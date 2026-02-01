module Yoga.Om.Strom.Examples.KafkaIntegration where

import Prelude

import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Effect (Effect)
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Strom as Strom

--------------------------------------------------------------------------------
-- Type Definitions
--------------------------------------------------------------------------------

type KafkaConfig = 
  { brokers :: Array String
  , groupId :: String
  , clientId :: String
  }

type KafkaMessage = 
  { topic :: String
  , partition :: Int
  , offset :: String
  , key :: String
  , value :: String
  , timestamp :: String
  , headers :: Array { key :: String, value :: String }
  }

type KafkaConsumer = 
  { subscribe :: String -> Aff Unit
  , consume :: Int -> Aff (Array KafkaMessage)  -- Poll with timeout
  , commit :: Aff Unit
  , disconnect :: Aff Unit
  }

type KafkaProducer = 
  { send :: String -> KafkaMessage -> Aff Unit
  , sendBatch :: String -> Array KafkaMessage -> Aff Unit
  , disconnect :: Aff Unit
  }

--------------------------------------------------------------------------------
-- Foreign Imports (would be implemented in .js file)
--------------------------------------------------------------------------------

-- These would connect to kafkajs or similar library
foreign import createConsumer :: KafkaConfig -> Aff KafkaConsumer
foreign import createProducer :: KafkaConfig -> Aff KafkaProducer

--------------------------------------------------------------------------------
-- Example 1: Simple Kafka Consumer Stream
--------------------------------------------------------------------------------

-- Convert Kafka consumer to Strom
kafkaStream :: KafkaConfig -> String -> Strom ctx () KafkaMessage
kafkaStream config topic = Strom.unfoldOm poll unit
  where
  poll :: Unit -> Om ctx () (Maybe (Tuple (Array KafkaMessage) Unit))
  poll _ = do
    consumer <- Om.fromAff $ createConsumer config
    Om.fromAff $ consumer.subscribe topic
    messages <- Om.fromAff $ consumer.consume 1000  -- 1 second timeout
    if Array.null messages
      then pure Nothing  -- Stop when no messages
      else pure $ Just $ Tuple messages unit

-- Usage
simpleConsumer :: Om ctx () Unit
simpleConsumer = do
  let config = 
        { brokers: ["localhost:9092"]
        , groupId: "my-group"
        , clientId: "my-client"
        }
  
  kafkaStream config "events"
    >>= Strom.fromArray  -- Flatten batches into individual messages
    # Strom.take 100  -- Process first 100 messages
    # Strom.traverse_ (\msg -> 
        Om.fromAff $ logMessage msg
      )

--------------------------------------------------------------------------------
-- Example 2: Infinite Consumer with Batching
--------------------------------------------------------------------------------

kafkaInfinite :: KafkaConfig -> String -> Strom ctx () KafkaMessage
kafkaInfinite config topic = do
  -- Setup consumer once
  consumer <- Strom.fromOm $ Om.fromAff $ createConsumer config
  _ <- Strom.fromOm $ Om.fromAff $ consumer.subscribe topic
  
  -- Infinite polling loop
  batch <- Strom.repeatOm do
    Om.fromAff $ consumer.consume 5000  -- 5 second timeout
  
  -- Flatten batches into individual messages
  message <- Strom.fromArray batch
  pure message

-- Process in batches
batchedConsumer :: Om ctx () Unit
batchedConsumer = do
  kafkaInfinite defaultConfig "orders"
    # Strom.filter (\msg -> msg.value /= "")
    # Strom.grouped 50  -- Group into batches of 50
    # Strom.traverse_ processBatch

processBatch :: Array KafkaMessage -> Om ctx () Unit
processBatch batch = do
  Om.fromAff $ logInfo $ "Processing batch of " <> show (Array.length batch)
  -- Process batch...
  pure unit

--------------------------------------------------------------------------------
-- Example 3: Consumer → Transform → Producer Pipeline
--------------------------------------------------------------------------------

type Event = { userId :: String, action :: String, timestamp :: Int }
type EnrichedEvent = { userId :: String, action :: String, timestamp :: Int, userName :: String }

kafkaPipeline :: Om Context () Unit
kafkaPipeline = do
  producer <- Om.fromAff $ createProducer producerConfig
  
  kafkaInfinite consumerConfig "raw-events"
    # Strom.mapM parseEvent
    # Strom.collect identity  -- Filter out parse failures
    # Strom.mapParallel 10 enrichEvent  -- Enrich in parallel
    # Strom.grouped 20  -- Batch for efficiency
    # Strom.traverse_ (\batch -> 
        Om.fromAff $ producer.sendBatch "enriched-events" 
          (Array.map serializeEvent batch)
      )

