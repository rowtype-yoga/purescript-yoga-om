module Yoga.Om.Strom.Examples where

import Prelude

import Data.Array as Array
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Effect.Aff (Aff)
import Effect.Class.Console as Console
import Data.Time.Duration (Milliseconds(..))
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Strom as Strom

--------------------------------------------------------------------------------
-- Example 1: Basic Stream Operations
--------------------------------------------------------------------------------

-- | Simple range and mapping
example1 :: Om {} () (Array Int)
example1 = do
  Strom.range 1 10
    # Strom.map (_ * 2)
    # Strom.filter (_ > 5)
    # Strom.runCollect

-- Expected output: [6, 8, 10, 12, 14, 16, 18]

--------------------------------------------------------------------------------
-- Example 2: Effectful Operations
--------------------------------------------------------------------------------

type LoggerContext = { logger :: String -> Aff Unit }

-- | Stream with effectful mapping and tapping
example2 :: Om LoggerContext () Unit
example2 = do
  Strom.range 1 5
    # Strom.tapM (\n -> do
        { logger } <- Om.ask
        Om.fromAff $ logger $ "Processing: " <> show n
      )
    # Strom.mapM (\n -> do
        Om.delay (Milliseconds 100.0)
        pure (n * n)
      )
    # Strom.traverse_ (\n -> do
        { logger } <- Om.ask
        Om.fromAff $ logger $ "Result: " <> show n
      )

-- Expected output:
-- Processing: 1
-- Processing: 2
-- ...
-- Result: 1
-- Result: 4
-- Result: 9
-- Result: 16
-- Result: 25

--------------------------------------------------------------------------------
-- Example 3: Parallel Processing
--------------------------------------------------------------------------------

-- | Process items in parallel (simulating API calls)
fetchUser :: Int -> Om {} () String
fetchUser id = do
  Om.delay (Milliseconds 100.0)
  pure $ "User #" <> show id

example3 :: Om {} () (Array String)
example3 = do
  Strom.range 1 20
    # Strom.mapParallel 5 fetchUser  -- Process 5 at a time
    # Strom.runCollect

--------------------------------------------------------------------------------
-- Example 4: Stateful Transformations
--------------------------------------------------------------------------------

-- | Running total using scan
example4 :: Om {} () (Array Int)
example4 = do
  Strom.fromArray [1, 2, 3, 4, 5]
    # Strom.scan (\acc n -> acc + n) 0
    # Strom.runCollect

-- Expected output: [1, 3, 6, 10, 15]

-- | Stateful map with accumulator
example4b :: Om {} () (Array String)
example4b = do
  Strom.fromArray ["a", "b", "c", "d"]
    # Strom.mapAccum (\count item -> Tuple (count + 1) (show count <> ": " <> item)) 1
    # Strom.runCollect

-- Expected output: ["1: a", "2: b", "3: c", "4: d"]

--------------------------------------------------------------------------------
-- Example 5: Stream Combination
--------------------------------------------------------------------------------

-- | Zip two streams
example5 :: Om {} () (Array (Tuple Int String))
example5 = do
  let numbers = Strom.range 1 5
  let letters = Strom.fromArray ["a", "b", "c", "d", "e"]
  Strom.zip numbers letters
    # Strom.runCollect

-- Expected output: [(1, "a"), (2, "b"), (3, "c"), (4, "d"), (5, "e")]

-- | Interleave two streams deterministically
example5b :: Om {} () (Array Int)
example5b = do
  let evens = Strom.fromArray [2, 4, 6, 8]
  let odds = Strom.fromArray [1, 3, 5, 7]
  Strom.interleave odds evens
    # Strom.runCollect

-- Expected output: [1, 2, 3, 4, 5, 6, 7, 8]

-- | Merge streams (non-deterministic, race-based)
example5c :: Om {} () (Array Int)
example5c = do
  let stream1 = Strom.fromArray [1, 2, 3]
  let stream2 = Strom.fromArray [4, 5, 6]
  Strom.merge stream1 stream2
    # Strom.runCollect

-- Output: non-deterministic, could be [1, 2, 3, 4, 5, 6] or [4, 5, 6, 1, 2, 3] etc

--------------------------------------------------------------------------------
-- Example 6: Infinite Streams
--------------------------------------------------------------------------------

