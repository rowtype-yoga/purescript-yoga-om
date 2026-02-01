module Yoga.Om.Strom.Examples.MergingShowcase where

import Prelude

import Data.Array as Array
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Data.Time.Duration (Milliseconds(..))
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Strom as Strom
import Yoga.Om.Strom.Do (guard)

--------------------------------------------------------------------------------
-- MERGING METHOD 1: Non-Deterministic Merge
--------------------------------------------------------------------------------

-- Use when: Order doesn't matter, want maximum throughput
mergeExample1 :: Om ctx () (Array Int)
mergeExample1 = do
  let stream1 = Strom.fromArray [1, 2, 3]
  let stream2 = Strom.fromArray [10, 20, 30]
  
  Strom.merge stream1 stream2
    # Strom.runCollect
  
  -- Output: Non-deterministic!
  -- Could be: [1, 2, 3, 10, 20, 30]
  -- Could be: [10, 20, 30, 1, 2, 3]
  -- Could be: [1, 10, 2, 20, 3, 30]
  -- Depends on which stream wins the race

-- Real-world: Merge multiple event sources
mergeEventSources :: Om Context () Event
mergeEventSources = do
  let clickEvents = fetchClickStream
  let keyEvents = fetchKeyStream
  let scrollEvents = fetchScrollStream
  
  Strom.concat  -- Sequential for determinism
    [ clickEvents # Strom.map ClickEvent
    , keyEvents # Strom.map KeyEvent
    , scrollEvents # Strom.map ScrollEvent
    ]
    # Strom.runCollect

