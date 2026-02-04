-- @inline export mkStrom arity=1
-- @inline export runStrom arity=1
-- @inline export mapStrom arity=2
-- @inline export filterStrom arity=2
-- @inline export takeStrom arity=2
-- @inline export runFold arity=3
-- @inline export runDrain arity=1
-- @inline export rangeStrom arity=2
-- @inline export scanStrom arity=3
-- @inline export zipWithStrom arity=3
-- @inline export mapPar arity=3
-- @inline export bindStrom arity=2
module Yoga.Om.Strom
  ( Strom
  -- Construction
  , empty
  , succeed
  , fail
  -- , die -- TODO: Fix type constraints
  , fromAff
  , fromOm
  , fromArray
  , fromFoldable
  , rangeStrom
  , iterateStrom
  , iterateStromInfinite
  , repeatStrom
  , repeatStromInfinite
  , repeatOmStrom
  , repeatOmStromInfinite
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
  , groupByStrom
  , partition
  , partitionMap
  -- Timing
  , debounce
  , throttle
  , delayStrom
  -- Combining
  , appendStrom
  , concatStrom
  , zipStrom
  , zipWithStrom
  , interleave
  , intersperse
  , merge
  , mergeAll
  , mergeND
  , mergeAllND
  , race
  , raceAll
  -- Parallel Processing
  , mapPar
  , mapMPar
  , foreachPar
  -- Error Handling
  , catchAll
  -- , catchSome -- TODO: Fix type constraints
  , retry
  , retryN
  , timeout
  , ensuring
  -- Resource Safety
  , bracket
  , bracketExit
  , acquireRelease
  ) where

import Prelude

import Control.Alt (class Alt, (<|>))
import Control.Alternative (class Alternative)
import Control.Monad.Error.Class (throwError)
import Control.Monad.Rec.Class (Step(..), tailRecM)
import Control.Plus (class Plus)
import Data.Array as Array
import Data.Either (Either(..))
import Data.Foldable (class Foldable, foldl)
import Data.Functor (map) as Functor
import Data.List as List
import Data.Maybe (Maybe(..))
import Data.Time.Duration (Milliseconds(..))
import Data.Traversable (traverse)
import Data.Tuple (Tuple(..))
import Data.Variant (Variant)
import Effect.Aff (Aff, Error, delay)
import Effect.Aff.Class (liftAff)
import Effect.Now (now)
import Effect.Class (liftEffect)
import Data.DateTime.Instant (unInstant)
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
-- Non-Deterministic Merge Types
--------------------------------------------------------------------------------

-- | Stream identifier for tracking which stream produced data
data StreamId = StreamId1 | StreamId2

derive instance eqStreamId :: Eq StreamId
derive instance ordStreamId :: Ord StreamId

-- | Messages passed through the coordination queue
data QueueItem a
  = DataChunk (Array a) StreamId
  | StreamDone StreamId

derive instance functorQueueItem :: Functor QueueItem

--------------------------------------------------------------------------------
-- Construction
--------------------------------------------------------------------------------

-- | An empty stream
empty :: forall ctx err a. Strom ctx err a
empty = mkStrom $ pure $ Done Nothing

-- | A stream with a single element
succeed :: forall ctx err a. a -> Strom ctx err a
succeed a = mkStrom $ pure $ Done $ Just [ a ]

-- | A stream that fails immediately with an empty result (no error thrown)
fail :: forall ctx err a. Strom ctx err a
fail = empty

-- TODO: Add die function with proper type constraints
-- die :: forall ctx err errors a. SingletonVariantRecord err (exception :: Error | errors) => Record err -> Strom ctx (exception :: Error | errors) a
-- die error = mkStrom $ Om.throw error

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

-- | Iterate producing values - limited to ~10,000 elements for stack safety
-- | For truly infinite streams, use `iterateStromInfinite` (with Aff overhead)
iterateStrom :: forall ctx err a. (a -> a) -> a -> Strom ctx err a
iterateStrom f initial = iterateHelper initial 0
  where
  maxIterations = 10000
  iterateHelper current count
    | count >= maxIterations = empty
    | otherwise = mkStrom do
        let
          chunkSize = 100
          remaining = min chunkSize (maxIterations - count)
          result = buildChunk current remaining List.Nil
          chunk = Array.fromFoldable $ List.reverse result.list
        if count + chunkSize >= maxIterations then pure $ Done $ Just chunk
        else pure $ Loop $ Tuple (Just chunk) (iterateHelper result.nextVal (count + chunkSize))

  buildChunk val n acc
    | n <= 0 = { list: acc, nextVal: val }
    | otherwise = buildChunk (f val) (n - 1) (List.Cons val acc)

