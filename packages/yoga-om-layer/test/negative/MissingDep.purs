module Test.Negative.MissingDep where

import Prelude
import Data.Newtype (un)
import Yoga.Om as Om
import Yoga.Om.Layer (OmLayer, makeLayer, combineRequirements)

type Config = { port :: Int }
type Logger = { log :: String -> String }

needsConfig :: OmLayer (config :: Config) (logger :: Logger) ()
needsConfig = makeLayer do
  { config } <- Om.ask
  pure { logger: { log: \msg -> "[" <> show config.port <> "] " <> msg } }

-- This should NOT compile - missing config!
badLayer :: OmLayer () (logger :: Logger) ()
badLayer = combineRequirements needsConfig needsConfig
