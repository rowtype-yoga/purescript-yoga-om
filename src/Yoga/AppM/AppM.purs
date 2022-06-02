module Yoga.App.AppM where

import Prelude

import Control.Monad.Error.Class (class MonadError, class MonadThrow, throwError, try)
import Control.Monad.Except (runExceptT)
import Control.Monad.Except.Checked (ExceptV, safe)
import Control.Monad.Except.Checked as ExceptV
import Control.Monad.Except.Trans (lift)
import Control.Monad.Reader (class MonadAsk, class MonadReader, ReaderT(..), ask, withReaderT)
import Control.Monad.Reader.Trans (runReaderT)
import Data.Either (Either(..), either)
import Data.Maybe (Maybe, maybe)
import Data.Newtype (class Newtype, unwrap)
import Data.Symbol (class IsSymbol)
import Data.Variant (class VariantMatchCases, Variant, case_, inj, onMatch)
import Effect (Effect)
import Effect.Aff (Aff, runAff_)
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect)
import Effect.Class.Console as Console
import Effect.Exception (Error)
import Prim.Row (class Nub, class Union)
import Prim.Row as R
import Prim.RowList (class RowToList)
import Prim.RowList as RL
import Record (disjointUnion, get)
import Type.Prelude (Proxy(..))
import Unsafe.Coerce (unsafeCoerce)

-- | A generic type for handling computations
-- | It combines asynchronous side-effecting computations with `Aff`,
-- | "dependency injection" via `ReaderT` which tracks a context, and
-- | checked exceptions and early return with `ExceptV`.
newtype AppM ctx err a = AppM (ReaderT ctx (ExceptV err Aff) a)

throw
  ∷ ∀ m r1 r2 a
   . VariantInjTagged r1 r2
  => MonadThrow (Variant r2) m
  => Record r1
  -> m a
throw = throwError <<< injTagged

-- | Turns a `Nothing` into an exception which reduces nesting and encourages
-- | tracking what actually went wrong
-- | e.g.
-- | ```purescript
-- |   do
-- |     let maybeCached = Object.lookup key cache :: Maybe a
-- |     cached :: a <- maybeCached # AppM.note (unexpectedCacheMiss key)
-- | ```
note ∷ ∀ err m a. MonadThrow err m => err -> Maybe a -> m a
note err = maybe (throwError $ err) pure

noteM ∷ ∀ err m a. MonadThrow err m => m err -> Maybe a -> m a
noteM err = maybe (throwError =<< err) pure

-- | Turns a `Left a` into an exception which reduces nesting
throwLeftAs
  ∷ ∀ err m left right
   . MonadThrow err m
  => (left -> err)
  -> Either left right
  -> m right
throwLeftAs toError = either (throwError <<< toError) pure

-- | Turn any `Aff` into an `AppM`.
-- | Because `Aff` can throw exceptions of type `Error`, a possible such 
-- | exception is captured in the `exception` branch of the error variant
fromAff ∷ ∀ ctx a err. Aff a -> AppM ctx (exception ∷ Error | err) a
fromAff e =
  AppM (lift (lift (try e)))
    >>= either (throw <<< { exception: _ }) pure

handleErrors
  ∷ ∀ ctx err1 err2 a
   . (Variant err1 -> AppM ctx err2 a)
  -> AppM ctx err1 a
  -> AppM ctx err2 a
handleErrors handle (AppM appM) = do
  ctx <- ask
  result <- runExceptT (runReaderT appM ctx) # liftAff
  case result of
    Left err -> handle err
    Right r -> pure r

handleError
  ∷ ∀ rl a ctx handlers excHandled excIn excOut
   . RowToList handlers rl
  => VariantMatchCases rl excHandled (AppM ctx excOut a)
  => Union excHandled excOut excIn
  => Record handlers
  -> AppM ctx excIn a
  -> AppM ctx excOut a
handleError cases (AppM appM) = do
  ask
    >>= (liftAff <$> unwrap <<< runReaderT appM)
    >>= either (onMatch cases throwError) pure

toExceptV
  ∷ ∀ ctx err1 err2 a
   . AppM ctx err1 a
  -> AppM ctx err2 (ExceptV err1 Aff a)
toExceptV (AppM appM) = do
  ctx <- ask
  pure $ runReaderT appM ctx

fromExceptV ∷ ∀ ctx err a. ExceptV err Aff a -> AppM ctx err a
fromExceptV = AppM <<< lift

-- | When you have a function that can throw a subset of the errors of the ones
-- | you could throw in a do block, `expand` allows to make them compatible
expand
  ∷ ∀ ctx lt more gt
   . R.Union lt more gt
  => AppM ctx lt
       ~> AppM ctx gt
expand = unsafeCoerce

expandCtx
  :: forall lt more gt err
   . Union lt more gt
  => AppM { | lt } err ~>
       AppM { | gt } err
expandCtx = unsafeCoerce

launchAppM_ ∷ ∀ ctx. ctx -> AppM ctx () Unit -> Effect Unit
launchAppM_ ctx appM =
  runAff_
    (either logUnhandledError pure)
    (runAppM_ ctx appM)

