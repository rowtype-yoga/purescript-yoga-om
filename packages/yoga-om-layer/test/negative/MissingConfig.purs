module Test.Negative.MissingConfig where

import Prelude
import Effect (Effect)
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Layer (OmLayer, makeLayer, runLayer)

type Config = { port :: Int, host :: String }
type Logger = { log :: String -> Effect Unit }

needsConfig :: OmLayer (config :: Config) (logger :: Logger) ()
needsConfig = makeLayer do
  { config } <- Om.ask
  pure { logger: { log: \_ -> pure unit } }

-- This should NOT compile - empty context, missing config
testMissingConfig :: Om (Record ()) () (Record (logger :: Logger))
testMissingConfig = runLayer {} needsConfig