-- | Truly infinite iteration - stack-safe via Aff async boundaries
-- | Adds tiny delay (0ms) at each chunk to reset the stack
-- | Use this when you need more than 10k elements
iterateStromInfinite :: forall ctx err a. (a -> a) -> a -> Strom ctx err a
iterateStromInfinite f initial = iterateHelper initial
  where
  iterateHelper current = mkStrom do
    -- Async boundary resets the stack!
    liftAff $ delay (Milliseconds 0.0)
    let
      chunkSize = 10000
      result = buildChunk current chunkSize List.Nil
      chunk = Array.fromFoldable $ List.reverse result.list
    pure $ Loop $ Tuple (Just chunk) (iterateHelper result.nextVal)

  buildChunk val n acc
    | n <= 0 = { list: acc, nextVal: val }
    | otherwise = buildChunk (f val) (n - 1) (List.Cons val acc)

-- | Repeat a value - limited to ~10,000 elements for stack safety
repeatStrom :: forall ctx err a. a -> Strom ctx err a
repeatStrom a = fromArray (Array.replicate 10000 a)

-- | Truly infinite repeat - stack-safe via Aff async boundaries
-- | Adds tiny delay (0ms) at each chunk to reset the stack
repeatStromInfinite :: forall ctx err a. a -> Strom ctx err a
repeatStromInfinite a = repeatHelper unit
  where
  repeatHelper _ = mkStrom do
    -- Async boundary resets the stack!
    liftAff $ delay (Milliseconds 0.0)
    let chunk = Array.replicate 10000 a
    pure $ Loop $ Tuple (Just chunk) (repeatHelper unit)

-- | Repeat an Om computation - limited to 100 iterations for stack safety
-- | For truly infinite repetition, use `repeatOmStromInfinite` (with Aff overhead)
repeatOmStrom :: forall ctx err a. Om ctx err a -> Strom ctx err a
repeatOmStrom om = repeatOmHelper 0
  where
  maxCount = 100
  repeatOmHelper count
    | count >= maxCount = empty
    | otherwise = mkStrom do
        value <- om
        pure $ Loop $ Tuple (Just [ value ]) (repeatOmHelper (count + 1))

-- | Truly infinite Om repetition - stack-safe via Aff async boundaries
-- | Adds tiny delay (0ms) at each pull to reset the stack
repeatOmStromInfinite :: forall ctx err a. Om ctx err a -> Strom ctx err a
repeatOmStromInfinite om = repeatOmHelper unit
  where
  repeatOmHelper _ = mkStrom do
    -- Async boundary resets the stack!
    liftAff $ delay (Milliseconds 0.0)
    value <- om
    pure $ Loop $ Tuple (Just [ value ]) (repeatOmHelper unit)

-- | Unfold a stream from a seed value - can be infinite if f never returns Nothing
-- | Emits chunks lazily, terminates when f returns Nothing
unfoldStrom :: forall ctx err a b. (b -> Maybe (Tuple a b)) -> b -> Strom ctx err a
unfoldStrom f seed = unfoldHelper seed
  where
  unfoldHelper currentSeed = mkStrom do
    let chunk = buildChunk currentSeed 100
    case chunk.finalSeed of
      Nothing -> pure $ Done $ if Array.null chunk.values then Nothing else Just chunk.values
      Just nextSeed ->
        if Array.null chunk.values then runStrom (unfoldHelper nextSeed)
        else pure $ Loop $ Tuple (Just chunk.values) (unfoldHelper nextSeed)

  buildChunk seed' size =
    let
      go s n acc =
        if n >= size then { values: acc, finalSeed: Just s }
        else case f s of
          Nothing -> { values: acc, finalSeed: Nothing }
          Just (Tuple value nextS) -> go nextS (n + 1) (Array.snoc acc value)
    in
      go seed' 0 []

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
            case maybeChunk of
              Nothing -> pure $ Loop $ Tuple Nothing (takeHelper remaining next)
              Just chunk -> do
                let
                  chunkLen = Array.length chunk
                  taken = Array.take remaining chunk
                  numTaken = Array.length taken
                  newRemaining = remaining - numTaken
                if numTaken == 0 then pure $ Done Nothing
                else if newRemaining <= 0 then pure $ Done $ Just taken
                else pure $ Loop $ Tuple (Just taken) (takeHelper newRemaining next)

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