-- | Take from an infinite stream
example6 :: Om {} () (Array Int)
example6 = do
  Strom.iterate (_ + 1) 0
    # Strom.take 10
    # Strom.runCollect

-- Expected output: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

-- | Repeat with condition
example6b :: Om {} () (Array Int)
example6b = do
  Strom.repeat 42
    # Strom.takeWhile (_ == 42)  -- Will take all
    # Strom.take 5                -- But we limit to 5
    # Strom.runCollect

-- Expected output: [42, 42, 42, 42, 42]

--------------------------------------------------------------------------------
-- Example 7: Grouping and Chunking
--------------------------------------------------------------------------------

-- | Group elements into chunks
example7 :: Om {} () (Array (Array Int))
example7 = do
  Strom.range 1 11
    # Strom.grouped 3
    # Strom.runCollect

-- Expected output: [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]

-- | Process in batches
example7b :: Om LoggerContext () Unit
example7b = do
  Strom.range 1 100
    # Strom.chunked 10
    # Strom.traverse_ (\batch -> do
        { logger } <- Om.ask
        Om.fromAff $ logger $ "Processing batch of " <> show (Array.length batch) <> " items"
      )

--------------------------------------------------------------------------------
-- Example 8: Deduplication
--------------------------------------------------------------------------------

-- | Remove consecutive duplicates
example8 :: Om {} () (Array Int)
example8 = do
  Strom.fromArray [1, 1, 2, 2, 2, 3, 1, 1, 4]
    # Strom.changes
    # Strom.runCollect

-- Expected output: [1, 2, 3, 1, 4]

--------------------------------------------------------------------------------
-- Example 9: Complex Pipeline (Real-world-ish)
--------------------------------------------------------------------------------

type User = { id :: Int, name :: String, active :: Boolean }

-- | Fetch users from API, process active ones, and save
example9 :: Om LoggerContext () Unit
example9 = do
  let users =
        [ { id: 1, name: "Alice", active: true }
        , { id: 2, name: "Bob", active: false }
        , { id: 3, name: "Charlie", active: true }
        , { id: 4, name: "Dave", active: true }
        , { id: 5, name: "Eve", active: false }
        ]
  
  Strom.fromArray users
    # Strom.filter _.active
    # Strom.tapM (\user -> do
        { logger } <- Om.ask
        Om.fromAff $ logger $ "Processing active user: " <> user.name
      )
    # Strom.mapM (\user -> do
        -- Simulate enriching user data
        Om.delay (Milliseconds 50.0)
        pure $ user.name <> " (ID: " <> show user.id <> ")"
      )
    # Strom.grouped 2  -- Process in batches of 2
    # Strom.traverse_ (\batch -> do
        { logger } <- Om.ask
        Om.fromAff $ logger $ "Saving batch: " <> show batch
      )

-- Expected output:
-- Processing active user: Alice
-- Processing active user: Charlie
-- Processing active user: Dave
-- Saving batch: ["Alice (ID: 1)", "Charlie (ID: 3)"]
-- Saving batch: ["Dave (ID: 4)"]

--------------------------------------------------------------------------------
-- Example 10: Unfold Pattern
--------------------------------------------------------------------------------

-- | Generate Fibonacci sequence
fibonacciStream :: forall ctx err. Strom ctx err Int
fibonacciStream = 
  Strom.unfold (\(Tuple a b) -> Just (Tuple a (Tuple b (a + b)))) (Tuple 0 1)

example10 :: Om {} () (Array Int)
example10 = do
  fibonacciStream
    # Strom.take 10
    # Strom.runCollect

-- Expected output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

-- | Unfold with effects (e.g., paginated API)
type Page = { items :: Array String, nextToken :: Maybe String }

fetchPage :: String -> Om {} () Page
fetchPage token = do
  Om.delay (Milliseconds 100.0)
  -- Simulate API call
  if token == "start"
    then pure { items: ["item1", "item2"], nextToken: Just "page2" }
    else if token == "page2"
    then pure { items: ["item3", "item4"], nextToken: Just "page3" }
    else if token == "page3"
    then pure { items: ["item5"], nextToken: Nothing }
    else pure { items: [], nextToken: Nothing }

