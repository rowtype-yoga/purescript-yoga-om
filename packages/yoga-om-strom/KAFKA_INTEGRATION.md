# Kafka Integration with Strom

## Overview

Integrating Kafka with Strom enables powerful stream processing capabilities. This guide shows patterns for consuming from and producing to Kafka topics.

## Architecture

```
Kafka Topic → Strom Stream → Processing Pipeline → Kafka Topic
```

## Prerequisites

You'll need a Kafka client library for PureScript/Node.js. Common options:

1. **kafkajs** (Node.js) - via FFI
2. **purescript-kafka** (if exists)
3. **rdkafka** via FFI

## Basic Kafka Consumer Pattern

### Pattern 1: Simple Consumer

```purescript
module Kafka.Consumer where

import Prelude
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Strom as Strom
import Effect.Aff (Aff)

type KafkaConfig = 
  { brokers :: Array String
  , groupId :: String
  , topic :: String
  }

type KafkaMessage = 
  { key :: String
  , value :: String
  , partition :: Int
  , offset :: String
  , timestamp :: String
  }

-- Foreign function to connect to Kafka
foreign import createKafkaConsumer 
  :: KafkaConfig 
  -> Aff KafkaConsumer

foreign import subscribeToTopic 
  :: KafkaConsumer 
  -> String 
  -> Aff Unit

foreign import consumeMessages 
  :: KafkaConsumer 
  -> Aff (Array KafkaMessage)

-- Convert Kafka consumer to Strom
kafkaStream :: KafkaConfig -> Strom Context () KafkaMessage
kafkaStream config = 
  Strom.unfoldOm pollMessages unit
  where
  pollMessages :: Unit -> Om Context () (Maybe (Tuple (Array KafkaMessage) Unit))
  pollMessages _ = do
    consumer <- Om.fromAff $ createKafkaConsumer config
    Om.fromAff $ subscribeToTopic consumer config.topic
    messages <- Om.fromAff $ consumeMessages consumer
    if Array.null messages
      then pure Nothing
      else pure $ Just $ Tuple messages unit

-- Usage
main :: Om Context () Unit
main = do
  let config = 
        { brokers: ["localhost:9092"]
        , groupId: "my-consumer-group"
        , topic: "events"
        }
  
  kafkaStream config
    >>= Strom.fromArray
    # Strom.mapM processMessage
    # Strom.traverse_ logMessage
```

---

## Pattern 2: Continuous Consumer with Backpressure

```purescript
-- Infinite Kafka consumer with natural backpressure
kafkaInfiniteStream :: KafkaConfig -> Strom Context () KafkaMessage
kafkaInfiniteStream config = do
  consumer <- Strom.fromOm $ Om.fromAff $ createKafkaConsumer config
  _ <- Strom.fromOm $ Om.fromAff $ subscribeToTopic consumer config.topic
  
  -- Infinite poll loop
  batch <- Strom.repeatOm do
    Om.fromAff $ consumeMessages consumer
  
  -- Flatten batches
  message <- Strom.fromArray batch
  pure message

-- Usage with backpressure
main :: Om Context () Unit
main = do
  kafkaInfiniteStream config
    # Strom.mapM processMessage      -- Process one by one
    # Strom.grouped 100                -- Batch for efficiency
    # Strom.traverse_ processBatch    -- Handle batches
```

---

## Pattern 3: Consumer with Error Handling

```purescript
import Yoga.Om.Strom.Do (guard)

kafkaStreamSafe :: KafkaConfig -> Strom Context () KafkaMessage
kafkaStreamSafe config = do
  consumer <- Strom.fromOm $ createConsumer config
  
  batch <- Strom.repeatOm do
    Om.fromAff $ consumeMessages consumer
      # Om.catchAll (\err -> do
          logError err
          pure []  -- Return empty on error, continue consuming
        )
  
  message <- Strom.fromArray batch
  
  -- Filter out invalid messages
  guard (isValidMessage message)
  
  pure message

isValidMessage :: KafkaMessage -> Boolean
isValidMessage msg = 
  msg.value /= "" && msg.key /= ""
```

---

## Pattern 4: Parallel Processing