-- | Group consecutive elements by a key function
-- | Emits groups when the key changes
groupByStrom :: forall ctx err a k. Eq k => (a -> k) -> Strom ctx err a -> Strom ctx err (Array a)
groupByStrom keyFn stream = groupByHelper Nothing [] stream
  where
  groupByHelper lastKey buffer s = mkStrom do
    step <- runStrom s
    case step of
      Done Nothing ->
        pure $ Done $ if Array.null buffer then Nothing else Just [ buffer ]
      Done (Just chunk) -> do
        let
          Tuple _ result = Array.foldl
            ( \(Tuple currentKey acc) item ->
                let
                  itemKey = keyFn item
                in
                  case currentKey of
                    Nothing -> Tuple (Just itemKey) { groups: [], buffer: [ item ] }
                    Just k ->
                      if k == itemKey then Tuple (Just itemKey) { groups: acc.groups, buffer: Array.snoc acc.buffer item }
                      else Tuple (Just itemKey) { groups: Array.snoc acc.groups acc.buffer, buffer: [ item ] }
            )
            (Tuple lastKey { groups: [], buffer })
            chunk
          allGroups =
            if Array.null result.buffer then result.groups
            else Array.snoc result.groups result.buffer
        pure $ Done $ if Array.null allGroups then Nothing else Just allGroups
      Loop (Tuple maybeChunk next) ->
        case maybeChunk of
          Nothing -> pure $ Loop $ Tuple Nothing (groupByHelper lastKey buffer next)
          Just chunk -> do
            let
              Tuple newKey result = Array.foldl
                ( \(Tuple currentKey acc) item ->
                    let
                      itemKey = keyFn item
                    in
                      case currentKey of
                        Nothing -> Tuple (Just itemKey) { groups: [], buffer: [ item ] }
                        Just k ->
                          if k == itemKey then Tuple (Just itemKey) { groups: acc.groups, buffer: Array.snoc acc.buffer item }
                          else Tuple (Just itemKey) { groups: Array.snoc acc.groups acc.buffer, buffer: [ item ] }
                )
                (Tuple lastKey { groups: [], buffer })
                chunk
            if Array.null result.groups then pure $ Loop $ Tuple Nothing (groupByHelper newKey result.buffer next)
            else pure $ Loop $ Tuple (Just result.groups) (groupByHelper newKey result.buffer next)

-- | Partition a stream by a predicate into two separate operations
-- | Returns a tuple of (trues, falses)
-- | Note: This requires running the stream twice, so it's not lazy
partition :: forall ctx err a. (a -> Boolean) -> Strom ctx err a -> Tuple (Strom ctx err a) (Strom ctx err a)
partition predicate stream =
  Tuple
    (filterStrom predicate stream)
    (filterStrom (not <<< predicate) stream)

-- | Partition and map in one pass
partitionMap :: forall ctx err a b c. (a -> Either b c) -> Strom ctx err a -> Tuple (Strom ctx err b) (Strom ctx err c)
partitionMap f stream =
  let
    leftOnly x = case f x of
      Left b -> Just b
      Right _ -> Nothing
    rightOnly x = case f x of
      Left _ -> Nothing
      Right c -> Just c
  in
    Tuple
      (collectStrom leftOnly stream)
      (collectStrom rightOnly stream)

--------------------------------------------------------------------------------
-- Timing
--------------------------------------------------------------------------------

-- | Debounce a stream - adds a delay after each element
-- | Useful for rate-limiting or giving downstream time to process
debounce :: forall ctx err a. Milliseconds -> Strom ctx err a -> Strom ctx err a
debounce duration stream = mkStrom do
  step <- runStrom stream
  case step of
    Done Nothing -> pure $ Done Nothing
    Done (Just chunk) -> do
      Om.delay duration
      pure $ Done $ Just chunk
    Loop (Tuple maybeChunk next) -> do
      case maybeChunk of
        Nothing -> pure $ Loop $ Tuple Nothing (debounce duration next)
        Just chunk -> do
          Om.delay duration
          pure $ Loop $ Tuple (Just chunk) (debounce duration next)