-- Or non-deterministic if order doesn't matter
mergeEventSourcesConcurrent :: Strom Context () Event
mergeEventSourcesConcurrent =
  Strom.merge
    (fetchClickStream # Strom.map ClickEvent)
    (Strom.merge
      (fetchKeyStream # Strom.map KeyEvent)
      (fetchScrollStream # Strom.map ScrollEvent)
    )

--------------------------------------------------------------------------------
-- MERGING METHOD 2: Sequential Append
--------------------------------------------------------------------------------

-- Use when: Order matters, process in stages
appendExample :: Om ctx () (Array Int)
appendExample = do
  Strom.fromArray [1, 2, 3]
    `Strom.append`
    Strom.fromArray [10, 20, 30]
    # Strom.runCollect
  
  -- Output: Always [1, 2, 3, 10, 20, 30]

-- Real-world: Pagination
fetchAllPages :: Om Context () (Array User)
fetchAllPages = do
  Strom.concat
    [ Strom.fromOm (fetchPage 1) >>= Strom.fromArray
    , Strom.fromOm (fetchPage 2) >>= Strom.fromArray
    , Strom.fromOm (fetchPage 3) >>= Strom.fromArray
    ]
    # Strom.runCollect

-- Or better - dynamic pagination!
fetchAllPagesDynamic :: Om Context () (Array User)
fetchAllPagesDynamic = do
  Strom.unfoldOm fetchNextPage 1
    >>= Strom.fromArray
    # Strom.runCollect

fetchNextPage :: Int -> Om Context () (Maybe (Tuple (Array User) Int))
fetchNextPage pageNum = do
  users <- fetchPage pageNum
  if Array.null users
    then pure Nothing
    else pure $ Just $ Tuple users (pageNum + 1)

--------------------------------------------------------------------------------
-- MERGING METHOD 3: Interleave (Deterministic)
--------------------------------------------------------------------------------

-- Use when: Want fair round-robin, order predictable
interleaveExample :: Om ctx () (Array Int)
interleaveExample = do
  Strom.interleave
    (Strom.fromArray [1, 2, 3])
    (Strom.fromArray [10, 20, 30])
    # Strom.runCollect
  
  -- Output: Always [1, 10, 2, 20, 3, 30]

-- Real-world: Fair task scheduling
fairScheduler :: Om ctx () Task
fairScheduler = do
  let highPriorityTasks = fetchHighPriorityTasks
  let normalTasks = fetchNormalTasks
  
  -- Alternate between priority levels
  Strom.interleave highPriorityTasks normalTasks
    # Strom.traverse_ executeTask

-- Real-world: Load balancing
loadBalanceServers :: Strom ctx () Request -> Om ctx () Unit
loadBalanceServers requests = do
  -- Split requests between servers
  let toServer1 = requests # Strom.filter (\r -> hashRequest r `mod` 2 == 0)
  let toServer2 = requests # Strom.filter (\r -> hashRequest r `mod` 2 /= 0)
  
  Strom.interleave
    (toServer1 # Strom.mapM sendToServer1)
    (toServer2 # Strom.mapM sendToServer2)
    # Strom.runDrain

--------------------------------------------------------------------------------
-- MERGING METHOD 4: Zip (Pair Elements)
--------------------------------------------------------------------------------

-- Use when: Streams are related, need element pairing
zipExample :: Om ctx () (Array (Tuple Int String))
zipExample = do
  Strom.zip
    (Strom.range 1 4)
    (Strom.fromArray ["a", "b", "c"])
    # Strom.runCollect
  
  -- Output: [(1,"a"), (2,"b"), (3,"c")]

-- Real-world: Join user IDs with user data
joinUserData :: Om ctx () (Array UserWithProfile)
joinUserData = do
  let userIds = Strom.range 1 100
  let profiles = userIds # Strom.mapM fetchProfile
  
  Strom.zip userIds profiles
    # Strom.map (\(Tuple id profile) -> { id, profile })
    # Strom.runCollect

-- Real-world: Add index to items
indexedItems :: Array Item -> Om ctx () (Array IndexedItem)
indexedItems items = do
  Strom.zip
    (Strom.iterate (_ + 1) 0)
    (Strom.fromArray items)
    # Strom.map (\(Tuple idx item) -> { index: idx, item })
    # Strom.runCollect

--------------------------------------------------------------------------------
-- MERGING METHOD 5: Race (First Wins)
--------------------------------------------------------------------------------

-- Use when: Want fastest response, have redundant sources
raceExample :: Om ctx () (Array Int)
raceExample = do
  Strom.race
    [ Strom.fromOm (Om.delay (Milliseconds 100.0) *> pure 1)
    , Strom.fromOm (pure 2)  -- This wins!
    , Strom.fromOm (Om.delay (Milliseconds 50.0) *> pure 3)
    ]
    # Strom.runCollect
  
  -- Output: [2] (the fastest)

-- Real-world: Timeout pattern
withTimeout :: Milliseconds -> Strom ctx err a -> Strom ctx (timeout :: String, err) a
withTimeout ms stream =
  Strom.race
    [ stream
    , Strom.fromOm do
        Om.delay ms
        Om.throw { timeout: "Operation timed out" }
    ]

-- Real-world: Fastest mirror
fetchFromFastestMirror :: String -> Om ctx () Data
fetchFromFastestMirror key = do
  Strom.race
    [ Strom.fromOm $ fetchFromMirror1 key
    , Strom.fromOm $ fetchFromMirror2 key
    , Strom.fromOm $ fetchFromMirror3 key
    ]
    # Strom.runCollect
    # map (Array.head >>> fromMaybe defaultData)

--------------------------------------------------------------------------------
-- MERGING METHOD 6: Do-Notation (Cartesian Product)
--------------------------------------------------------------------------------

-- Use when: Need all combinations
cartesianExample :: Om ctx () (Array (Tuple Int String))
cartesianExample = do
  result <- (do
    x <- Strom.fromArray [1, 2, 3]
    y <- Strom.fromArray ["a", "b"]
    pure (Tuple x y)
  ) # Strom.runCollect
  
  pure result
  -- Output: [(1,"a"), (1,"b"), (2,"a"), (2,"b"), (3,"a"), (3,"b")]

-- Real-world: Generate test data combinations
testDataGenerator :: Om ctx () (Array TestCase)
testDataGenerator = do
  (do
    browser <- Strom.fromArray ["Chrome", "Firefox", "Safari"]
    os <- Strom.fromArray ["Windows", "Mac", "Linux"]
    viewport <- Strom.fromArray ["mobile", "tablet", "desktop"]
    pure { browser, os, viewport }
  ) # Strom.runCollect

-- Real-world: Grid positions
gridPositions :: Int -> Int -> Om ctx () (Array Position)
gridPositions width height = do
  (do
    x <- Strom.range 0 width
    y <- Strom.range 0 height
    pure { x, y }
  ) # Strom.runCollect

--------------------------------------------------------------------------------
-- MERGING METHOD 7: Applicative Do (Parallel)
--------------------------------------------------------------------------------

-- Use when: Streams are independent, want parallel execution
adoExample :: Om ctx () (Array Result)
adoExample = do
  result <- (ado
    users <- Strom.fromOm fetchUsers
    posts <- Strom.fromOm fetchPosts
    comments <- Strom.fromOm fetchComments
    in { users, posts, comments }
  ) # Strom.runCollect
  
  pure result
  -- All three fetches happen in parallel!

--------------------------------------------------------------------------------
-- COMPLEX EXAMPLE: Merge Multiple Kafka Topics
--------------------------------------------------------------------------------

type KafkaMessage = 
  { topic :: String
  , key :: String
  , value :: String
  , partition :: Int
  }

-- Merge messages from 3 Kafka topics
mergeKafkaTopics :: Om Context () Unit
mergeKafkaTopics = do
  -- Create 3 separate streams
  let events = kafkaStream config "events"
  let logs = kafkaStream config "logs"
  let metrics = kafkaStream config "metrics"
  
  -- Merge all three (non-deterministic)
  Strom.concat
    [ events # Strom.map (\msg -> msg { topic = "events" })
    , logs # Strom.map (\msg -> msg { topic = "logs" })
    , metrics # Strom.map (\msg -> msg { topic = "metrics" })
    ]
    # Strom.mapM routeAndProcess
    # Strom.grouped 100
    # Strom.traverse_ saveBatch

routeAndProcess :: KafkaMessage -> Om Context () ProcessedMessage
routeAndProcess msg = case msg.topic of
  "events" -> processEvent msg
  "logs" -> processLog msg
  "metrics" -> processMetric msg
  _ -> pure $ defaultProcessed msg

--------------------------------------------------------------------------------
-- PATTERN: Merge with Deduplication
--------------------------------------------------------------------------------

import Data.Set as Set
import Effect.Ref as Ref

-- Merge and deduplicate
mergeUnique :: forall a. Ord a => Strom ctx () a -> Strom ctx () a -> Om ctx () (Array a)
mergeUnique s1 s2 = do
  seenRef <- liftEffect $ Ref.new Set.empty
  
  Strom.merge s1 s2
    # Strom.filterM (\item -> do
        seen <- liftEffect $ Ref.read seenRef
        if Set.member item seen
          then pure false
          else do
            liftEffect $ Ref.modify_ (Set.insert item) seenRef
            pure true
      )
    # Strom.runCollect

-- Usage
deduplicatedMerge :: Om ctx () (Array Int)
deduplicatedMerge = 
  mergeUnique
    (Strom.fromArray [1, 2, 3, 4])
    (Strom.fromArray [3, 4, 5, 6])
  -- Output: [1, 2, 3, 4, 5, 6] (no duplicates)

--------------------------------------------------------------------------------
-- PATTERN: Merge with Priority
--------------------------------------------------------------------------------

-- Process high-priority items first
mergeWithPriority :: Strom ctx err a -> Strom ctx err a -> Strom ctx err a
mergeWithPriority highPriority lowPriority =
  Strom.concat
    [ highPriority # Strom.take 10  -- First 10 from high priority
    , Strom.interleave highPriority lowPriority  -- Then fair scheduling
    ]

-- Usage
prioritizedProcessing :: Om ctx () Unit
prioritizedProcessing = do
  let urgent = urgentTasks
  let normal = normalTasks
  
  mergeWithPriority urgent normal
    # Strom.traverse_ executeTask

--------------------------------------------------------------------------------
-- PATTERN: Merge Multiple Sources with Tagging
--------------------------------------------------------------------------------

data Source = SourceA | SourceB | SourceC

type Tagged a = { source :: Source, value :: a }

-- Merge and tag sources
mergeWithTags :: Om ctx () (Array (Tagged Int))
mergeWithTags = do
  Strom.concat
    [ Strom.fromArray [1, 2, 3] # Strom.map (\v -> { source: SourceA, value: v })
    , Strom.fromArray [10, 20] # Strom.map (\v -> { source: SourceB, value: v })
    , Strom.fromArray [100] # Strom.map (\v -> { source: SourceC, value: v })
    ]
    # Strom.runCollect

-- Process differently based on source
processTagged :: Om ctx () Unit
processTagged = do
  mergeWithTags
    # Strom.traverse_ (\tagged -> 
        case tagged.source of
          SourceA -> processFromA tagged.value
          SourceB -> processFromB tagged.value
          SourceC -> processFromC tagged.value
      )

--------------------------------------------------------------------------------
-- KAFKA REAL-WORLD EXAMPLES
--------------------------------------------------------------------------------

-- Example 1: Multi-partition consumer (merge partitions)
multiPartitionConsumer :: String -> Int -> Om ctx () Unit
multiPartitionConsumer topic numPartitions = do
  -- Create stream for each partition
  let partitionStreams = Array.range 0 (numPartitions - 1) <#> \partition ->
        kafkaPartitionStream config topic partition
  
  -- Merge all partitions
  Strom.concat partitionStreams
    # Strom.mapM processMessage
    # Strom.runDrain

kafkaPartitionStream :: KafkaConfig -> String -> Int -> Strom ctx () KafkaMessage
kafkaPartitionStream config topic partition = 
  Strom.unfoldOm (pollPartition config topic partition) unit

-- Example 2: Multi-topic consumer (merge topics)
multiTopicConsumer :: Om ctx () Unit
multiTopicConsumer = do
  let topics = ["events", "logs", "metrics"]
  
  -- Create stream for each topic
  let topicStreams = topics <#> \topic ->
        kafkaStream config topic
  
  -- Merge all topics (non-deterministic)
  Strom.concat topicStreams
    # Strom.mapM routeMessage
    # Strom.runDrain

-- Example 3: Consumer with rate limiting across merged streams
rateLimitedMultiStream :: Om ctx () Unit
rateLimitedMultiStream = do
  Strom.concat
    [ kafkaStream config "topic1"
    , kafkaStream config "topic2"
    , kafkaStream config "topic3"
    ]
    # Strom.grouped 10  -- Batch 10 messages
    # Strom.tapM (\_ -> Om.delay $ Milliseconds 1000.0)  -- Wait 1s
    >>= Strom.fromArray
    # Strom.traverse_ processMessage

-- Example 4: Merge with transformation
mergeAndTransform :: Om ctx () Unit
mergeAndTransform = do
  producer <- Om.fromAff $ createProducer producerConfig
  
  -- Read from multiple input topics
  Strom.concat
    [ kafkaStream config "raw-events" # Strom.map parseEventV1
    , kafkaStream config "raw-events-v2" # Strom.map parseEventV2
    , kafkaStream config "legacy-events" # Strom.map parseLegacyEvent
    ]
    # Strom.collect identity  -- Filter parse failures
    # Strom.mapM enrichEvent
    # Strom.grouped 50
    # Strom.traverse_ (\batch ->
        Om.fromAff $ producer.sendBatch "unified-events" (Array.map serialize batch)
      )

-- Example 5: Merge with filtering and dedup
mergeDedupFilter :: Om ctx () Unit
mergeDedupFilter = do
  seenRef <- liftEffect $ Ref.new Set.empty
  
  Strom.concat
    [ kafkaStream config "topic1"
    , kafkaStream config "topic2"
    ]
    # Strom.filterM (\msg -> do
        seen <- liftEffect $ Ref.read seenRef
        let messageId = msg.key <> ":" <> msg.offset
        if Set.member messageId seen
          then pure false
          else do
            liftEffect $ Ref.modify_ (Set.insert messageId) seenRef
            pure true
      )
    # Strom.traverse_ processUniqueMessage

--------------------------------------------------------------------------------
-- COMPLETE PIPELINE: Multiple Kafka Topics → Process → Output
--------------------------------------------------------------------------------

type InputEvent = { eventType :: String, data :: String }
type OutputEvent = { eventType :: String, processed :: String, timestamp :: Int }

completePipeline :: Om Context () Unit
completePipeline = do
  ctx <- Om.ask
  producer <- Om.fromAff $ createProducer producerConfig
  
  -- Merge 3 input topics
  Strom.concat
    [ kafkaStream config "events-topic-1"
    , kafkaStream config "events-topic-2"  
    , kafkaStream config "events-topic-3"
    ]
    # Strom.tapM (\msg -> ctx.logger $ "Received from " <> msg.topic)
    # Strom.mapM parseInputEvent
    # Strom.collect identity  -- Filter parse failures
    # Strom.filter (\event -> event.eventType /= "ignore")
    # Strom.mapParallel 10 processEvent  -- Process 10 concurrent
    # Strom.grouped 20  -- Batch for efficiency
    # Strom.tapM (\batch -> ctx.logger $ "Sending batch of " <> show (Array.length batch))
    # Strom.traverse_ (\batch ->
        Om.fromAff $ producer.sendBatch "output-topic" 
          (Array.map serializeOutput batch)
      )

