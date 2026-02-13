module Yoga.Om.Test (testOm) where

import Prelude

import Effect.Aff (Aff)
import Yoga.Om (Om)
import Yoga.Om as Om

testOm :: forall ctx a. Monoid a => ctx -> Om ctx () a -> Aff a
testOm ctx = Om.runOm ctx { exception: mempty }
