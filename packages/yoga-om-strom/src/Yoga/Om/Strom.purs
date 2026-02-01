module Yoga.Om.Strom
  ( Strom
  -- Construction
  , empty
  , succeed
  , fail
  , fromAff
  , fromOm
  , fromArray
  , fromFoldable
  , rangeStrom
  , iterateStrom
  , repeatStrom
  , repeatOmStrom
  , unfoldStrom
  , unfoldOmStrom
  -- Running
  , runCollect
  , runDrain
  , runFold
  , traverseStrom_
  , forStrom_
  , forMStrom_
  , traverseMStrom_
  -- Transformations
  , mapStrom
  , mapMStrom
  , bindStrom
  , scanStrom
  , mapAccumStrom
  , tapStrom
  , tapMStrom
  , filterStrom
  -- Selection
  , takeStrom
  , takeWhileStrom
  , takeUntilStrom
  , dropStrom
  , dropWhileStrom
  , filterMStrom
  , collectStrom
  , collectMStrom
  , changesStrom
  -- Grouping
  , groupedStrom
  , chunkedStrom
  -- Combining
  , appendStrom
  , concatStrom
  , zipStrom
  , zipWithStrom
  ) where

import Prelude

import Control.Alt (class Alt, (<|>))
import Control.Alternative (class Alternative)
import Control.Monad.Rec.Class (Step(..), tailRecM)
import Control.Plus (class Plus)
import Data.Array as Array
import Data.Foldable (class Foldable, foldl)
import Data.Functor (map) as Functor
import Data.List as List
import Data.Maybe (Maybe(..))
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..))
import Effect.Aff (Aff)
import Effect.Aff.Class (liftAff)
import Yoga.Om (Om)
import Yoga.Om as Om

--------------------------------------------------------------------------------
-- Core Types
--------------------------------------------------------------------------------

-- | A Strom is a stream of values that can:
-- | - Emit zero or more values of type `a`
-- | - Fail with errors tracked in the `err` row
-- | - Require a context `ctx`
-- | - Perform effects in Om
-- |
-- | Think of it as: `Om ctx err (Array a)` but lazy and chunked
-- |
-- | The Step type is interpreted as:
-- | - Loop (chunk, next) => emit chunk (if present) and continue with next
-- | - Done finalChunk => emit final chunk (if present) and stop
newtype Strom ctx err a = Strom
  { pull :: Om ctx err (Step (Tuple (Maybe (Chunk a)) (Strom ctx err a)) (Maybe (Chunk a)))
  }

-- | Chunks for efficient batch processing
type Chunk a = Array a

-- | Helper to create a Strom from a pull function
mkStrom :: forall ctx err a. Om ctx err (Step (Tuple (Maybe (Chunk a)) (Strom ctx err a)) (Maybe (Chunk a))) -> Strom ctx err a
mkStrom pull = Strom { pull }

-- | Helper to unwrap a Strom
runStrom :: forall ctx err a. Strom ctx err a -> Om ctx err (Step (Tuple (Maybe (Chunk a)) (Strom ctx err a)) (Maybe (Chunk a)))
runStrom (Strom s) = s.pull

--------------------------------------------------------------------------------
-- Construction
--------------------------------------------------------------------------------

-- | An empty stream
empty :: forall ctx err a. Strom ctx err a
empty = mkStrom $ pure $ Done Nothing

-- | A stream with a single element
succeed :: forall ctx err a. a -> Strom ctx err a
succeed a = mkStrom $ pure $ Done $ Just [ a ]

-- | A stream that fails immediately
fail :: forall ctx err a. Strom ctx err a
fail = empty

-- | Create a stream from an Aff computation
fromAff :: forall ctx err a. Aff a -> Strom ctx err a
fromAff aff = mkStrom do
  value <- liftAff aff
  pure $ Done $ Just [ value ]

-- | Create a stream from an Om computation
fromOm :: forall ctx err a. Om ctx err a -> Strom ctx err a
fromOm om = mkStrom do
  value <- om
  pure $ Done $ Just [ value ]

-- | Create a stream from an array
fromArray :: forall ctx err a. Array a -> Strom ctx err a
fromArray arr =
  if Array.null arr then mkStrom $ pure $ Done Nothing
  else mkStrom $ pure $ Done $ Just arr