parseEvent :: KafkaMessage -> Om ctx () (Maybe Event)
parseEvent msg = do
  case decodeJSON msg.value of
    Right event -> pure (Just event)
    Left _ -> pure Nothing

enrichEvent :: Event -> Om ctx () EnrichedEvent
enrichEvent event = do
  userName <- fetchUserName event.userId
  pure { userId: event.userId, action: event.action, timestamp: event.timestamp, userName }

serializeEvent :: EnrichedEvent -> KafkaMessage
serializeEvent event = 
  { topic: "enriched-events"
  , partition: 0
  , offset: "0"
  , key: event.userId
  , value: encodeJSON event
  , timestamp: show event.timestamp
  , headers: []
  }

--------------------------------------------------------------------------------
-- Example 4: Multi-Topic Consumer
--------------------------------------------------------------------------------

multiTopicConsumer :: Array String -> Strom ctx () KafkaMessage
multiTopicConsumer topics = do
  topic <- Strom.fromArray topics
  message <- kafkaInfinite defaultConfig topic
  pure message

-- Usage
aggregateTopics :: Om ctx () Unit
aggregateTopics = do
  multiTopicConsumer ["events", "logs", "metrics"]
    # Strom.mapM routeMessage
    # Strom.runDrain

routeMessage :: KafkaMessage -> Om ctx () Unit
routeMessage msg = case msg.topic of
  "events" -> processEvent msg
  "logs" -> processLog msg
  "metrics" -> processMetric msg
  _ -> pure unit

--------------------------------------------------------------------------------
-- Example 5: Error Handling with DLQ
--------------------------------------------------------------------------------

withDeadLetterQueue :: Strom ctx () KafkaMessage -> Om ctx () Unit
withDeadLetterQueue source = do
  producer <- Om.fromAff $ createProducer producerConfig
  
  source
    # Strom.mapM (\msg -> do
        -- Try to process
        processMessage msg
          # Om.handleErrors { exception: \err -> do
              -- Send to DLQ on error
              Om.fromAff $ producer.send "dlq-topic" 
                (msg { value = "ERROR: " <> show err <> " | " <> msg.value })
              pure unit
            }
      )
    # Strom.runDrain

processMessage :: KafkaMessage -> Om ctx (exception :: String) Unit
processMessage msg = do
  -- Processing that might fail
  pure unit

--------------------------------------------------------------------------------
-- Example 6: With Offset Management
--------------------------------------------------------------------------------

manualOffsetConsumer :: Om ctx () Unit
manualOffsetConsumer = do
  consumer <- Om.fromAff $ createConsumer defaultConfig
  Om.fromAff $ consumer.subscribe "orders"
  
  Strom.repeatOm do
    -- Poll messages
    messages <- Om.fromAff $ consumer.consume 5000
    
    -- Process messages
    results <- Om.inParallel $ Array.map processMessageSafe messages
    
    -- Commit offsets only if all succeeded
    when (Array.all isSuccess results) do
      Om.fromAff consumer.commit
    
    pure messages
  >>= Strom.fromArray
  # Strom.runDrain

processMessageSafe :: KafkaMessage -> Om ctx () (Either String Unit)
processMessageSafe msg = do
  Om.handleErrors' 
    (\err -> pure $ Left $ "Error: " <> show err)
    (Right <$> processMessage msg)

isSuccess :: Either String Unit -> Boolean
isSuccess (Right _) = true
isSuccess _ = false

--------------------------------------------------------------------------------
-- Example 7: Fan-Out Pattern
--------------------------------------------------------------------------------

fanOutKafka :: Om ctx () Unit
fanOutKafka = do
  let source = kafkaInfinite defaultConfig "all-events"
  
  -- Branch 1: Analytics
  _ <- Om.fromAff $ launchProcessor $ 
    source
      # Strom.filter isAnalyticsEvent
      # Strom.traverse_ processAnalytics
  
  -- Branch 2: Logging  
  _ <- Om.fromAff $ launchProcessor $
    source
      # Strom.filter isLogEvent
      # Strom.traverse_ writeLog
  
  -- Branch 3: Alerts
  source
    # Strom.filter isAlertEvent
    # Strom.traverse_ sendAlert

isAnalyticsEvent :: KafkaMessage -> Boolean
isAnalyticsEvent msg = msg.key == "analytics"

isLogEvent :: KafkaMessage -> Boolean
isLogEvent msg = msg.key == "log"

isAlertEvent :: KafkaMessage -> Boolean
isAlertEvent msg = msg.key == "alert"

--------------------------------------------------------------------------------
-- Example 8: Rate-Limited Consumer
--------------------------------------------------------------------------------

