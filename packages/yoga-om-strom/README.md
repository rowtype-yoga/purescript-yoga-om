# yoga-om-strom

**Strom** is a powerful, ZIO ZStream-inspired streaming library for yoga-om that brings pull-based, composable, and resource-safe stream processing to PureScript.

## Why "Strom"?

Just as **Om** represents your effect type, **Strom** represents streaming effects. The name comes from German/Swedish meaning "stream" or "current" - fitting for a streaming library!

## Features

### 🎯 ZIO ZStream-Inspired

Strom brings the best ideas from Scala's ZIO ZStream to PureScript:

- **Pull-based streams** - Efficient, backpressure-aware processing
- **Chunked execution** - Batch processing for optimal performance  
- **Resource safety** - Proper cleanup and error handling
- **Type-safe** - Leverages Om's context and error tracking

### 🚀 Comprehensive Operations

- **Construction**: `fromArray`, `range`, `iterate`, `repeat`, `unfold`, `repeatOm`
- **Transformation**: `map`, `mapM`, `mapParallel`, `bind` (or `>>=`), `scan`, `mapAccum`
- **Selection**: `take`, `takeWhile`, `takeUntil`, `drop`, `dropWhile`, `filter`, `collect`, `changes`
- **Combination**: `append`, `concat`, `merge`, `zip`, `zipWith`, `interleave`, `race`
- **Grouping**: `grouped`, `chunked`, `partition`
- **Execution**: `runCollect`, `runDrain`, `runFold`, `traverse_`, `for_`, `subscribe`
- **Error Handling**: `catchAll`, `orElse`

## Installation

```bash
spago install yoga-om-core yoga-om-strom
```

## Quick Start

### Basic Stream Operations

```purescript
import Yoga.Om.Strom as Strom

-- Simple transformation pipeline
result <- 
  Strom.range 1 10
    # Strom.map (_ * 2)
    # Strom.filter (_ > 10)
    # Strom.runCollect

-- Output: [12, 14, 16, 18]
```

### Do-Notation (Comprehension-Style!)

```purescript
import Yoga.Om.Strom.Do (guard)

-- Pythagoras triples
triples <-
  (do
    a <- Strom.range 1 20
    b <- Strom.range a 20
    c <- Strom.range b 20
    guard (a * a + b * b == c * c)
    pure (Tuple a (Tuple b c))
  ) # Strom.runCollect

-- Output: [(3,4,5), (5,12,13), (6,8,10), (8,15,17), ...]
```

**See [DO_NOTATION.md](./DO_NOTATION.md) for comprehensive examples!**

### Effectful Operations

```purescript
-- Map with monadic effects
users <-
  Strom.range 1 100
    # Strom.mapM (\id -> fetchUser id)  -- Om ctx err User
    # Strom.filter (_.active)
    # Strom.runCollect
```

### Parallel Processing

```purescript
-- Process up to 10 items concurrently
results <-
  Strom.fromArray urls
    # Strom.mapParallel 10 fetchUrl
    # Strom.runCollect
```

### Stateful Transformations

```purescript
-- Running total with scan
totals <-
  Strom.fromArray [1, 2, 3, 4, 5]
    # Strom.scan (+) 0
    # Strom.runCollect
-- Output: [1, 3, 6, 10, 15]

-- Stateful map with accumulator
indexed <-
  Strom.fromArray ["a", "b", "c"]
    # Strom.mapAccum (\i x -> Tuple (i + 1) (show i <> ": " <> x)) 1
    # Strom.runCollect
-- Output: ["1: a", "2: b", "3: c"]
```

### Combining Streams

```purescript
-- Zip two streams
pairs <-
  Strom.zip
    (Strom.range 1 5)
    (Strom.fromArray ["a", "b", "c", "d", "e"])
  # Strom.runCollect
-- Output: [(1, "a"), (2, "b"), (3, "c"), (4, "d"), (5, "e")]

-- Interleave deterministically
mixed <-
  Strom.interleave
    (Strom.fromArray [1, 3, 5])
    (Strom.fromArray [2, 4, 6])
  # Strom.runCollect
-- Output: [1, 2, 3, 4, 5, 6]

-- Merge non-deterministically (race-based)
merged <-
  Strom.merge stream1 stream2
  # Strom.runCollect
```

### Infinite Streams

