module Test.Negative.DuplicateProvides where

import Prelude
import Effect (Effect)
import Yoga.Om as Om
import Yoga.Om.Layer (OmLayer, makeLayer, combineRequirements)

type Config = { port :: Int }
type Logger = { log :: String -> Effect Unit }

-- Both layers provide logger!
layer1 :: OmLayer (config :: Config) (logger :: Logger) ()
layer1 = makeLayer do
  { config } <- Om.ask
  pure { logger: { log: \msg -> pure unit } }

layer2 :: OmLayer (config :: Config) (logger :: Logger) ()
layer2 = makeLayer do
  { config } <- Om.ask
  pure { logger: { log: \msg -> pure unit } }

-- What happens when we combine them?
combined :: OmLayer (config :: Config) (logger :: Logger) ()
combined = combineRequirements layer1 layer2
