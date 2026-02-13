-- @inline export new arity=1
-- @inline export read arity=1
-- @inline export modify' arity=2
-- @inline export modify arity=2
-- @inline export modify_ arity=2
-- @inline export write arity=2
module Yoga.Om.Ref
  ( module Effect.Ref
  , new
  , read
  , modify'
  , modify
  , modify_
  , write
  ) where

import Prelude

import Effect.Class (class MonadEffect, liftEffect)
import Effect.Ref (Ref)
import Effect.Ref as Ref

new :: forall m s. MonadEffect m => s -> m (Ref s)
new = liftEffect <<< Ref.new

read :: forall m s. MonadEffect m => Ref s -> m s
read = liftEffect <<< Ref.read

modify' :: forall m s b. MonadEffect m => (s -> { state :: s, value :: b }) -> Ref s -> m b
modify' f = liftEffect <<< Ref.modify' f

modify :: forall m s. MonadEffect m => (s -> s) -> Ref s -> m s
modify f = liftEffect <<< Ref.modify f

modify_ :: forall m s. MonadEffect m => (s -> s) -> Ref s -> m Unit
modify_ f = liftEffect <<< Ref.modify_ f

write :: forall m s. MonadEffect m => s -> Ref s -> m Unit
write s = liftEffect <<< Ref.write s