```purescript
-- Take from infinite stream
first10 <-
  Strom.iterate (_ + 1) 0
    # Strom.take 10
    # Strom.runCollect
-- Output: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

-- Fibonacci sequence
fibonacci <-
  Strom.unfold
    (\(Tuple a b) -> Just (Tuple a (Tuple b (a + b))))
    (Tuple 0 1)
  # Strom.take 10
  # Strom.runCollect
-- Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### Grouping and Batching

```purescript
-- Process in batches
Strom.range 1 100
  # Strom.grouped 10
  # Strom.traverse_ (\batch -> do
      Console.log $ "Processing batch of " <> show (length batch)
      processBatch batch
    )
```

### Error Handling

```purescript
-- Catch and recover
results <-
  riskyStream
    # Strom.catchAll (\err -> Strom.succeed defaultValue)
    # Strom.runCollect

-- Provide alternative stream
results <-
  primaryStream `Strom.orElse` fallbackStream
  # Strom.runCollect
```

## Real-World Example

### Event Processing Pipeline

```purescript
type Event = { timestamp :: Int, userId :: String, action :: String }
type Context = { logger :: String -> Aff Unit, db :: Database }

processEvents :: Om Context () Unit
processEvents = do
  fetchEventStream
    # Strom.filter (_.action /= "spam")           -- Filter spam
    # Strom.changes                                -- Deduplicate consecutive
    # Strom.mapM enrichEvent                       -- Fetch additional data
    # Strom.mapParallel 5 validateEvent            -- Validate concurrently
    # Strom.collect identity                       -- Keep only valid (Maybe)
    # Strom.grouped 50                             -- Batch for DB
    # Strom.tapM (\batch -> logBatch batch)        -- Log each batch
    # Strom.traverse_ (\batch -> saveBatch batch)  -- Save to DB
```

### Paginated API Fetching

```purescript
-- Unfold paginated results into a stream
fetchAllPages :: Om Context () (Array Item)
fetchAllPages = do
  Strom.unfoldOm (\pageToken -> do
    page <- fetchPage pageToken
    case page.nextToken of
      Nothing -> pure Nothing
      Just token -> pure $ Just $ Tuple page.items token
  ) initialToken
    >>= Strom.fromArray  -- Flatten pages
    # Strom.runCollect
```

### Rate-Limited API Calls

```purescript
-- Process with delays between items
processWithRateLimit :: Om Context () Unit
processWithRateLimit = do
  Strom.fromArray items
    # Strom.mapM (\item -> do
        result <- callAPI item
        Om.delay (Milliseconds 100.0)  -- Rate limit
        pure result
      )
    # Strom.traverse_ handleResult
```

## Comparison with Other Approaches

### vs Arrays

```purescript
-- ❌ Arrays: Load everything into memory
processArrays :: Om ctx err (Array Result)
processArrays = do
  items <- fetchAllItems  -- Loads ALL items
  Array.traverse processItem items  -- Sequential

-- ✅ Strom: Efficient streaming
processStream :: Om ctx err Unit
processStream = do
  Strom.unfoldOm fetchNextBatch initialState
    >>= Strom.fromArray
    # Strom.mapParallel 10 processItem  -- Parallel!
    # Strom.runDrain
```

### vs Bolson Events

```purescript
-- Bolson Events are push-based (FRP)
-- Great for UI, but less control over backpressure

