# Strom with Do-Notation: Visual Examples

## Side-by-Side Comparisons

### Example 1: Simple Transformation

#### Without Do
```purescript
result = 
  Strom.range 1 10
    >>= (\x ->
        Strom.range 1 3
          # Strom.map (\y -> x * y)
      )
```

#### With Do ✨
```purescript
result = do
  x <- Strom.range 1 10
  y <- Strom.range 1 3
  pure (x * y)
```

**Output**: `[1, 2, 3, 2, 4, 6, 3, 6, 9, ..., 30]`

---

### Example 2: Filtering

#### Without Do
```purescript
evens = 
  Strom.range 1 20
    # Strom.filter (\x -> x `mod` 2 == 0)
```

#### With Do ✨
```purescript
import Yoga.Om.Strom.Do (guard)

evens = do
  x <- Strom.range 1 20
  guard (x `mod` 2 == 0)
  pure x
```

**Output**: `[2, 4, 6, 8, 10, 12, 14, 16, 18, 20]`

---

### Example 3: Nested Streams

#### Without Do
```purescript
result =
  Strom.fromArray [1, 2, 3]
    >>= (\x ->
        Strom.fromArray [10, 20]
          >>= (\y ->
              Strom.fromArray [100, 200]
                # Strom.map (\z -> x + y + z)
            )
      )
```

#### With Do ✨
```purescript
result = do
  x <- Strom.fromArray [1, 2, 3]
  y <- Strom.fromArray [10, 20]
  z <- Strom.fromArray [100, 200]
  pure (x + y + z)
```

**Output**: `[111, 211, 121, 221, 112, 212, 122, 222, 113, 213, 123, 223]`

---

## Real-World Examples

### Example 4: Pythagorean Triples

```purescript
import Yoga.Om.Strom.Do (guard)

pythagoreanTriples :: Int -> Strom ctx err (Tuple Int Int Int)
pythagoreanTriples maxN = do
  a <- Strom.range 1 (maxN + 1)
  b <- Strom.range a (maxN + 1)
  c <- Strom.range b (maxN + 1)
  guard (a * a + b * b == c * c)
  pure (Tuple a b c)

-- Usage
main = do
  triples <- pythagoreanTriples 20 # Strom.runCollect
  -- triples = [(3,4,5), (5,12,13), (6,8,10), (8,15,17), (9,12,15), (12,16,20)]
```

**Compare to Scala ZIO:**
```scala
def pythagoreanTriples(maxN: Int) = for {
  a <- ZStream.range(1, maxN + 1)
  b <- ZStream.range(a, maxN + 1)
  c <- ZStream.range(b, maxN + 1)
  if a * a + b * b == c * c
} yield (a, b, c)
```

---

### Example 5: Paginated API

```purescript
import Yoga.Om.Strom.Do (guard)

fetchAllUsers :: Strom Context () User
fetchAllUsers = do
  pageNum <- Strom.iterate (_ + 1) 0
  page <- Strom.fromOm (fetchPage pageNum)
  guard (not $ Array.null page.users)
  user <- Strom.fromArray page.users
  pure user

-- Usage
main = do
  users <- fetchAllUsers
    # Strom.take 100
    # Strom.runCollect
```

**Without Do** (much harder to read):
```purescript
fetchAllUsers' =
  Strom.iterate (_ + 1) 0
    >>= (\pageNum ->
        Strom.fromOm (fetchPage pageNum)
          >>= (\page ->
              if Array.null page.users
              then Strom.empty
              else Strom.fromArray page.users
            )
      )
```

---

### Example 6: Data Processing Pipeline

```purescript
import Yoga.Om.Strom.Do (guard, when)

processDepartments :: Config -> Strom Context () Report
processDepartments config = do
  -- Get all departments
  dept <- departments
  
  -- Get employees
  employee <- Strom.fromArray dept.employees
  guard employee.active
  
  -- Optional enrichment
  enriched <- when config.enrichData do
    Strom.fromOm (enrichEmployee employee)
  
  -- Get projects
  project <- Strom.fromArray enriched.projects
  guard (project.status == "active")
  
  -- Build report
  pure { 
    deptName: dept.name,
    empName: enriched.name,
    projectName: project.name,
    budget: project.budget
  }
```

