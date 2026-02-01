# Strom Quick Reference

One-page reference for the Strom API.

## Type Signature

```purescript
newtype Strom ctx err a
```

A stream that:
- Emits values of type `a`
- May fail with errors in `err`
- Requires context `ctx`
- Performs effects in Om

## Construction

```purescript
empty                              -- Empty stream
succeed a                          -- Single element
fail err                           -- Immediate failure

fromArray [1, 2, 3]               -- From array
fromFoldable list                  -- From any Foldable
fromOm omEffect                    -- From Om effect
fromAff affEffect                  -- From Aff effect

range 1 100                        -- Integers [1..100)
iterate (+ 1) 0                    -- 0, 1, 2, 3, ...
repeat "x"                         -- "x", "x", "x", ...
repeatOm fetchData                 -- Repeat effect

unfold f seed                      -- Pure unfold
unfoldOm f seed                    -- Effectful unfold
```

## Running (Consuming)

```purescript
runCollect stream                  -- Om ctx err (Array a)
runDrain stream                    -- Om ctx err Unit
runFold init f stream              -- Om ctx err b
traverse_ handler stream          -- Om ctx err Unit
subscribe handler stream           -- Om ctx err (Om ctx err Unit)
```

## Transformations

```purescript
stream # map f                     -- Pure map
stream # mapM f                   -- Effectful map
stream # mapParallel 5 f           -- Parallel (max 5)
stream >>= toStream                -- Monadic bind (flatten)
stream # scan f init               -- Running fold
stream # mapAccum f state          -- Stateful map
stream # tap observer              -- Pure observe
stream # tapM observer            -- Effectful observe
```

## Selection

```purescript
stream # take 10                   -- First 10
stream # takeWhile predicate       -- While true
stream # takeUntil predicate       -- Until true (inclusive)

stream # drop 5                    -- Skip first 5
stream # dropWhile predicate       -- Skip while true

stream # filter predicate          -- Pure filter
stream # filterM predicate        -- Effectful filter
stream # collect partialFn         -- Filter + map
stream # collectM partialFn       -- Effectful collect

stream # changes                   -- Remove consecutive dups
```

## Combining

```purescript
s1 `append` s2                     -- Sequential concat
s1 <> s2                           -- Same (Semigroup)
concat [s1, s2, s3]                -- Multiple streams

s1 `merge` s2                      -- Non-deterministic
zip s1 s2                          -- Tuple pairs
zipWith f s1 s2                    -- Zip with function
interleave s1 s2                   -- Deterministic alternating

race [s1, s2, s3]                  -- First to emit
```

## Grouping

```purescript
stream # grouped 10                -- Chunks of 10
stream # chunked 50                -- Batches of 50
partition predicate stream         -- Split in two
```

## Error Handling

```purescript
stream # catchAll handler          -- Catch and recover
s1 `orElse` s2                     -- Alternative on fail
s1 <|> s2                          -- Same (Alt)
```

## Common Patterns

### API Pipeline
```purescript
Strom.range 1 1000
  # Strom.mapParallel 10 fetchUser
  # Strom.filter (_.active)
  # Strom.grouped 50
  # Strom.traverse_ saveBatch
```

### Pagination
```purescript
Strom.unfoldOm fetchPage token
  >>= Strom.fromArray
  # Strom.runCollect
```

### Event Processing
```purescript
events
  # Strom.filter isValid
  # Strom.changes
  # Strom.mapM enrichEvent
  # Strom.grouped 100
  # Strom.traverse_ processBatch
```

### Fibonacci
```purescript
Strom.unfold
  (\(Tuple a b) -> Just (Tuple a (Tuple b (a + b))))
  (Tuple 0 1)
  # Strom.take 20
```

### Running Total
```purescript
numbers
  # Strom.scan (+) 0
  # Strom.runCollect
```

### Indexed Items
```purescript
items
  # Strom.mapAccum
      (\i x -> Tuple (i + 1) { index: i, item: x })
      0
```

### With Cancellation
```purescript
cancel <- Strom.subscribe handler stream
-- later:
cancel
```

## Type Classes

Strom is a:
- `Functor` - use `map`
- `Apply` / `Applicative` - use `pure` / `<*>`
- `Bind` / `Monad` - use `>>=` / do-notation
- `Semigroup` / `Monoid` - use `<>` / `mempty`
- `Alt` / `Plus` / `Alternative` - use `<|>` / `empty`

