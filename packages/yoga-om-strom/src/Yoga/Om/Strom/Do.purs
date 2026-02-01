module Yoga.Om.Strom.Do
  ( module Yoga.Om.Strom
  , module Yoga.Om.Strom.Do
  ) where

import Prelude

import Yoga.Om.Strom

-- | This module re-exports Strom with examples of do-notation usage.
-- | 
-- | Since Strom is a Monad, you can use regular do-notation:
-- | 
-- | ```purescript
-- | myStream :: Strom ctx err Int
-- | myStream = do
-- |   x <- Strom.range 1 5
-- |   y <- Strom.range 1 3
-- |   pure (x * y)
-- | ```
-- | 
-- | This creates a Cartesian product stream!

-- | Helper: Generate pairs from two streams (Cartesian product)
-- | 
-- | Example:
-- | ```purescript
-- | pairs = do
-- |   x <- Strom.range 1 4    -- [1, 2, 3]
-- |   y <- Strom.range 1 3    -- [1, 2]
-- |   pure (Tuple x y)
-- | -- Result: [(1,1), (1,2), (2,1), (2,2), (3,1), (3,2)]
-- | ```
for2 :: forall ctx err a b c. Strom ctx err a -> Strom ctx err b -> (a -> b -> c) -> Strom ctx err c
for2 as bs f = do
  a <- as
  b <- bs
  pure (f a b)

-- | Helper: Three-way Cartesian product
for3 :: forall ctx err a b c d. Strom ctx err a -> Strom ctx err b -> Strom ctx err c -> (a -> b -> c -> d) -> Strom ctx err d
for3 as bs cs f = do
  a <- as
  b <- bs
  c <- cs
  pure (f a b c)

-- | Helper: Generate stream from generator function
-- | 
-- | Example:
-- | ```purescript
-- | stream = generate do
-- |   x <- Strom.range 1 5
-- |   y <- Strom.range 1 5
-- |   guard (x + y == 7)  -- Only pairs that sum to 7
-- |   pure (Tuple x y)
-- | ```
generate :: forall ctx err a. Strom ctx err a -> Strom ctx err a
generate = identity

-- | Helper: Replicate each element n times using do-notation
-- | 
-- | Example:
-- | ```purescript
-- | stream = do
-- |   x <- Strom.range 1 3
-- |   replicateEach 2 x
-- | -- Result: [1, 1, 2, 2, 3, 3]
-- | ```
replicateEach :: forall ctx err a. Int -> a -> Strom ctx err a
replicateEach n x = Strom.repeat x # Strom.take n

-- | Comprehension-style helper
-- | 
-- | Example:
-- | ```purescript
-- | result = comprehension do
-- |   x <- Strom.range 1 10
-- |   Strom.guard (x `mod` 2 == 0)
-- |   y <- Strom.range 1 x
-- |   pure (Tuple x y)
-- | ```
comprehension :: forall ctx err a. Strom ctx err a -> Strom ctx err a
comprehension = identity

-- | Guard function for filtering in do-notation
-- | Like Haskell's list comprehension guards
-- | 
-- | Example:
-- | ```purescript
-- | evens = do
-- |   x <- Strom.range 1 10
-- |   guard (x `mod` 2 == 0)
-- |   pure x
-- | ```
guard :: forall ctx err. Boolean -> Strom ctx err Unit
guard true = Strom.succeed unit
guard false = Strom.empty

-- | when-style conditional
-- | 
-- | Example:
-- | ```purescript
-- | result = do
-- |   x <- Strom.range 1 10
-- |   when (x > 5) do
-- |     -- Only emits for x > 5
-- |     pure x
-- | ```
when :: forall ctx err a. Boolean -> Strom ctx err a -> Strom ctx err a
when true s = s
when false _ = Strom.empty

-- | unless-style conditional
unless :: forall ctx err a. Boolean -> Strom ctx err a -> Strom ctx err a
unless cond = when (not cond)
