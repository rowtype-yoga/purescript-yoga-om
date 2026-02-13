-- @inline export tap arity=2
-- @inline export tapM arity=2
-- @inline export note arity=2
-- @inline export fromAff arity=1
-- @inline export runOm arity=2
-- @inline export toOm arity=1
-- @inline export onError arity=2
-- @inline export mapError arity=2
module Yoga.Om
  ( Om(..)
  , ParOm(..)
  , delay
  , error
  , expand
  , expandCtx
  , expandErr
  , fromAff
  , handleErrors
  , mapError
  , onError
  , handleErrors'
  , launchOm
  , launchOm_
  , note
  , noteM
  , parOmToAff
  , race
  , inParallel
  , readerT
  , runOm
  , runReader
  , tap
  , tapM
  , throw
  , throwLeftAs
  , throwLeftAsM
  , class ToOm
  , toOm
  , unliftAff
  , unliftAffFn
  , widenCtx
  , module Control.Monad.Reader.Trans
  ) where

import Prelude

import Control.Alt (class Alt, (<|>))
import Control.Alternative (class Alternative, class Plus)
import Control.Monad.Error.Class (class MonadError, class MonadThrow, throwError, try)
import Control.Monad.Except.Trans (lift)
import Control.Monad.Reader (class MonadAsk, class MonadReader)
import Control.Monad.Reader.Trans (ask, asks)
import Control.Monad.Rec.Class (class MonadRec)
import Control.Parallel (class Parallel, parOneOf, parSequence, parallel, sequential)
import Control.Plus (empty)
import Data.Either (Either(..), either)
import Data.Maybe (Maybe(..), maybe)
import Data.Newtype (class Newtype)
import Data.Time.Duration (class Duration, fromDuration)
import Data.Tuple.Nested ((/\))
import Data.Variant (class VariantMatchCases, Variant, case_, match, on, onMatch)
import Data.Variant as Variant
import Effect (Effect)
import Effect.AVar (AVar)
import Effect.Aff (Aff, Fiber, ParAff, forkAff, launchAff, supervise)
import Effect.Aff as Aff
import Effect.Aff.AVar as AVar
import Effect.Aff.Class (class MonadAff, liftAff)
import Effect.Class (class MonadEffect, liftEffect)
import Effect.Exception (Error)
import Data.Symbol (class IsSymbol)
import Prim.Row (class Cons, class Nub, class Union)
import Type.Proxy (Proxy(..))
import Prim.RowList (class RowToList, RowList)
import Record (disjointUnion)
import Record.Studio (class Keys, shrink)
import Uncurried.RWSET (RWSET, hoistRWSET, runRWSET, rwseT, withRWSET)
import Unsafe.Coerce (unsafeCoerce)
import Yoga.Om.Error (Exception, OneOfTheseErrors, exception, getParallelError, newParallelError, parallelErrorToError, toParallelError, class SingletonVariantRecord, singletonRecordToVariant)

-- | A generic type for handling computations
-- | It combines asynchronous side-effecting computations with `Aff`,
-- | "dependency injection" via `ReaderT` which tracks a context, and
-- | checked exceptions and early return with `ExceptV`.
newtype Om ctx err a = Om
  (RWSET ctx Unit Unit (Variant (exception ∷ Error | err)) Aff a)

-- Instances for the Om type
derive instance Newtype (Om ctx err a) _
derive newtype instance Functor (Om ctx err)
derive newtype instance Applicative (Om ctx err)
derive newtype instance Apply (Om ctx err)
derive newtype instance Bind (Om ctx err)
derive newtype instance Monad (Om ctx err)
instance MonadEffect (Om ctx err) where
  liftEffect = liftEffect >>> fromAff

instance MonadAff (Om ctx err) where
  liftAff = fromAff

derive newtype instance MonadAsk ctx (Om ctx err)
derive newtype instance MonadReader ctx (Om ctx err)
derive newtype instance MonadThrow (Variant (Exception err)) (Om ctx err)
derive newtype instance MonadError (Variant (Exception err)) (Om ctx err)
derive newtype instance MonadRec (Om ctx err)
derive newtype instance Semigroup a ⇒ Semigroup (Om ctx err a)
derive newtype instance Alt (Om ctx err)

instance Plus (Om ctx err) where
  empty = fromAff (throwError $ (Aff.error "Always fails"))

throw
  ∷ ∀ m err errors a
  . SingletonVariantRecord err errors
  ⇒ MonadThrow (OneOfTheseErrors errors) m
  ⇒ Record err
  → m a
throw = throwError <<< error

error
  ∷ ∀ err errors
   . SingletonVariantRecord err errors
  => Record err
  -> OneOfTheseErrors errors
error = singletonRecordToVariant