parseInputEvent :: KafkaMessage -> Om ctx () (Maybe InputEvent)
parseInputEvent msg = pure Nothing  -- Would parse JSON

processEvent :: InputEvent -> Om ctx () OutputEvent
processEvent input = 
  pure { eventType: input.eventType, processed: input.data, timestamp: 0 }

serializeOutput :: OutputEvent -> KafkaMessage
serializeOutput event = 
  { topic: "output"
  , partition: 0
  , key: event.eventType
  , value: show event
  }

--------------------------------------------------------------------------------
-- Placeholder types and functions
--------------------------------------------------------------------------------

type Context = { logger :: String -> Om {} () Unit }
type Event = Unit
type Task = Unit
type Request = Unit
type User = Unit
type UserWithProfile = Unit
type Item = Unit
type IndexedItem = Unit
type ProcessedMessage = Unit
type Database = Unit
type Data = Unit
type Position = Unit
type TestCase = Unit

data ClickEvent = ClickEvent Event
data KeyEvent = KeyEvent Event
data ScrollEvent = ScrollEvent Event

type KafkaConfig = Unit
type KafkaConsumer = Unit
type KafkaProducer = Unit
type KafkaMessage = 
  { topic :: String
  , partition :: Int
  , offset :: String
  , key :: String
  , value :: String
  }

