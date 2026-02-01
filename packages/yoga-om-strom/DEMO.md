# Strom API Demo

This document showcases the Strom API design and usage patterns.

## Core Design Philosophy

Strom brings ZIO ZStream's powerful streaming model to PureScript's Om effect system:

1. **Pull-based** - Consumer controls the pace (backpressure-aware)
2. **Chunked** - Processes data in batches for efficiency
3. **Type-safe** - Leverages Om's context (`ctx`) and error (`err`) tracking
4. **Resource-safe** - Integrates with Om's error handling

## Type Signature

```purescript
newtype Strom ctx err a = Strom
  { pull :: Om ctx err (Step (Strom ctx err a) (Maybe (Chunk a)))
  }

type Chunk a = Array a
```

Each `pull` operation:
- Returns a `Step` (either `Done` or `Loop` to continue)
- May emit a chunk of values or `Nothing`
- Can perform Om effects with context and error handling

## API Showcase

### 1. Construction - Building Streams

```purescript
-- Empty stream
empty :: Strom ctx err a

-- Single value
succeed 42 :: Strom ctx err Int

-- From collections
fromArray [1, 2, 3, 4, 5] :: Strom ctx err Int
fromFoldable (List.fromFoldable [1, 2, 3]) :: Strom ctx err Int

-- From effects
fromOm (fetchUser 123) :: Strom ctx err User
fromAff httpCall :: Strom ctx err Response

-- Ranges and sequences
range 1 100 :: Strom ctx err Int
iterate (_ + 1) 0 :: Strom ctx err Int  -- infinite!
repeat "hello" :: Strom ctx err String  -- infinite!

-- Unfold patterns
unfold (\n -> if n > 10 then Nothing else Just (Tuple n (n + 1))) 0
unfoldOm fetchNextPage initialToken  -- paginated APIs!

-- Repeat with effects
repeatOm (fetchLatestData) :: Strom ctx err Data
```

### 2. Running - Consuming Streams

```purescript
-- Collect all elements
runCollect :: Strom ctx err a -> Om ctx err (Array a)
result <- Strom.range 1 10 # Strom.runCollect
-- [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

-- Fold (reduce)
runFold :: b -> (b -> a -> b) -> Strom ctx err a -> Om ctx err b
sum <- Strom.range 1 100 # Strom.runFold 0 (+)
-- 5050

-- Run for effects, discard values
runDrain :: Strom ctx err a -> Om ctx err Unit
Strom.repeat doSomething # Strom.take 10 # Strom.runDrain

-- Process each element
traverse_ :: (a -> Om ctx err Unit) -> Strom ctx err a -> Om ctx err Unit
events # Strom.traverse_ handleEvent

-- Subscribe (returns cancellation)
subscribe :: (a -> Om ctx err Unit) -> Strom ctx err a -> Om ctx err (Om ctx err Unit)
cancel <- Strom.subscribe logEvent eventStream
-- later: cancel
```

### 3. Transformations - Modifying Streams

```purescript
-- Pure map
Strom.range 1 10
  # Strom.map (_ * 2)
  # Strom.map show
-- ["2", "4", "6", ..., "20"]

-- Effectful map
users
  # Strom.mapM enrichUserData
  # Strom.mapM validateUser

-- Parallel map (up to N concurrent)
urls
  # Strom.mapParallel 10 fetchUrl
  # Strom.runCollect

-- Bind (nested streams, use >>= operator)
departments
  >>= (\dept -> Strom.fromArray dept.employees)

-- Scan (running aggregation, emits intermediates)
Strom.fromArray [1, 2, 3, 4, 5]
  # Strom.scan (+) 0
-- [1, 3, 6, 10, 15]

-- Stateful map with accumulator
items
  # Strom.mapAccum (\index item -> Tuple (index + 1) { index, item }) 0

-- Tap (observe without modifying)
stream
  # Strom.tap (\x -> log x)  -- pure observation
  # Strom.tapM (\x -> saveToDb x)  -- effectful
```

### 4. Selection - Filtering Streams

```purescript
-- Take n elements
Strom.iterate (_ + 1) 0
  # Strom.take 10
-- [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

-- Take while predicate
numbers
  # Strom.takeWhile (_ < 100)

-- Take until predicate (inclusive)
numbers
  # Strom.takeUntil (_ == 42)

-- Drop operations
numbers
  # Strom.drop 5
  # Strom.dropWhile (_ < 10)

-- Filter
numbers
  # Strom.filter (_ `mod` 2 == 0)

-- Effectful filter
users
  # Strom.filterM isActiveUser

-- Collect (filter + map in one)
strings
  # Strom.collect parseInt  -- :: String -> Maybe Int
-- Only successful parses!

-- Remove consecutive duplicates
events
  # Strom.changes
```

### 5. Combination - Merging Streams

```purescript
-- Sequential concatenation
stream1 `Strom.append` stream2
Strom.concat [s1, s2, s3, s4]

-- Non-deterministic merge (race-based)
Strom.merge fastStream slowStream
-- Elements appear as they're produced

-- Zip (pairs elements)
Strom.zip
  (Strom.range 1 5)
  (Strom.fromArray ["a", "b", "c", "d", "e"])
-- [(1, "a"), (2, "b"), (3, "c"), (4, "d"), (5, "e")]

-- Zip with function
Strom.zipWith (\_) stream1 stream2

-- Deterministic interleave
Strom.interleave odds evens
-- Takes one from each alternately

-- Race (first to emit wins)
Strom.race [source1, source2, source3]
```

### 6. Grouping - Batching Streams