-- | Run multiple `Om` computations in parallel, and return the fastest
-- | To collect all results, use `inParallel` instead
race :: forall ctx e a. Array (Om ctx e a) -> Om ctx e a
race = parOneOf

-- | Run multiple `Om`s in parallel, and collect all results
-- | To only take the fastest result, use `race`
inParallel :: forall ctx e a. Array (Om ctx e a) -> Om ctx e (Array a)
inParallel = parSequence

delay :: forall m d. MonadAff m => Duration d => d -> m Unit
delay = liftAff <<< Aff.delay <<< fromDuration

-- | Tap into a value for side effects (logging, debugging, etc.)
-- | Returns the original value unchanged
-- | ```purescript
-- | users <- getUsers
-- |   # tap \u -> log $ "Got " <> show (length u) <> " users"
-- | ```
tap :: forall ctx err a. (a -> Om ctx err Unit) -> a -> Om ctx err a
tap f a = f a $> a

-- | Monadic version of tap - useful when the tapping function is effectful
-- | ```purescript
-- | user <- getUser userId
-- |   # tapM \u -> logUser u
-- | ```
tapM :: forall ctx err a. (a -> Om ctx err Unit) -> Om ctx err a -> Om ctx err a
tapM f ma = ma >>= \a -> f a $> a

-- | Turns a `Nothing` into an exception which reduces nesting and encourages
-- | tracking what actually went wrong
-- | e.g.
-- | ```purescript
-- |   do
-- |     let maybeCached = Object.lookup key cache :: Maybe a
-- |     cached :: a <- maybeCached # Om.note (unexpectedCacheMiss key)
-- | ```
note
  ∷ ∀ m err errors a
  . SingletonVariantRecord err errors
  ⇒ MonadThrow (OneOfTheseErrors errors) m
  ⇒ Record err
  → Maybe a
  → m a
note err = maybe (throw err) pure

noteM ∷ ∀ err m a. MonadThrow err m ⇒ m err → Maybe a → m a
noteM err = maybe (throwError =<< err) pure

-- | Turns a `Left a` into an exception which reduces nesting
throwLeftAs
  ∷ ∀ err m left right
  . MonadThrow err m
  ⇒ (left → err)
  → Either left right
  → m right
throwLeftAs toError = either (throwError <<< toError) pure

-- | Turns a `Left a` into an exception which reduces nesting
throwLeftAsM
  ∷ ∀ err m left right
  . MonadThrow err m
  ⇒ (left → m err)
  → Either left right
  → m right
throwLeftAsM toError = either (throwError <=< toError) pure

-- | Turn any `Aff` into an `Om`.
-- | Because `Aff` can throw exceptions of type `Error`, a possible such
-- | exception is captured in the `exception` branch of the error variant
fromAff ∷ ∀ ctx a err. Aff a → Om ctx err a
fromAff e =
  Om (lift (try e))
    >>= either (throw <<< { exception: _ }) pure

handleErrors'
  ∷ ∀ ctx err1 err2 a
  . (Variant (Exception err1) → Om ctx err2 a)
  → Om ctx err1 a
  → Om ctx err2 a
handleErrors' handle (Om om) = do
  ctx ← ask
  result ← runRWSET ctx unit om <#> (\(_ /\ v /\ _) → v) # fromAff
  case result of
    Left err → handle err
    Right r → pure r

handleErrors
  ∷ ∀ ctx errIn errOut a
      (handlersRL ∷ RowList Type)
      (handlers ∷ Row Type)
      (handled ∷ Row Type)
  . RowToList handlers handlersRL
  ⇒ VariantMatchCases handlersRL handled (Om ctx errOut a)
  ⇒ Union handled (exception ∷ Error | errOut) (exception ∷ Error | errIn)
  ⇒ Record handlers
  → Om ctx errIn a
  → Om ctx errOut a
handleErrors cases (Om om) = do
  ctx ← ask
  err ← liftAff ((\(_ /\ v /\ _) → v) <$> (runRWSET ctx unit om))
  err # either (onMatch cases throwError) pure

mapError
  :: forall @from @to tyIn tyOut ctx errIn errMid errOut a
   . IsSymbol from
  => IsSymbol to
  => Cons from tyIn (exception :: Error | errMid) (exception :: Error | errIn)
  => Cons to tyOut (exception :: Error | errMid) (exception :: Error | errOut)
  => (tyIn -> tyOut)
  -> Om ctx errIn a
  -> Om ctx errOut a
mapError f = handleErrors' \variant ->
  variant # on (Proxy :: Proxy from)
    (throwError <<< Variant.inj (Proxy :: Proxy to) <<< f)
    (throwError <<< unsafeCoerce)

onError
  :: forall @label ty ctx errIn errOut a
   . IsSymbol label
  => Cons label ty (exception :: Error | errOut) (exception :: Error | errIn)
  => (ty -> Om ctx errOut a)
  -> Om ctx errIn a
  -> Om ctx errOut a
