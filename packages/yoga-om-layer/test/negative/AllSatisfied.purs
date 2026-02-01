module Test.Negative.AllSatisfied where

import Prelude
import Effect (Effect)
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Layer (OmLayer, makeLayer, runLayer)

type Config = { port :: Int }
type Logger = { log :: String -> Effect Unit }

needsConfig :: OmLayer (config :: Config) (logger :: Logger) ()
needsConfig = makeLayer do
  { config } <- Om.ask
  pure { logger: { log: \_ -> pure unit } }

-- This SHOULD compile - all dependencies satisfied
testAllSatisfied :: Om (Record (config :: Config)) () (Record (logger :: Logger))
testAllSatisfied = runLayer { config: { port: 5432 } } needsConfig
