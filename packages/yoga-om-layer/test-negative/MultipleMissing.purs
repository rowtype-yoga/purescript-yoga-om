module Test.Negative.MultipleMissing where

import Prelude
import Data.Maybe (Maybe(..))
import Effect (Effect)
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Layer (OmLayer, makeLayer, runLayer)

type Config = { port :: Int }
type Logger = { log :: String -> Effect Unit }
type Database = { query :: String -> Effect (Array String) }
type Cache = { get :: String -> Effect (Maybe String) }

-- Needs THREE dependencies
needsThree :: OmLayer (config :: Config, logger :: Logger, database :: Database) (cache :: Cache) ()
needsThree = makeLayer do
  { config, logger, database } <- Om.ask
  pure { cache: { get: \_ -> pure Nothing } }

-- Provides NONE of them - what error do we get?
testMultipleMissing :: Om (Record ()) () (Record (cache :: Cache))
testMultipleMissing = runLayer {} needsThree
