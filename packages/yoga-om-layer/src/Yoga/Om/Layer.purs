-- @inline export makeLayer arity=1
-- @inline export runLayer arity=2
module Yoga.Om.Layer 
  ( OmLayer(..)
  , makeLayer
  , runLayer
  , combineRequirements
  , provide
  , (>->)
  , class CheckAllProvided
  , class CheckAllLabelsExist
  , class CheckLabelExists
  ) where

import Prelude

import Data.Newtype (class Newtype)
import Effect.Aff.Class (liftAff)
import Prim.Row (class Nub, class Union)
import Prim.RowList (class RowToList, Cons, Nil, RowList)
import Prim.TypeError (class Fail, Above, Quote, Text)
import Record as Record
import Record.Studio (class Keys)
import Type.Equality (class TypeEquals)
import Unsafe.Coerce (unsafeCoerce)
import Yoga.Om (Om)
import Yoga.Om as Om

-- | A layer that requires dependencies (req) and provides services (prov)
newtype OmLayer req prov err = OmLayer (Om (Record req) err (Record prov))

derive instance Newtype (OmLayer req prov err) _

-- | Helper to create a layer from an Om computation
makeLayer :: forall req prov err. Om (Record req) err (Record prov) -> OmLayer req prov err
makeLayer = OmLayer

-- =============================================================================
-- Custom Type Errors for Missing Dependencies
-- =============================================================================

-- | Check if all required dependencies are provided
-- If not, show a helpful diff of required vs available
class CheckAllProvided (required :: Row Type) (available :: Row Type)

instance checkAllProvidedImpl ::
  ( RowToList required reqList
  , RowToList available availList
  , CheckAllLabelsExist reqList availList required available
  ) =>
  CheckAllProvided required available

-- | Check that all labels in required RowList exist in available RowList
-- Pass along the original rows for better error messages
class CheckAllLabelsExist (required :: RowList Type) (available :: RowList Type) (requiredRow :: Row Type) (availableRow :: Row Type)

-- Base case: no more requirements to check
instance checkAllLabelsNil :: CheckAllLabelsExist Nil available requiredRow availableRow

-- Recursive case: check if this label exists, then check the rest
instance checkAllLabelsCons ::
  ( CheckLabelExists label ty available requiredRow availableRow
  , CheckAllLabelsExist tail available requiredRow availableRow
  ) =>
  CheckAllLabelsExist (Cons label ty tail) available requiredRow availableRow

-- | Check if a single label exists in the available RowList
-- This is where the magic happens - we dispatch on RowList structure in the instance head!
class CheckLabelExists (label :: Symbol) (ty :: Type) (available :: RowList Type) (requiredRow :: Row Type) (availableRow :: Row Type)

