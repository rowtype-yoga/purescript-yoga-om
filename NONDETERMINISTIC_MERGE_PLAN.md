# Non-Deterministic Merge - Implementation Plan

## Goal

Implement `mergeNonDeterministic` that truly runs streams concurrently and emits elements as soon as they're available from either stream.

## Current State

**Deterministic merge (current):**
```purescript
merge s1 s2 = mkStrom do
  step1 <- runStrom s1  -- Sequential!
  step2 <- runStrom s2  -- Sequential!
  -- Combine results
```

**Problem:** Pulls are sequential, not concurrent.

## Target API

```purescript
-- Non-deterministic concurrent merge
mergeND :: forall ctx err a. Strom ctx err a -> Strom ctx err a -> Strom ctx err a

-- Multiple streams
mergeAllND :: forall ctx err a. Array (Strom ctx err a) -> Strom ctx err a
```

## Implementation Strategy

### Phase 1: Two-Stream Merge (2-3 hours)

**Core Algorithm:**
1. Fork both streams as fibers
2. Use AVar as a shared queue
3. Both fibers write results to queue
4. Main stream reads from queue and emits
5. Handle completion when both streams finish

**Code Structure:**
```purescript
mergeND :: forall ctx err a. Strom ctx err a -> Strom ctx err a -> Strom ctx err a
mergeND s1 s2 = mkStrom do
  ctx <- Om.ask
  
  -- Step 1: Create coordination structures
  resultQueue <- liftAff AVar.empty
  completionVar <- liftAff AVar.empty
  
  -- Step 2: Fork stream 1
  fiber1 <- Om.launchOm ctx handlers do
    pullAndEnqueue resultQueue completionVar s1 StreamId1
  
  -- Step 3: Fork stream 2
  fiber2 <- Om.launchOm ctx handlers do
    pullAndEnqueue resultQueue completionVar s2 StreamId2
  
  -- Step 4: Read from queue and emit
  dequeueAndEmit resultQueue completionVar fiber1 fiber2
```

### Phase 2: Helper Functions

**1. Pull and Enqueue (per stream):**
```purescript
pullAndEnqueue 
  :: forall ctx err a
   . AVar (QueueItem a)
  -> AVar CompletionSignal
  -> Strom ctx err a
  -> StreamId
  -> Om ctx err Unit
pullAndEnqueue queue completion stream streamId = do
  step <- runStrom stream
  case step of
    Done Nothing -> 
      liftAff $ AVar.put (StreamCompleted streamId) completion
    Done (Just chunk) -> do
      liftAff $ AVar.put (DataAvailable chunk streamId) queue
      liftAff $ AVar.put (StreamCompleted streamId) completion
    Loop (Tuple maybeChunk next) -> do
      case maybeChunk of
        Nothing -> pure unit
        Just chunk -> liftAff $ AVar.put (DataAvailable chunk streamId) queue
      pullAndEnqueue queue completion next streamId
```

**2. Dequeue and Emit:**
```purescript
dequeueAndEmit
  :: forall ctx err a
   . AVar (QueueItem a)
  -> AVar CompletionSignal
  -> Fiber Unit
  -> Fiber Unit
  -> Om ctx err (Step ...)
dequeueAndEmit queue completion fiber1 fiber2 = do
  -- Race between data arrival and completion
  result <- Om.race
    [ Left <$> (liftAff $ AVar.take queue)
    , Right <$> (liftAff $ AVar.take completion)
    ]
  
  case result of
    Left (DataAvailable chunk streamId) ->
      -- Emit chunk and continue
      pure $ Loop $ Tuple (Just chunk) (continueReading queue completion fiber1 fiber2)
    
    Right (StreamCompleted streamId) ->
      -- One stream done, check if both done
      checkBothComplete streamId fiber1 fiber2
```

### Phase 3: Data Types