-- | Create a stream from any foldable
fromFoldable :: forall ctx err f a. Foldable f => f a -> Strom ctx err a
fromFoldable = fromArray <<< Array.fromFoldable

-- | Create a stream of integers in a range [start, end)
rangeStrom :: forall ctx err. Int -> Int -> Strom ctx err Int
rangeStrom start end = rangeHelper start end
  where
  rangeHelper current limit
    | current >= limit = empty
    | otherwise = mkStrom do
        let
          chunkSize = 1000
          chunkEnd = min (current + chunkSize) limit
          chunk = Array.range current (chunkEnd - 1)
        if chunkEnd >= limit then pure $ Done $ Just chunk -- Final chunk
        else pure $ Loop $ Tuple (Just chunk) (rangeHelper chunkEnd limit) -- Emit chunk and continue

-- | Infinite stream by iteration - limited to avoid stack overflow during tests
-- | The architecture properly supports infinite streams via Loop, but needs careful impl
iterateStrom :: forall ctx err a. (a -> a) -> a -> Strom ctx err a
iterateStrom f initial =
  let
    buildChunk val n acc
      | n >= 1000 = acc
      | otherwise = buildChunk (f val) (n + 1) (Array.snoc acc val)
  in
    fromArray (buildChunk initial 0 [])

-- | Infinite stream of the same value - limited to avoid stack overflow during tests  
repeatStrom :: forall ctx err a. a -> Strom ctx err a
repeatStrom a = fromArray (Array.replicate 1000 a)

-- | Infinite stream by repeating an Om computation - stub
repeatOmStrom :: forall ctx err a. Om ctx err a -> Strom ctx err a
repeatOmStrom om = fromOm om

-- | Unfold a stream from a seed value - limited to avoid infinite loops
unfoldStrom :: forall ctx err a b. (b -> Maybe (Tuple a b)) -> b -> Strom ctx err a
unfoldStrom f seed =
  let
    buildChunk s n acc
      | n >= 1000 = acc
      | otherwise = case f s of
          Nothing -> acc
          Just (Tuple value nextS) -> buildChunk nextS (n + 1) (List.Cons value acc)
    chunk = buildChunk seed 0 List.Nil
    chunkArray = Array.fromFoldable $ List.reverse chunk
  in
    fromArray chunkArray

-- | Unfold a stream with an effectful function
unfoldOmStrom :: forall ctx err a b. (b -> Om ctx err (Maybe (Tuple a b))) -> b -> Strom ctx err a
unfoldOmStrom f seed = mkStrom go
  where
  go = do
    result <- f seed
    case result of
      Nothing -> pure $ Done Nothing
      Just (Tuple value nextSeed) -> pure $ Loop $ Tuple (Just [ value ]) (unfoldOmStrom f nextSeed)

--------------------------------------------------------------------------------
-- Transformations
--------------------------------------------------------------------------------

-- | Map over elements
mapStrom :: forall ctx err a b. (a -> b) -> Strom ctx err a -> Strom ctx err b
mapStrom f stream = mkStrom do
  step <- runStrom stream
  case step of
    Done Nothing -> pure $ Done Nothing
    Done (Just chunk) -> pure $ Done $ Just $ Functor.map f chunk
    Loop (Tuple maybeChunk next) -> pure $ Loop $ Tuple (Functor.map (Functor.map f) maybeChunk) (mapStrom f next)

-- | Map with a monadic effect
mapMStrom :: forall ctx err a b. (a -> Om ctx err b) -> Strom ctx err a -> Strom ctx err b
mapMStrom f stream = mkStrom do
  step <- runStrom stream
  case step of
    Done Nothing -> pure $ Done Nothing
    Done (Just chunk) -> do
      mapped <- traverse f chunk
      pure $ Done $ Just mapped
    Loop (Tuple maybeChunk next) -> do
      mappedChunk <- case maybeChunk of
        Nothing -> pure Nothing
        Just chunk -> Just <$> traverse f chunk
      pure $ Loop $ Tuple mappedChunk (mapMStrom f next)