-- Strom is pull-based
-- Consumer controls when to pull next items
-- Better for batch processing, APIs, file I/O
```

## API Overview

### Construction

- `empty :: Strom ctx err a` - Empty stream
- `succeed :: a -> Strom ctx err a` - Single element
- `fromArray :: Array a -> Strom ctx err a` - From array
- `fromFoldable :: Foldable f => f a -> Strom ctx err a` - From any foldable
- `fromOm :: Om ctx err a -> Strom ctx err a` - From Om effect
- `fromAff :: Aff a -> Strom ctx err a` - From Aff
- `range :: Int -> Int -> Strom ctx err Int` - Range of integers
- `iterate :: (a -> a) -> a -> Strom ctx err a` - Infinite iteration
- `repeat :: a -> Strom ctx err a` - Infinite repetition
- `repeatOm :: Om ctx err a -> Strom ctx err a` - Infinite Om repetition
- `unfold :: (b -> Maybe (Tuple a b)) -> b -> Strom ctx err a` - Unfold pattern
- `unfoldOm :: (b -> Om ctx err (Maybe (Tuple a b))) -> b -> Strom ctx err a` - Effectful unfold

### Running

- `runCollect :: Strom ctx err a -> Om ctx err (Array a)` - Collect all elements
- `runDrain :: Strom ctx err a -> Om ctx err Unit` - Run and discard
- `runFold :: b -> (b -> a -> b) -> Strom ctx err a -> Om ctx err b` - Fold stream
- `traverse_ :: (a -> Om ctx err Unit) -> Strom ctx err a -> Om ctx err Unit` - Traverse with effects
- `for_ :: Strom ctx err a -> (a -> Om ctx err Unit) -> Om ctx err Unit` - Flipped traverse_
- `subscribe :: (a -> Om ctx err Unit) -> Strom ctx err a -> Om ctx err (Om ctx err Unit)` - Subscribe with cancellation

### Transformations

- `map :: (a -> b) -> Strom ctx err a -> Strom ctx err b` - Pure map
- `mapM :: (a -> Om ctx err b) -> Strom ctx err a -> Strom ctx err b` - Monadic map
- `mapParallel :: Int -> (a -> Om ctx err b) -> Strom ctx err a -> Strom ctx err b` - Parallel map
- `bind :: (a -> Strom ctx err b) -> Strom ctx err a -> Strom ctx err b` - Monadic bind (use `>>=` operator)
- `scan :: (b -> a -> b) -> b -> Strom ctx err a -> Strom ctx err b` - Running fold
- `mapAccum :: (s -> a -> Tuple s b) -> s -> Strom ctx err a -> Strom ctx err b` - Stateful map
- `tap :: (a -> Unit) -> Strom ctx err a -> Strom ctx err a` - Observe without modifying
- `tapM :: (a -> Om ctx err Unit) -> Strom ctx err a -> Strom ctx err a` - Monadic tap

### Selection

- `take :: Int -> Strom ctx err a -> Strom ctx err a` - Take n elements
- `takeWhile :: (a -> Boolean) -> Strom ctx err a -> Strom ctx err a` - Take while true
- `takeUntil :: (a -> Boolean) -> Strom ctx err a -> Strom ctx err a` - Take until true (inclusive)
- `drop :: Int -> Strom ctx err a -> Strom ctx err a` - Drop n elements
- `dropWhile :: (a -> Boolean) -> Strom ctx err a -> Strom ctx err a` - Drop while true
- `filter :: (a -> Boolean) -> Strom ctx err a -> Strom ctx err a` - Filter elements
- `filterM :: (a -> Om ctx err Boolean) -> Strom ctx err a -> Strom ctx err a` - Monadic filter
- `collect :: (a -> Maybe b) -> Strom ctx err a -> Strom ctx err b` - Filter + map
- `collectM :: (a -> Om ctx err (Maybe b)) -> Strom ctx err a -> Strom ctx err b` - Monadic collect
- `changes :: Eq a => Strom ctx err a -> Strom ctx err a` - Remove consecutive duplicates

### Combining

- `append :: Strom ctx err a -> Strom ctx err a -> Strom ctx err a` - Sequential concatenation
- `concat :: Array (Strom ctx err a) -> Strom ctx err a` - Concat multiple streams
- `merge :: Strom ctx err a -> Strom ctx err a -> Strom ctx err a` - Non-deterministic merge
- `zip :: Strom ctx err a -> Strom ctx err b -> Strom ctx err (Tuple a b)` - Zip two streams
- `zipWith :: (a -> b -> c) -> Strom ctx err a -> Strom ctx err b -> Strom ctx err c` - Zip with function
- `interleave :: Strom ctx err a -> Strom ctx err a -> Strom ctx err a` - Deterministic interleave
- `race :: Array (Strom ctx err a) -> Strom ctx err a` - Race multiple streams

### Grouping

- `grouped :: Int -> Strom ctx err a -> Strom ctx err (Array a)` - Fixed-size chunks
- `chunked :: Int -> Strom ctx err a -> Strom ctx err (Array a)` - Alias for grouped
- `partition :: (a -> Boolean) -> Strom ctx err a -> Tuple (Strom ctx err a) (Strom ctx err a)` - Split by predicate

### Error Handling

- `catchAll :: (Record err -> Strom ctx err2 a) -> Strom ctx err a -> Strom ctx err2 a` - Catch and recover
- `orElse :: Strom ctx err a -> Strom ctx err a -> Strom ctx err a` - Alternative on failure

## Performance Characteristics

- **Chunked processing**: Operations process arrays internally for efficiency
- **Pull-based**: Backpressure naturally handled - consumer controls pace
- **Lazy**: Elements only computed when pulled
- **Resource-safe**: Om's error handling ensures cleanup

### Benchmark Results (Node.js v25)

Performance benchmarks on a modern system (median of 10 runs):

| Operation | Dataset | Median Time |
|-----------|---------|-------------|
| **Simple Ops** | | |
| map | 2M elements | <1ms |
| filter (50%) | 2M elements | <1ms |
| map chain (3x) | 2M elements | <1ms |
| pipeline (map+filter+map) | 2M elements | <1ms |
| **Aggregation** | | |
| fold (sum) | 1M elements | <1ms |
| collect | 50k elements | <1ms |
| scan (running sum) | 2M elements | <1ms |
| **Construction** | | |
| fromArray | 1M elements | <1ms |
| iterateStrom | 10k elements | <1ms |
| repeatStrom | 10k elements | <1ms |
| unfold | 10k elements | <1ms |
| iterateInfinite + take | 10k elements | **1ms** |
| **Selection** | | |
| take | 5k from 2M | <1ms |
| takeWhile | ~50k from 1M | <1ms |
| drop | 5k from 1M | <1ms |
| dropWhile | 500k from 1M | <1ms |
| **Transform** | | |
| mapM (effect) | 50k elements | <1ms |
| tap | 50k elements | <1ms |
| collect (filter+map) | 50k elements | <1ms |
| changes (dedup) | 50k elements | <1ms |
| **Grouping** | | |
| grouped (chunks of 100) | 50k elements | <1ms |
| partition (even/odd) | 50k elements | <1ms |
| **Combining** | | |
| append | 2x500k streams | <1ms |
| concat | 10x10k streams | <1ms |
| zip | 2x500k streams | <1ms |
| zipWith | 2x500k streams | <1ms |
| bind (flatMap) | 5k×10 | <1ms |
| **Concurrent** | | |
| mergeND | 2x1M streams | **485ms** |
| mapPar (concurrency=4) | 5k elements | **355ms** |

**Key Takeaways:**
- ⚡ Most operations are **sub-millisecond** thanks to chunked processing and STArray optimizations
- 🔄 Only truly concurrent operations (mergeND, mapPar) have observable overhead from async coordination
- 🚀 Excellent throughput: **>2M elements/ms** for simple transformations
- 📦 Efficient chunking (10,000 elements per chunk) minimizes overhead

## Architecture

Strom is built on a simple but powerful abstraction:

```purescript
newtype Strom ctx err a = Strom
  { pull :: Om ctx err (Step (Strom ctx err a) (Maybe (Chunk a)))
  }

