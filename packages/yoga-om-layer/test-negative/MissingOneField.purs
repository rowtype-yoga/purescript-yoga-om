module Test.Negative.MissingOneField where

import Prelude
import Effect (Effect)
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Layer (OmLayer, makeLayer, runLayer)

type Config = { port :: Int }
type Logger = { log :: String -> Effect Unit }
type Database = { query :: String -> Effect (Array String) }

-- This layer needs BOTH config AND logger
needsBoth :: OmLayer (config :: Config, logger :: Logger) (database :: Database) ()
needsBoth = makeLayer do
  { config, logger } <- Om.ask
  pure { database: { query: \q -> pure [] } }

-- This should NOT compile - we provide config but not logger
testMissingOneField :: Om (Record (config :: Config)) () (Record (database :: Database))
testMissingOneField = runLayer { config: { port: 5432 } } needsBoth
