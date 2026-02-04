module Benchmark.MinibenchMain where

import Prelude

import Data.Array as Array
import Data.DateTime.Instant (diff)
import Data.Int (toNumber)
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Milliseconds(..))
import Data.Traversable (sequence)
import Data.Tuple (Tuple(..))
import Effect (Effect)
import Effect.Aff (Aff, launchAff_, throwError)
import Effect.Class (liftEffect)
import Effect.Console as Console
import Effect.Now (now)
import Yoga.Om as Om
import Yoga.Om.Strom as Strom

-- Helper to run Om in benchmark context
runOm :: forall a. Om.Om {} () a -> Aff a
runOm om = Om.runOm {} { exception: \err -> throwError err } om

-- Custom benchmark runner for Aff operations
benchAff :: String -> Int -> Aff Unit -> Aff Unit
benchAff name runs action = do
  liftEffect $ Console.log $ "\n🏃 " <> name <> " (runs: " <> show runs <> ")"

  times <- sequence $ Array.replicate runs do
    start <- liftEffect now
    action
    end <- liftEffect now
    let Milliseconds duration = diff end start
    pure duration

  let
    sorted = Array.sort times
    n = toNumber runs
    sum = Array.foldl (+) 0.0 times
    mean = sum / n
    min = Array.head sorted
    max = Array.last sorted
    median = Array.index sorted (runs / 2)

  liftEffect do
    case min of
      Just m -> Console.log $ "  min:    " <> show m <> " ms"
      Nothing -> pure unit
    case median of
      Just m -> Console.log $ "  median: " <> show m <> " ms"
      Nothing -> pure unit
    Console.log $ "  mean:   " <> show mean <> " ms"
    case max of
      Just m -> Console.log $ "  max:    " <> show m <> " ms"
      Nothing -> pure unit

-- Benchmark Suite
main :: Effect Unit
main = launchAff_ do
  liftEffect $ Console.log "🔥 Strom Performance Benchmark Suite"
  liftEffect $ Console.log "====================================="
  liftEffect $ Console.log ""

  -- Simple map operation
  benchAff "map-2M" 10 do
    runOm $
      Strom.rangeStrom 1 2000001
        # Strom.mapStrom (_ + 1)
        # Strom.runDrain

  -- Filter operation
  benchAff "filter-2M-50pct" 10 do
    runOm $
      Strom.rangeStrom 1 2000001
        # Strom.filterStrom (\n -> n `mod` 2 == 0)
        # Strom.runDrain

  -- Chain of maps (fusion test)
  benchAff "map-chain-3x-2M" 10 do
    runOm $
      Strom.rangeStrom 1 2000001
        # Strom.mapStrom (_ + 1)
        # Strom.mapStrom (_ * 2)
        # Strom.mapStrom (_ - 1)
        # Strom.runDrain

  -- Complex pipeline
  benchAff "pipeline-map-filter-map-2M" 10 do
    runOm $
      Strom.rangeStrom 1 2000001
        # Strom.mapStrom (_ + 1)
        # Strom.filterStrom (\n -> n `mod` 3 == 0)
        # Strom.mapStrom (_ * 2)
        # Strom.runDrain

  -- Fold operation
  benchAff "fold-sum-1M" 10 do
    void $ runOm $
      Strom.rangeStrom 1 1000001
        # Strom.runFold 0 (\acc n -> acc + n)

  -- Collect operation (array allocation)
  benchAff "collect-50k" 10 do
    void $ runOm $
      Strom.rangeStrom 1 50001
        # Strom.runCollect

  -- Take operation (early termination test)
  benchAff "take-5k-from-2M" 10 do
    runOm $
      Strom.rangeStrom 1 2000001
        # Strom.takeStrom 5000
        # Strom.runDrain

  -- Non-deterministic merge
  benchAff "mergeND-2x1M" 10 do
    runOm $
      Strom.mergeND
        (Strom.rangeStrom 1 1000001)
        (Strom.rangeStrom 1000001 2000001)
        # Strom.runDrain

  -- Parallel map with concurrency
  benchAff "mapPar-concurrency4-5k" 10 do
    runOm $
      Strom.rangeStrom 1 5001
        # Strom.mapPar 4 (\n -> pure (n * 2))
        # Strom.runDrain

  -- Scan operation (stateful)
  benchAff "scan-running-sum-2M" 10 do
    runOm $
      Strom.rangeStrom 1 2000001
        # Strom.scanStrom (\acc n -> acc + n) 0
        # Strom.runDrain

  -- Unfold operation (limited size due to stack)
  benchAff "unfold-10k" 10 do
    runOm $
      Strom.unfoldStrom (\n -> if n > 10000 then Nothing else Just (Tuple n (n + 1))) 1
        # Strom.runDrain

  -- Infinite stream with take (limited size)
  benchAff "infinite-iterate-take-10k" 10 do
    runOm $
      Strom.iterateStromInfinite (_ + 1) 0
        # Strom.takeStrom 10000
        # Strom.runDrain

  -- Bind/FlatMap operation (smaller for stack safety)
  benchAff "bind-5kx10" 10 do
    runOm $
      Strom.rangeStrom 1 5001
        # Strom.bindStrom (\n -> Strom.rangeStrom n (n + 10))
        # Strom.runDrain

  -- Zip operation
  benchAff "zip-2x500k" 10 do
    runOm $
      Strom.zipStrom
        (Strom.rangeStrom 1 500001)
        (Strom.rangeStrom 500001 1000001)
        # Strom.runDrain

  liftEffect $ Console.log "\n✨ Benchmark suite complete!"
