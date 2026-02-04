module Benchmark.HighRes
  ( nowMs
  ) where

import Effect (Effect)

foreign import nowMs :: Effect Number