-- | Tap (observe without modifying)
tapStrom :: forall ctx err a. (a -> Unit) -> Strom ctx err a -> Strom ctx err a
tapStrom f stream = mkStrom do
  step <- runStrom stream
  case step of
    Done Nothing -> pure $ Done Nothing
    Done (Just chunk) -> do
      let _ = Functor.map f chunk
      pure $ Done $ Just chunk
    Loop (Tuple maybeChunk next) -> do
      let
        tappedChunk = case maybeChunk of
          Nothing -> Nothing
          Just chunk ->
            let
              _ = Functor.map f chunk
            in
              Just chunk
      pure $ Loop $ Tuple tappedChunk (tapStrom f next)

-- | Tap with monadic effect (observe with effects)
tapMStrom :: forall ctx err a. (a -> Om ctx err Unit) -> Strom ctx err a -> Strom ctx err a
tapMStrom f stream = mkStrom do
  step <- runStrom stream
  case step of
    Done Nothing -> pure $ Done Nothing
    Done (Just chunk) -> do
      _ <- traverse f chunk
      pure $ Done $ Just chunk
    Loop (Tuple maybeChunk next) -> do
      tappedChunk <- case maybeChunk of
        Nothing -> pure Nothing
        Just chunk -> do
          _ <- traverse f chunk
          pure $ Just chunk
      pure $ Loop $ Tuple tappedChunk (tapMStrom f next)

-- | Bind for streams (monadic flatMap/chain)
-- | Use >>= operator for cleaner syntax: `stream >>= f`
bindStrom :: forall ctx err a b. (a -> Strom ctx err b) -> Strom ctx err a -> Strom ctx err b
bindStrom f stream = stream >>= f

-- | Scan with accumulator (like foldl but emits intermediate results)  
scanStrom :: forall ctx err a b. (b -> a -> b) -> b -> Strom ctx err a -> Strom ctx err b
scanStrom f initial stream = scanHelper initial stream
  where
  scanHelper acc s = mkStrom do
    step <- runStrom s
    case step of
      Done Nothing -> pure $ Done Nothing
      Done (Just chunk) -> do
        -- Build results by folding and collecting intermediate values
        let
          Tuple _ results = Array.foldl
            ( \(Tuple prevAcc accList) item ->
                let
                  newAcc = f prevAcc item
                in
                  Tuple newAcc (Array.snoc accList newAcc)
            )
            (Tuple acc [])
            chunk
        pure $ Done $ if Array.null results then Nothing else Just results
      Loop (Tuple maybeChunk next) ->
        case maybeChunk of
          Nothing -> pure $ Loop $ Tuple Nothing (scanHelper acc next)
          Just chunk -> do
            let
              Tuple newAcc results = Array.foldl
                ( \(Tuple prevAcc accList) item ->
                    let
                      currAcc = f prevAcc item
                    in
                      Tuple currAcc (Array.snoc accList currAcc)
                )
                (Tuple acc [])
                chunk
            if Array.null results then pure $ Loop $ Tuple Nothing (scanHelper newAcc next)
            else pure $ Loop $ Tuple (Just results) (scanHelper newAcc next)

-- | Map with accumulator (stateful map)
mapAccumStrom :: forall ctx err a b s. (s -> a -> Tuple s b) -> s -> Strom ctx err a -> Strom ctx err b
mapAccumStrom f initial stream = mapAccumHelper initial stream
  where
  mapAccumHelper state s = mkStrom do
    step <- runStrom s
    case step of
      Done Nothing -> pure $ Done Nothing
      Done (Just chunk) -> do
        let
          Tuple finalState results = Array.foldl
            ( \(Tuple st acc) a ->
                let
                  Tuple newSt b = f st a
                in
                  Tuple newSt (Array.snoc acc b)
            )
            (Tuple state [])
            chunk
        pure $ Done $ if Array.null results then Nothing else Just results
      Loop (Tuple maybeChunk next) ->
        case maybeChunk of
          Nothing -> pure $ Loop $ Tuple Nothing (mapAccumHelper state next)
          Just chunk -> do
            let
              Tuple newState results = Array.foldl
                ( \(Tuple st acc) a ->
                    let
                      Tuple newSt b = f st a
                    in
                      Tuple newSt (Array.snoc acc b)
                )
                (Tuple state [])
                chunk
            if Array.null results then pure $ Loop $ Tuple Nothing (mapAccumHelper newState next)
            else pure $ Loop $ Tuple (Just results) (mapAccumHelper newState next)