rateLimitedConsumer :: Om ctx () Unit
rateLimitedConsumer = do
  kafkaInfinite defaultConfig "high-volume"
    # Strom.grouped 10  -- Process 10 at a time
    # Strom.tapM (\_ -> Om.delay $ Milliseconds 1000.0)  -- Wait 1s between batches
    >>= Strom.fromArray
    # Strom.traverse_ processMessage

--------------------------------------------------------------------------------
-- Example 9: Exactly-Once Processing
--------------------------------------------------------------------------------

exactlyOnceProcessor :: Om ctx () Unit
exactlyOnceProcessor = do
  consumer <- Om.fromAff $ createConsumer consumerConfig
  producer <- Om.fromAff $ createProducer producerConfig
  
  Om.fromAff $ consumer.subscribe "input-topic"
  
  Strom.repeatOm do
    -- Read batch
    batch <- Om.fromAff $ consumer.consume 5000
    
    if Array.null batch
      then pure []
      else do
        -- Process batch atomically
        processed <- Array.traverse processAndTransform batch
        
        -- Send to output (transactional send)
        Om.fromAff $ producer.sendBatch "output-topic" processed
        
        -- Commit offsets (only after successful send)
        Om.fromAff $ consumer.commit
        
        pure batch
  >>= Strom.fromArray
  # Strom.runDrain

processAndTransform :: KafkaMessage -> Om ctx () KafkaMessage
processAndTransform msg = 
  pure msg { value = "processed: " <> msg.value }

--------------------------------------------------------------------------------
-- Helper Functions
--------------------------------------------------------------------------------

type Context = { logger :: String -> Aff Unit }

defaultConfig :: KafkaConfig
defaultConfig = 
  { brokers: ["localhost:9092"]
  , groupId: "default-group"
  , clientId: "default-client"
  }

consumerConfig :: KafkaConfig
consumerConfig = defaultConfig

producerConfig :: KafkaConfig
producerConfig = defaultConfig

logMessage :: KafkaMessage -> Aff Unit
logMessage msg = 
  logInfo $ "Message: " <> msg.key <> " = " <> msg.value

logInfo :: String -> Aff Unit
logInfo = pure  -- Would actually log

decodeJSON :: forall a. String -> Either String a
decodeJSON = unsafeCrashWith "Not implemented"

encodeJSON :: forall a. a -> String
encodeJSON = unsafeCrashWith "Not implemented"

fetchUserName :: String -> Om ctx () String
fetchUserName userId = pure $ "User-" <> userId

processEvent :: KafkaMessage -> Om ctx () Unit
processEvent _ = pure unit

processLog :: KafkaMessage -> Om ctx () Unit
processLog _ = pure unit

processMetric :: KafkaMessage -> Om ctx () Unit
processMetric _ = pure unit

processAnalytics :: KafkaMessage -> Om ctx () Unit
processAnalytics _ = pure unit

writeLog :: KafkaMessage -> Om ctx () Unit
writeLog _ = pure unit

sendAlert :: KafkaMessage -> Om ctx () Unit
sendAlert _ = pure unit

launchProcessor :: forall ctx err. Om ctx err Unit -> Aff (Fiber Unit)
launchProcessor = unsafeCrashWith "Not implemented"

unsafeCrashWith :: forall a. String -> a
unsafeCrashWith msg = unsafeCoerce unit

unsafeCoerce :: forall a b. a -> b
unsafeCoerce x = x

when :: Boolean -> Om ctx err Unit -> Om ctx err Unit
when true action = action
when false _ = pure unit

foreign import data Fiber :: Type -> Type

--------------------------------------------------------------------------------
-- Summary of Patterns
--------------------------------------------------------------------------------

{-
  KAFKA + STROM PATTERNS:
  
  1. Simple Consumer
     kafkaStream config topic
       # Strom.traverse_ process
  
  2. Infinite Consumer
     kafkaInfinite config topic
       # Strom.grouped 50
       # Strom.traverse_ processBatch
  
  3. Pipeline (Consumer → Producer)
     kafkaInfinite config "input"
       # Strom.mapParallel 10 transform
       # Strom.traverse_ (sendToKafka "output")
  
  4. Multi-Topic
     multiTopicConsumer ["t1", "t2", "t3"]
       # Strom.traverse_ route
  
  5. Error Handling
     source
       # Strom.mapM (tryProcess `catchAll` sendToDLQ)
       # Strom.runDrain
  
  6. Fan-Out
     Launch multiple processors on same source
  
  7. Rate Limiting
     source
       # Strom.grouped n
       # Strom.tapM (\_ -> delay ms)
       # Strom.runDrain
  
  8. Exactly-Once
     Read → Process → Send → Commit (atomic)
-}
