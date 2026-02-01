# Strom Do-Notation Guide

Yes! **Strom fully supports do-notation** because it implements the `Monad` type class.

## Table of Contents

1. [Basic Do-Notation](#basic-do-notation)
2. [Comprehension-Style](#comprehension-style)
3. [Cartesian Products](#cartesian-products)
4. [Guards and Filtering](#guards-and-filtering)
5. [Applicative Do (ado)](#applicative-do-ado)
6. [Comparison with For-Comprehensions](#comparison-with-for-comprehensions)

## Basic Do-Notation

### Standard Monadic Bind

```purescript
import Yoga.Om.Strom as Strom

-- FlatMap in do-notation
stream :: Strom ctx err Int
stream = do
  x <- Strom.range 1 5
  y <- Strom.range 1 3
  pure (x * y)

-- Equivalent to:
stream' = Strom.range 1 5
  >>= (\x ->
      Strom.range 1 3
        # Strom.map (\y -> x * y)
    )

-- Result: [1, 2, 3, 2, 4, 6, 3, 6, 9, 4, 8, 12]
```

### Sequential Processing

```purescript
processData :: Strom ctx err Result
processData = do
  userId <- userIds
  user <- fetchUser userId        -- Om effect
  orders <- fetchOrders user.id   -- Om effect
  pure orders

-- Each userId produces a stream of orders
-- Result is flattened automatically
```

## Comprehension-Style

### With Guards (Import from Strom.Do)

```purescript
import Yoga.Om.Strom.Do as Strom

-- Pythagoras triples
pythagoreanTriples :: Int -> Strom ctx err (Tuple3 Int Int Int)
pythagoreanTriples n = do
  a <- Strom.range 1 (n + 1)
  b <- Strom.range a (n + 1)
  c <- Strom.range b (n + 1)
  Strom.guard (a * a + b * b == c * c)
  pure (Tuple3 a b c)

-- Result: [(3,4,5), (5,12,13), (6,8,10), (8,15,17), (9,12,15), ...]
```

### Even Numbers

```purescript
import Yoga.Om.Strom.Do (guard)

evens :: Strom ctx err Int
evens = do
  x <- Strom.range 1 100
  guard (x `mod` 2 == 0)
  pure x

-- Equivalent to:
evens' = Strom.range 1 100
  # Strom.filter (\x -> x `mod` 2 == 0)
```

### Prime Numbers

```purescript
import Yoga.Om.Strom.Do (guard)

isPrime :: Int -> Boolean
isPrime n = n > 1 && Array.all (\d -> n `mod` d /= 0) (Array.range 2 (n - 1))

primes :: Int -> Strom ctx err Int
primes upTo = do
  n <- Strom.range 2 (upTo + 1)
  guard (isPrime n)
  pure n

-- primes 20 -> [2, 3, 5, 7, 11, 13, 17, 19]
```

## Cartesian Products

### Pairs (2D)

```purescript
import Data.Tuple (Tuple(..))

allPairs :: Strom ctx err (Tuple Int Int)
allPairs = do
  x <- Strom.range 1 4
  y <- Strom.range 1 3
  pure (Tuple x y)

-- Result: [(1,1), (1,2), (2,1), (2,2), (3,1), (3,2)]

-- Or with helper:
import Yoga.Om.Strom.Do (for2)
allPairs' = for2 (Strom.range 1 4) (Strom.range 1 3) Tuple
```

### Triples (3D)

```purescript
allTriples :: Strom ctx err (Tuple3 Int Int Int)
allTriples = do
  x <- Strom.range 1 3
  y <- Strom.range 1 3
  z <- Strom.range 1 3
  pure (Tuple3 x y z)

-- Result: [(1,1,1), (1,1,2), (1,1,3), (1,2,1), ...]

-- Or with helper:
import Yoga.Om.Strom.Do (for3)
allTriples' = for3 
  (Strom.range 1 3) 
  (Strom.range 1 3) 
  (Strom.range 1 3) 
  Tuple3
```

### Filtered Pairs

```purescript
import Yoga.Om.Strom.Do (guard)

sumToN :: Int -> Strom ctx err (Tuple Int Int)
sumToN n = do
  x <- Strom.range 1 (n + 1)
  y <- Strom.range 1 (n + 1)
  guard (x + y == n)
  pure (Tuple x y)

-- sumToN 5 -> [(1,4), (2,3), (3,2), (4,1)]
```

## Guards and Filtering

### Multiple Guards

```purescript
import Yoga.Om.Strom.Do (guard)

complexFilter :: Strom ctx err Int
complexFilter = do
  x <- Strom.range 1 100
  guard (x `mod` 2 == 0)      -- Even
  guard (x `mod` 3 == 0)      -- Divisible by 3
  guard (x < 50)               -- Less than 50
  pure x

-- Result: [6, 12, 18, 24, 30, 36, 42, 48]
```

### When/Unless

```purescript
import Yoga.Om.Strom.Do (when, unless)

conditionalStream :: Boolean -> Strom ctx err Int
conditionalStream includeEvens = do
  x <- Strom.range 1 10
  when includeEvens do
    guard (x `mod` 2 == 0)
  pure x
```

## Applicative Do (ado)

For **independent** parallel operations, use `ado` notation:

```purescript
-- Sequential (do) - second depends on first
sequential :: Strom ctx err (Tuple User Orders)
sequential = do
  user <- fetchUser 123
  orders <- fetchOrders user.id  -- Depends on user!
  pure (Tuple user orders)

-- Parallel (ado) - independent
parallel :: Strom ctx err (Tuple User Profile)
parallel = ado
  user <- fetchUser 123
  profile <- fetchProfile 123     -- Independent!
  in Tuple user profile

-- With ado, both fetch concurrently
```

### Ado with Multiple Streams

```purescript
-- Zip-like behavior with ado
combined :: Strom ctx err Result
combined = ado
  x <- stream1
  y <- stream2
  z <- stream3
  in combine x y z

-- This zips the three streams together
```

## Comparison with For-Comprehensions

### Scala (ZIO ZStream)

```scala
// Scala
val result = for {
  x <- ZStream.range(1, 5)
  y <- ZStream.range(1, 3)
  if x % 2 == 0  // guard
} yield x * y
```

### PureScript (Strom)

```purescript
-- PureScript
import Yoga.Om.Strom.Do (guard)

result = do
  x <- Strom.range 1 5
  y <- Strom.range 1 3
  guard (x `mod` 2 == 0)  -- guard
  pure (x * y)
```

**Nearly identical!** 🎉

## Real-World Examples

### API Pagination with Do-Notation

```purescript
import Yoga.Om.Strom.Do (guard)

fetchAllUsers :: Strom Context () User
fetchAllUsers = do
  page <- Strom.iterate (_ + 1) 0
  pageData <- Strom.fromOm (fetchPage page)
  guard (not $ Array.null pageData.users)
  user <- Strom.fromArray pageData.users
  pure user
```

### Nested Data Processing

```purescript
processDepartments :: Strom Context () EmployeeReport
processDepartments = do
  dept <- departments
  employee <- Strom.fromArray dept.employees
  guard employee.active
  projects <- Strom.fromArray employee.projects
  guard (projects.status == "active")
  pure { employee: employee.name, project: projects.name }
```

### Combinations with Constraints

```purescript
import Yoga.Om.Strom.Do (guard)

-- All ways to make change for $1 using quarters, dimes, nickels
makeChange :: Strom ctx err (Tuple3 Int Int Int)
makeChange = do
  quarters <- Strom.range 0 5        -- 0-4 quarters
  dimes <- Strom.range 0 11          -- 0-10 dimes
  nickels <- Strom.range 0 21        -- 0-20 nickels
  let total = quarters * 25 + dimes * 10 + nickels * 5
  guard (total == 100)
  pure (Tuple3 quarters dimes nickels)
```

### Graph Traversal

```purescript
import Yoga.Om.Strom.Do (guard)

traversePaths :: Graph -> Node -> Int -> Strom ctx err Path
traversePaths graph start maxDepth = do
  depth <- Strom.range 1 (maxDepth + 1)
  guard (depth <= maxDepth)
  node <- Strom.fromArray (graph.neighbors start)
  path <- buildPath start node depth
  pure path
```

## Advanced Patterns

### Recursive Do-Notation

```purescript
fibonacci :: Strom ctx err Int
fibonacci = do
  pair <- Strom.iterate (\(Tuple a b) -> Tuple b (a + b)) (Tuple 0 1)
  pure (fst pair)

-- Take first 10: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### Nested Comprehensions

```purescript
import Yoga.Om.Strom.Do (guard)

nestedPatterns :: Strom ctx err (Tuple Int Int)
nestedPatterns = do
  x <- Strom.range 1 10
  guard (x `mod` 2 == 0)
  y <- do
    n <- Strom.range 1 x
    guard (n `mod` 2 /= 0)
    pure n
  pure (Tuple x y)
```

### Conditional Streaming

```purescript
import Yoga.Om.Strom.Do (when, unless)

conditionalProcess :: Config -> Strom ctx err Result
conditionalProcess config = do
  item <- sourceStream
  when config.enableValidation do
    validated <- validateItem item
    guard validated.isValid
  when config.enableEnrichment do
    enrichItem item
  pure item
```

## Type Class Magic

Because Strom implements these type classes:

```purescript
instance Functor (Strom ctx err)      -- map, <$>
instance Apply (Strom ctx err)        -- <*>, apply
instance Applicative (Strom ctx err)  -- pure
instance Bind (Strom ctx err)         -- >>=, bind
instance Monad (Strom ctx err)        -- do-notation
```

You get all these for free:

- ✅ `do` notation
- ✅ `ado` notation
- ✅ `<$>` (map)
- ✅ `<*>` (apply)
- ✅ `>>=` (bind)
- ✅ `>>` (discard)

## Performance Considerations

### Do-Notation = FlatMap

```purescript
-- This:
do
  x <- stream1
  y <- stream2
  pure (x + y)

-- Is equivalent to:
stream1 >>= (\x ->
  stream2 # Strom.map (\y -> x + y)
)
```

For large Cartesian products, this can be expensive!

### When to Use Do-Notation

✅ **Good Use Cases:**
- Dependent operations (next depends on previous)
- Comprehension-style filtering
- Graph traversal
- Tree structures
- Small Cartesian products

❌ **Avoid For:**
- Large Cartesian products (use `zip` instead)
- Independent operations (use `ado` or `mapParallel`)
- Simple transformations (use `map`)

### Optimization Example

```purescript
-- ❌ Slow for large streams
slowPairs = do
  x <- Strom.range 1 10000
  y <- Strom.range 1 10000
  pure (Tuple x y)

-- ✅ Much faster
fastPairs = Strom.zip
  (Strom.range 1 10000)
  (Strom.range 1 10000)
```

## Helper Module: Yoga.Om.Strom.Do

Import the helper module for comprehension-style programming:

```purescript
import Yoga.Om.Strom.Do as Strom

myStream = do
  x <- Strom.range 1 10
  Strom.guard (x `mod` 2 == 0)
  y <- Strom.range 1 x
  pure (Tuple x y)
```

### Available Helpers

- `guard :: Boolean -> Strom ctx err Unit` - Filter in do-notation
- `when :: Boolean -> Strom ctx err a -> Strom ctx err a` - Conditional
- `unless :: Boolean -> Strom ctx err a -> Strom ctx err a` - Negated conditional
- `for2 :: Strom a -> Strom b -> (a -> b -> c) -> Strom c` - 2D comprehension
- `for3 :: Strom a -> Strom b -> Strom c -> (a -> b -> c -> d) -> Strom d` - 3D comprehension
- `replicateEach :: Int -> a -> Strom a` - Replicate element
- `comprehension :: Strom a -> Strom a` - Identity (for clarity)
- `generate :: Strom a -> Strom a` - Identity (for clarity)

## Summary

### ✅ Yes, Strom Has Full Do-Notation Support!

Because Strom implements `Monad`, you get:

1. **Regular do-notation** - For dependent operations
2. **Applicative do (ado)** - For independent parallel operations
3. **Comprehension-style** - With guards and filtering
4. **Cartesian products** - Natural in do-notation
5. **All monadic combinators** - `>>=`, `>>`, `<$>`, `<*>`, etc.

### Compare: Scala vs PureScript

```scala
// Scala ZIO ZStream
for {
  x <- ZStream.range(1, 10)
  y <- ZStream.range(1, x)
  if x % 2 == 0
} yield (x, y)
```

```purescript
-- PureScript Strom
import Yoga.Om.Strom.Do (guard)

do
  x <- Strom.range 1 10
  y <- Strom.range 1 x
  guard (x `mod` 2 == 0)
  pure (Tuple x y)
```

**Nearly identical!** 🎉

---

**Strom + Do-Notation = Powerful Stream Comprehensions!** 🌊
