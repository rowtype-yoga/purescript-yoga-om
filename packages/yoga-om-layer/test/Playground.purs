module Test.Playground where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import Effect.Console as Console
import Type.Row (type (+))
import Yoga.Om (Om, launchOm_)
import Yoga.Om as Om
import Yoga.Om.Layer (OmLayer, makeLayer, runLayer, combineRequirements)

-- Define some example types
type Config = { port :: Int, host :: String }
type ConfigL r = (config :: Config | r)
type ConfigL_ = ConfigL ()
type Logger = { log :: String -> Effect Unit }
type LoggerL r = (logger :: Logger | r)
type LoggerL_ = LoggerL ()
type Database = { query :: String -> Effect (Array String) }
type DatabaseL r = (database :: Database | r)
type DatabaseL_ = DatabaseL ()
type Cache = { get :: String -> Effect (Maybe String) }
type CacheL r = (cache :: Cache | r)
type CacheL_ = CacheL ()

-- Example layer 1: needs config, provides logger
loggerLayer :: OmLayer ConfigL_ LoggerL_ ()
loggerLayer = makeLayer do
  { config } <- Om.ask
  pure { logger: { log: \msg -> pure unit } }

-- Example layer 2: needs config, provides database
databaseLayer :: OmLayer ConfigL_ DatabaseL_ ()
databaseLayer = makeLayer do
  { config } <- Om.ask
  pure { database: { query: \q -> pure [] } }

-- Example layer 3: needs logger and database, provides cache
cacheLayer :: OmLayer (LoggerL + DatabaseL_) CacheL_ ()
cacheLayer = makeLayer do
  { logger, database } <- Om.ask
  pure { cache: { get: \key -> pure Nothing } }

programLayer :: OmLayer (DatabaseL + CacheL_) () ()
programLayer = makeLayer do
  pure {}

aProgram = launchOm_ do
  programLayer # runLayer
    { config: { port: 5432, host: "localhost" }
    , logger: { log: Console.log }
    , database: { query: \q -> pure [] }
    , cache: { get: \key -> pure Nothing }
    }

--------------------------------------------------------------------------------
-- TRY THESE! Uncomment one at a time to see different error messages
--------------------------------------------------------------------------------

-- ❌ ERROR 1: Missing config entirely
-- Uncomment this to see the error:
-- example1 :: Om (Record ()) () (Record (logger :: Logger))
-- example1 = runLayer {} loggerLayer

-- ❌ ERROR 2: Partial context - have logger, missing database
-- Uncomment this to see the error:
-- example2 :: Om (Record (logger :: Logger)) () (Record (cache :: Cache))
-- example2 = runLayer { logger: { log: \_ -> pure unit } } cacheLayer

-- ❌ ERROR 3: Multiple missing dependencies
-- Uncomment this to see the error:
-- combined :: OmLayer (config :: Config) (logger :: Logger, database :: Database) ()
-- combined = combineRequirements loggerLayer databaseLayer
-- example3 :: Om (Record ()) () (Record (logger :: Logger, database :: Database))
-- example3 = runLayer {} combined

-- ✅ SUCCESS: All dependencies provided!
-- This one works! Uncomment to verify:
-- example4 :: Om (Record (config :: Config)) () (Record (logger :: Logger))
-- example4 = runLayer { config: { port: 5432, host: "localhost" } } loggerLayer

--------------------------------------------------------------------------------
-- Instructions:
--   1. Uncomment ONE of the examples above
--   2. Run: npx spago build -p yoga-om-layer
--   3. See the beautiful error message!
--   4. Try different combinations to explore
--------------------------------------------------------------------------------