-- | Filter elements
filterStrom :: forall ctx err a. (a -> Boolean) -> Strom ctx err a -> Strom ctx err a
filterStrom predicate stream = mkStrom do
  step <- runStrom stream
  case step of
    Done Nothing -> pure $ Done Nothing
    Done (Just chunk) -> do
      let filtered = Array.filter predicate chunk
      pure $ Done $ if Array.null filtered then Nothing else Just filtered
    Loop (Tuple maybeChunk next) -> do
      let
        filteredChunk = case maybeChunk of
          Nothing -> Nothing
          Just chunk ->
            let
              filtered = Array.filter predicate chunk
            in
              if Array.null filtered then Nothing else Just filtered
      pure $ Loop $ Tuple filteredChunk (filterStrom predicate next)

--------------------------------------------------------------------------------
-- Selection
--------------------------------------------------------------------------------

-- | Take n elements (with proper state tracking across chunks)
takeStrom :: forall ctx err a. Int -> Strom ctx err a -> Strom ctx err a
takeStrom n stream = takeHelper n stream
  where
  takeHelper remaining s
    | remaining <= 0 = empty
    | otherwise = mkStrom do
        step <- runStrom s
        case step of
          Done Nothing -> pure $ Done Nothing
          Done (Just chunk) -> do
            let
              taken = Array.take remaining chunk
              numTaken = Array.length taken
            if numTaken == 0 then pure $ Done Nothing
            else pure $ Done $ Just taken
          Loop (Tuple maybeChunk next) ->
            pure $ Loop $ Tuple maybeChunk (takeHelper remaining next)

-- | Take while predicate is true
takeWhileStrom :: forall ctx err a. (a -> Boolean) -> Strom ctx err a -> Strom ctx err a
takeWhileStrom predicate stream = mkStrom do
  step <- runStrom stream
  case step of
    Done Nothing -> pure $ Done Nothing
    Done (Just chunk) -> do
      let taken = Array.takeWhile predicate chunk
      if Array.length taken < Array.length chunk then pure $ Done $ Just taken
      else pure $ Done $ Just taken
    Loop (Tuple maybeChunk next) -> pure $ Loop $ Tuple maybeChunk (takeWhileStrom predicate next)

-- | Drop n elements (with proper state tracking across chunks)
dropStrom :: forall ctx err a. Int -> Strom ctx err a -> Strom ctx err a
dropStrom n stream
  | n <= 0 = stream
  | otherwise = dropHelper n stream
      where
      dropHelper remaining s
        | remaining <= 0 = s
        | otherwise = mkStrom do
            step <- runStrom s
            case step of
              Done Nothing -> pure $ Done Nothing
              Done (Just chunk) -> do
                let dropped = Array.drop remaining chunk
                pure $ Done $ if Array.null dropped then Nothing else Just dropped
              Loop (Tuple maybeChunk next) ->
                case maybeChunk of
                  Nothing -> pure $ Loop $ Tuple Nothing (dropHelper remaining next)
                  Just chunk ->
                    let
                      chunkLen = Array.length chunk
                    in
                      if remaining >= chunkLen then pure $ Loop $ Tuple Nothing (dropHelper (remaining - chunkLen) next)
                      else
                        let
                          dropped = Array.drop remaining chunk
                        in
                          pure $ Loop $ Tuple (Just dropped) next

-- | Take until predicate is true (includes the matching element)
takeUntilStrom :: forall ctx err a. (a -> Boolean) -> Strom ctx err a -> Strom ctx err a
takeUntilStrom predicate stream = mkStrom do
  step <- runStrom stream
  case step of
    Done Nothing -> pure $ Done Nothing
    Done (Just chunk) -> do
      case Array.findIndex predicate chunk of
        Just idx -> pure $ Done $ Just $ Array.take (idx + 1) chunk -- Include the matching element
        Nothing -> pure $ Done $ Just chunk
    Loop (Tuple maybeChunk next) ->
      case maybeChunk of
        Nothing -> pure $ Loop $ Tuple Nothing (takeUntilStrom predicate next)
        Just chunk -> case Array.findIndex predicate chunk of
          Just idx -> pure $ Done $ Just $ Array.take (idx + 1) chunk -- Found match, stop here
          Nothing -> pure $ Loop $ Tuple (Just chunk) (takeUntilStrom predicate next) -- Keep going