```purescript
-- Which stream produced data
data StreamId = StreamId1 | StreamId2

-- Queue items
data QueueItem a
  = DataAvailable (Array a) StreamId
  | StreamCompleted StreamId

-- Completion tracking
type CompletionState = 
  { stream1Done :: Boolean
  , stream2Done :: Boolean
  }
```

### Phase 4: Error Handling

**Challenges:**
- If one stream errors, should we cancel the other?
- How to propagate errors from background fibers?

**Solution:**
```purescript
-- Wrap in error handling
mergeND s1 s2 = mkStrom do
  Om.handleErrors'
    (\err -> do
      -- Cancel both fibers on error
      liftAff $ killFiber (error "Merge aborted") fiber1
      liftAff $ killFiber (error "Merge aborted") fiber2
      Om.throw err
    )
    (mergeNDImpl s1 s2)
```

### Phase 5: Resource Cleanup

**Problem:** Fibers must be cleaned up even if stream is interrupted.

**Solution:**
```purescript
mergeND s1 s2 = 
  bracket
    (allocateMergeResources s1 s2)    -- Acquire
    (\resources -> cleanup resources)  -- Release
    (\resources -> runMerge resources) -- Use
  where
  cleanup { fiber1, fiber2, queue } = do
    liftAff $ killFiber (error "Cleanup") fiber1
    liftAff $ killFiber (error "Cleanup") fiber2
    -- AVars auto-cleanup
```

## Implementation Steps

### Step 1: Basic Two-Stream Merge (1 hour)
- [ ] Define data types (`StreamId`, `QueueItem`)
- [ ] Implement `pullAndEnqueue`
- [ ] Implement `dequeueAndEmit`
- [ ] Basic `mergeND` without error handling

### Step 2: Completion Tracking (30 min)
- [ ] Track which streams are done
- [ ] Emit remaining data when one completes
- [ ] Terminate when both complete

### Step 3: Error Handling (30 min)
- [ ] Wrap in `handleErrors'`
- [ ] Cancel fibers on error
- [ ] Propagate errors correctly

### Step 4: Resource Safety (30 min)
- [ ] Use `bracket` for fiber cleanup
- [ ] Ensure fibers killed on interruption
- [ ] Test cancellation scenarios

### Step 5: Testing (30 min)
- [ ] Test with fast/slow streams
- [ ] Test with errors
- [ ] Test with infinite streams
- [ ] Verify non-deterministic behavior
- [ ] Test cancellation

### Step 6: Multiple Streams (30 min)
- [ ] Generalize to `Array (Strom ctx err a)`
- [ ] Track completion for N streams
- [ ] Handle N fibers

## Testing Strategy

### Test 1: Basic Merge
```purescript
it "merges two streams concurrently" do
  let
    slow = Strom.fromArray [1, 2, 3]
           # Strom.mapMStrom (\n -> Om.delay (Milliseconds 100.0) *> pure n)
    fast = Strom.fromArray [10, 20, 30]
           # Strom.mapMStrom (\n -> Om.delay (Milliseconds 10.0) *> pure n)
  
  result <- runOm $ Strom.mergeND slow fast # Strom.runCollect
  
  -- Should contain all elements (order may vary)
  Array.sort result `shouldEqual` [1, 2, 3, 10, 20, 30]
  -- Fast elements should appear first (probabilistically)
  Array.take 3 result `shouldSatisfy` \arr -> 10 `elem` arr
```

### Test 2: Error Propagation
```purescript
it "propagates errors from either stream" do
  let
    ok = Strom.fromArray [1, 2, 3]
    bad = Strom.fromArray [1, 2, 3]
          # Strom.mapMStrom (\n ->
              if n == 2 then Om.throw { error: "Failed" }
              else pure n
            )
  
  result <- runOm $ 
    Strom.mergeND ok bad
      # Strom.catchAll (\_ -> Strom.succeed 999)
      # Strom.runCollect
  
  -- Should have caught error
  result `shouldContain` 999
```