## Tips

### Compose with `#`
```purescript
result <- stream
  # Strom.filter predicate
  # Strom.map transform
  # Strom.grouped 10
  # Strom.runCollect
```

### Parallel Processing
```purescript
-- Sequential (slow)
stream # Strom.mapM fetchData

-- Parallel (fast!)
stream # Strom.mapParallel 10 fetchData
```

### Infinite Streams
Always use `take` or `takeWhile` before running!
```purescript
Strom.iterate (+ 1) 0
  # Strom.take 100  -- ← Important!
  # Strom.runCollect
```

### Memory Efficiency
Use `runDrain` or `traverse_` instead of `runCollect` for large streams:
```purescript
-- ❌ Loads everything into memory
results <- stream # Strom.runCollect

-- ✅ Processes incrementally
stream # Strom.traverse_ processOne
```

### Batching
Group items for efficient bulk operations:
```purescript
items
  # Strom.grouped 100
  # Strom.traverse_ bulkInsert
```

### Context Access
Use Om's `ask` in effectful operations:
```purescript
stream
  # Strom.mapM (\item -> do
      ctx <- Om.ask  -- Access context
      processWithContext ctx item
    )
```

## Performance

- **Chunked**: Processes ~1000 elements at a time internally
- **Lazy**: Values computed only when pulled
- **Backpressure**: Consumer controls pace
- **Parallel**: `mapParallel n` runs up to `n` concurrent effects

## When to Use Strom

✅ **Use Strom for**:
- Data processing pipelines
- API integrations
- Batch operations
- File I/O
- Event streams
- Large datasets
- Paginated APIs

❌ **Don't use for**:
- Small collections (use Array)
- UI events (use Bolson Events)
- Simple transformations (use Array.map)

## Comparison

| Need | Array | Bolson Event | Strom |
|------|-------|--------------|-------|
| Small collection | ✅ | ❌ | ❌ |
| Large dataset | ❌ | ❌ | ✅ |
| UI events | ❌ | ✅ | ❌ |
| API pipeline | ❌ | ❌ | ✅ |
| Backpressure | ❌ | ❌ | ✅ |
| Parallel processing | ⚠️ | ❌ | ✅ |

## Common Gotchas

### 1. Infinite Streams
```purescript
-- ❌ Never finishes!
Strom.repeat 42 # Strom.runCollect

-- ✅ Bounded
Strom.repeat 42 # Strom.take 10 # Strom.runCollect
```

### 2. Effects in `map`
```purescript
-- ❌ Effects won't run!
stream # Strom.map (\x -> Om.fromAff $ log x)

-- ✅ Use mapM
stream # Strom.mapM (\x -> Om.fromAff $ log x)
```

### 3. Forgetting to Run
```purescript
-- ❌ Just a value, doesn't run!
let result = stream # Strom.map (+ 1)

-- ✅ Actually execute it
result <- stream
  # Strom.map (+ 1)
  # Strom.runCollect
```

## Full Example

```purescript
module Main where

import Prelude
import Effect.Aff (Aff, launchAff_)
import Effect.Class.Console as Console
import Yoga.Om as Om
import Yoga.Om.Strom as Strom

type Context = { apiKey :: String }

main :: Aff Unit
main = launchAff_ $ Om.runOm context handlers program
  where
  context = { apiKey: "secret" }
  handlers = { exception: \err -> Console.log (show err) }

program :: Om Context () Unit
program = do
  results <- Strom.range 1 100
    # Strom.filter (\n -> n `mod` 2 == 0)
    # Strom.mapParallel 5 (\n -> do
        { apiKey } <- Om.ask
        -- Use apiKey to fetch data
        pure (n * 2)
      )
    # Strom.grouped 10
    # Strom.tapM (\batch -> 
        Om.fromAff $ Console.log $ "Processing batch of " <> show (Array.length batch)
      )
    >>= Strom.fromArray
    # Strom.runCollect
  
  Om.fromAff $ Console.log $ "Final results: " <> show results
```

## Documentation

- **README.md** - Comprehensive guide
- **DEMO.md** - API showcase with examples
- **COMPARISON.md** - vs ZIO ZStream
- **SUMMARY.md** - What we built
- **QUICKREF.md** - This file

## Questions?

Check the examples in `src/Yoga/Om/Strom/Examples.purs` - 18 comprehensive examples covering all use cases!