```purescript
kafkaParallelProcessing :: KafkaConfig -> Om Context () Unit
kafkaParallelProcessing config = do
  kafkaStream config
    # Strom.mapParallel 10 processMessage  -- Process 10 messages concurrently
    # Strom.runDrain
```

---

## Pattern 5: Consumer with Offset Management

```purescript
type OffsetManager = 
  { commit :: Array KafkaMessage -> Om Context () Unit
  , lastCommitted :: Om Context () String
  }

kafkaWithOffsets :: KafkaConfig -> OffsetManager -> Strom Context () KafkaMessage
kafkaWithOffsets config offsetMgr = do
  consumer <- Strom.fromOm $ createConsumer config
  
  batch <- Strom.repeatOm do
    Om.fromAff $ consumeMessages consumer
  
  -- Commit offsets after processing
  _ <- Strom.fromOm $ offsetMgr.commit batch
  
  message <- Strom.fromArray batch
  pure message
```

---

## Kafka Producer Pattern

### Pattern 1: Simple Producer

```purescript
type KafkaProducer = Unit  -- Placeholder

foreign import createKafkaProducer 
  :: KafkaConfig 
  -> Aff KafkaProducer

foreign import sendMessage 
  :: KafkaProducer 
  -> String  -- topic
  -> KafkaMessage 
  -> Aff Unit

-- Process stream and send to Kafka
produceToKafka :: String -> Strom Context () KafkaMessage -> Om Context () Unit
produceToKafka topic stream = do
  producer <- Om.fromAff $ createKafkaProducer defaultConfig
  
  stream
    # Strom.traverse_ (\msg -> 
        Om.fromAff $ sendMessage producer topic msg
      )
```

---

## Pattern 2: Batch Producer (More Efficient)

```purescript
foreign import sendBatch 
  :: KafkaProducer 
  -> String 
  -> Array KafkaMessage 
  -> Aff Unit

produceBatchToKafka :: String -> Strom Context () KafkaMessage -> Om Context () Unit
produceBatchToKafka topic stream = do
  producer <- Om.fromAff $ createKafkaProducer defaultConfig
  
  stream
    # Strom.grouped 100  -- Batch 100 messages
    # Strom.traverse_ (\batch -> 
        Om.fromAff $ sendBatch producer topic batch
      )
```

---

## Complete Example: Kafka → Process → Kafka

```purescript
import Yoga.Om.Strom as Strom
import Yoga.Om.Strom.Do (guard)

type Event = 
  { userId :: String
  , action :: String
  , timestamp :: String
  }

type EnrichedEvent = 
  { userId :: String
  , action :: String
  , timestamp :: String
  , userName :: String
  , category :: String
  }

-- Consumer → Processing → Producer pipeline
kafkaPipeline :: Om Context () Unit
kafkaPipeline = do
  -- Setup
  producer <- Om.fromAff $ createKafkaProducer producerConfig
  
  -- Consume → Transform → Produce
  kafkaStream consumerConfig
    # Strom.mapM parseEvent         -- Parse JSON
    # Strom.filter isValidEvent      -- Filter invalid
    # Strom.mapParallel 5 enrichEvent -- Enrich with user data (parallel)
    # Strom.grouped 50                -- Batch for efficiency
    # Strom.traverse_ (\batch ->     -- Send to output topic
        Om.fromAff $ sendBatch producer "enriched-events" batch
      )

parseEvent :: KafkaMessage -> Om Context () Event
parseEvent msg = 
  case parseJSON msg.value of
    Right event -> pure event
    Left err -> Om.throw { parseError: err }

isValidEvent :: Event -> Boolean
isValidEvent event = 
  event.userId /= "" && event.action /= ""

enrichEvent :: Event -> Om Context () EnrichedEvent
enrichEvent event = do
  user <- fetchUser event.userId
  pure 
    { userId: event.userId
    , action: event.action
    , timestamp: event.timestamp
    , userName: user.name
    , category: user.category
    }
```

---

## Pattern: Multi-Topic Consumer

