# Strom Integration Guide: Merging & Kafka

Quick visual guide to merging streams and integrating with Kafka.

## 🔀 Merging Strategies

### 1. `merge` - Non-Deterministic (Race-Based)

```purescript
result = Strom.merge stream1 stream2
```

```
Stream 1:  [1, 2, 3] ──┐
                        ├─→ [?, ?, ?, ?, ?, ?]  (non-deterministic order)
Stream 2:  [a, b, c] ──┘
```

**Use for**: Event streams, multiple sources, max throughput

---

### 2. `append` / `concat` - Sequential

```purescript
result = stream1 `Strom.append` stream2
-- or
result = Strom.concat [stream1, stream2, stream3]
```

```
Stream 1:  [1, 2, 3] ──┐
                        ├─→ [1, 2, 3, a, b, c]  (deterministic)
Stream 2:  [a, b, c] ──┘
          (waits for stream1)
```

**Use for**: Pagination, stages, fallbacks

---

### 3. `interleave` - Deterministic Alternating

```purescript
result = Strom.interleave stream1 stream2
```

```
Stream 1:  [1, 2, 3] ──┐
                        ├─→ [1, a, 2, b, 3, c]  (alternates)
Stream 2:  [a, b, c] ──┘
```

**Use for**: Fair scheduling, round-robin, load balancing

---

### 4. `zip` - Pair Elements

```purescript
result = Strom.zip stream1 stream2
```

```
Stream 1:  [1, 2, 3] ──┐
                        ├─→ [(1,a), (2,b), (3,c)]
Stream 2:  [a, b, c] ──┘
```

**Use for**: Joining related data, adding indices

---

### 5. `race` - First Wins

```purescript
result = Strom.race [stream1, stream2, stream3]
```

```
Stream 1:  [slow...] ──┐
                        │
Stream 2:  [FAST!]  ────├─→ [FAST!]  (first to emit wins)
                        │
Stream 3:  [slower] ────┘
```

**Use for**: Timeouts, fastest response, circuit breakers

---

### 6. Do-Notation - Cartesian Product

```purescript
result = do
  x <- stream1
  y <- stream2
  pure (Tuple x y)
```

```
Stream 1:  [1, 2] ──┐
                     ├─→ [(1,a), (1,b), (2,a), (2,b)]
Stream 2:  [a, b] ──┘   (all combinations)
```

**Use for**: All combinations, test cases, grids

---

## 🎯 Quick Decision Tree

```
Need to merge streams?
│
├─ Order matters?
│  ├─ YES → Use `append`/`concat`
│  └─ NO → Continue...
│
├─ Need all combinations?
│  ├─ YES → Use do-notation
│  └─ NO → Continue...
│
├─ Need pairing?
│  ├─ YES → Use `zip`
│  └─ NO → Continue...
│
├─ Want fastest?
│  ├─ YES → Use `race`
│  └─ NO → Continue...
│
├─ Want fair scheduling?
│  ├─ YES → Use `interleave`
│  └─ NO → Use `merge`
```

---

## ☕ Kafka Integration Patterns

### Pattern 1: Simple Consumer

```purescript
kafkaStream config "my-topic"
  # Strom.mapM processMessage
  # Strom.traverse_ handleResult
```

### Pattern 2: Infinite Consumer with Batching

```purescript
kafkaInfinite config "my-topic"
  # Strom.grouped 100      -- Batch 100
  # Strom.traverse_ processBatch
```

### Pattern 3: Consumer → Producer Pipeline

```purescript
producer <- createProducer config

kafkaStream config "input"
  # Strom.mapParallel 10 transform
  # Strom.grouped 50
  # Strom.traverse_ (\batch ->
      producer.sendBatch "output" batch
    )
```

### Pattern 4: Multi-Topic Consumer

```purescript
-- Option A: Sequential
Strom.concat
  [ kafkaStream config "topic1"
  , kafkaStream config "topic2"
  , kafkaStream config "topic3"
  ]
  # Strom.traverse_ process

-- Option B: With tagging
Strom.concat
  [ kafkaStream config "t1" # Strom.map (\m -> {topic: "t1", msg: m})
  , kafkaStream config "t2" # Strom.map (\m -> {topic: "t2", msg: m})
  ]
  # Strom.traverse_ routeByTopic
```

### Pattern 5: Error Handling with DLQ

```purescript
producer <- createProducer config

source
  # Strom.mapM (\msg ->
      processMessage msg
        # Om.catchAll (\err -> do
            producer.send "dlq-topic" msg
            pure Nothing
          )
    )
  # Strom.collect identity
  # Strom.runDrain
```

