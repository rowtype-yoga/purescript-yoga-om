module Yoga.Om.Retry
  ( recovering
  , repeating
  , module Effect.Aff.Retry
  ) where

import Prelude

import Control.Monad.Error.Class (catchError, throwError)
import Data.Maybe (maybe)
import Data.Variant (class VariantMatchCases, onMatch)
import Effect.Aff.Retry (RetryPolicyM, RetryStatus, applyAndDelay, defaultRetryStatus)
import Effect.Exception (Error)
import Prim.Row (class Union)
import Prim.RowList (class RowToList, RowList)
import Yoga.Om (Om)

recovering
  :: forall ctx err rest a
       (handlersRL :: RowList Type)
       (handlers :: Row Type)
       (handled :: Row Type)
   . RowToList handlers handlersRL
  => VariantMatchCases handlersRL handled (Om ctx err Boolean)
  => Union handled rest (exception :: Error | err)
  => RetryPolicyM (Om ctx err)
  -> (RetryStatus -> Record handlers)
  -> (RetryStatus -> Om ctx err a)
  -> Om ctx err a
recovering policy mkChecks action = go defaultRetryStatus
  where
  go status =
    catchError (action status) (handleErr status)

  handleErr status variant = do
    let shouldRetry = variant # onMatch (mkChecks status) (\_ -> pure false)
    ifM shouldRetry
      (applyAndDelay policy status >>= maybe (throwError variant) go)
      (throwError variant)

-- | Repeat a successful action according to a policy while a condition holds.
-- | Returns the last result.
-- |
-- | ```purescript
-- | repeating (constantDelay (Milliseconds 1000.0) <> limitRetries 10)
-- |   (\_ result -> pure (result < threshold))
-- |   (\_ -> pollSensor)
-- | ```
repeating
  :: forall ctx err a
   . RetryPolicyM (Om ctx err)
  -> (RetryStatus -> a -> Om ctx err Boolean)
  -> (RetryStatus -> Om ctx err a)
  -> Om ctx err a
repeating policy shouldRepeat action = go defaultRetryStatus
  where
  go status = do
    result <- action status
    ifM (shouldRepeat status result)
      (applyAndDelay policy status >>= maybe (pure result) go)
      (pure result)
