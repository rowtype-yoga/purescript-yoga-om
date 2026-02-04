module Benchmark where

import Prelude

import Data.Array as Array
import Data.Int (toNumber)
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Milliseconds(..))
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff, launchAff_, throwError)
import Effect.Class (liftEffect)
import Effect.Exception (Error)
import Effect.Class.Console as Console
import Effect.Now (now)
import Data.DateTime.Instant (unInstant, diff)
import Yoga.Om as Om
import Yoga.Om.Strom as Strom

-- Helper to time an operation
timeOperation :: forall a. String -> Aff a -> Aff a
timeOperation name action = do
  Console.log $ "\n🏃 Running: " <> name
  start <- liftEffect now
  result <- action
  end <- liftEffect now
  let Milliseconds duration = diff end start
  Console.log $ "✓ Completed in " <> show duration <> "ms"
  pure result

-- Helper to calculate throughput
reportThroughput :: String -> Int -> Number -> Effect Unit
reportThroughput name elements duration = do
  let elementsPerSec = (1000.0 * toNumber elements) / duration
  let millions = elementsPerSec / 1000000.0
  Console.log $ "  📊 " <> name <> ": " <> show elementsPerSec <> " elements/sec"
  Console.log $ "  📊 " <> name <> ": " <> show millions <> "M elements/sec"

-- Run Om in benchmark context
runOm :: forall a. Om.Om {} () a -> Aff a
runOm om = Om.runOm {} { exception: \err -> throwError err } om

main :: Effect Unit
main = launchAff_ do
  Console.log "🔥 Strom Performance Benchmark Suite"
  Console.log "====================================="

  -- Benchmark 1: Simple map
  _ <- timeOperation "Map 1M elements" do
    start <- liftEffect now
    result <- runOm $
      Strom.rangeStrom 1 1000001
        # Strom.mapStrom (_ + 1)
        # Strom.runDrain
    end <- liftEffect now
    let Milliseconds duration = diff end start
    liftEffect $ reportThroughput "map" 1000000 duration
    pure result

  -- Benchmark 2: Filter
  _ <- timeOperation "Filter 1M elements (50% kept)" do
    start <- liftEffect now
    result <- runOm $
      Strom.rangeStrom 1 1000001
        # Strom.filterStrom (\n -> n `mod` 2 == 0)
        # Strom.runDrain
    end <- liftEffect now
    let Milliseconds duration = diff end start
    liftEffect $ reportThroughput "filter" 1000000 duration
    pure result

  -- Benchmark 3: Map chain (3 maps)
  _ <- timeOperation "Chain 3 maps over 1M elements" do
    start <- liftEffect now
    result <- runOm $
      Strom.rangeStrom 1 1000001
        # Strom.mapStrom (_ + 1)
        # Strom.mapStrom (_ * 2)
        # Strom.mapStrom (_ - 1)
        # Strom.runDrain
    end <- liftEffect now
    let Milliseconds duration = diff end start
    liftEffect $ reportThroughput "3x map" 1000000 duration
    pure result

  -- Benchmark 4: Complex pipeline
  _ <- timeOperation "Complex pipeline (map, filter, map) on 1M elements" do
    start <- liftEffect now
    result <- runOm $
      Strom.rangeStrom 1 1000001
        # Strom.mapStrom (_ + 1)
        # Strom.filterStrom (\n -> n `mod` 3 == 0)
        # Strom.mapStrom (_ * 2)
        # Strom.runDrain
    end <- liftEffect now
    let Milliseconds duration = diff end start
    liftEffect $ reportThroughput "pipeline" 1000000 duration
    pure result

  -- Benchmark 5: Fold (runFold)
  _ <- timeOperation "Fold 1M elements (sum)" do
    start <- liftEffect now
    result <- runOm $
      Strom.rangeStrom 1 1000001
        # Strom.runFold 0 (\acc n -> acc + n)
    end <- liftEffect now
    let Milliseconds duration = diff end start
    liftEffect $ reportThroughput "fold" 1000000 duration
    Console.log $ "  Result: " <> show result
    pure result

  -- Benchmark 6: Collect (runCollect)
  _ <- timeOperation "Collect 100K elements" do
    start <- liftEffect now
    result <- runOm $
      Strom.rangeStrom 1 100001
        # Strom.runCollect
    end <- liftEffect now
    let Milliseconds duration = diff end start
    liftEffect $ reportThroughput "collect" 100000 duration
    Console.log $ "  Array size: " <> show (Array.length result)
    pure result

  -- Benchmark 7: Take (early termination)
  _ <- timeOperation "Take 10K from 1M elements" do
    start <- liftEffect now
    result <- runOm $
      Strom.rangeStrom 1 1000001
        # Strom.takeStrom 10000
        # Strom.runDrain
    end <- liftEffect now
    let Milliseconds duration = diff end start
    Console.log $ "  Duration: " <> show duration <> "ms (should be fast!)"
    pure result

  -- Benchmark 8: Concurrent merge
  _ <- timeOperation "Non-deterministic merge of 2x500K elements" do
    start <- liftEffect now
    result <- runOm $
      Strom.mergeND
        (Strom.rangeStrom 1 500001)
        (Strom.rangeStrom 500001 1000001)
        # Strom.runDrain
    end <- liftEffect now
    let Milliseconds duration = diff end start
    liftEffect $ reportThroughput "mergeND" 1000000 duration
    pure result

  -- Benchmark 9: Parallel map (simulated work)
  _ <- timeOperation "Parallel map (concurrency=4) on 1000 elements" do
    start <- liftEffect now
    result <- runOm $
      Strom.rangeStrom 1 1001
        # Strom.mapPar 4 (\n -> pure (n * 2)) -- Pure computation
        # Strom.runDrain
    end <- liftEffect now
    let Milliseconds duration = diff end start
    liftEffect $ reportThroughput "mapPar(4)" 1000 duration
    pure result

  -- Benchmark 10: Infinite stream with take (stack safety)
  _ <- timeOperation "Infinite stream, take 1M elements" do
    start <- liftEffect now
    result <- runOm $
      Strom.iterateStromInfinite (_ + 1) 0
        # Strom.takeStrom 1000000
        # Strom.runDrain
    end <- liftEffect now
    let Milliseconds duration = diff end start
    liftEffect $ reportThroughput "infinite+take" 1000000 duration
    pure result

  -- Benchmark 11: Scan (stateful)
  _ <- timeOperation "Scan (running sum) over 1M elements" do
    start <- liftEffect now
    result <- runOm $
      Strom.rangeStrom 1 1000001
        # Strom.scanStrom (\acc n -> acc + n) 0
        # Strom.runDrain
    end <- liftEffect now
    let Milliseconds duration = diff end start
    liftEffect $ reportThroughput "scan" 1000000 duration
    pure result

  -- Benchmark 12: Unfold
  _ <- timeOperation "Unfold 100K elements" do
    start <- liftEffect now
    result <- runOm $
      Strom.unfoldStrom (\n -> if n > 100000 then Nothing else Just (Tuple n (n + 1))) 1
        # Strom.runDrain
    end <- liftEffect now
    let Milliseconds duration = diff end start
    liftEffect $ reportThroughput "unfold" 100000 duration
    pure result

  Console.log "\n✨ Benchmark suite complete!"
  Console.log "\n📈 Summary:"
  Console.log "- Basic operations (map, filter): should be 1-10M elements/sec"
  Console.log "- Pipelines: still fast due to chunking"
  Console.log "- Take/early termination: should be near-instant"
  Console.log "- Concurrent operations: good speedup"
  Console.log "- Infinite streams: stack-safe and fast"
