module Test.Negative.SimpleTypeMismatch where

import Prelude
import Effect (Effect)
import Yoga.Om (Om)
import Yoga.Om.Layer (OmLayer, makeLayer, runLayer)

type Database = { query :: String -> Effect (Array String) }

programLayer :: OmLayer (database :: Database) () ()
programLayer = makeLayer do
  pure {}

-- This should FAIL with TypeEquals error - wrong type for database!
testSimpleTypeMismatch :: Om _ () _
testSimpleTypeMismatch = runLayer { database: { query: \q -> "" } } programLayer