onError handler = handleErrors' \variant ->
  variant # on (Proxy :: Proxy label) handler throwError

-- | When you have a function that can throw a subset of the errors of the ones
-- | you could throw in a do block, `expand` allows to make them compatible

expandErr ∷ ∀ ctx lt more gt. Union lt more gt ⇒ Om ctx lt ~> Om ctx gt
expandErr = unsafeCoerce

-- | When you have a function that requires a closed subset of the context of
-- | the one you're operating in, `expandCtx` allows to call this function in a
-- | do block, e.g.:
-- | ```purescript
-- | let
-- |   otherComp :: Om { a :: A } _ _
-- |   otherComp = ...
-- |   myComp :: Om { a :: A, b :: B } _ _
-- |   myComp = do
-- |      ...
-- |      otherComp # expandCtx
-- | ```
expandCtx
  ∷ ∀ lt more gt err
  . Union lt more gt
  ⇒ Keys lt
  ⇒ Om { | lt } err ~>
      Om { | gt } err
expandCtx (Om om) = Om (withRWSET (\r s → shrink r /\ s) om)

expand
  :: forall eSmall e_ eLarge a cSmall c_ cLarge
   . Union eSmall e_ eLarge
  => Union cSmall c_ cLarge
  => Keys cSmall
  => Om { | cSmall } eSmall a
  -> Om { | cLarge } eLarge a
expand = expandErr <<< expandCtx

-- | Launches an error free Om
launchOm
  ∷ ∀ ctx r rl err_ err a
   . RowToList (exception ∷ Error → Aff a | r) rl
  ⇒ VariantMatchCases rl err_ (Aff a)
  ⇒ Union err_ () (Exception err)
  ⇒ ctx
  → { exception ∷ Error → Aff a | r }
  -> Om ctx err a
  -> Effect (Fiber a)
launchOm ctx handlers om =
  launchAff (runOm ctx handlers om)

-- | Launches an error free Om
launchOm_
  ∷ ∀ ctx r rl err_ err
   . RowToList (exception ∷ Error → Aff Unit | r) rl
  ⇒ VariantMatchCases rl err_ (Aff Unit)
  ⇒ Union err_ () (Exception err)
  ⇒ ctx
  → { exception ∷ Error → Aff Unit | r }
  -> Om ctx err Unit
  -> Effect Unit
launchOm_ ctx handlers om =
  void (launchOm ctx handlers om)

-- | Invoke this function in the end after handling all possible errors, e.g.
-- | ```purescript
-- | runOm_ { token: "123" } someApp
-- | ```

-- runOm_ ∷ ∀ ctx a. ctx → Om ctx () a → Aff a
-- runOm_ ctx (Om app) = runRWSET ctx unit app >>= case _ of
--   (_ /\ Right r /\ _) → pure r
--   (_ /\ Left err /\ _) → err # match { exception: throwError }

-- | Removes the ReaderT part and makes the errors explicit
-- | ```purescript
-- | runReader { token: "123" } someApp
-- | ```
runReader
  ∷ ∀ ctx err a. ctx → Om ctx err a → Aff (Either (Variant (Exception err)) a)
runReader ctx om =
  runOm ctx { exception: \exception -> pure (Left (error { exception })) }
    $ handleErrors' (pure <<< Left)
    $ (Right <$> om)

-- | Useful when constructing a *parameterless* callback of type `Aff` or
-- | `Effect` within the context of an Om computation
-- | ```purescript
-- | recordAndUploadDOM ∷ Aff _ <- do
-- |   Om.unliftAff $ serialiseDOM >>= uploadDOMSnapshot
-- | ```
unliftAff
  ∷ ∀ ctx err otherErrors a
  . Om ctx err a
  → Om ctx otherErrors (Aff (Either (Variant (Exception err)) a))
unliftAff om = ado ctx ← ask in runReader ctx om

-- | Useful when constructing a callback of type `Aff` or `Effect` within the
-- | context of an Om computation
-- | ```purescript
-- | uploadDOM ∷ (SerialisedDOM -> Aff _) <- do
-- |   Om.unliftAffFn $ uploadDOMSnapshot
-- | ```
unliftAffFn
  ∷ ∀ ctx arg errors a
  . (arg → Om ctx () a)
  → Om ctx errors (arg → Aff a)
