module Test.Negative.ShowDiff where

import Prelude
import Effect (Effect)
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Layer (OmLayer, makeLayer, runLayer)

type Config = { port :: Int }
type Logger = { log :: String -> Effect Unit }
type Database = { query :: String -> Effect (Array String) }
type Cache = { get :: String -> Effect Unit }

-- Needs THREE dependencies
needsThree :: OmLayer (config :: Config, logger :: Logger, database :: Database) (cache :: Cache) ()
needsThree = makeLayer do
  { config, logger, database } <- Om.ask
  pure { cache: { get: \_ -> pure unit } }

-- Provides only ONE - should show a nice diff!
testShowDiff :: Om (Record (logger :: Logger)) () (Record (cache :: Cache))
testShowDiff = runLayer { logger: { log: \_ -> pure unit } } needsThree