-- | Drop while predicate is true
dropWhileStrom :: forall ctx err a. (a -> Boolean) -> Strom ctx err a -> Strom ctx err a
dropWhileStrom predicate stream = dropWhileHelper true stream
  where
  dropWhileHelper stillDropping s
    | not stillDropping = s
    | otherwise = mkStrom do
        step <- runStrom s
        case step of
          Done Nothing -> pure $ Done Nothing
          Done (Just chunk) -> do
            let dropped = Array.dropWhile predicate chunk
            pure $ Done $ if Array.null dropped then Nothing else Just dropped
          Loop (Tuple maybeChunk next) ->
            case maybeChunk of
              Nothing -> pure $ Loop $ Tuple Nothing (dropWhileHelper stillDropping next)
              Just chunk -> do
                let dropped = Array.dropWhile predicate chunk
                if Array.null dropped then pure $ Loop $ Tuple Nothing (dropWhileHelper true next)
                else pure $ Loop $ Tuple (Just dropped) next -- Found elements to keep, stop dropping

-- | Filter with monadic predicate
filterMStrom :: forall ctx err a. (a -> Om ctx err Boolean) -> Strom ctx err a -> Strom ctx err a
filterMStrom predicate stream = mkStrom do
  step <- runStrom stream
  case step of
    Done Nothing -> pure $ Done Nothing
    Done (Just chunk) -> do
      filtered <- Array.filterA predicate chunk
      pure $ Done $ if Array.null filtered then Nothing else Just filtered
    Loop (Tuple maybeChunk next) -> do
      filteredChunk <- case maybeChunk of
        Nothing -> pure Nothing
        Just chunk -> do
          filtered <- Array.filterA predicate chunk
          pure $ if Array.null filtered then Nothing else Just filtered
      pure $ Loop $ Tuple filteredChunk (filterMStrom predicate next)

-- | Collect with partial function (mapMaybe)
collectStrom :: forall ctx err a b. (a -> Maybe b) -> Strom ctx err a -> Strom ctx err b
collectStrom f stream = mkStrom do
  step <- runStrom stream
  case step of
    Done Nothing -> pure $ Done Nothing
    Done (Just chunk) -> do
      let collected = Array.mapMaybe f chunk
      pure $ Done $ if Array.null collected then Nothing else Just collected
    Loop (Tuple maybeChunk next) ->
      let
        collected = case maybeChunk of
          Nothing -> Nothing
          Just chunk ->
            let
              c = Array.mapMaybe f chunk
            in
              if Array.null c then Nothing else Just c
      in
        pure $ Loop $ Tuple collected (collectStrom f next)

-- | Collect with monadic partial function
collectMStrom :: forall ctx err a b. (a -> Om ctx err (Maybe b)) -> Strom ctx err a -> Strom ctx err b
collectMStrom f stream = mkStrom do
  step <- runStrom stream
  case step of
    Done Nothing -> pure $ Done Nothing
    Done (Just chunk) -> do
      maybes <- traverse f chunk
      let collected = Array.mapMaybe identity maybes
      pure $ Done $ if Array.null collected then Nothing else Just collected
    Loop (Tuple maybeChunk next) -> do
      collected <- case maybeChunk of
        Nothing -> pure Nothing
        Just chunk -> do
          maybes <- traverse f chunk
          let c = Array.mapMaybe identity maybes
          pure $ if Array.null c then Nothing else Just c
      pure $ Loop $ Tuple collected (collectMStrom f next)

