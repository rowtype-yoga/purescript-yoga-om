module Yoga.Om.Strom.Do.Test where

import Prelude

import Data.Tuple (Tuple(..))
import Effect.Aff (Aff)
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual, fail)
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Strom as Strom
import Yoga.Om.Strom.Do as StromDo

-- Helper to run Om in tests
runOm :: forall a. Om {} () a -> Aff a
runOm om = Om.runOm {} { exception: \err -> fail (show err) } om

spec :: Spec Unit
spec = do
  describe "Strom Do-Notation" do
    
    describe "Basic Do-Notation" do
      
      it "bind via do-notation" do
        result <- runOm $
          (do
            x <- Strom.range 1 4
            y <- Strom.range 1 3
            pure (x * y)
          ) # Strom.runCollect
        result `shouldEqual` [1, 2, 3, 2, 4, 6, 3, 6, 9]
      
      it "sequential processing" do
        result <- runOm $
          (do
            x <- Strom.fromArray [1, 2, 3]
            y <- Strom.fromArray [x, x * 10]
            pure y
          ) # Strom.runCollect
        result `shouldEqual` [1, 10, 2, 20, 3, 30]
    
    describe "Comprehension-Style with Guards" do
      
      it "guard filters elements" do
        result <- runOm $
          (do
            x <- Strom.range 1 11
            StromDo.guard (x `mod` 2 == 0)
            pure x
          ) # Strom.runCollect
        result `shouldEqual` [2, 4, 6, 8, 10]
      
      it "multiple guards" do
        result <- runOm $
          (do
            x <- Strom.range 1 31
            StromDo.guard (x `mod` 2 == 0)
            StromDo.guard (x `mod` 3 == 0)
            pure x
          ) # Strom.runCollect
        result `shouldEqual` [6, 12, 18, 24, 30]
      
      it "guard with no matches produces empty" do
        result <- runOm $
          (do
            x <- Strom.range 1 11
            StromDo.guard (x > 100)  -- Never true
            pure x
          ) # Strom.runCollect
        result `shouldEqual` []
    
    describe "Cartesian Products" do
      
      it "2D Cartesian product" do
        result <- runOm $
          (do
            x <- Strom.range 1 4
            y <- Strom.range 1 3
            pure (Tuple x y)
          ) # Strom.runCollect
        result `shouldEqual`
          [ Tuple 1 1, Tuple 1 2
          , Tuple 2 1, Tuple 2 2
          , Tuple 3 1, Tuple 3 2
          ]
      
      it "for2 helper" do
        result <- runOm $
          StromDo.for2 
            (Strom.range 1 4) 
            (Strom.range 1 3) 
            Tuple
          # Strom.runCollect
        result `shouldEqual`
          [ Tuple 1 1, Tuple 1 2
          , Tuple 2 1, Tuple 2 2
          , Tuple 3 1, Tuple 3 2
          ]
      
      it "filtered Cartesian product" do
        result <- runOm $
          (do
            x <- Strom.range 1 6
            y <- Strom.range 1 6
            StromDo.guard (x + y == 7)
            pure (Tuple x y)
          ) # Strom.runCollect
        result `shouldEqual`
          [ Tuple 1 6, Tuple 2 5, Tuple 3 4
          , Tuple 4 3, Tuple 5 2, Tuple 6 1
          ]
    
    describe "When/Unless Conditionals" do
      
      it "when with true condition" do
        result <- runOm $
          (do
            x <- Strom.range 1 6
            StromDo.when (x > 3) do
              pure x
          ) # Strom.runCollect
        result `shouldEqual` [4, 5]
      
      it "when with false condition produces empty" do
        result <- runOm $
          (do
            x <- Strom.range 1 6
            StromDo.when false do
              pure x
          ) # Strom.runCollect
        result `shouldEqual` []
      
      it "unless with false condition" do
        result <- runOm $
          (do
            x <- Strom.range 1 6
            StromDo.unless (x > 3) do
              pure x
          ) # Strom.runCollect
        result `shouldEqual` [1, 2, 3]
    
    describe "ReplicateEach" do
      
      it "replicates each element" do
        result <- runOm $
          (do
            x <- Strom.range 1 4
            StromDo.replicateEach 3 x
          ) # Strom.runCollect
        result `shouldEqual` [1, 1, 1, 2, 2, 2, 3, 3, 3]
    
    describe "Real-World Patterns" do
      
      it "Pythagorean triples (small)" do
        result <- runOm $
          (do
            a <- Strom.range 1 6
            b <- Strom.range a 6
            c <- Strom.range b 6
            StromDo.guard (a * a + b * b == c * c)
            pure (Tuple a (Tuple b c))
          ) # Strom.runCollect
        result `shouldEqual` [Tuple 3 (Tuple 4 5)]
      
      it "primes less than 20" do
        let isPrime n = n > 1 && all (\d -> n `mod` d /= 0) (range 2 (n - 1))
        result <- runOm $
          (do
            n <- Strom.range 2 21
            StromDo.guard (isPrime n)
            pure n
          ) # Strom.runCollect
        result `shouldEqual` [2, 3, 5, 7, 11, 13, 17, 19]
      
      it "nested filtering" do
        result <- runOm $
          (do
            x <- Strom.range 1 11
            StromDo.guard (x `mod` 2 == 0)
            y <- do
              n <- Strom.range 1 x
              StromDo.guard (n `mod` 2 /= 0)
              pure n
            pure (Tuple x y)
          ) # Strom.runCollect
        -- Even x, odd y where y < x
        result `shouldEqual`
          [ Tuple 2 1
          , Tuple 4 1, Tuple 4 3
          , Tuple 6 1, Tuple 6 3, Tuple 6 5
          , Tuple 8 1, Tuple 8 3, Tuple 8 5, Tuple 8 7
          , Tuple 10 1, Tuple 10 3, Tuple 10 5, Tuple 10 7, Tuple 10 9
          ]
    
    describe "Monadic Laws" do
      
      it "left identity: pure a >>= f = f a" do
        let f x = Strom.fromArray [x, x * 2]
        result1 <- runOm $ (pure 5 >>= f) # Strom.runCollect
        result2 <- runOm $ f 5 # Strom.runCollect
        result1 `shouldEqual` result2
      
      it "right identity: m >>= pure = m" do
        let m = Strom.range 1 6
        result1 <- runOm $ (m >>= pure) # Strom.runCollect
        result2 <- runOm $ m # Strom.runCollect
        result1 `shouldEqual` result2
      
      it "associativity: (m >>= f) >>= g = m >>= (\\x -> f x >>= g)" do
        let m = Strom.range 1 4
        let f x = Strom.fromArray [x, x + 10]
        let g y = Strom.fromArray [y * 2, y * 3]
        result1 <- runOm $ ((m >>= f) >>= g) # Strom.runCollect
        result2 <- runOm $ (m >>= (\x -> f x >>= g)) # Strom.runCollect
        result1 `shouldEqual` result2

-- Helpers
range :: Int -> Int -> Array Int
range start end = 
  if start >= end 
  then []
  else [start] <> range (start + 1) end

all :: forall a. (a -> Boolean) -> Array a -> Boolean
all f arr = case arr of
  [] -> true
  [x] -> f x
  xs -> foldr (\x acc -> f x && acc) true xs