-- Found it! The label matches in the instance head
-- TypeEquals ensures the types at this label actually match!
instance checkLabelExistsFound ::
  TypeEquals ty ty' =>
  CheckLabelExists label ty (Cons label ty' tail) requiredRow availableRow

-- Keep looking: different label, recurse on tail
else instance checkLabelExistsKeepLooking ::
  CheckLabelExists label ty tail requiredRow availableRow =>
  CheckLabelExists label ty (Cons otherLabel otherTy tail) requiredRow availableRow

-- Not found: reached end of list, emit custom error WITH FULL CONTEXT!
else instance checkLabelExistsNotFound ::
  Fail
    ( Above
        (Text "Missing required dependency!")
        (Above
          (Text "")
          (Above
            (Text "The first missing field is: ")
            (Above
              (Quote label)
              (Above
                (Text "")
                (Above
                  (Text "The layer requires: ")
                  (Above
                    (Quote requiredRow)
                    (Above
                      (Text "")
                      (Above
                        (Text "But you provided: ")
                        (Quote availableRow)
                      )
                    )
                  )
                )
              )
            )
          )
        )
    ) =>
  CheckLabelExists label ty Nil requiredRow availableRow

-- | Run a layer with a given context, with custom error if requirements aren't met
runLayer
  :: forall req prov err available
   . CheckAllProvided req available  -- ← Custom error if dependencies missing!
  => Record available
  -> OmLayer req prov err
  -> Om (Record available) err (Record prov)
runLayer _ctx layer = unsafeCastLayer layer
  where
  -- After CheckAllProvided succeeds, we know req ⊆ available at compile time
  -- So this cast is safe - we're just telling the type system what it already proved
  unsafeCastLayer :: OmLayer req prov err -> Om (Record available) err (Record prov)
  unsafeCastLayer = unsafeCoerce

-- | The key function: combine two layers with automatic deduplication
-- Given two layers with potentially overlapping requirements,
-- produce a layer with deduplicated requirements
-- 
-- Uses expand to properly widen contexts and errors, then runs both layers!
combineRequirements
  :: forall req1 req2 prov1 prov2 err1 err2 provMerged provMergedRaw reqMerged reqDeduped _req1 _req2 _err1 _err2
   . Union req1 req2 reqMerged
  => Nub reqMerged reqDeduped  -- ← Automatic deduplication of requirements!
  => Union req1 _req1 reqDeduped  -- req1 is subset of reqDeduped
  => Union req2 _req2 reqDeduped  -- req2 is subset of reqDeduped
  => Union err1 _err1 ()  -- Widen errors to empty
  => Union err2 _err2 ()
  => Union prov1 prov2 provMergedRaw  -- Merge provisions
  => Nub provMergedRaw provMerged  -- Deduplicate provisions too!
  => Keys req1  -- Needed for expand
  => Keys req2  -- Needed for expand
  => OmLayer req1 prov1 err1
  -> OmLayer req2 prov2 err2
  -> OmLayer reqDeduped provMerged ()
combineRequirements (OmLayer build1) (OmLayer build2) = makeLayer do
  -- Widen both contexts and errors to allow them to run in the deduplicated context
  -- expand allows an Om computation to run in a larger context with larger error row
  rec1 <- Om.expand build1  -- Om req1 err1 -> Om reqDeduped ()
  rec2 <- Om.expand build2  -- Om req2 err2 -> Om reqDeduped ()
  -- Merge the results (Record.merge handles the Nub)
  pure (Record.merge rec1 rec2)

-- Example proof that this works:
-- If we have:
--   layer1 :: OmLayer (config :: Config) (logger :: Logger) ()
--   layer2 :: OmLayer (config :: Config) (database :: Database) ()
-- 
-- Then: combineRequirements layer1 layer2
-- Has type: OmLayer (config :: Config) prov3 err3
--
-- NOT: OmLayer (config :: Config, config :: Config) prov3 err3
--
-- The duplicated requirement (config, config) is automatically
-- deduplicated to just (config) by the Nub constraint!

-- =============================================================================
-- Vertical Composition (ZLayer-style provide)
-- =============================================================================

-- | Vertical composition: feed output of one layer into input of another
-- | This is the >>> operator from ZIO ZLayer
-- | 
-- | Example:
-- |   postgresLive :: OmLayer (config :: Config) (postgres :: SQL) ()
-- |   userRepoLive :: OmLayer (postgres :: SQL) (userRepo :: UserRepo) ()
-- |   
-- |   composed = userRepoLive `provide` postgresLive
-- |   -- Result: OmLayer (config :: Config) (userRepo :: UserRepo) ()
provide
  :: forall req prov1 prov2 err1 err2 _req _prov1 _err1 _err2
   . Union req _req req            -- expand constraints
  => Union prov1 _prov1 prov1
  => Union err1 _err1 ()
  => Union err2 _err2 ()
  => Keys req
  => Keys prov1
  => OmLayer prov1 prov2 err2     -- layer that needs prov1, provides prov2
  -> OmLayer req prov1 err1       -- layer that needs req, provides prov1
  -> OmLayer req prov2 ()         -- composed: needs req, provides prov2
provide (OmLayer layer2) (OmLayer layer1) = makeLayer do
  -- Run first layer to get prov1
  prov1 <- Om.expand layer1
  
  -- Run second layer with prov1 as context
  liftAff $ Om.runOm prov1
    { exception: \_ -> pure (unsafeCoerce {}) }
    (Om.expand layer2)

infixl 9 provide as >->

-- TODO: More sophisticated composition operators
-- For now, use >>> for simple chains and combineRequirements for parallel deps