config :: KafkaConfig
config = unit

consumerConfig :: KafkaConfig
consumerConfig = unit

producerConfig :: KafkaConfig
producerConfig = unit

defaultConfig :: KafkaConfig
defaultConfig = unit

defaultData :: Data
defaultData = unit

kafkaStream :: KafkaConfig -> String -> Strom ctx () KafkaMessage
kafkaStream _ _ = Strom.empty

kafkaPartitionStream :: KafkaConfig -> String -> Int -> Strom ctx () KafkaMessage  
kafkaPartitionStream _ _ _ = Strom.empty

pollPartition :: KafkaConfig -> String -> Int -> Unit -> Om ctx () (Maybe (Tuple (Array KafkaMessage) Unit))
pollPartition _ _ _ _ = pure Nothing

fetchClickStream :: Strom ctx () Event
fetchClickStream = Strom.empty

fetchKeyStream :: Strom ctx () Event
fetchKeyStream = Strom.empty

fetchScrollStream :: Strom ctx () Event
fetchScrollStream = Strom.empty

fetchPage :: Int -> Om ctx () (Array User)
fetchPage _ = pure []

fetchProfile :: Int -> Om ctx () User
fetchProfile _ = pure unit

fetchHighPriorityTasks :: Strom ctx () Task
fetchHighPriorityTasks = Strom.empty

