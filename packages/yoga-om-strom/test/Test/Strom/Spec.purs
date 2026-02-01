module Test.Strom.Spec where

import Prelude

import Data.Array as Array
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Data.Time.Duration (Milliseconds(..))
import Effect.Aff (Aff)
import Effect.Ref as Ref
import Effect.Class (liftEffect)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, fail)
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Strom as Strom

-- Helper to run Om in tests
runOm :: forall a. Om {} () a -> Aff a
runOm om = Om.runOm {} { exception: \err -> fail (show err) } om

spec :: Spec Unit
spec = do
  describe "Strom" do
    
    describe "Construction" do
      
      it "empty produces no elements" do
        result <- runOm $ Strom.empty # Strom.runCollect
        result `shouldEqual` ([] :: Array Int)
      
      it "succeed produces single element" do
        result <- runOm $ Strom.succeed 42 # Strom.runCollect
        result `shouldEqual` [42]
      
      it "fromArray produces all elements" do
        result <- runOm $ Strom.fromArray [1, 2, 3, 4, 5] # Strom.runCollect
        result `shouldEqual` [1, 2, 3, 4, 5]
      
      it "fromArray handles empty array" do
        result <- runOm $ Strom.fromArray [] # Strom.runCollect
        result `shouldEqual` ([] :: Array Int)
      
      it "range produces correct sequence" do
        result <- runOm $ Strom.range 1 6 # Strom.runCollect
        result `shouldEqual` [1, 2, 3, 4, 5]
      
      it "range with start >= end produces empty" do
        result <- runOm $ Strom.range 5 5 # Strom.runCollect
        result `shouldEqual` []
      
      it "iterate produces sequence" do
        result <- runOm $ 
          Strom.iterate (_ + 1) 0
            # Strom.take 5
            # Strom.runCollect
        result `shouldEqual` [0, 1, 2, 3, 4]
      
      it "repeat produces repeated values" do
        result <- runOm $
          Strom.repeat 42
            # Strom.take 3
            # Strom.runCollect
        result `shouldEqual` [42, 42, 42]
      
      it "unfold produces Fibonacci sequence" do
        result <- runOm $
          Strom.unfold
            (\(Tuple a b) -> if a > 100 then Nothing else Just (Tuple a (Tuple b (a + b))))
            (Tuple 0 1)
            # Strom.runCollect
        result `shouldEqual` [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
      
      it "fromOm produces value from effect" do
        result <- runOm $
          Strom.fromOm (pure 42)
            # Strom.runCollect
        result `shouldEqual` [42]
    
    describe "Running/Consuming" do
      
      it "runCollect collects all elements" do
        result <- runOm $
          Strom.range 1 6
            # Strom.runCollect
        result `shouldEqual` [1, 2, 3, 4, 5]
      
      it "runDrain executes but returns unit" do
        result <- runOm $
          Strom.range 1 100
            # Strom.runDrain
        result `shouldEqual` unit
      
      it "runFold reduces stream" do
        result <- runOm $
          Strom.range 1 6
            # Strom.runFold 0 (+)
        result `shouldEqual` 15
      
      it "runForEach executes effects" do
        countRef <- liftEffect $ Ref.new 0
        _ <- runOm $
          Strom.range 1 6
            # Strom.runForEach (\_ -> liftEffect $ Ref.modify_ (_ + 1) countRef)
        count <- liftEffect $ Ref.read countRef
        count `shouldEqual` 5
    
    describe "Transformations" do
      
      it "map transforms elements" do
        result <- runOm $
          Strom.range 1 6
            # Strom.map (_ * 2)
            # Strom.runCollect
        result `shouldEqual` [2, 4, 6, 8, 10]
      
      it "mapOm with effects" do
        result <- runOm $
          Strom.fromArray [1, 2, 3]
            # Strom.mapOm (\n -> pure (n * 2))
            # Strom.runCollect
        result `shouldEqual` [2, 4, 6]
      
      it "mapParallel processes concurrently" do
        result <- runOm $
          Strom.fromArray [1, 2, 3, 4, 5]
            # Strom.mapParallel 2 (\n -> do
                Om.delay (Milliseconds 10.0)
                pure (n * 2)
              )
            # Strom.runCollect
        Array.sort result `shouldEqual` [2, 4, 6, 8, 10]
      
      it "bind (>>=) flattens nested streams" do
        result <- runOm $
          Strom.fromArray [1, 2, 3]
            >>= (\n -> Strom.fromArray [n, n * 10])
            # Strom.runCollect
        result `shouldEqual` [1, 10, 2, 20, 3, 30]
      
      it "scan produces running totals" do
        result <- runOm $
          Strom.fromArray [1, 2, 3, 4, 5]
            # Strom.scan (+) 0
            # Strom.runCollect
        result `shouldEqual` [1, 3, 6, 10, 15]
      
      it "mapAccum with state" do
        result <- runOm $
          Strom.fromArray ["a", "b", "c"]
            # Strom.mapAccum (\i x -> Tuple (i + 1) (show i <> x)) 1
            # Strom.runCollect
        result `shouldEqual` ["1a", "2b", "3c"]
      
      it "tap observes without modifying" do
        sideEffectRef <- liftEffect $ Ref.new 0
        result <- runOm $
          Strom.fromArray [1, 2, 3]
            # Strom.tap (\n -> let _ = n in unit)  -- Pure observation
            # Strom.runCollect
        result `shouldEqual` [1, 2, 3]
      
      it "tapOm with effects" do
        countRef <- liftEffect $ Ref.new 0
        result <- runOm $
          Strom.fromArray [1, 2, 3]
            # Strom.tapOm (\_ -> liftEffect $ Ref.modify_ (_ + 1) countRef)
            # Strom.runCollect
        count <- liftEffect $ Ref.read countRef
        count `shouldEqual` 3
        result `shouldEqual` [1, 2, 3]
    
    describe "Selection" do
      
      it "take limits elements" do
        result <- runOm $
          Strom.range 1 100
            # Strom.take 5
            # Strom.runCollect
        result `shouldEqual` [1, 2, 3, 4, 5]
      
      it "take with 0 produces empty" do
        result <- runOm $
          Strom.range 1 100
            # Strom.take 0
            # Strom.runCollect
        result `shouldEqual` []
      
      it "takeWhile stops at condition" do
        result <- runOm $
          Strom.range 1 10
            # Strom.takeWhile (_ < 5)
            # Strom.runCollect
        result `shouldEqual` [1, 2, 3, 4]
      
      it "takeUntil includes matching element" do
        result <- runOm $
          Strom.range 1 10
            # Strom.takeUntil (_ == 5)
            # Strom.runCollect
        result `shouldEqual` [1, 2, 3, 4, 5]
      
      it "drop skips elements" do
        result <- runOm $
          Strom.range 1 10
            # Strom.drop 5
            # Strom.runCollect
        result `shouldEqual` [6, 7, 8, 9]
      
      it "dropWhile skips until condition" do
        result <- runOm $
          Strom.range 1 10
            # Strom.dropWhile (_ < 5)
            # Strom.runCollect
        result `shouldEqual` [5, 6, 7, 8, 9]
      
      it "filter keeps matching elements" do
        result <- runOm $
          Strom.range 1 10
            # Strom.filter (\n -> n `mod` 2 == 0)
            # Strom.runCollect
        result `shouldEqual` [2, 4, 6, 8]
      
      it "filterOm with effects" do
        result <- runOm $
          Strom.range 1 10
            # Strom.filterOm (\n -> pure (n `mod` 2 == 0))
            # Strom.runCollect
        result `shouldEqual` [2, 4, 6, 8]
      
      it "collect filters and maps" do
        result <- runOm $
          Strom.fromArray ["1", "x", "2", "y", "3"]
            # Strom.collect parseNumber
            # Strom.runCollect
        result `shouldEqual` [1, 2, 3]
      
      it "changes removes consecutive duplicates" do
        result <- runOm $
          Strom.fromArray [1, 1, 2, 2, 2, 3, 3, 1, 1]
            # Strom.changes
            # Strom.runCollect
        result `shouldEqual` [1, 2, 3, 1]
    
    describe "Combining" do
      
      it "append concatenates streams" do
        result <- runOm $
          Strom.fromArray [1, 2, 3]
            # Strom.append (Strom.fromArray [4, 5, 6])
            # Strom.runCollect
        result `shouldEqual` [1, 2, 3, 4, 5, 6]
      
      it "concat multiple streams" do
        result <- runOm $
          Strom.concat
            [ Strom.fromArray [1, 2]
            , Strom.fromArray [3, 4]
            , Strom.fromArray [5, 6]
            ]
            # Strom.runCollect
        result `shouldEqual` [1, 2, 3, 4, 5, 6]
      
      it "zip pairs elements" do
        result <- runOm $
          Strom.zip
            (Strom.range 1 4)
            (Strom.fromArray ["a", "b", "c"])
            # Strom.runCollect
        result `shouldEqual` [Tuple 1 "a", Tuple 2 "b", Tuple 3 "c"]
      
      it "zip stops at shortest stream" do
        result <- runOm $
          Strom.zip
            (Strom.range 1 10)
            (Strom.fromArray ["a", "b"])
            # Strom.runCollect
        result `shouldEqual` [Tuple 1 "a", Tuple 2 "b"]
      
      it "zipWith with custom function" do
        result <- runOm $
          Strom.zipWith (+)
            (Strom.range 1 4)
            (Strom.range 10 13)
            # Strom.runCollect
        result `shouldEqual` [11, 13, 15]
      
      it "interleave alternates elements" do
        result <- runOm $
          Strom.interleave
            (Strom.fromArray [1, 3, 5])
            (Strom.fromArray [2, 4, 6])
            # Strom.runCollect
        result `shouldEqual` [1, 2, 3, 4, 5, 6]
      
      it "race takes first to emit" do
        result <- runOm $
          Strom.race
            [ Strom.fromOm (Om.delay (Milliseconds 100.0) *> pure 1)
            , Strom.fromOm (pure 2)  -- This should win
            , Strom.fromOm (Om.delay (Milliseconds 50.0) *> pure 3)
            ]
            # Strom.runCollect
        -- Result should be from the fastest stream
        Array.length result `shouldEqual` 1
    
    describe "Grouping" do
      
      it "grouped creates fixed-size chunks" do
        result <- runOm $
          Strom.range 1 11
            # Strom.grouped 3
            # Strom.runCollect
        result `shouldEqual` [[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]
      
      it "grouped with partial last chunk" do
        result <- runOm $
          Strom.range 1 8
            # Strom.grouped 3
            # Strom.runCollect
        result `shouldEqual` [[1, 2, 3], [4, 5, 6], [7]]
      
      it "chunked is alias for grouped" do
        result <- runOm $
          Strom.range 1 6
            # Strom.chunked 2
            # Strom.runCollect
        result `shouldEqual` [[1, 2], [3, 4], [5]]
      
      it "partition splits by predicate" do
        let Tuple evens odds = Strom.partition (\n -> n `mod` 2 == 0) (Strom.range 1 11)
        evensResult <- runOm $ Strom.runCollect evens
        oddsResult <- runOm $ Strom.runCollect odds
        evensResult `shouldEqual` [2, 4, 6, 8, 10]
        oddsResult `shouldEqual` [1, 3, 5, 7, 9]
    
    describe "Error Handling" do
      
      it "catchAll recovers from errors" do
        result <- runOm $
          Strom.fromArray [1, 2, 3]
            # Strom.mapOm (\n -> 
                if n == 2 
                then Om.throw { testError: "error at 2" }
                else pure (n * 2)
              )
            # Strom.catchAll (\_ -> Strom.succeed 999)
            # Strom.runCollect
        -- Should have gotten an error and recovered
        Array.length result `shouldEqual` 1
      
      it "orElse provides alternative" do
        let failingStream = Strom.fromOm (Om.throw { testError: "fail" })
        let successStream = Strom.fromArray [1, 2, 3]
        result <- runOm $
          failingStream `Strom.orElse` successStream
            # Strom.runCollect
        result `shouldEqual` [1, 2, 3]
    
    describe "Complex Scenarios" do
      
      it "pipeline: filter, map, group" do
        result <- runOm $
          Strom.range 1 21
            # Strom.filter (\n -> n `mod` 2 == 0)
            # Strom.map (_ * 2)
            # Strom.grouped 3
            # Strom.runCollect
        result `shouldEqual` [[4, 8, 12], [16, 20, 24], [28, 32, 36], [40]]
      
      it "nested bind (>>=) with filtering" do
        result <- runOm $
          Strom.fromArray [1, 2, 3]
            >>= (\n ->
                Strom.range (n * 10) (n * 10 + 3)
                  # Strom.filter (\x -> x `mod` 2 == 0)
              )
            # Strom.runCollect
        result `shouldEqual` [10, 12, 20, 22, 30, 32]
      
      it "scan with filtering and mapping" do
        result <- runOm $
          Strom.fromArray [1, -2, 3, -4, 5]
            # Strom.filter (_ > 0)
            # Strom.scan (+) 0
            # Strom.map (_ * 10)
            # Strom.runCollect
        result `shouldEqual` [10, 40, 90]
      
      it "zip with scan" do
        result <- runOm $
          Strom.zip
            (Strom.fromArray ["a", "b", "c", "d"])
            (Strom.iterate (_ + 1) 1 # Strom.scan (+) 0 # Strom.take 4)
            # Strom.runCollect
        result `shouldEqual` [Tuple "a" 1, Tuple "b" 3, Tuple "c" 6, Tuple "d" 10]
      
      it "large stream with take" do
        result <- runOm $
          Strom.iterate (_ + 1) 0
            # Strom.filter (\n -> n `mod` 3 == 0)
            # Strom.take 100
            # Strom.grouped 10
            # Strom.runCollect
        Array.length result `shouldEqual` 10
        result # Array.head # map Array.head `shouldEqual` Just (Just 0)
    
    describe "Edge Cases" do
      
      it "empty stream through pipeline" do
        result <- runOm $
          Strom.empty
            # Strom.map (_ * 2)
            # Strom.filter (_ > 0)
            # Strom.grouped 10
            # Strom.runCollect
        result `shouldEqual` ([] :: Array (Array Int))
      
      it "single element through complex pipeline" do
        result <- runOm $
          Strom.succeed 42
            # Strom.map (_ * 2)
            # Strom.filter (_ > 50)
            # Strom.take 10
            # Strom.runCollect
        result `shouldEqual` [84]
      
      it "take more than available" do
        result <- runOm $
          Strom.fromArray [1, 2, 3]
            # Strom.take 100
            # Strom.runCollect
        result `shouldEqual` [1, 2, 3]
      
      it "drop more than available" do
        result <- runOm $
          Strom.fromArray [1, 2, 3]
            # Strom.drop 100
            # Strom.runCollect
        result `shouldEqual` []
      
      it "grouped with size larger than stream" do
        result <- runOm $
          Strom.fromArray [1, 2, 3]
            # Strom.grouped 100
            # Strom.runCollect
        result `shouldEqual` [[1, 2, 3]]

-- Helper functions
parseNumber :: String -> Maybe Int
parseNumber "1" = Just 1
parseNumber "2" = Just 2
parseNumber "3" = Just 3
parseNumber "4" = Just 4
parseNumber "5" = Just 5
parseNumber _ = Nothing
