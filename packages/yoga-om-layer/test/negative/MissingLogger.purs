module Test.Negative.MissingLogger where

import Prelude
import Effect (Effect)
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Layer (OmLayer, makeLayer, runLayer)

type Config = { port :: Int }
type Logger = { log :: String -> Effect Unit }
type Database = { query :: String -> Effect (Array String) }

needsBoth :: OmLayer (config :: Config, logger :: Logger) (database :: Database) ()
needsBoth = makeLayer do
  { config, logger } <- Om.ask
  pure { database: { query: \_ -> pure [] } }

-- This should NOT compile - we provide config but not logger
testMissingLogger :: Om (Record (config :: Config)) () (Record (database :: Database))
testMissingLogger = runLayer { config: { port: 5432 } } needsBoth