---

### Example 7: Combinations with Constraints

```purescript
import Yoga.Om.Strom.Do (guard)

-- Find all ways to make change for $1 using coins
makeChange :: Strom ctx err CoinCombination
makeChange = do
  quarters <- Strom.range 0 5   -- 0-4 quarters
  dimes <- Strom.range 0 11     -- 0-10 dimes  
  nickels <- Strom.range 0 21   -- 0-20 nickels
  pennies <- Strom.range 0 101  -- 0-100 pennies
  
  let total = quarters * 25 + dimes * 10 + nickels * 5 + pennies
  guard (total == 100)
  
  pure { quarters, dimes, nickels, pennies }

-- Usage
main = do
  ways <- makeChange # Strom.runCollect
  Console.log $ "Found " <> show (Array.length ways) <> " ways to make change"
```

---

### Example 8: Prime Numbers

```purescript
import Yoga.Om.Strom.Do (guard)

isPrime :: Int -> Boolean
isPrime n = n > 1 && all (\d -> n `mod` d /= 0) (range 2 (n - 1))

primes :: Int -> Strom ctx err Int
primes upTo = do
  n <- Strom.range 2 (upTo + 1)
  guard (isPrime n)
  pure n

-- Usage
main = do
  primeList <- primes 100 # Strom.runCollect
  -- [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, ...]
```

---

### Example 9: Graph Traversal

```purescript
import Yoga.Om.Strom.Do (guard)

type Graph = Map Node (Array Node)

-- Find all paths of length N from start node
findPaths :: Graph -> Node -> Int -> Strom ctx err Path
findPaths graph start maxDepth = do
  -- Try each depth
  depth <- Strom.range 1 (maxDepth + 1)
  
  -- Build path recursively
  path <- buildPath start depth
  
  pure path
  
  where
  buildPath :: Node -> Int -> Strom ctx err Path
  buildPath current 0 = Strom.succeed [current]
  buildPath current n = do
    neighbor <- Strom.fromArray (Map.lookup current graph # fromMaybe [])
    restOfPath <- buildPath neighbor (n - 1)
    pure (current : restOfPath)
```

---

### Example 10: Matrix Operations

```purescript
import Yoga.Om.Strom.Do (guard)

-- Generate all matrix indices
matrixIndices :: Int -> Int -> Strom ctx err (Tuple Int Int)
matrixIndices rows cols = do
  row <- Strom.range 0 rows
  col <- Strom.range 0 cols
  pure (Tuple row col)

-- Get diagonal elements
diagonalIndices :: Int -> Strom ctx err (Tuple Int Int)
diagonalIndices size = do
  i <- Strom.range 0 size
  pure (Tuple i i)

-- Get upper triangle (excluding diagonal)
upperTriangle :: Int -> Strom ctx err (Tuple Int Int)
upperTriangle size = do
  row <- Strom.range 0 size
  col <- Strom.range 0 size
  guard (col > row)
  pure (Tuple row col)
```

---

### Example 11: Nested Filtering

```purescript
import Yoga.Om.Strom.Do (guard)

-- Find all even numbers with odd divisors
evenWithOddDivisors :: Strom ctx err (Tuple Int (Array Int))
evenWithOddDivisors = do
  x <- Strom.range 2 51
  guard (x `mod` 2 == 0)  -- Even numbers only
  
  divisor <- do
    d <- Strom.range 1 (x + 1)
    guard (x `mod` d == 0)   -- Is divisor
    guard (d `mod` 2 /= 0)   -- Odd divisor
    pure d
  
  divisors <- Strom.fromArray [divisor]  -- Collect all odd divisors
  pure (Tuple x divisors)
```