```purescript
-- Consume from multiple topics and merge
multiTopicStream :: Array String -> Strom Context () KafkaMessage
multiTopicStream topics = do
  topic <- Strom.fromArray topics
  consumer <- Strom.fromOm $ createConsumerForTopic topic
  batch <- Strom.repeatOm $ Om.fromAff $ consumeMessages consumer
  message <- Strom.fromArray batch
  pure message

-- Usage
main :: Om Context () Unit
main = do
  multiTopicStream ["events", "logs", "metrics"]
    # Strom.mapM processAnyMessage
    # Strom.runDrain
```

---

## Pattern: Fan-Out (One Topic → Multiple Processors)

```purescript
-- Process same stream in different ways
fanOutPattern :: Om Context () Unit
fanOutPattern = do
  let source = kafkaStream config
  
  -- Process 1: Analytics
  _ <- Om.fromAff $ Om.launchOm ctx handlers $
    source
      # Strom.filter isAnalyticsEvent
      # Strom.mapM processAnalytics
      # Strom.runDrain
  
  -- Process 2: Logging
  _ <- Om.fromAff $ Om.launchOm ctx handlers $
    source
      # Strom.filter isLogEvent
      # Strom.mapM writeLog
      # Strom.runDrain
  
  -- Process 3: Alerts
  source
    # Strom.filter isAlertEvent
    # Strom.mapM sendAlert
    # Strom.runDrain
```

---

## Pattern: Exactly-Once Semantics

```purescript
type Transaction = 
  { messages :: Array KafkaMessage
  , producer :: KafkaProducer
  , commit :: Om Context () Unit
  }

exactlyOnce :: KafkaConfig -> Om Context () Unit
exactlyOnce config = do
  consumer <- Om.fromAff $ createKafkaConsumer config
  producer <- Om.fromAff $ createKafkaProducer config
  
  Strom.repeatOm do
    -- Read batch
    batch <- Om.fromAff $ consumeMessages consumer
    
    -- Process batch
    processed <- Array.traverse processMessage batch
    
    -- Send to output topic (transactional)
    Om.fromAff $ sendBatchTransactional producer "output" processed
    
    -- Commit offsets (after successful send)
    Om.fromAff $ commitOffsets consumer batch
    
    pure unit
  # Strom.runDrain
```

---

## Pattern: Dead Letter Queue

```purescript
import Yoga.Om.Strom.Do (guard)

withDeadLetterQueue :: String -> Strom Context () KafkaMessage -> Om Context () Unit
withDeadLetterQueue dlqTopic stream = do
  producer <- Om.fromAff $ createKafkaProducer config
  
  stream
    # Strom.mapM (\msg -> do
        -- Try to process
        processMessage msg
          # Om.catchAll (\err -> do
              -- Send to DLQ on error
              Om.fromAff $ sendMessage producer dlqTopic msg
              pure Nothing
            )
      )
    # Strom.collect identity  -- Filter out Nothings
    # Strom.runDrain
```

---

## Pattern: Rate Limiting

```purescript
-- Consume with rate limiting
rateLimitedConsumer :: KafkaConfig -> Strom Context () KafkaMessage
rateLimitedConsumer config = do
  message <- kafkaStream config
  
  -- Add delay between messages
  _ <- Strom.fromOm $ Om.delay (Milliseconds 100.0)
  
  pure message

-- Or batch-based rate limiting
batchRateLimited :: KafkaConfig -> Strom Context () KafkaMessage
batchRateLimited config = do
  batch <- kafkaStream config
    # Strom.grouped 10
  
  -- Delay between batches
  _ <- Strom.fromOm $ Om.delay (Milliseconds 1000.0)
  
  message <- Strom.fromArray batch
  pure message
```

---

## Pattern: Windowing

```purescript
-- Time-based windows (conceptual - would need timer integration)
windowedProcessing :: KafkaConfig -> Om Context () Unit
windowedProcessing config = do
  kafkaStream config
    # Strom.grouped 1000  -- Size-based window
    # Strom.mapM processWindow
    # Strom.runDrain

processWindow :: Array KafkaMessage -> Om Context () Unit
processWindow messages = do
  let count = Array.length messages
  let summary = summarize messages
  logWindowStats count summary
```

---

## Complete Real-World Example