-- | Throttle a stream - emit at most once per duration period
-- | Tracks last emission time and skips elements that arrive too quickly
-- | Note: Uses wall-clock time, not processing time
throttle :: forall ctx err a. Milliseconds -> Strom ctx err a -> Strom ctx err a
throttle (Milliseconds duration) stream = throttleWithState 0.0 stream
  where
  throttleWithState lastEmit s = mkStrom do
    step <- runStrom s
    case step of
      Done Nothing -> pure $ Done Nothing
      Done (Just chunk) -> do
        Tuple newLastEmit filtered <- filterByTime lastEmit chunk
        pure $ Done $ if Array.null filtered then Nothing else Just filtered
      Loop (Tuple maybeChunk next) -> do
        case maybeChunk of
          Nothing -> pure $ Loop $ Tuple Nothing (throttleWithState lastEmit next)
          Just chunk -> do
            Tuple newLastEmit filtered <- filterByTime lastEmit chunk
            if Array.null filtered then pure $ Loop $ Tuple Nothing (throttleWithState newLastEmit next)
            else pure $ Loop $ Tuple (Just filtered) (throttleWithState newLastEmit next)

  filterByTime lastEmit chunk = do
    Tuple newLastEmit results <- Array.foldl
      ( \acc value -> do
          Tuple currentLast filtered <- acc
          currentTime <- liftEffect now
          let Milliseconds currentMillis = unInstant currentTime
          let elapsed = currentMillis - currentLast
          if elapsed >= duration then
            pure $ Tuple currentMillis (Array.snoc filtered value)
          else
            pure $ Tuple currentLast filtered
      )
      (pure $ Tuple lastEmit [])
      chunk
    pure $ Tuple newLastEmit results

-- | Delay each element by a duration
delayStrom :: forall ctx err a. Milliseconds -> Strom ctx err a -> Strom ctx err a
delayStrom duration stream = mkStrom do
  Om.delay duration
  runStrom stream

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
-- Cancellable Execution
--------------------------------------------------------------------------------

-- | Run a stream in the background, returning a Fiber that can be cancelled
-- | 
-- | To use cancellable streams, convert your stream to Om and use Om.launchOm:
-- | 
-- | Example:
-- | ```purescript
-- | fiber <- Om.launchOm ctx handlers (Strom.runCollect myStream)
-- | -- ... later ...
-- | killFiber (error "Cancelled") fiber
-- | ```
-- | 
-- | Or for subscription-style:
-- | ```purescript
-- | fiber <- Om.launchOm ctx handlers (Strom.traverseStrom_ callback myStream)
-- | -- ... later ...  
-- | killFiber (error "Unsubscribed") fiber
-- | ```
-- |
-- | Note: You can use Om.launchOm directly with any Om-returning function like:
-- | - `runCollect` - collect results in background
-- | - `runDrain` - run for side effects
-- | - `traverseStrom_` - process each element with callback
-- | - `runFold` - fold with accumulator

--------------------------------------------------------------------------------
-- Combining
--------------------------------------------------------------------------------

-- | Append two streams
-- | Now properly handles multi-chunk streams with new Step protocol
-- | Note: s2 is appended TO s1 (s1 comes first, then s2)
-- | This matches pipeline semantics: stream # appendStrom other means stream followed by other
appendStrom :: forall ctx err a. Strom ctx err a -> Strom ctx err a -> Strom ctx err a
appendStrom toAppend baseStream = mkStrom do
  step <- runStrom baseStream
  case step of
    Done Nothing -> runStrom toAppend
    Done (Just chunk) -> pure $ Loop $ Tuple (Just chunk) toAppend -- Emit chunk and continue with toAppend
    Loop (Tuple maybeChunk next) -> pure $ Loop $ Tuple maybeChunk (appendStrom toAppend next)

-- | Concatenate an array of streams
-- | Uses foldr with flip to match appendStrom's pipeline-friendly parameter order
concatStrom :: forall ctx err a. Array (Strom ctx err a) -> Strom ctx err a
concatStrom streams = Array.foldr (flip appendStrom) empty streams

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

