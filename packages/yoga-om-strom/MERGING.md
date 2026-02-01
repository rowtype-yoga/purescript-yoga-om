# Merging Streams in Strom

## Overview

Strom provides multiple ways to merge streams, each with different semantics and use cases.

## 1. `merge` - Non-Deterministic Merge (Race-Based)

Merges two streams concurrently. Elements appear as they're produced.

```purescript
import Yoga.Om.Strom as Strom

-- Merge two streams
merged :: Strom ctx err Int
merged = Strom.merge stream1 stream2

-- Example
main = do
  result <- 
    Strom.merge
      (Strom.fromArray [1, 2, 3])
      (Strom.fromArray [10, 20, 30])
    # Strom.runCollect
  -- Output: Non-deterministic! Could be [1,2,3,10,20,30] or [10,20,30,1,2,3]
  -- or any interleaving depending on timing
```

### Use Cases
- ✅ Merging multiple data sources (APIs, databases, etc.)
- ✅ Combining event streams
- ✅ Load balancing across sources
- ❌ When order matters

---

## 2. `append` / `concat` - Sequential Merge

Combines streams sequentially. Second stream starts after first completes.

```purescript
-- Append (operator)
sequential = stream1 `Strom.append` stream2

-- Or using Semigroup
sequential = stream1 <> stream2

-- Or concat multiple
sequential = Strom.concat [stream1, stream2, stream3]

-- Example
main = do
  result <- 
    Strom.fromArray [1, 2, 3]
      `Strom.append`
    Strom.fromArray [10, 20, 30]
    # Strom.runCollect
  -- Output: [1, 2, 3, 10, 20, 30] (always in this order)
```

### Use Cases
- ✅ Processing data in stages
- ✅ Fallback streams
- ✅ Pagination (page 1, then page 2, then page 3...)
- ✅ When order matters

---

## 3. `interleave` - Deterministic Merge

Alternates between streams deterministically.

```purescript
interleaved :: Strom ctx err Int
interleaved = Strom.interleave stream1 stream2

-- Example
main = do
  result <- 
    Strom.interleave
      (Strom.fromArray [1, 2, 3])
      (Strom.fromArray [10, 20, 30])
    # Strom.runCollect
  -- Output: [1, 10, 2, 20, 3, 30] (deterministic alternation)
```

### Use Cases
- ✅ Round-robin scheduling
- ✅ Fair resource distribution
- ✅ Combining sorted streams
- ✅ Predictable interleaving

---

## 4. `zip` - Pair Elements

Pairs elements from two streams.

```purescript
import Data.Tuple (Tuple(..))

zipped :: Strom ctx err (Tuple Int String)
zipped = Strom.zip numbers letters

-- Example
main = do
  result <- 
    Strom.zip
      (Strom.range 1 4)
      (Strom.fromArray ["a", "b", "c"])
    # Strom.runCollect
  -- Output: [(1,"a"), (2,"b"), (3,"c")]
```

### Use Cases
- ✅ Combining related data
- ✅ Joining streams by position
- ✅ Pairing keys with values
- ❌ When streams have different lengths (shortest wins)

---

## 5. `race` - First to Emit Wins

Takes first stream to emit a value.

```purescript
winner :: Strom ctx err Int
winner = Strom.race [stream1, stream2, stream3]

-- Example
main = do
  result <- 
    Strom.race
      [ Strom.fromOm (Om.delay (Milliseconds 100.0) *> pure 1)
      , Strom.fromOm (pure 2)  -- This wins!
      , Strom.fromOm (Om.delay (Milliseconds 50.0) *> pure 3)
      ]
    # Strom.runCollect
  -- Output: [2] (the fastest one)
```

### Use Cases
- ✅ Timeout patterns
- ✅ Fastest data source wins
- ✅ Redundant sources (pick first response)
- ✅ Circuit breaker patterns

---

## 6. Do-Notation Merge (Cartesian Product)

Using do-notation creates a Cartesian product (all combinations).