unliftAffFn om = do
  ctx ← ask
  pure \arg → do
    runReader ctx (om arg) >>= either
      (case_ # on exception (\e → throwError e))
      pure

-- | Invoke this function in the end and handle all possible errors, e.g.
-- | ```purescript
-- | runOm { token: "123" } { someError: \e -> handleTheError e } someApp
-- | ```
runOm
  ∷ ∀ ctx r rl err_ err a
  . RowToList (exception ∷ Error → Aff a | r) rl
  ⇒ VariantMatchCases rl err_ (Aff a)
  ⇒ Union err_ () (Exception err)
  ⇒ ctx
  → { exception ∷ Error → Aff a | r }
  → Om ctx err a
  → Aff a
runOm ctx errorHandlers (Om app) = do
  runRWSET ctx unit app >>= case _ of
    (_ /\ Right r /\ _) → pure r
    (_ /\ Left err /\ _) → err # match errorHandlers

class ToOm :: (Type -> Type) -> Constraint
class ToOm f where
  toOm :: forall ctx err a. f a -> Om ctx err a

instance ToOm Effect where
  toOm = liftEffect

instance ToOm Aff where
  toOm = liftAff

-- | Manually add some fields to the context of a computation.
-- | This function is useful when already inside a `do` block of an `Om`
-- | and you want to call a function that requires some `ctx` that you obtained
-- | within this `do` block. For example:
-- | ```purescript
-- | do
-- |  moreCtx <- getSomeData :: Om {} _
-- |  getMoreData :: Om { moreCtx :: _ } _ # widenCtx { moreCtx }
-- | ```
widenCtx
  ∷ ∀ err additionalCtx ctx widerCtx
  . Union additionalCtx ctx widerCtx
  ⇒ Nub widerCtx widerCtx
  ⇒ { | additionalCtx }
  → Om { | widerCtx } err
      ~> Om { | ctx } err
widenCtx toUnion (Om (om)) =
  Om (withRWSET (\r _ → disjointUnion toUnion r /\ unit) om)

-- Parallel computations
newtype ParOm ctx err a = ParOm
  (RWSET ctx Unit Unit (Variant (exception ∷ Error | err)) ParAff a)

derive newtype instance Functor (ParOm ctx err)
instance
  Apply (ParOm ctx err) where
  apply f a = do
    ParOm $ readerT \ctx → parallel $ supervise do
      functionVar ← AVar.empty
      valueVar ← AVar.empty
      void $ forkAff $ runOrKillBoth ctx functionVar valueVar f
      void $ forkAff $ runOrKillBoth ctx valueVar functionVar a
      function ← AVar.take functionVar
      value ← AVar.take valueVar
      pure (Right (function value))
    where

    runOrKillBoth
      ∷ ∀ a b. ctx → AVar a → AVar b → (ParOm ctx err a) → Aff Unit
    runOrKillBoth ctx resultVar otherVar comp = do
      res ← parOmToAff ctx comp
      case res of
        Right result → resultVar # AVar.put result
        Left e →
          e # newParallelError # parallelErrorToError # \err → do
            otherVar # AVar.kill err
            resultVar # AVar.kill err

instance Applicative (ParOm ctx err) where
  pure v = ParOm (readerT \_ → pure (Right v))

readerT
  ∷ ∀ m err r a
  . Functor m
  ⇒ (r → m (Either (Variant err) a))
  → RWSET r Unit Unit (Variant err) m a
readerT k = rwseT
  \r _ → k r <#> (\x → unit /\ x /\ unit)

parOmToAff
  ∷ ∀ ctx err a
  . ctx
  → ParOm ctx err a
  → Aff (Either (Variant (exception ∷ Error | err)) a)
parOmToAff ctx (ParOm par) = (\(_ /\ v /\ _) → v) <$>
  runRWSET ctx unit
    ( hoistRWSET
        sequential
        par
    )

instance Parallel (ParOm ctx err) (Om ctx err) where
  sequential ∷ ParOm ctx err ~> Om ctx err
  sequential par =
    Om
      ( readerT \ctx →
          ( do
              resultVar ← AVar.empty
              void $ forkAff do
                res ← try $ parOmToAff ctx par
                case res of
                  Right good → AVar.put good resultVar
                  Left e | Just pe ← toParallelError e → do
                    AVar.put (Left (getParallelError pe)) resultVar
                  Left e → throwError e
              AVar.take resultVar
          )
      )

  -- [FIXME]: I think this is just unsafeCoerce
  parallel (Om seq) = do
    ParOm $ readerT \ctx →
      (parallel ∷ Aff ~> ParAff)
        $ (runRWSET ctx unit seq <#> (\(_ /\ v /\ _) → v))

instance Alt (ParOm ctx err) where
  alt x y = ParOm $ readerT \ctx →
    ( parallel $ do
        res ← parOmToAff ctx x
        res # either throwOut (pure <<< Right)
    ) <|>
      ( parallel $ do
          res ← parOmToAff ctx y
          res # either throwOut (pure <<< Right)
      )
    where
    throwOut ∷ ∀ a. Variant (Exception err) → Aff a
    throwOut e = throwError (parallelErrorToError (newParallelError e))

instance Plus (ParOm ctx err) where
  empty = parallel empty

instance Alternative (ParOm ctx err)