example10b :: Om {} () (Array String)
example10b = do
  Strom.unfoldOm (\token -> do
    page <- fetchPage token
    case page.nextToken of
      Nothing -> pure Nothing
      Just next -> pure $ Just $ Tuple page.items next
  ) "start"
    >>= Strom.fromArray
    # Strom.runCollect

-- Expected output: ["item1", "item2", "item3", "item4", "item5"]

--------------------------------------------------------------------------------
-- Example 11: Racing Streams
--------------------------------------------------------------------------------

-- | Race multiple data sources
example11 :: Om {} () (Array Int)
example11 = do
  let source1 = Strom.fromOm do
        Om.delay (Milliseconds 100.0)
        pure 1
      
      source2 = Strom.fromOm do
        Om.delay (Milliseconds 50.0)  -- This will win
        pure 2
      
      source3 = Strom.fromOm do
        Om.delay (Milliseconds 200.0)
        pure 3
  
  Strom.race [source1, source2, source3]
    # Strom.runCollect

-- Expected output: [2] (the fastest source)

--------------------------------------------------------------------------------
-- Example 12: Partition Stream
--------------------------------------------------------------------------------

-- | Split stream into two based on predicate
example12 :: Om {} () { evens :: Array Int, odds :: Array Int }
example12 = do
  let stream = Strom.range 1 11
  let Tuple evens odds = Strom.partition (\n -> n `mod` 2 == 0) stream
  
  evensResult <- Strom.runCollect evens
  oddsResult <- Strom.runCollect odds
  
  pure { evens: evensResult, odds: oddsResult }

-- Expected output: { evens: [2, 4, 6, 8, 10], odds: [1, 3, 5, 7, 9] }

--------------------------------------------------------------------------------
-- Example 13: Collect Pattern (filter + map in one)
--------------------------------------------------------------------------------

-- | Extract and transform in one pass
parseNumbers :: String -> Maybe Int
parseNumbers "one" = Just 1
parseNumbers "two" = Just 2
parseNumbers "three" = Just 3
parseNumbers _ = Nothing

example13 :: Om {} () (Array Int)
example13 = do
  Strom.fromArray ["one", "invalid", "two", "nope", "three"]
    # Strom.collect parseNumbers
    # Strom.runCollect

-- Expected output: [1, 2, 3]

-- | Collect with Om effect
example13b :: Om {} () (Array Int)
example13b = do
  Strom.fromArray ["1", "not a number", "2", "3", "invalid"]
    # Strom.collectM (\str -> do
        Om.delay (Milliseconds 10.0)
        pure $ case str of
          "1" -> Just 1
          "2" -> Just 2
          "3" -> Just 3
          _ -> Nothing
      )
    # Strom.runCollect

-- Expected output: [1, 2, 3]

--------------------------------------------------------------------------------
-- Example 14: Drop Operations
--------------------------------------------------------------------------------

-- | Skip elements
example14 :: Om {} () (Array Int)
example14 = do
  Strom.range 1 11
    # Strom.drop 5
    # Strom.runCollect

-- Expected output: [6, 7, 8, 9, 10]

-- | Drop while condition holds
example14b :: Om {} () (Array Int)
example14b = do
  Strom.range 1 11
    # Strom.dropWhile (_ < 5)
    # Strom.runCollect

-- Expected output: [5, 6, 7, 8, 9, 10]

--------------------------------------------------------------------------------
-- Example 15: Subscription Pattern (Long-running streams)
--------------------------------------------------------------------------------

-- | Subscribe to a stream and cancel later
example15 :: Om LoggerContext () Unit
example15 = do
  let eventStream = 
        Strom.iterate (_ + 1) 0
          # Strom.mapM (\n -> do
              Om.delay (Milliseconds 500.0)
              pure n
            )
  
  cancel <- Strom.subscribe (\n -> do
    { logger } <- Om.ask
    Om.fromAff $ logger $ "Received: " <> show n
  ) eventStream
  
  -- Let it run for a bit
  Om.delay (Milliseconds 2500.0)
  
  -- Then cancel
  { logger } <- Om.ask
  Om.fromAff $ logger "Cancelling subscription..."
  cancel

-- Expected output:
-- Received: 0
-- Received: 1
-- Received: 2
-- Received: 3
-- Received: 4
-- Cancelling subscription...