```purescript
-- Fixed-size chunks
Strom.range 1 100
  # Strom.grouped 10
-- [[1..10], [11..20], ..., [91..100]]

-- Chunked (alias for grouped)
events
  # Strom.chunked 50
  # Strom.traverse_ processBatch

-- Partition (split by predicate)
let Tuple evens odds = Strom.partition (\n -> n `mod` 2 == 0) numbers
evensResult <- Strom.runCollect evens
oddsResult <- Strom.runCollect odds
```

### 7. Error Handling

```purescript
-- Catch and recover
riskyStream
  # Strom.catchAll (\err -> Strom.succeed fallbackValue)

-- Alternative on failure
primaryStream `Strom.orElse` backupStream
```

## Real-World Example: Event Processing Pipeline

```purescript
type Event = { id :: String, userId :: String, action :: String, timestamp :: Int }
type Context = { logger :: String -> Aff Unit, db :: Database }

processEventStream :: Om Context () Unit
processEventStream = do
  eventSource
    # Strom.filter (\e -> e.action /= "spam")
    # Strom.changes
    # Strom.mapM enrichEvent
    # Strom.mapParallel 5 validateEvent
    # Strom.collect identity
    # Strom.mapAccum
        (\seq event -> Tuple (seq + 1) { seq, event })
        0
    # Strom.tapM (\{ seq, event } -> logEvent seq event)
    # Strom.grouped 50
    # Strom.traverse_ saveBatch
```

## Real-World Example: Paginated API

```purescript
type Page = { items :: Array Item, nextToken :: Maybe String }

fetchAllPages :: Om Context () (Array Item)
fetchAllPages = do
  Strom.unfoldOm (\token -> do
    page <- fetchPage token
    case page.nextToken of
      Nothing -> pure Nothing
      Just next -> pure $ Just $ Tuple page.items next
  ) initialToken
    >>= Strom.fromArray
    # Strom.runCollect
```

## Real-World Example: Rate-Limited Processing

```purescript
processWithRateLimit :: Om Context () Unit
processWithRateLimit = do
  items
    # Strom.mapM (\item -> do
        result <- callAPI item
        Om.delay (Milliseconds 100.0)  -- Rate limit
        pure result
      )
    # Strom.grouped 10  -- Process in batches
    # Strom.traverse_ logBatch
```

## Comparison: Strom vs Arrays

```purescript
-- ❌ Arrays: Everything in memory
items <- fetchAllItems  -- Could be 1M items!
results <- Array.traverse processItem items  -- Sequential
saveAll results

-- ✅ Strom: Stream processing
fetchAllItemsStream
  # Strom.mapParallel 10 processItem  -- Parallel!
  # Strom.grouped 100                 -- Batch saves
  # Strom.traverse_ saveBatch        -- Incremental
```

## Comparison: Strom vs Bolson Events

- **Bolson Events**: Push-based (FRP), great for UI
- **Strom**: Pull-based, great for data processing, APIs, I/O

Both complement each other! You can even convert between them via `yoga-om-streams`.

## Performance Characteristics

- **Chunked**: Processes arrays internally (1000 elements by default)
- **Lazy**: Values computed only when pulled
- **Backpressure**: Consumer controls pace naturally
- **Resource-safe**: Om's error handling ensures cleanup
- **Parallel**: `mapParallel` processes up to N concurrently

## Advanced Patterns

### Fibonacci Generator

```purescript
fibonacci = Strom.unfold
  (\(Tuple a b) -> Just (Tuple a (Tuple b (a + b))))
  (Tuple 0 1)

first20 <- fibonacci # Strom.take 20 # Strom.runCollect
```

### Infinite Data Source with Cancellation

```purescript
liveDataFeed :: Om Context () Unit
liveDataFeed = do
  cancel <- Strom.repeatOm fetchLatestData
    # Strom.mapM processData
    # Strom.subscribe handleData
  
  -- Let it run
  Om.delay (Milliseconds 60000.0)
  
  -- Cancel after 1 minute
  cancel
```

### Multi-Source Aggregation

```purescript
aggregateFromSources :: Om Context () (Array Result)
aggregateFromSources = do
  Strom.race
    [ sourceA # Strom.map toResult
    , sourceB # Strom.map toResult  
    , sourceC # Strom.map toResult
    ]
  # Strom.take 100
  # Strom.runCollect
```

## Type Safety Benefits

```purescript
-- Context is tracked
fetchUser :: Int -> Om { db :: Database } _ User

-- Won't compile - missing db in context!
❌ Strom.fromOm (fetchUser 1) :: Strom {} _ User

-- ✅ Correct - db provided
✓ Strom.fromOm (fetchUser 1) :: Strom { db :: Database } _ User

-- Errors are tracked
riskyOp :: Om ctx (networkError :: String) Result

-- Error appears in stream type
riskyStream :: Strom ctx (networkError :: String) Result
riskyStream = Strom.fromOm riskyOp

-- Must handle or propagate
handled = riskyStream # Strom.catchAll (\_ -> Strom.succeed defaultValue)
```

## Summary

Strom provides a comprehensive, type-safe, and efficient streaming library for Om that:

✅ **Scales**: Process millions of items without loading into memory  
✅ **Composes**: Rich combinator library for building pipelines  
✅ **Controls**: Pull-based model gives consumer control  
✅ **Parallels**: Easy concurrent processing with `mapParallel`  
✅ **Integrates**: Works seamlessly with Om's context and errors  
✅ **Performs**: Chunked processing for optimal throughput  

Perfect for: Data pipelines, API processing, event streams, file I/O, batch jobs, real-time feeds.