fetchNormalTasks :: Strom ctx () Task
fetchNormalTasks = Strom.empty

executeTask :: Task -> Om ctx () Unit
executeTask _ = pure unit

hashRequest :: Request -> Int
hashRequest _ = 0

sendToServer1 :: Request -> Om ctx () Unit
sendToServer1 _ = pure unit

sendToServer2 :: Request -> Om ctx () Unit
sendToServer2 _ = pure unit

fetchFromMirror1 :: String -> Om ctx () Data
fetchFromMirror1 _ = pure unit

fetchFromMirror2 :: String -> Om ctx () Data
fetchFromMirror2 _ = pure unit

fetchFromMirror3 :: String -> Om ctx () Data
fetchFromMirror3 _ = pure unit

routeMessage :: KafkaMessage -> Om ctx () Unit
routeMessage _ = pure unit

processMessage :: KafkaMessage -> Om ctx () Unit
processMessage _ = pure unit

processUniqueMessage :: KafkaMessage -> Om ctx () Unit
processUniqueMessage _ = pure unit

saveBatch :: Array ProcessedMessage -> Om ctx () Unit
saveBatch _ = pure unit

processFromA :: Int -> Om ctx () Unit
processFromA _ = pure unit

processFromB :: Int -> Om ctx () Unit
processFromB _ = pure unit

processFromC :: Int -> Om ctx () Unit
processFromC _ = pure unit

parseEventV1 :: KafkaMessage -> Maybe InputEvent
parseEventV1 _ = Nothing

parseEventV2 :: KafkaMessage -> Maybe InputEvent
parseEventV2 _ = Nothing

parseLegacyEvent :: KafkaMessage -> Maybe InputEvent
parseLegacyEvent _ = Nothing

enrichEvent :: InputEvent -> Om ctx () OutputEvent
enrichEvent _ = pure { eventType: "", processed: "", timestamp: 0 }

serialize :: OutputEvent -> KafkaMessage
serialize _ = { topic: "", partition: 0, offset: "", key: "", value: "" }

createProducer :: KafkaConfig -> Aff KafkaProducer
createProducer _ = pure unit

fromMaybe :: forall a. a -> Maybe a -> a
fromMaybe def Nothing = def
fromMaybe _ (Just x) = x

foreign import data Set :: Type -> Type