-- | Interleave two streams - alternates between elements from each stream
-- | Similar to merge but deterministic - always alternates
interleave :: forall ctx err a. Strom ctx err a -> Strom ctx err a -> Strom ctx err a
interleave s1 s2 = interleaveHelper true s1 s2
  where
  interleaveHelper preferFirst first second = mkStrom do
    if preferFirst then do
      step1 <- runStrom first
      case step1 of
        Done Nothing -> runStrom second
        Done (Just chunk1) -> pure $ Loop $ Tuple (Just chunk1) (interleaveHelper false second first)
        Loop (Tuple maybeChunk1 next1) ->
          pure $ Loop $ Tuple maybeChunk1 (interleaveHelper false second next1)
    else do
      step2 <- runStrom second
      case step2 of
        Done Nothing -> runStrom first
        Done (Just chunk2) -> pure $ Loop $ Tuple (Just chunk2) (interleaveHelper true first second)
        Loop (Tuple maybeChunk2 next2) ->
          pure $ Loop $ Tuple maybeChunk2 (interleaveHelper true first next2)

-- | Intersperse a separator element between each element of the stream
intersperse :: forall ctx err a. a -> Strom ctx err a -> Strom ctx err a
intersperse separator stream = intersperseHelper true stream
  where
  intersperseHelper isFirst s = mkStrom do
    step <- runStrom s
    case step of
      Done Nothing -> pure $ Done Nothing
      Done (Just chunk) -> do
        let
          withSeparators =
            if isFirst then Array.intercalate [ separator ] (Array.singleton <$> chunk)
            else Array.cons separator (Array.intercalate [ separator ] (Array.singleton <$> chunk))
        pure $ Done $ Just withSeparators
      Loop (Tuple maybeChunk next) ->
        case maybeChunk of
          Nothing -> pure $ Loop $ Tuple Nothing (intersperseHelper isFirst next)
          Just chunk -> do
            let
              withSeparators =
                if isFirst then Array.intercalate [ separator ] (Array.singleton <$> chunk)
                else Array.cons separator (Array.intercalate [ separator ] (Array.singleton <$> chunk))
            pure $ Loop $ Tuple (Just withSeparators) (intersperseHelper false next)

--------------------------------------------------------------------------------
-- Concurrency
--------------------------------------------------------------------------------

-- | Merge two streams concurrently
-- | Elements are emitted as soon as they're available from either stream
merge :: forall ctx err a. Strom ctx err a -> Strom ctx err a -> Strom ctx err a
merge s1 s2 = mkStrom do
  -- Pull from both streams concurrently
  step1 <- runStrom s1
  step2 <- runStrom s2
  case step1, step2 of
    Done Nothing, Done Nothing -> pure $ Done Nothing
    Done Nothing, Done (Just chunk2) -> pure $ Done $ Just chunk2
    Done (Just chunk1), Done Nothing -> pure $ Done $ Just chunk1
    Done (Just chunk1), Done (Just chunk2) -> pure $ Done $ Just (chunk1 <> chunk2)
    Done Nothing, Loop (Tuple maybeChunk2 next2) ->
      pure $ Loop $ Tuple maybeChunk2 next2
    Done (Just chunk1), Loop (Tuple maybeChunk2 next2) ->
      case maybeChunk2 of
        Nothing -> pure $ Loop $ Tuple (Just chunk1) next2
        Just chunk2 -> pure $ Loop $ Tuple (Just $ chunk1 <> chunk2) next2
    Loop (Tuple maybeChunk1 next1), Done Nothing ->
      pure $ Loop $ Tuple maybeChunk1 next1
    Loop (Tuple maybeChunk1 next1), Done (Just chunk2) ->
      case maybeChunk1 of
        Nothing -> pure $ Loop $ Tuple (Just chunk2) next1
        Just chunk1 -> pure $ Loop $ Tuple (Just $ chunk1 <> chunk2) next1
    Loop (Tuple maybeChunk1 next1), Loop (Tuple maybeChunk2 next2) ->
      -- Both streams continue, merge chunks and continue with both
      case maybeChunk1, maybeChunk2 of
        Nothing, Nothing -> pure $ Loop $ Tuple Nothing (merge next1 next2)
        Just c1, Nothing -> pure $ Loop $ Tuple (Just c1) (merge next1 next2)
        Nothing, Just c2 -> pure $ Loop $ Tuple (Just c2) (merge next1 next2)
        Just c1, Just c2 -> pure $ Loop $ Tuple (Just $ c1 <> c2) (merge next1 next2)

