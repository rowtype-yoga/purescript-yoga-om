module Test.Negative.MissingConfigRun where

import Prelude
import Effect (Effect)
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Layer (OmLayer, makeLayer, runLayer)

type Config = { port :: Int, host :: String }
type Logger = { log :: String -> Effect Unit }

-- This layer needs config
needsConfig :: OmLayer (config :: Config) (logger :: Logger) ()
needsConfig = makeLayer do
  { config } <- Om.ask
  pure { logger: { log: \msg -> pure unit } }

-- This should NOT compile - trying to run needsConfig without providing config
testMissingConfigRun :: Om (Record ()) () (Record (logger :: Logger))
testMissingConfigRun = runLayer {} needsConfig
