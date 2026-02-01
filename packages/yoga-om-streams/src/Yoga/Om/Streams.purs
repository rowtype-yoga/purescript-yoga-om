module Yoga.Om.Streams
  ( omToEvent
  , eventToOm
  , streamOms
  , raceEvents
  , filterMapOm
  , foldOms
  , EventOmCanceller
  , withEventStream
  ) where

import Prelude

import Control.Alt ((<|>))
import Data.Either (Either(..), either)
import Data.Foldable (foldr)
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Data.Variant (Variant)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Class (liftEffect)
import Effect.Exception (Error)
import Effect.Ref as Ref
import FRP.Event (Event, makeEvent, subscribe)
import FRP.Event as Event
import Prim.Row (class Union)
import Prim.RowList (class RowToList)
import Type.Row (type (+))
import Data.Variant (class VariantMatchCases)
import Yoga.Om (Om)
import Yoga.Om as Om

-- | A canceller for event-based Om operations
type EventOmCanceller = Effect Unit

-- | Convert an Om computation to a Bolson Event
-- | The event fires once when the Om completes successfully
-- | Errors are handled by the provided error handler in the context
omToEvent
  :: forall ctx r rl err_ err a
   . RowToList (exception :: Error -> Aff a | r) rl
  => VariantMatchCases rl err_ (Aff a)
  => Union err_ () (exception :: Error | err)
  => ctx
  -> { exception :: Error -> Aff a | r }
  -> Om ctx err a
  -> Event a
omToEvent ctx handlers om = makeEvent \push -> do
  _ <- launchAff_ do
    result <- Om.runOm ctx handlers om
    liftEffect $ push result
  pure (pure unit)

-- | Convert a Bolson Event stream to an Om computation
-- | Takes the first value emitted by the event
eventToOm
  :: forall ctx err a
   . Event a
  -> Om ctx err a
eventToOm event = Om.fromAff do
  resultRef <- liftEffect $ Ref.new Nothing
  canceller <- liftEffect $ subscribe event \value -> do
    Ref.write (Just value) resultRef
  
  -- Wait for the first value
  let
    checkValue = do
      maybeValue <- liftEffect $ Ref.read resultRef
      case maybeValue of
        Just value -> do
          liftEffect canceller
          pure value
        Nothing -> checkValue
  checkValue

-- | Stream multiple Om computations as events
-- | Creates an event that fires for each Om that completes
streamOms
  :: forall ctx r rl err_ err a
   . RowToList (exception :: Error -> Aff a | r) rl
  => VariantMatchCases rl err_ (Aff a)
  => Union err_ () (exception :: Error | err)
  => ctx
  -> { exception :: Error -> Aff a | r }
  -> Array (Om ctx err a)
  -> Event a
streamOms ctx handlers oms = 
  foldr (\om acc -> omToEvent ctx handlers om <|> acc) 
    (Event.makeEvent \_ -> pure (pure unit)) 
    oms

-- | Race multiple events, taking the first successful one
-- | Similar to Om's race but for events
raceEvents
  :: forall a
   . Array (Event a)
  -> Event a
raceEvents events = 
  foldr (<|>) 
    (Event.makeEvent \_ -> pure (pure unit)) 
    events

-- | Filter and map an Om computation based on event values
filterMapOm
  :: forall ctx r rl err_ err a b
   . RowToList (exception :: Error -> Aff (Maybe b) | r) rl
  => VariantMatchCases rl err_ (Aff (Maybe b))
  => Union err_ () (exception :: Error | err)
  => (a -> Om ctx err (Maybe b))
  -> ctx
  -> { exception :: Error -> Aff (Maybe b) | r }
  -> Event a
  -> Event b
filterMapOm f ctx handlers event = makeEvent \push -> do
  subscribe event \value -> do
    launchAff_ do
      result <- Om.runOm ctx handlers (f value)
      case result of
        Just b -> liftEffect $ push b
        Nothing -> pure unit

-- | Fold over Om computations triggered by events
foldOms
  :: forall ctx r rl err_ err a b
   . RowToList (exception :: Error -> Aff b | r) rl
  => VariantMatchCases rl err_ (Aff b)
  => Union err_ () (exception :: Error | err)
  => (b -> a -> Om ctx err b)
  -> b
  -> ctx
  -> { exception :: Error -> Aff b | r }
  -> Event a
  -> Event b
foldOms f initial ctx handlers event = makeEvent \push -> do
  accRef <- Ref.new initial
  subscribe event \value -> do
    launchAff_ do
      currentAcc <- liftEffect $ Ref.read accRef
      newAcc <- Om.runOm ctx handlers (f currentAcc value)
      liftEffect do
        Ref.write newAcc accRef
        push newAcc

-- | Helper to work with event streams within an Om context
-- | Provides a clean way to integrate event-driven logic
withEventStream
  :: forall ctx err a b
   . Event a
  -> (a -> Om ctx err b)
  -> Om ctx err (Event b)
withEventStream event f = do
  ctx <- Om.ask
  pure $ makeEvent \push -> do
    subscribe event \value -> do
      launchAff_ do
        -- Run the Om with the current context
        -- Note: Error handling needs to be provided by the caller
        result <- Om.runReader ctx (f value)
        either (const $ pure unit) (\r -> liftEffect $ push r) result