logUnhandledError ∷ Error -> Effect Unit
logUnhandledError (err ∷ Error) =
  Console.error
    $ "Unhandled Error!\n"
        <> show err

launchAppM
  ∷ ∀ ctx r rl err_ err
   . RowToList r rl
  => VariantMatchCases rl err_ (Aff Unit)
  => Union err_ () err
  => ctx
  -> Record r
  -> AppM ctx err Unit
  -> Effect Unit
launchAppM ctx errorHandlers (AppM app) =
  runAff_ (either logUnhandledError pure) do
    ExceptV.handleErrors errorHandlers $ runReaderT app ctx

-- | Invoke this function in the end after handling all possible errors, e.g.
-- | ```purescript
-- | runAppM_ { token: "123" } someApp
-- | ```
runAppM_ ∷ ∀ ctx a. ctx -> AppM ctx () a -> Aff a
runAppM_ ctx (AppM app) = do
  safe $ runReaderT app ctx

-- | Removes the ReaderT part and makes the errors explicit
-- | ```purescript
-- | runReader { token: "123" } someApp
-- | ```
runReader ∷ ∀ ctx err a. ctx -> AppM ctx err a -> Aff (Either (Variant err) a)
runReader ctx appM =
  runAppM_ ctx
    $ handleErrors (pure <<< Left)
    $ (Right <$> appM)

-- | Useful when constructing a *parameterless* callback of type `Aff` or 
-- | `Effect` within the context of an AppM computation
-- | ```purescript
-- | recordAndUploadDOM ∷ Aff _ <- do 
-- |   AppM.unliftAff $ serialiseDOM >>= uploadDOMSnapshot
-- | ```
unliftAff
  ∷ ∀ ctx err otherErrors a
   . AppM ctx err a
  -> AppM ctx otherErrors (Aff (Either (Variant err) a))
unliftAff appM = do
  ctx <- ask
  pure $ runReader ctx appM

-- | Useful when constructing a callback of type `Aff` or `Effect` within the 
-- | context of an AppM computation
-- | ```purescript
-- | uploadDOMDOM ∷ (SerialisedDOM -> Aff _) <- do 
-- |   AppM.unliftAffFn $ uploadDOMSnapshot
-- | ```
unliftAffFn
  ∷ ∀ ctx arg otherErrors a
   . (arg -> AppM ctx () a)
  -> AppM ctx otherErrors (arg -> Aff a)
unliftAffFn appM = do
  ctx <- ask
  pure \arg -> do
    runReader ctx (appM arg) <#> either case_ identity

-- | Invoke this function in the end and handle all possible errors, e.g.
-- | ```purescript
-- | runAppM { token: "123" } { someError: \e -> handleTheError e } someApp
-- | ```
runAppM
  ∷ ∀ ctx r rl err_ err a
   . RowToList r rl
  => VariantMatchCases rl err_ (Aff a)
  => Union err_ () err
  => ctx
  -> Record r
  -> AppM ctx err a
  -> Aff a
runAppM ctx errorHandlers (AppM app) = do
  ExceptV.handleErrors errorHandlers $ runReaderT app ctx

-- | Manually add some fields to the context of a computation.
-- | This function is useful when already inside a `do` block of an `AppM`
-- | and you want to call a function that requires some `ctx` that you obtained
-- | within this `do` block. For example:
-- | ```purescript
-- | do
-- |  moreCtx <- getSomeData :: AppM {} _
-- |  getMoreData :: AppM { moreCtx :: _ } _ # widenCtx { moreCtx }
-- | ```
widenCtx
  ∷ ∀ err additionalCtx ctx widerCtx
   . Union additionalCtx ctx widerCtx
  => Nub widerCtx widerCtx
  => { | additionalCtx }
  -> AppM { | widerCtx } err
       ~> AppM { | ctx } err
widenCtx toUnion (AppM (appM)) =
  AppM
    (withReaderT (disjointUnion toUnion) appM)

-- Instances for the AppM type
derive instance Newtype (AppM ctx err a) _
derive newtype instance Functor (AppM ctx err)
derive newtype instance Applicative (AppM ctx err)
derive newtype instance Apply (AppM ctx err)
derive newtype instance Bind (AppM ctx err)
derive newtype instance Monad (AppM ctx err)
derive newtype instance MonadEffect (AppM ctx err)
derive newtype instance MonadAff (AppM ctx err)
derive newtype instance MonadAsk ctx (AppM ctx err)
derive newtype instance MonadReader ctx (AppM ctx err)
derive newtype instance MonadThrow (Variant err) (AppM ctx err)
derive newtype instance MonadError (Variant err) (AppM ctx err)

--   liftAff = fromAff
-- | Helper class to make throwing errors easier
class VariantInjTagged a b | a -> b where
  injTagged ∷ Record a -> Variant b

instance variantInjTagged ∷
  ( RowToList r1 (RL.Cons sym a RL.Nil)
  , R.Cons sym a () r1
  , R.Cons sym a rx r2
  , IsSymbol sym
  ) =>
  VariantInjTagged r1 r2 where
  injTagged = inj (Proxy ∷ Proxy sym) <<< get (Proxy ∷ Proxy sym)