--------------------------------------------------------------------------------
-- Example 16: FlatMap for Nested Streams
--------------------------------------------------------------------------------

-- | Flatten nested data structures
type Department = { name :: String, employees :: Array String }

example16 :: Om {} () (Array String)
example16 = do
  let departments =
        [ { name: "Engineering", employees: ["Alice", "Bob"] }
        , { name: "Sales", employees: ["Charlie"] }
        , { name: "Marketing", employees: ["Dave", "Eve", "Frank"] }
        ]
  
  Strom.fromArray departments
    >>= (\dept -> Strom.fromArray dept.employees)
    # Strom.runCollect

-- Expected output: ["Alice", "Bob", "Charlie", "Dave", "Eve", "Frank"]

--------------------------------------------------------------------------------
-- Example 17: Error Handling
--------------------------------------------------------------------------------

data AppError = NetworkError | ValidationError | TimeoutError

-- | Catch errors and provide fallback
example17 :: Om {} (networkError :: String) (Array Int)
example17 = do
  let riskyStream = Strom.range 1 5
        # Strom.mapM (\n -> do
            if n == 3
              then Om.throw { networkError: "Connection failed!" }
              else pure (n * 2)
          )
  
  riskyStream
    # Strom.catchAll (\err -> Strom.succeed 999)  -- Fallback value
    # Strom.runCollect

-- Expected output: [2, 4, 999, 8, 10]

-- | Provide alternative stream on failure
example17b :: Om {} (networkError :: String) (Array Int)
example17b = do
  let primaryStream = Strom.fromOm $ Om.throw { networkError: "Primary failed" }
  let fallbackStream = Strom.fromArray [1, 2, 3]
  
  primaryStream `Strom.orElse` fallbackStream
    # Strom.runCollect

-- Expected output: [1, 2, 3]

--------------------------------------------------------------------------------
-- Example 18: Real-world: Event Processing Pipeline
--------------------------------------------------------------------------------

type Event = { timestamp :: Int, userId :: String, action :: String }

-- | Complete event processing pipeline
eventProcessingPipeline :: Om LoggerContext () Unit
eventProcessingPipeline = do
  let events =
        [ { timestamp: 1000, userId: "u1", action: "login" }
        , { timestamp: 1001, userId: "u1", action: "view" }
        , { timestamp: 1002, userId: "u2", action: "login" }
        , { timestamp: 1003, userId: "u1", action: "view" }
        , { timestamp: 1004, userId: "u1", action: "view" }
        , { timestamp: 1005, userId: "u2", action: "purchase" }
        ]
  
  Strom.fromArray events
    # Strom.filter (\e -> e.action /= "login")  -- Filter out logins
    # Strom.changes                              -- Remove consecutive duplicates
    # Strom.mapAccum                             -- Add sequence numbers
        (\seq event -> Tuple (seq + 1) { seq, event })
        0
    # Strom.tapM (\{ seq, event } -> do         -- Log each event
        { logger } <- Om.ask
        Om.fromAff $ logger $ 
          "Event #" <> show seq <> ": " 
          <> event.userId <> " - " <> event.action
      )
    # Strom.grouped 2                            -- Batch for processing
    # Strom.traverse_ (\batch -> do             -- Process batches
        { logger } <- Om.ask
        Om.fromAff $ logger $ "Processed batch of " <> show (Array.length batch)
      )

-- Expected output:
-- Event #1: u1 - view
-- Event #2: u2 - purchase
-- Processed batch of 2

--------------------------------------------------------------------------------
-- Helper to run examples
--------------------------------------------------------------------------------

runExample :: forall a. Show a => Om {} () a -> Aff Unit
runExample om = do
  result <- Om.runOm {} { exception: \err -> do
    Console.log $ "Error: " <> show err
    pure unit
  } (om >>= \a -> Om.fromAff $ Console.log $ show a)
  pure result

runExampleWithLogger :: forall a. Show a => Om LoggerContext () a -> Aff Unit
runExampleWithLogger om = do
  let ctx = { logger: \msg -> Console.log msg }
  result <- Om.runOm ctx { exception: \err -> do
    Console.log $ "Error: " <> show err
    pure unit
  } (om >>= \a -> Om.fromAff $ Console.log $ show a)
  pure result