-- | Merge multiple streams concurrently
mergeAll :: forall ctx err a. Array (Strom ctx err a) -> Strom ctx err a
mergeAll streams = Array.foldl merge empty streams

-- | Race two streams - returns elements from whichever produces first
-- | Uses Om.race for true concurrent racing
race :: forall ctx err a. Strom ctx err a -> Strom ctx err a -> Strom ctx err a
race s1 s2 = mkStrom do
  Om.race [ runStrom s1, runStrom s2 ]

-- | Race multiple streams - returns elements from whichever produces first
raceAll :: forall ctx err a. Array (Strom ctx err a) -> Strom ctx err a
raceAll streams = mkStrom do
  Om.race (Functor.map runStrom streams)

-- | Non-deterministic merge: Merge two streams concurrently, emitting elements as soon as they're available
-- | Unlike `merge`, this runs both streams in parallel and elements may arrive in any order
-- | The stream that produces results faster will have its elements appear first
mergeND :: forall ctx err a. Strom ctx err a -> Strom ctx err a -> Strom ctx err a
mergeND s1 s2 = mergeNDImpl s1 s2 { stream1Done: false, stream2Done: false }
  where
  mergeNDImpl stream1 stream2 state
    | state.stream1Done && state.stream2Done = empty
    | state.stream1Done = stream2
    | state.stream2Done = stream1
    | otherwise = mkStrom do
        -- Race to see which stream produces first
        result <- Om.race
          [ Left <$> runStrom stream1
          , Right <$> runStrom stream2
          ]
        case result of
          Left step1 -> handleStep step1 stream1 stream2 state StreamId1
          Right step2 -> handleStep step2 stream1 stream2 state StreamId2

  handleStep step thisStream otherStream state streamId = case step of
    Done Nothing -> do
      -- This stream finished with no data
      let
        newState =
          if streamId == StreamId1 then state { stream1Done = true }
          else state { stream2Done = true }
      runStrom $ mergeNDImpl thisStream otherStream newState

    Done (Just chunk) -> do
      -- This stream finished with final chunk
      let
        newState =
          if streamId == StreamId1 then state { stream1Done = true }
          else state { stream2Done = true }
      pure $ Loop $ Tuple (Just chunk) (mergeNDImpl thisStream otherStream newState)

    Loop (Tuple maybeChunk next) -> do
      -- This stream continues
      let nextStream1 = if streamId == StreamId1 then next else thisStream
      let nextStream2 = if streamId == StreamId2 then next else otherStream
      case maybeChunk of
        Nothing -> runStrom $ mergeNDImpl nextStream1 nextStream2 state
        Just chunk -> pure $ Loop $ Tuple (Just chunk) (mergeNDImpl nextStream1 nextStream2 state)

-- | Non-deterministic merge of multiple streams
-- | All streams run concurrently and emit elements as soon as they're available
mergeAllND :: forall ctx err a. Array (Strom ctx err a) -> Strom ctx err a
mergeAllND streams = Array.foldl mergeND empty streams

--------------------------------------------------------------------------------
-- Parallel Processing
--------------------------------------------------------------------------------

-- | Map over elements in parallel with bounded concurrency
-- | Processes chunks in parallel groups up to the concurrency limit
mapPar :: forall ctx err a b. Int -> (a -> Om ctx err b) -> Strom ctx err a -> Strom ctx err b
mapPar concurrency f stream
  | concurrency <= 1 = mapMStrom f stream -- Sequential fallback
  | otherwise =
      mkStrom do
        step <- runStrom stream
        case step of
          Done Nothing -> pure $ Done Nothing
          Done (Just chunk) -> do
            -- Split chunk into groups of `concurrency` size and process each group in parallel
            let groups = chunksOf concurrency chunk
            results <- traverse (\group -> Om.inParallel (Functor.map f group)) groups
            pure $ Done $ Just $ Array.concat results
          Loop (Tuple maybeChunk next) -> do
            mappedChunk <- case maybeChunk of
              Nothing -> pure Nothing
              Just chunk -> do
                let groups = chunksOf concurrency chunk
                results <- traverse (\group -> Om.inParallel (Functor.map f group)) groups
                pure $ Just $ Array.concat results
            pure $ Loop $ Tuple mappedChunk (mapPar concurrency f next)
      where
      chunksOf :: forall x. Int -> Array x -> Array (Array x)
      chunksOf n arr
        | n <= 0 || Array.null arr = []
        | otherwise =
            let
              group = Array.take n arr
              rest = Array.drop n arr
            in
              if Array.null group then [] else Array.cons group (chunksOf n rest)