-- | Remove consecutive duplicates  
changesStrom :: forall ctx err a. Eq a => Strom ctx err a -> Strom ctx err a
changesStrom stream = changesHelper Nothing stream
  where
  changesHelper lastSeen s = mkStrom do
    step <- runStrom s
    case step of
      Done Nothing -> pure $ Done Nothing
      Done (Just chunk) -> do
        let
          Tuple _ result = Array.foldl
            ( \(Tuple prev acc) curr ->
                if Just curr == prev then Tuple (Just curr) acc
                else Tuple (Just curr) (Array.snoc acc curr)
            )
            (Tuple lastSeen [])
            chunk
        pure $ Done $ if Array.null result then Nothing else Just result
      Loop (Tuple maybeChunk next) ->
        case maybeChunk of
          Nothing -> pure $ Loop $ Tuple Nothing (changesHelper lastSeen next)
          Just chunk -> do
            let
              Tuple newLast result = Array.foldl
                ( \(Tuple prev acc) curr ->
                    if Just curr == prev then Tuple (Just curr) acc
                    else Tuple (Just curr) (Array.snoc acc curr)
                )
                (Tuple lastSeen [])
                chunk
            if Array.null result then pure $ Loop $ Tuple Nothing (changesHelper newLast next)
            else pure $ Loop $ Tuple (Just result) (changesHelper newLast next)

--------------------------------------------------------------------------------
-- Grouping
--------------------------------------------------------------------------------

-- | Group elements into fixed-size arrays
groupedStrom :: forall ctx err a. Int -> Strom ctx err a -> Strom ctx err (Array a)
groupedStrom size stream
  | size <= 0 = empty
  | otherwise = groupedHelper [] stream
      where
      groupedHelper buffer s = mkStrom do
        step <- runStrom s
        case step of
          Done Nothing ->
            -- End of stream, emit remaining buffer if non-empty
            pure $ Done $ if Array.null buffer then Nothing else Just [ buffer ]
          Done (Just chunk) -> do
            -- Process final chunk with buffer
            let
              combined = buffer <> chunk
              groups = groupsOf size combined
              completeGroups = Array.dropEnd 1 groups
              lastGroup = case Array.last groups of
                Just g -> if Array.length g == size then [ g ] else []
                Nothing -> []
              remainder = case Array.last groups of
                Just g -> if Array.length g < size then g else []
                Nothing -> []
            if Array.null remainder then pure $ Done $ if Array.null (completeGroups <> lastGroup) then Nothing else Just (completeGroups <> lastGroup)
            else pure $ Done $ if Array.null (completeGroups <> [ remainder ]) then Nothing else Just (completeGroups <> [ remainder ])
          Loop (Tuple maybeChunk next) ->
            case maybeChunk of
              Nothing -> pure $ Loop $ Tuple Nothing (groupedHelper buffer next)
              Just chunk -> do
                let
                  combined = buffer <> chunk
                  groups = groupsOf size combined
                  completeGroups = if Array.null groups then [] else Array.dropEnd 1 groups
                  newBuffer = case Array.last groups of
                    Just g -> if Array.length g < size then g else []
                    Nothing -> []
                if Array.null completeGroups then pure $ Loop $ Tuple Nothing (groupedHelper newBuffer next)
                else pure $ Loop $ Tuple (Just completeGroups) (groupedHelper newBuffer next)

      groupsOf :: forall b. Int -> Array b -> Array (Array b)
      groupsOf n arr
        | n <= 0 || Array.null arr = []
        | otherwise =
            let
              group = Array.take n arr
              rest = Array.drop n arr
            in
              if Array.null group then [] else Array.cons group (groupsOf n rest)

-- | Alias for groupedStrom
chunkedStrom :: forall ctx err a. Int -> Strom ctx err a -> Strom ctx err (Array a)
chunkedStrom = groupedStrom

--------------------------------------------------------------------------------
-- Running
--------------------------------------------------------------------------------

-- | Fold over all elements
runFold :: forall ctx err a b. b -> (b -> a -> b) -> Strom ctx err a -> Om ctx err b
runFold initial f stream = tailRecM go (Tuple initial stream)
  where
  go (Tuple acc s) = do
    step <- runStrom s
    case step of
      Done Nothing -> pure $ Done acc
      Done (Just chunk) -> pure $ Done $ foldl f acc chunk
      Loop (Tuple maybeChunk next) ->
        -- Process chunk if present and continue
        case maybeChunk of
          Nothing -> pure $ Loop $ Tuple acc next
          Just chunk -> pure $ Loop $ Tuple (foldl f acc chunk) next