type Chunk a = Array a
```

Each pull:
1. Returns a `Step` - either `Done` (finished) or `Loop` (continue)
2. May emit a `Chunk` of values (or `Nothing` if no values yet)
3. Can perform Om effects (context access, error handling, etc.)

This design enables:
- Efficient batching
- Natural backpressure
- Resource safety
- Composability

## Documentation

- **[INDEX.md](./INDEX.md)** - Start here! Navigation and overview
- **[README.md](./README.md)** - This file (complete guide)
- **[QUICKREF.md](./QUICKREF.md)** - One-page API reference
- **[DO_NOTATION.md](./DO_NOTATION.md)** - Do-notation guide with examples
- **[DEMO.md](./DEMO.md)** - API showcase with usage patterns
- **[COMPARISON.md](./COMPARISON.md)** - Detailed comparison with ZIO ZStream
- **[TESTING.md](./TESTING.md)** - Test coverage summary
- **[Examples.purs](./src/Yoga/Om/Strom/Examples.purs)** - 18 runnable examples

## See Also

- **[yoga-om-core](../yoga-om-core)** - Core Om effect system (required)
- **[yoga-om-node](../yoga-om-node)** - Node.js integrations
- **[yoga-om-rom](../yoga-om-rom)** - Reactive Om: Bolson FRP integration (complementary, push-based)

## Credits

Inspired by [ZIO ZStream](https://zio.dev/reference/stream/zstream) from the Scala ZIO ecosystem.