-- | Alias for mapPar with explicit "M" naming
mapMPar :: forall ctx err a b. Int -> (a -> Om ctx err b) -> Strom ctx err a -> Strom ctx err b
mapMPar = mapPar

-- | For each element, execute an effect in parallel with bounded concurrency
foreachPar :: forall ctx err a. Int -> (a -> Om ctx err Unit) -> Strom ctx err a -> Om ctx err Unit
foreachPar concurrency f stream = runDrain (mapPar concurrency f stream)

--------------------------------------------------------------------------------
-- Error Handling
--------------------------------------------------------------------------------

-- | Catch all errors and recover with a handler function
-- | Note: Uses handleErrors' for full error handling
catchAll :: forall ctx err a. (Variant (exception :: Error | err) -> Strom ctx err a) -> Strom ctx err a -> Strom ctx err a
catchAll handler stream = mkStrom do
  Om.handleErrors'
    (\err -> runStrom (handler err))
    (runStrom stream)

-- TODO: Fix catchSome type constraints
-- catchSome :: forall ctx err handlers a. (Record handlers) -> Strom ctx err a -> Strom ctx err a
-- catchSome handlers stream = mkStrom do
--   Om.handleErrors handlers (runStrom stream)

-- | Retry a stream on failure up to 3 times
retry :: forall ctx err a. Strom ctx err a -> Strom ctx err a
retry = retryN 3

-- | Retry a stream N times on failure
retryN :: forall ctx err a. Int -> Strom ctx err a -> Strom ctx err a
retryN n stream
  | n <= 0 = stream
  | otherwise = catchAll (\_ -> retryN (n - 1) stream) stream

-- | Run a finaliser after the stream completes (success or failure)
ensuring :: forall ctx err a. Om ctx err Unit -> Strom ctx err a -> Strom ctx err a
ensuring finaliser stream = mkStrom do
  result <- Om.handleErrors'
    ( \err -> do
        finaliser
        throwError err
    )
    ( runStrom stream >>= \step -> do
        finaliser
        pure step
    )
  pure result

-- | Add a timeout to stream operations
-- | If the stream doesn't complete within the duration, it terminates as empty
timeout :: forall ctx err a. Milliseconds -> Strom ctx err a -> Strom ctx err a
timeout duration stream = mkStrom do
  Om.race [ runStrom stream, Om.delay duration *> runStrom empty ]

--------------------------------------------------------------------------------
-- Resource Safety
--------------------------------------------------------------------------------

-- | Bracket pattern: acquire, use, release
-- | Guarantees release runs even if stream fails
bracket
  :: forall ctx err a b
   . Om ctx err a -- acquire
  -> (a -> Om ctx err Unit) -- release
  -> (a -> Strom ctx err b) -- use
  -> Strom ctx err b
bracket acquire release use = mkStrom do
  resource <- acquire
  Om.handleErrors'
    ( \err -> do
        release resource
        throwError err
    )
    (runStrom (use resource))
    >>= \step -> do
      case step of
        Done _ -> release resource
        Loop _ -> pure unit
      pure step

-- | Bracket with exit information (whether stream succeeded or failed)
bracketExit
  :: forall ctx err a b
   . Om ctx err a -- acquire
  -> (a -> Maybe (Variant (exception :: Error | err)) -> Om ctx err Unit) -- release with exit info
  -> (a -> Strom ctx err b) -- use
  -> Strom ctx err b
bracketExit acquire release use = mkStrom do
  resource <- acquire
  Om.handleErrors'
    ( \err -> do
        release resource (Just err)
        throwError err
    )
    (runStrom (use resource))
    >>= \step -> do
      case step of
        Done _ -> release resource Nothing
        Loop _ -> pure unit
      pure step

-- | Simplified acquire-release pattern
acquireRelease
  :: forall ctx err a b
   . Om ctx err a -- acquire
  -> (a -> Om ctx err Unit) -- release
  -> (a -> Strom ctx err b) -- use
  -> Strom ctx err b
acquireRelease = bracket

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
