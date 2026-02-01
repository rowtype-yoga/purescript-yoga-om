# Quick Answers: Merging & Kafka

## Question 1: How Can We Merge Two Streams?

### 🎯 **5 Ways to Merge**

#### 1. `merge` - Race-Based (Non-Deterministic)

```purescript
result = Strom.merge stream1 stream2

-- Example
userEvents = Strom.merge clickStream keyboardStream
```

**When to use**: Multiple event sources, order doesn't matter, max throughput

---

#### 2. `append` / `<>` - Sequential

```purescript
result = stream1 `Strom.append` stream2
-- or
result = stream1 <> stream2

-- Example
allPages = page1 <> page2 <> page3
```

**When to use**: Order matters, pagination, stages

---

#### 3. `interleave` - Round-Robin

```purescript
result = Strom.interleave stream1 stream2

-- Example
fairScheduled = Strom.interleave highPriority normalPriority
```

**When to use**: Fair scheduling, deterministic alternation

---

#### 4. `zip` - Pair Elements

```purescript
result = Strom.zip stream1 stream2

-- Example
indexed = Strom.zip 
  (Strom.iterate (_ + 1) 0)
  items
```

**When to use**: Related data, joining by position

---

#### 5. `race` - Fastest Wins

```purescript
result = Strom.race [stream1, stream2, stream3]

-- Example
fastest = Strom.race [cache, database, api]
```

**When to use**: Timeouts, redundant sources, circuit breakers

---

## Question 2: How to Integrate Kafka?

### 🎯 **Pattern: Consumer → Process → Producer**

```purescript
-- Complete pipeline
kafkaPipeline :: Om Context () Unit
kafkaPipeline = do
  producer <- createProducer config
  
  -- Consume from Kafka
  kafkaStream consumerConfig "input-topic"
    # Strom.mapM parseMessage           -- Parse JSON
    # Strom.collect identity              -- Filter failures
    # Strom.mapParallel 10 enrichData     -- Parallel processing
    # Strom.grouped 50                    -- Batch for efficiency
    # Strom.traverse_ (\batch ->         -- Send to output
        producer.sendBatch "output-topic" batch
      )
```

---

### 📥 **Kafka Consumer Stream**

```purescript
-- Create a Strom from Kafka topic
kafkaStream :: KafkaConfig -> String -> Strom ctx () KafkaMessage
kafkaStream config topic = 
  Strom.unfoldOm pollMessages unit
  where
  pollMessages _ = do
    consumer <- Om.fromAff $ createConsumer config
    Om.fromAff $ consumer.subscribe topic
    messages <- Om.fromAff $ consumer.consume 5000  -- Poll
    pure $ Just $ Tuple messages unit

-- Usage
main = do
  kafkaStream config "events"
    >>= Strom.fromArray
    # Strom.traverse_ processEvent
```

---

### 📤 **Kafka Producer**

```purescript
-- Send to Kafka
produceToKafka :: Om ctx () Unit
produceToKafka = do
  producer <- createProducer config
  
  myDataStream
    # Strom.grouped 100  -- Batch for efficiency
    # Strom.traverse_ (\batch ->
        producer.sendBatch "output-topic" batch
      )
```

---

### 🔄 **Complete ETL Pipeline**

```purescript
import Yoga.Om.Strom.Do (guard)

kafkaETL :: Om Context () Unit
kafkaETL = do
  producer <- createProducer config
  
  -- Consume
  kafkaStream config "raw-events"
    # Strom.mapM parseJSON              -- Parse
    # Strom.collect identity             -- Filter invalid
    # Strom.filter isValid                -- Validate
    # Strom.mapParallel 10 enrichWithDB  -- Enrich (parallel!)
    # Strom.grouped 100                  -- Batch
    # Strom.traverse_ (\batch ->        -- Produce
        producer.sendBatch "processed-events" batch
      )
```

---