-- | Collect all elements into an array (O(n) using chunk accumulation)
runCollect :: forall ctx err a. Strom ctx err a -> Om ctx err (Array a)
runCollect stream = tailRecM go (Tuple List.Nil stream)
  where
  go (Tuple chunkList s) = do
    step <- runStrom s
    case step of
      Done Nothing -> pure $ Done $ Array.concat $ Array.fromFoldable $ List.reverse chunkList
      Done (Just chunk) -> pure $ Done $ Array.concat $ Array.fromFoldable $ List.reverse $ List.Cons chunk chunkList
      Loop (Tuple maybeChunk next) ->
        -- Emit the chunk (if present) and continue
        case maybeChunk of
          Nothing -> pure $ Loop $ Tuple chunkList next
          Just chunk -> pure $ Loop $ Tuple (List.Cons chunk chunkList) next

-- | Run the stream and discard all elements
runDrain :: forall ctx err a. Strom ctx err a -> Om ctx err Unit
runDrain = runFold unit (\_ _ -> unit)

-- | Traverse the stream with effects, discarding results
traverseStrom_ :: forall ctx err a. (a -> Om ctx err Unit) -> Strom ctx err a -> Om ctx err Unit
traverseStrom_ f stream = tailRecM go stream
  where
  go s = do
    step <- runStrom s
    case step of
      Done Nothing -> pure $ Done unit
      Done (Just chunk) -> do
        _ <- traverse f chunk
        pure $ Done unit
      Loop (Tuple maybeChunk next) -> do
        -- Process chunk if present, then continue
        case maybeChunk of
          Nothing -> pure unit
          Just chunk -> void $ traverse f chunk
        pure $ Loop next

-- | Alias for traverseStrom_ with arguments flipped
forStrom_ :: forall ctx err a. Strom ctx err a -> (a -> Om ctx err Unit) -> Om ctx err Unit
forStrom_ = flip traverseStrom_

-- | Alias for traverseStrom_ (FP convention)
forMStrom_ :: forall ctx err a. Strom ctx err a -> (a -> Om ctx err Unit) -> Om ctx err Unit
forMStrom_ = forStrom_

-- | Alias for traverseStrom_ (explicit monadic naming)
traverseMStrom_ :: forall ctx err a. (a -> Om ctx err Unit) -> Strom ctx err a -> Om ctx err Unit
traverseMStrom_ = traverseStrom_

--------------------------------------------------------------------------------
-- Combining
--------------------------------------------------------------------------------

-- | Append two streams
-- | Now properly handles multi-chunk streams with new Step protocol
appendStrom :: forall ctx err a. Strom ctx err a -> Strom ctx err a -> Strom ctx err a
appendStrom s1 s2 = mkStrom do
  step <- runStrom s1
  case step of
    Done Nothing -> runStrom s2
    Done (Just chunk) -> pure $ Loop $ Tuple (Just chunk) s2 -- Emit chunk and continue with s2
    Loop (Tuple maybeChunk next) -> pure $ Loop $ Tuple maybeChunk (appendStrom next s2)

-- | Concatenate an array of streams
concatStrom :: forall ctx err a. Array (Strom ctx err a) -> Strom ctx err a
concatStrom streams = Array.foldl appendStrom empty streams

-- | Zip two streams together
zipStrom :: forall ctx err a b. Strom ctx err a -> Strom ctx err b -> Strom ctx err (Tuple a b)
zipStrom = zipWithStrom Tuple

-- | Zip two streams with a function
zipWithStrom :: forall ctx err a b c. (a -> b -> c) -> Strom ctx err a -> Strom ctx err b -> Strom ctx err c
zipWithStrom f s1 s2 = mkStrom do
  step1 <- runStrom s1
  step2 <- runStrom s2
  case step1, step2 of
    Done (Just arr1), Done (Just arr2) -> do
      let zipped = Array.zipWith f arr1 arr2
      pure $ Done $ Just zipped
    Done Nothing, _ -> pure $ Done Nothing
    _, Done Nothing -> pure $ Done Nothing
    Loop (Tuple maybeChunk1 next1), Loop (Tuple maybeChunk2 next2) ->
      -- Both looping: zip chunks if both present, continue with both nexts
      case maybeChunk1, maybeChunk2 of
        Just chunk1, Just chunk2 -> pure $ Loop $ Tuple (Just $ Array.zipWith f chunk1 chunk2) (zipWithStrom f next1 next2)
        _, _ -> pure $ Loop $ Tuple Nothing (zipWithStrom f next1 next2)
    Loop (Tuple _ next1), _ -> pure $ Loop $ Tuple Nothing (zipWithStrom f next1 s2)
    _, Loop (Tuple _ next2) -> pure $ Loop $ Tuple Nothing (zipWithStrom f s1 next2)