### Test 3: Completion Handling
```purescript
it "continues when one stream completes" do
  let
    short = Strom.fromArray [1, 2]
    long = Strom.fromArray [10, 20, 30, 40]
  
  result <- runOm $ Strom.mergeND short long # Strom.runCollect
  Array.sort result `shouldEqual` [1, 2, 10, 20, 30, 40]
```

### Test 4: Cancellation
```purescript
it "cleans up fibers on cancellation" do
  let
    infinite1 = Strom.repeatStromInfinite 1
    infinite2 = Strom.repeatStromInfinite 2
  
  fiber <- Om.launchOm ctx handlers $
    Strom.mergeND infinite1 infinite2
      # Strom.takeStrom 10
      # Strom.runCollect
  
  result <- Aff.joinFiber fiber
  Array.length result `shouldEqual` 10
  -- Should not hang or leak resources
```

## Challenges & Solutions

### Challenge 1: Handler Propagation
**Problem:** Background fibers need access to error handlers.

**Solution:** Capture handlers in closure:
```purescript
mergeND s1 s2 = mkStrom do
  ctx <- Om.ask
  -- Store handlers in scope
  let handlers = { exception: \e -> ... }
  fiber1 <- Om.launchOm ctx handlers (...)
```

### Challenge 2: Context Threading
**Problem:** Both streams need the context.

**Solution:** Use `Om.ask` to get context, pass to `launchOm`:
```purescript
ctx <- Om.ask
fiber <- Om.launchOm ctx handlers om
```

### Challenge 3: AVar Blocking
**Problem:** `AVar.take` blocks if empty.

**Solution:** Use `Om.race` to race between queue and completion signals.

### Challenge 4: Fairness
**Problem:** One fast stream might starve the slow one.

**Solution:** Round-robin reading from queue, or use separate queues per stream.

## Performance Considerations

### Memory
- **AVars:** O(1) per merge operation
- **Fibers:** O(1) per stream
- **Queue:** Bounded by chunk size (already in memory)

### CPU
- **Overhead:** ~0.1ms per fiber spawn
- **Coordination:** Negligible (AVar operations are fast)
- **Benefit:** Streams run truly concurrently

### When to Use
- ✅ Multiple slow I/O streams
- ✅ Reactive event streams
- ✅ Real-time data aggregation
- ❌ Simple sequential processing (use regular `merge`)

## Alternative: Simpler Non-Blocking Merge

If full fiber coordination is too complex, a simpler approach:

```purescript
-- Poll both streams, emit whichever is ready
mergePolling s1 s2 = mkStrom do
  -- Try both, use whichever responds first
  result <- Om.race
    [ Left <$> runStrom s1
    , Right <$> runStrom s2
    ]
  
  case result of
    Left step1 -> emitAndContinue step1 s1 s2
    Right step2 -> emitAndContinue step2 s1 s2
```

**Trade-off:** Simpler but less fair (one stream might dominate).

## Rollout Plan

1. **Implement basic version** (Phase 1-2)
2. **Add tests** (Phase 5)
3. **Add error handling** (Phase 3)
4. **Add resource safety** (Phase 4)
5. **Extend to multiple streams** (Phase 6)
6. **Document behavior** in module docs
7. **Add to exports** and update feature parity docs

## Estimated Effort

- **Basic implementation**: 2-3 hours
- **Testing & polish**: 1 hour
- **Documentation**: 30 minutes
- **Total**: 3-4 hours

## Success Criteria

- ✅ Streams run concurrently (verified with timing tests)
- ✅ Elements emitted as soon as available
- ✅ Order is non-deterministic
- ✅ Both streams complete correctly
- ✅ Errors propagated from either stream
- ✅ Resources cleaned up on cancellation
- ✅ Works with infinite streams
- ✅ Tests pass with fast/slow combinations

## Ready to Implement?

This plan provides a complete roadmap for non-deterministic merge. Should I proceed with implementation?
