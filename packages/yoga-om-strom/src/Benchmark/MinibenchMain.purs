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

  -- Additional construction methods
  benchAff "fromArray-1M" 10 do
    runOm $
      Strom.fromArray (Array.range 1 1000000)
        # Strom.runDrain

  benchAff "iterateStrom-10k" 10 do
    runOm $
      Strom.iterateStrom (_ + 1) 0
        # Strom.runDrain

  benchAff "repeatStrom-10k" 10 do
    runOm $
      Strom.repeatStrom 42
        # Strom.runDrain

  -- Transformations
  benchAff "mapM-effect-50k" 10 do
    runOm $
      Strom.rangeStrom 1 50001
        # Strom.mapMStrom (\n -> pure (n * 2))
        # Strom.runDrain

  benchAff "tap-50k" 10 do
    runOm $
      Strom.rangeStrom 1 50001
        # Strom.tapStrom (\_ -> unit)
        # Strom.runDrain

  benchAff "collect-filter-map-50k" 10 do
    runOm $
      Strom.rangeStrom 1 50001
        # Strom.collectStrom (\n -> if n `mod` 2 == 0 then Just (n * 2) else Nothing)
        # Strom.runDrain

  benchAff "changes-50k" 10 do
    runOm $
      Strom.fromArray (Array.replicate 50000 1 <> [2])
        # Strom.changesStrom
        # Strom.runDrain

  -- Taking/Dropping
  benchAff "takeWhile-50k" 10 do
    runOm $
      Strom.rangeStrom 1 1000001
        # Strom.takeWhileStrom (_ < 50000)
        # Strom.runDrain

  benchAff "drop-5k-from-1M" 10 do
    runOm $
      Strom.rangeStrom 1 1000001
        # Strom.dropStrom 5000
        # Strom.runDrain

  benchAff "dropWhile-half-1M" 10 do
    runOm $
      Strom.rangeStrom 1 1000001
        # Strom.dropWhileStrom (_ < 500000)
        # Strom.runDrain

  -- Grouping
  benchAff "grouped-chunks-of-100-from-50k" 10 do
    runOm $
      Strom.rangeStrom 1 50001
        # Strom.groupedStrom 100
        # Strom.runDrain

  benchAff "partition-even-odd-50k" 10 do
    runOm $ do
      let Tuple evens odds = Strom.partition (\n -> n `mod` 2 == 0) (Strom.rangeStrom 1 50001)
      Strom.appendStrom evens odds
        # Strom.runDrain

  -- Combining
  benchAff "append-2x500k" 10 do
    runOm $
      Strom.appendStrom
        (Strom.rangeStrom 1 500001)
        (Strom.rangeStrom 500001 1000001)
        # Strom.runDrain

  benchAff "concat-10x10k" 10 do
    runOm $
      Strom.concatStrom (Array.replicate 10 (Strom.rangeStrom 1 10001))
        # Strom.runDrain

  benchAff "zipWith-add-2x500k" 10 do
    runOm $
      Strom.zipWithStrom (+)
        (Strom.rangeStrom 1 500001)
        (Strom.rangeStrom 1 500001)
        # Strom.runDrain

  benchAff "interleave-2x50k" 10 do
    runOm $
      Strom.interleave
        (Strom.rangeStrom 1 50001)
        (Strom.rangeStrom 50001 100001)
        # Strom.runDrain

  benchAff "merge-2x500k" 10 do
    runOm $
      Strom.merge
        (Strom.rangeStrom 1 500001)
        (Strom.rangeStrom 500001 1000001)
        # Strom.runDrain

  benchAff "mergeAll-10x10k" 10 do
    runOm $
      Strom.mergeAll (Array.replicate 10 (Strom.rangeStrom 1 10001))
        # Strom.runDrain

  benchAff "race-2x50k" 10 do
    runOm $
      Strom.race
        (Strom.rangeStrom 1 50001)
        (Strom.rangeStrom 50001 100001)
        # Strom.runDrain

  -- Parallel operations
  benchAff "foreachPar-concurrency8-1k" 10 do
    runOm $
      Strom.rangeStrom 1 1001
        # Strom.foreachPar 8 (\_ -> pure unit)

  benchAff "mapMPar-concurrency8-1k" 10 do
    runOm $
      Strom.rangeStrom 1 1001
        # Strom.mapMPar 8 (\n -> pure (n * 2))
        # Strom.runDrain

  -- Error handling
  benchAff "catchAll-no-errors-50k" 10 do
    runOm $
      Strom.rangeStrom 1 50001
        # Strom.catchAll (\_ -> Strom.succeed 0)
        # Strom.runDrain

  liftEffect $ Console.log "\n✨ Benchmark suite complete!"