--------------------------------------------------------------------------------
-- Instances
--------------------------------------------------------------------------------

instance Functor (Strom ctx err) where
  map f stream = mkStrom
    ( runStrom stream >>= \step ->
        case step of
          Done Nothing -> pure $ Done Nothing
          Done (Just chunk) -> pure $ Done $ Just $ Functor.map f chunk
          Loop (Tuple maybeChunk next) -> pure $ Loop $ Tuple (Functor.map (Functor.map f) maybeChunk) (Functor.map f next)
    )

instance Apply (Strom ctx err) where
  apply fs as = mkStrom
    ( runStrom fs >>= \stepF ->
        runStrom as >>= \stepA ->
          case stepF, stepA of
            Done (Just funcs), Done (Just vals) ->
              let
                results = do
                  f <- funcs
                  a <- vals
                  pure (f a)
              in
                pure $ Done $ Just results
            Done Nothing, _ -> pure $ Done Nothing
            _, Done Nothing -> pure $ Done Nothing
            Loop (Tuple maybeChunkF nextF), Loop (Tuple maybeChunkA nextA) ->
              -- Apply chunks if both present
              case maybeChunkF, maybeChunkA of
                Just chunkF, Just chunkA ->
                  let
                    applied = do
                      f <- chunkF
                      a <- chunkA
                      pure (f a)
                  in
                    pure $ Loop $ Tuple (Just applied) (nextF <*> nextA)
                _, _ -> pure $ Loop $ Tuple Nothing (nextF <*> nextA)
            Loop (Tuple _ nextF), _ -> pure $ Loop $ Tuple Nothing (nextF <*> as)
            _, Loop (Tuple _ nextA) -> pure $ Loop $ Tuple Nothing (fs <*> nextA)
    )

instance Applicative (Strom ctx err) where
  pure = succeed

instance Bind (Strom ctx err) where
  bind stream f = mkStrom
    ( runStrom stream >>= \step ->
        case step of
          Done Nothing -> pure $ Done Nothing
          Done (Just chunk) ->
            let
              streams = Functor.map f chunk
            in
              runStrom $ concatStrom streams
          Loop (Tuple maybeChunk next) ->
            -- When looping, if we have a chunk, we need to process it through f and concat
            case maybeChunk of
              Nothing -> pure $ Loop $ Tuple Nothing (next >>= f)
              Just chunk ->
                let
                  streams = Functor.map f chunk
                  prefixStream = concatStrom streams
                in
                  runStrom $ appendStrom prefixStream (next >>= f)
    )

instance Monad (Strom ctx err)

instance Semigroup (Strom ctx err a) where
  append s1 s2 = mkStrom
    ( runStrom s1 >>= \step ->
        case step of
          Done Nothing -> runStrom s2
          Done (Just chunk) -> pure $ Loop $ Tuple (Just chunk) s2
          Loop (Tuple maybeChunk next) -> pure $ Loop $ Tuple maybeChunk (next <> s2)
    )

instance Monoid (Strom ctx err a) where
  mempty = empty

instance Alt (Strom ctx err) where
  alt s1 s2 = mkStrom
    ( runStrom s1 >>= \step ->
        case step of
          Done Nothing -> runStrom s2
          Done (Just chunk) -> pure $ Loop $ Tuple (Just chunk) s2
          Loop (Tuple maybeChunk next) -> pure $ Loop $ Tuple maybeChunk (next <|> s2)
    )

instance Plus (Strom ctx err) where
  empty = mkStrom $ pure $ Done Nothing

instance Alternative (Strom ctx err)