---

### Example 12: Event Stream Processing

```purescript
import Yoga.Om.Strom.Do (guard)

type Event = { userId :: String, action :: String, timestamp :: Int }

processEvents :: Strom Context () ProcessedEvent
processEvents = do
  -- Get events
  event <- eventSource
  
  -- Filter spam
  guard (event.action /= "spam")
  
  -- Get user data
  user <- Strom.fromOm (fetchUser event.userId)
  guard user.active
  
  -- Enrich with context
  enriched <- Strom.fromOm (enrichEvent event user)
  
  -- Validate
  guard enriched.isValid
  
  pure enriched
```

---

## Complex Pipeline Comparison

### Without Do (Nested Hell 😱)

```purescript
complexPipeline =
  Strom.range 1 100
    # Strom.filter (\x -> x `mod` 2 == 0)
    >>= (\x ->
        Strom.fromOm (fetchData x)
          >>= (\data ->
              if data.isValid
              then Strom.fromArray data.items
                >>= (\item ->
                    Strom.fromOm (processItem item)
                      # Strom.map (\result -> {x, data, item, result})
                  )
              else Strom.empty
            )
      )
```

### With Do (Clean & Readable ✨)

```purescript
import Yoga.Om.Strom.Do (guard)

complexPipeline = do
  x <- Strom.range 1 100
  guard (x `mod` 2 == 0)
  
  data <- Strom.fromOm (fetchData x)
  guard data.isValid
  
  item <- Strom.fromArray data.items
  result <- Strom.fromOm (processItem item)
  
  pure {x, data, item, result}
```

**Much cleaner!** 🎉

---

## Pattern: Cartesian Products

### 2D Grid

```purescript
-- Without Do
grid2D = 
  Strom.range 0 width
    >>= (\x ->
        Strom.range 0 height
          # Strom.map (\y -> Point {x, y})
      )

-- With Do ✨
grid2D = do
  x <- Strom.range 0 width
  y <- Strom.range 0 height
  pure (Point {x, y})
```

### 3D Grid

```purescript
-- With Do ✨
grid3D = do
  x <- Strom.range 0 width
  y <- Strom.range 0 height
  z <- Strom.range 0 depth
  pure (Point3D {x, y, z})
```

### Filtered Grid (only certain cells)

```purescript
import Yoga.Om.Strom.Do (guard)

checkerboard = do
  x <- Strom.range 0 8
  y <- Strom.range 0 8
  guard ((x + y) `mod` 2 == 0)  -- Checkerboard pattern
  pure (Square {x, y})
```

---

## Comparison Summary

### Before Do-Notation
```purescript
❌ Nested bind (>>=) calls
❌ Hard to read
❌ Lots of lambdas
❌ Deep indentation
❌ Hard to add filters
```

### With Do-Notation
```purescript
✅ Linear, top-to-bottom flow
✅ Easy to read
✅ No explicit lambdas
✅ Flat indentation
✅ Easy guards/filters
✅ Looks like imperative code
✅ Same as Scala/Haskell
```

---

## Key Takeaways

1. **Do-notation makes Strom streams look imperative** but they're still pure and lazy!

2. **Guards are powerful** - use `guard` from `Yoga.Om.Strom.Do` for filtering

3. **Cartesian products are natural** - just use multiple `<-` binds

4. **Much more readable** than nested `>>=` calls

5. **Same as Scala ZIO** - if you know Scala for-comprehensions, you know this!

---

## Quick Reference

```purescript
import Yoga.Om.Strom.Do as Strom

-- Basic pattern
result = do
  x <- source1
  y <- source2
  Strom.guard (condition x y)
  pure (combine x y)

-- With when/unless
result = do
  item <- items
  Strom.when config.enabled do
    process item
  pure item

-- Nested streams
result = do
  outer <- outerStream
  inner <- innerStream outer
  pure (combine outer inner)
```

---

**Strom + Do-Notation = Beautiful Stream Processing!** 🌊✨