```purescript
module Examples.KafkaETL where

import Prelude
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Strom as Strom
import Yoga.Om.Strom.Do (guard)

type Context = 
  { logger :: String -> Om {} () Unit
  , database :: Database
  }

-- ETL Pipeline: Kafka → Transform → Validate → Enrich → Database
kafkaETLPipeline :: Om Context () Unit
kafkaETLPipeline = do
  ctx <- Om.ask
  producer <- Om.fromAff $ createKafkaProducer producerConfig
  
  kafkaStream inputConfig
    # Strom.tap (\msg -> 
        ctx.logger $ "Received: " <> msg.key
      )
    # Strom.mapM parseAndValidate
    # Strom.collect identity  -- Filter out Nones (invalid)
    # Strom.mapParallel 10 enrichData
    # Strom.grouped 100
    # Strom.tapM (\batch ->
        ctx.logger $ "Processing batch of " <> show (Array.length batch)
      )
    # Strom.traverse_ (\batch -> do
        -- Save to database
        Om.fromAff $ saveBatch ctx.database batch
        
        -- Also send to output topic
        Om.fromAff $ sendBatch producer "processed" batch
      )

parseAndValidate :: KafkaMessage -> Om Context () (Maybe ProcessedData)
parseAndValidate msg = do
  case parseJSON msg.value of
    Left err -> pure Nothing
    Right data -> 
      if isValid data
      then pure (Just data)
      else pure Nothing

enrichData :: ProcessedData -> Om Context () EnrichedData
enrichData data = do
  -- Fetch additional data from APIs
  user <- fetchUser data.userId
  product <- fetchProduct data.productId
  
  pure { data, user, product }
```

---

## Monitoring & Observability

```purescript
-- Add metrics to Kafka pipeline
monitoredPipeline :: KafkaConfig -> Om Context () Unit
monitoredPipeline config = do
  ctx <- Om.ask
  
  -- Track metrics
  countRef <- liftEffect $ Ref.new 0
  errorRef <- liftEffect $ Ref.new 0
  
  kafkaStream config
    # Strom.tapM (\_ -> 
        liftEffect $ Ref.modify_ (_ + 1) countRef
      )
    # Strom.mapM (\msg -> 
        processMessage msg
          # Om.catchAll (\err -> do
              liftEffect $ Ref.modify_ (_ + 1) errorRef
              Om.throw err
            )
      )
    # Strom.runDrain
  
  -- Report metrics
  processed <- liftEffect $ Ref.read countRef
  errors <- liftEffect $ Ref.read errorRef
  ctx.logger $ "Processed: " <> show processed <> ", Errors: " <> show errors
```

---

## Best Practices

### ✅ DO

1. **Use batching** - Group messages for efficient processing
2. **Handle errors gracefully** - Use catchAll and DLQs
3. **Commit offsets carefully** - Only after successful processing
4. **Use backpressure** - Let Strom's pull-based model handle it
5. **Monitor throughput** - Track messages/second
6. **Use parallel processing** - `mapParallel` for I/O-bound operations

### ❌ DON'T

1. **Don't lose messages** - Always commit after processing
2. **Don't process too slowly** - Use parallel processing
3. **Don't ignore errors** - Log and handle appropriately
4. **Don't auto-commit** - Manual commits after processing
5. **Don't forget timeouts** - Add timeout logic

---

## Summary

### Kafka → Strom Integration Patterns

1. **Simple Consumer** - `unfoldOm` polling loop
2. **Infinite Consumer** - `repeatOm` for continuous consumption
3. **Batch Processing** - `grouped` for efficiency
4. **Parallel Processing** - `mapParallel` for throughput
5. **Producer** - `traverse_` to send messages
6. **ETL Pipeline** - Full consumer → transform → producer
7. **Multi-Topic** - Merge multiple topics
8. **Fan-Out** - One source, multiple processors
9. **DLQ** - Error handling with dead letter queue
10. **Rate Limiting** - Control consumption rate

### Key Benefits

✅ **Natural Backpressure** - Pull-based Strom naturally throttles  
✅ **Type-Safe** - Om's error tracking  
✅ **Composable** - Chain transformations easily  
✅ **Parallel** - `mapParallel` for high throughput  
✅ **Testable** - Replace Kafka source with `fromArray` in tests  

**Strom + Kafka = Powerful Stream Processing!** 🌊