```purescript
import Yoga.Om.Strom.Do (guard)

cartesian :: Strom ctx err (Tuple Int Int)
cartesian = do
  x <- stream1
  y <- stream2
  pure (Tuple x y)

-- Example
main = do
  result <- 
    (do
      x <- Strom.fromArray [1, 2, 3]
      y <- Strom.fromArray [10, 20]
      pure (Tuple x y)
    ) # Strom.runCollect
  -- Output: [(1,10), (1,20), (2,10), (2,20), (3,10), (3,20)]
```

### Use Cases
- ✅ All combinations
- ✅ Grid generation
- ✅ Constraint satisfaction
- ❌ Large streams (exponential growth!)

---

## 7. Applicative Merge (Parallel)

Use `ado` for independent parallel operations.

```purescript
parallel :: Strom ctx err Result
parallel = ado
  x <- streamA
  y <- streamB  -- Runs in parallel with streamA
  z <- streamC  -- Runs in parallel with both
  in combine x y z

-- Example
main = do
  result <- 
    (ado
      user <- Strom.fromOm (fetchUser 123)
      posts <- Strom.fromOm (fetchPosts 123)
      in { user, posts }
    ) # Strom.runCollect
```

### Use Cases
- ✅ Independent data fetching
- ✅ Parallel API calls
- ✅ Combining independent sources

---

## Comparison Table

| Method | Order | Timing | Use Case |
|--------|-------|--------|----------|
| `merge` | Non-deterministic | Concurrent | Multiple sources, events |
| `append` | Sequential | After first completes | Stages, pagination |
| `concat` | Sequential | After all complete | Multiple stages |
| `interleave` | Deterministic | Alternating | Round-robin, fair scheduling |
| `zip` | Paired | Synchronized | Related data, joining |
| `race` | First wins | Fastest | Timeouts, redundancy |
| Do-notation | Cartesian | Sequential | All combinations |
| Ado-notation | Parallel | Concurrent | Independent parallel |

---

## Real-World Examples

### Example 1: Merge Multiple API Sources

```purescript
import Yoga.Om.Strom as Strom

-- Merge data from 3 different APIs
allUsers :: Strom Context () User
allUsers = 
  Strom.concat
    [ Strom.fromOm fetchUsersFromDB
        >>= Strom.fromArray
    , Strom.fromOm fetchUsersFromCache
        >>= Strom.fromArray
    , Strom.fromOm fetchUsersFromAPI
        >>= Strom.fromArray
    ]
```

### Example 2: Merge Event Streams

```purescript
-- Merge clicks, scrolls, and keypresses
allEvents :: Strom Context () Event
allEvents = 
  Strom.concat
    [ clickStream # Strom.map ClickEvent
    , scrollStream # Strom.map ScrollEvent
    , keyStream # Strom.map KeyEvent
    ]
```

### Example 3: Load Balancing

```purescript
-- Round-robin between servers
loadBalanced :: Strom Context () Response
loadBalanced = 
  Strom.interleave
    (requests # Strom.mapM (callServer1))
    (requests # Strom.mapM (callServer2))
```

### Example 4: Fallback Pattern

```purescript
-- Try cache, then database, then API
getData :: String -> Strom Context () Data
getData key = 
  Strom.race
    [ Strom.fromOm (getFromCache key)
    , Strom.fromOm (getFromDB key)
    , Strom.fromOm (getFromAPI key)
    ]
```

### Example 5: Merge with Filtering

```purescript
import Yoga.Om.Strom.Do (guard)

-- Merge two streams but only include valid items
mergedFiltered :: Strom Context () Item
mergedFiltered = do
  item <- Strom.merge stream1 stream2
  guard (isValid item)
  pure item
```

### Example 6: Time-Based Merge

```purescript
-- Merge with delays between items
delayedMerge :: Strom Context () Int
delayedMerge = 
  Strom.concat
    [ Strom.fromArray [1, 2, 3]
    , Strom.fromOm (Om.delay (Milliseconds 1000.0) *> pure unit)
        >>= (\_ -> Strom.fromArray [4, 5, 6])
    ]
```

---

## Merging Multiple Streams

### Pattern 1: Merge All (Non-Deterministic)