### Pattern 6: Exactly-Once Semantics

```purescript
consumer <- createConsumer config
producer <- createProducer config

Strom.repeatOm do
  batch <- consumer.consume 5000
  processed <- Array.traverse transform batch
  producer.sendBatch "output" processed
  consumer.commit  -- After successful send
  pure batch
>>= Strom.fromArray
# Strom.runDrain
```

---

## 🚀 Real-World: Complete ETL Pipeline

```purescript
-- Kafka → Transform → Enrich → Validate → Kafka
kafkaETL :: Om Context () Unit
kafkaETL = do
  producer <- createProducer producerConfig
  
  kafkaInfinite consumerConfig "raw-events"
    # Strom.mapM parseEvent                    -- Parse JSON
    # Strom.collect identity                    -- Filter failures
    # Strom.filter isValidEvent                 -- Business validation
    # Strom.mapParallel 10 enrichWithUserData   -- Parallel enrichment
    # Strom.filter (\e -> e.user.active)        -- Filter inactive
    # Strom.grouped 100                         -- Batch
    # Strom.tapM logBatchStats                 -- Monitor
    # Strom.traverse_ (\batch -> do            -- Send & commit
        producer.sendBatch "enriched-events" batch
        commitOffsets batch
      )
```

**With Do-Notation for Multiple Topics:**

```purescript
import Yoga.Om.Strom.Do (guard)

multiTopicETL :: Om Context () Unit
multiTopicETL = do
  producer <- createProducer config
  
  event <- do
    -- Merge 3 topics with filtering
    msg <- Strom.concat
      [ kafkaStream config "events-v1"
      , kafkaStream config "events-v2"
      , kafkaStream config "events-v3"
      ]
    
    -- Parse based on topic
    parsed <- Strom.fromOm $ parseByTopic msg
    guard (isValid parsed)
    pure parsed
  
  -- Enrich
  enriched <- Strom.fromOm $ enrichEvent event
  guard enriched.isComplete
  
  -- Send to output
  _ <- Strom.fromOm $ 
    Om.fromAff $ producer.send "output" (serialize enriched)
  
  pure unit
```

---

## 📊 Comparison: Merge Methods

| Method | Order | Speed | Memory | Best For |
|--------|-------|-------|--------|----------|
| `merge` | ❌ | ⚡⚡⚡ | 💾 | High throughput |
| `append` | ✅ | ⚡ | 💾 | Stages |
| `concat` | ✅ | ⚡ | 💾 | Multiple stages |
| `interleave` | ✅ | ⚡⚡ | 💾💾 | Fair scheduling |
| `zip` | ✅ | ⚡⚡ | 💾💾 | Pairing |
| `race` | ❌ | ⚡⚡⚡ | 💾 | Fastest wins |
| Do-notation | ✅ | ⚡ | 💾💾💾 | All combos |

---

## 🎓 Key Takeaways

### Merging Streams

1. **5 merge strategies** - each with different semantics
2. **Choose based on needs** - order, speed, semantics
3. **Composable** - can combine strategies
4. **Type-safe** - errors tracked through merges

### Kafka Integration

1. **Simple pattern** - `unfoldOm` for polling
2. **Natural backpressure** - pull-based Strom throttles automatically
3. **Batching** - use `grouped` for efficiency
4. **Parallel** - use `mapParallel` for throughput
5. **Error handling** - use `catchAll` and DLQ patterns
6. **Exactly-once** - read → process → send → commit

### Best Practices

✅ **Batch messages** - Group for efficiency  
✅ **Use parallel processing** - `mapParallel` for I/O  
✅ **Handle errors gracefully** - DLQ pattern  
✅ **Commit after processing** - Exactly-once semantics  
✅ **Monitor throughput** - Log batch sizes  
✅ **Test with mocks** - Replace Kafka with `fromArray`  

---

## 📚 See Also

- **[MERGING.md](./MERGING.md)** - Detailed merge strategies
- **[KAFKA_INTEGRATION.md](./KAFKA_INTEGRATION.md)** - Complete Kafka guide
- **[examples/MergingShowcase.purs](./examples/MergingShowcase.purs)** - All patterns
- **[examples/KafkaIntegration.purs](./examples/KafkaIntegration.purs)** - Kafka examples
- **[examples/KafkaIntegration.js](./examples/KafkaIntegration.js)** - FFI implementation

---

**Strom makes stream merging and Kafka integration simple and type-safe!** 🌊