### 🎭 **Multi-Topic Consumer**

```purescript
-- Merge multiple Kafka topics
allTopics :: Strom ctx () KafkaMessage
allTopics = 
  Strom.concat
    [ kafkaStream config "events"
    , kafkaStream config "logs"
    , kafkaStream config "metrics"
    ]

-- With routing
main = do
  allTopics
    # Strom.traverse_ (\msg ->
        case msg.topic of
          "events" -> processEvent msg
          "logs" -> processLog msg
          "metrics" -> processMetric msg
          _ -> pure unit
      )
```

---

### 💪 **Advanced: Multi-Topic with Do-Notation**

```purescript
import Yoga.Om.Strom.Do (guard)

processKafkaTopics :: Om ctx () Unit
processKafkaTopics = do
  -- Merge and process in one flow
  processed <- do
    msg <- Strom.concat
      [ kafkaStream config "events-v1"
      , kafkaStream config "events-v2"
      , kafkaStream config "events-v3"
      ]
    
    event <- Strom.fromOm $ parseMessage msg
    guard (isValid event)
    
    enriched <- Strom.fromOm $ enrichEvent event
    guard enriched.isComplete
    
    pure enriched
  
  processed
    # Strom.grouped 100
    # Strom.traverse_ saveBatch
```

---

## 🔥 Real-World Kafka Example

### Complete Production Pipeline

```purescript
production :: Om Context () Unit
production = do
  ctx <- Om.ask
  producer <- createProducer producerConfig
  
  -- Merge 3 Kafka topics
  Strom.concat
    [ kafkaStream config "orders"
    , kafkaStream config "payments"
    , kafkaStream config "shipments"
    ]
    # Strom.tapM (\msg -> 
        ctx.logger $ "Received: " <> msg.key
      )
    # Strom.mapM parseAndValidate
    # Strom.collect identity               -- Keep valid
    # Strom.mapParallel 10 enrichWithDB    -- Parallel fetch
    # Strom.grouped 50                     -- Batch
    # Strom.tapM (\batch -> 
        ctx.logger $ "Processing: " <> show (Array.length batch)
      )
    # Strom.traverse_ (\batch -> do       -- Atomic: send + commit
        producer.sendBatch "processed" batch
        commitOffsets batch
      )
```

---

## 📋 Cheat Sheet

### Merging Two Streams

```purescript
-- Non-deterministic (fast)
Strom.merge s1 s2

-- Sequential (ordered)
s1 `Strom.append` s2
s1 <> s2  -- Same

-- Alternating (fair)
Strom.interleave s1 s2

-- Paired (joined)
Strom.zip s1 s2

-- Fastest (race)
Strom.race [s1, s2]

-- All combinations (Cartesian)
do
  x <- s1
  y <- s2
  pure (Tuple x y)
```

### Kafka Patterns

```purescript
-- Simple consumer
kafkaStream config topic
  # Strom.traverse_ process

-- With batching
kafkaStream config topic
  # Strom.grouped 100
  # Strom.traverse_ processBatch

-- Consumer → Producer
kafkaStream config "in"
  # Strom.mapM transform
  # Strom.grouped 50
  # Strom.traverse_ (sendTo "out")

-- Multi-topic
Strom.concat
  [ kafkaStream config "t1"
  , kafkaStream config "t2"
  ]
  # Strom.traverse_ route
```

---

## 🎓 Key Insights

### Merging
- **5 strategies** with different semantics
- **Choose by requirements**: order, speed, pairing
- **Composable** - combine strategies as needed

### Kafka
- **Natural fit** - Strom's pull-based model = backpressure
- **Simple pattern** - `unfoldOm` for polling
- **Batch processing** - `grouped` for efficiency
- **Parallel** - `mapParallel` for throughput
- **Type-safe** - Om tracks errors and context

---

**Both merging and Kafka integration are first-class in Strom!** 🌊