```purescript
-- Merge many streams concurrently
mergeMany :: Array (Strom ctx err a) -> Strom ctx err a
mergeMany [] = Strom.empty
mergeMany [s] = s
mergeMany streams = 
  Array.foldl Strom.merge Strom.empty streams

-- Usage
allStreams = mergeMany [stream1, stream2, stream3, stream4]
```

### Pattern 2: Concat All (Sequential)

```purescript
-- Concatenate many streams
concatMany :: Array (Strom ctx err a) -> Strom ctx err a
concatMany = Strom.concat

-- Usage
allStreams = concatMany [stream1, stream2, stream3]
```

### Pattern 3: Race All

```purescript
-- Race many streams
raceMany :: Array (Strom ctx err a) -> Strom ctx err a
raceMany = Strom.race

-- Usage
fastest = raceMany [stream1, stream2, stream3]
```

---

## Advanced Patterns

### Pattern 1: Merge with Priority

```purescript
-- High-priority stream gets processed first
mergePriority :: Strom ctx err a -> Strom ctx err a -> Strom ctx err a
mergePriority highPriority lowPriority =
  Strom.concat
    [ highPriority # Strom.take 10  -- Process first 10 from high priority
    , Strom.merge highPriority lowPriority  -- Then merge rest
    ]
```

### Pattern 2: Merge with Deduplication

```purescript
import Yoga.Om.Strom.Do (guard)
import Data.Set as Set

mergeUnique :: forall a. Ord a => Strom ctx err a -> Strom ctx err a -> Strom ctx err a
mergeUnique s1 s2 = do
  item <- Strom.merge s1 s2
  seen <- ???  -- Would need stateful tracking
  guard (not $ Set.member item seen)
  pure item
```

### Pattern 3: Merge with Transformation

```purescript
-- Merge and transform
mergeAndMap :: (a -> b) -> (c -> b) -> Strom ctx err a -> Strom ctx err c -> Strom ctx err b
mergeAndMap f g s1 s2 =
  Strom.merge (Strom.map f s1) (Strom.map g s2)
```

---

## Performance Considerations

### `merge` (Non-Deterministic)
- ⚡ Fast - elements flow as produced
- 💾 Low memory - no buffering
- 🎲 Non-deterministic output
- ✅ Good for high-throughput

### `append` / `concat` (Sequential)
- 🐢 Waits for first stream to complete
- 💾 Low memory
- 🎯 Deterministic output
- ✅ Good for stages/phases

### `interleave` (Deterministic)
- ⚡ Fast - alternates immediately
- 💾 May need buffering
- 🎯 Deterministic output
- ✅ Good for fair scheduling

### `zip` (Paired)
- ⚡ Fast
- 💾 May buffer slower stream
- 🎯 Deterministic output
- ⚠️ Stops at shortest stream

### `race` (First Wins)
- ⚡ Very fast - stops after first
- 💾 Low memory
- 🎲 Non-deterministic winner
- ✅ Good for timeouts

---

## When to Use Each

### Use `merge` when:
- You have multiple independent sources
- Order doesn't matter
- You want maximum throughput
- Example: Combining event streams from different sources

### Use `append`/`concat` when:
- Order matters
- You want to process in stages
- You have fallback sources
- Example: Pagination, staged processing

### Use `interleave` when:
- You want fair scheduling
- Order should be predictable
- Round-robin access needed
- Example: Load balancing, fair queueing

### Use `zip` when:
- Streams are related
- You need element-by-element pairing
- Lengths are similar
- Example: Joining related data

### Use `race` when:
- You want the fastest response
- You have redundant sources
- You need timeout behavior
- Example: Circuit breakers, fastest mirror

---

## Summary

Strom provides **5 main merge strategies**:

1. **`merge`** - Concurrent, non-deterministic (like `mergeAll` in ZIO)
2. **`append`/`concat`** - Sequential (like `++` in ZIO)
3. **`interleave`** - Deterministic alternation
4. **`zip`** - Pair elements
5. **`race`** - First to emit wins

Plus **composable patterns** using do-notation and applicative do!

Choose based on:
- **Order requirements** (deterministic vs non-deterministic)
- **Timing** (concurrent vs sequential)
- **Semantics** (all elements vs first wins vs pairs)
