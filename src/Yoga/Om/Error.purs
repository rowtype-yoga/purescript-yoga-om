module Yoga.Om.Error where

import Prelude

import Data.Function.Uncurried (Fn3, runFn3)
import Data.Maybe (Maybe(..))
import Data.Symbol (class IsSymbol)
import Data.Variant (Variant)
import Data.Variant as V
import Effect (Effect)
import Effect.Class.Console as Console
import Effect.Exception (Error)
import Prim.RowList (class RowToList)
import Prim.RowList as RL
import Prim.TypeError (class Fail, class Warn, Doc, Text)
import Record (get)
import Type.Proxy (Proxy(..))
import Type.Row as Row
import Unsafe.Coerce (unsafeCoerce)

errorKey ∷ ∀ a. Proxy a
errorKey = Proxy

type ErrorKey :: forall k. k -> Type
type ErrorKey = Proxy

exception :: ErrorKey "exception"
exception = errorKey

type Exception others = (exception :: Error | others)

mkError
  ∷ ∀ errorKey errorsBefore errorsAfter a
   . Row.Cons errorKey a errorsBefore errorsAfter
  => IsSymbol errorKey
  => ErrorKey errorKey
  -> a
  -> OneOfTheseErrors errorsAfter
mkError = V.inj

type OneOfTheseErrors = V.Variant

logUnhandledError :: Error -> Effect Unit
logUnhandledError (error :: Error) =
  Console.error $ "Unhandled Error!" <> show error

foreign import data ParallelError ∷ Type → Type
foreign import toParallelErrorImpl
  ∷ ∀ a err. Fn3 (a → Maybe a) (Maybe a) Error (Maybe (ParallelError err))

toParallelError ∷ ∀ err. Error → Maybe (ParallelError err)
toParallelError = runFn3 toParallelErrorImpl Just Nothing

parallelErrorToError ∷ ∀ err. ParallelError err → Error
parallelErrorToError = unsafeCoerce

foreign import newParallelError ∷ ∀ err. err → ParallelError err
foreign import getParallelError ∷ ∀ err. ParallelError err → err

-- | Helper class to make throwing errors easier
class SingletonVariantRecord a b | a -> b where
  singletonRecordToVariant :: Record a -> Variant b

instance
  ( RowToList rec (RL.Cons key a RL.Nil)
  , Row.Cons key a () rec
  , Row.Cons key a otherErrors var
  , IsSymbol key
  ) =>
  SingletonVariantRecord rec var where
  singletonRecordToVariant = V.inj (Proxy :: Proxy key) <<< get (Proxy :: Proxy key)
