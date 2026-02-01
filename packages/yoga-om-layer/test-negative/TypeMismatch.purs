module Test.Negative.TypeMismatch where

import Prelude

import Data.Maybe (Maybe(..))
import Effect (Effect)
import Yoga.Om (Om, launchOm_)
import Yoga.Om.Layer (OmLayer, makeLayer, runLayer)

type Database = { query :: String -> Effect (Array String) }

programLayer :: OmLayer (database :: Database) () ()
programLayer = makeLayer do
  pure {}

-- This should FAIL to compile - wrong type for database!
-- Expected: { query :: String -> Effect (Array String) }
-- Provided: { query :: String -> String }
testTypeMismatch :: Om _ () _
testTypeMismatch = launchOm_ do
  programLayer # runLayer
    { database: { query: \q -> "" } }  -- Wrong! Returns String not Effect (Array String)
