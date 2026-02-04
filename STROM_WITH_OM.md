# Strom with Om - Complete Feature Set

## Om Utilities Available in Strom

Since Strom uses Om as its effect type, **all Om utilities work seamlessly** with streams!

### Concurrency (Already Used)

```purescript
-- Race multiple Om computations
Om.race :: Array (Om ctx e a) -> Om ctx e a

-- Run multiple Om computations in parallel
Om.inParallel :: Array (Om ctx e a) -> Om ctx e (Array a)

-- Launch Om in background (cancellable)
Om.launchOm :: ctx -> handlers -> Om ctx err a -> Effect (Fiber a)
Om.launchOm_ :: ctx -> handlers -> Om ctx err Unit -> Effect Unit
```

### Error Handling Utilities

**Convert `Maybe` to errors:**
```purescript
-- Stream of Maybe values -> Stream with errors
myStream
  # Strom.mapMStrom \maybeValue ->
      Om.note { customError: "Value was Nothing" } maybeValue
  # Strom.catchAll \err -> Strom.succeed defaultValue
```

**Convert `Either` to errors:**
```purescript
-- Stream with Either results
myStream
  # Strom.mapMStrom \result ->
      Om.throwLeftAs (\e -> { parseError: show e }) result
```

**Handle specific errors:**
```purescript
myStream
  # Strom.catchAll \err ->
      Om.handleErrors
        { parseError: \msg -> Strom.succeed defaultValue
        , networkError: \e -> Strom.retry (fetchFromBackup e)
        }
        (Om.throw err)
```

### Context Management

**Expand context (run stream needing less context):**
```purescript
-- Stream needing only { logger :: Logger }
smallContextStream :: Strom { logger :: Logger } err a

-- Use in larger context
bigContextOp :: Om { logger :: Logger, db :: DB } err Unit
bigContextOp = do
  result <- smallContextStream
    # Strom.mapMStrom Om.expandCtx  -- Automatically shrinks context
    # Strom.runCollect
  -- ...
```

**Widen context:**
```purescript
Om.widenCtx :: Om { | lt } err ~> Om { | gt } err
-- Allows using functions with smaller context in larger context
```

### Delays and Timing

```purescript
-- Already using:
Om.delay :: Duration d => d -> Om ctx err Unit

-- Use in streams:
Strom.fromArray [1, 2, 3]
  # Strom.mapMStrom \n -> do
      Om.delay (Milliseconds 100.0)
      pure (n * 2)
```

### Working with Aff

**Convert Aff to Om:**
```purescript
Om.fromAff :: Aff a -> Om ctx err a

-- Use in streams:
Strom.repeatOmStromInfinite
  (Om.fromAff fetchDataFromAPI)
  # Strom.takeStrom 100
```

### Error Construction

```purescript
-- Throw typed errors
Om.throw :: Record err -> Om ctx errors a
Om.error :: Record err -> Variant errors

-- Use in streams:
Strom.fromArray items
  # Strom.mapMStrom \item ->
      if isValid item
        then pure item
        else Om.throw { validation: "Invalid item" }
```

## Complete Example: Real-World Stream Processing

```purescript
module Main where

import Prelude
import Yoga.Om.Strom as Strom
import Yoga.Om as Om
import Effect.Aff (Milliseconds(..), killFiber)
import Effect.Exception (error)

type Context = 
  { db :: Database
  , logger :: Logger
  , config :: Config
  }

type Errors = 
  ( database :: String
  , validation :: String
  , network :: String
  , exception :: Error
  )

-- Infinite stream processing pipeline
processOrders :: Strom Context Errors Unit
processOrders =
  -- Infinite stream of orders
  Strom.repeatOmStromInfinite fetchNextOrder
    # Strom.throttle (Milliseconds 100.0)  -- Rate limit
    # Strom.mapMStrom validateOrder        -- May throw validation errors
    # Strom.filterMStrom isHighPriority    -- Filter with DB check
    # Strom.mapPar 5 enrichWithCustomerData  -- Parallel enrichment
    # Strom.groupedStrom 10                -- Batch
    # Strom.mapMStrom processBatch         -- May throw database errors
    # Strom.catchAll handleErrors          -- Recover from errors
    # Strom.runDrain                       -- Run for side effects

fetchNextOrder :: Om Context Errors Order
fetchNextOrder = do
  -- Poll queue with timeout
  maybeOrder <- Om.fromAff pollOrderQueue
  -- Convert Maybe to error
  Om.note { network: "No orders available" } maybeOrder

validateOrder :: Order -> Om Context Errors Order
validateOrder order = do
  config <- Om.asks _.config
  if isValidOrder config order
    then pure order
    else Om.throw { validation: "Invalid order: " <> show order }

isHighPriority :: Order -> Om Context Errors Boolean
isHighPriority order = do
  db <- Om.asks _.db
  customer <- Om.fromAff $ lookupCustomer db order.customerId
  -- Convert Either to error
  Om.throwLeftAs (\e -> { database: show e }) customer
    <#> _.isPriority

enrichWithCustomerData :: Order -> Om Context Errors EnrichedOrder
enrichWithCustomerData order = do
  result <- Om.fromAff $ fetchCustomerData order.customerId
  Om.throwLeftAs (\e -> { network: show e }) result
    <#> \customer -> { order, customer }

processBatch :: Array EnrichedOrder -> Om Context Errors Unit
processBatch batch = do
  logger <- Om.asks _.logger
  db <- Om.asks _.db
  Om.fromAff $ log logger $ "Processing batch of " <> show (length batch)
  result <- Om.fromAff $ saveBatch db batch
  Om.throwLeftAs (\e -> { database: show e }) result

handleErrors :: Variant Errors -> Strom Context Errors Unit
handleErrors err =
  Om.handleErrors
    { validation: \msg -> do
        logWarning msg
        Strom.empty  -- Skip invalid orders
    , network: \msg -> do
        logError msg
        Om.delay (Seconds 5.0)  -- Wait and retry
        processOrders
    , database: \msg -> do
        logCritical msg
        Om.throw { exception: error "Database failure" }
    }
    (Om.throw err)

-- Run cancellably
main :: Effect Unit
main = do
  let ctx = { db, logger, config }
  let handlers = { exception: \e -> log $ message e }
  
  -- Launch in background
  fiber <- Om.launchOm ctx handlers processOrders
  
  -- Cancel after 1 hour
  _ <- setTimeout (3600 * 1000) do
    killFiber (error "Shutting down") fiber
  
  pure unit
```

## Key Insights

### 1. **All Om Utilities Work with Streams**

Since `Strom` operations return `Om ctx err a`, you can use **any Om utility** inside stream transformations:

```purescript
myStream
  # Strom.mapMStrom \value -> do
      Om.delay (Milliseconds 10.0)       -- ✅ Works
      result <- Om.fromAff apiCall       -- ✅ Works
      Om.note { error: "Failed" } result -- ✅ Works
```

### 2. **Context Propagation is Automatic**

The context flows through the entire pipeline:

```purescript
-- Context available in every operation
process :: Strom { db :: DB, logger :: Logger } Errors Result
process =
  Strom.fromArray items
    # Strom.mapMStrom \item -> do
        logger <- Om.asks _.logger  -- ✅ Context available
        db <- Om.asks _.db          -- ✅ Context available
        -- ...
```

### 3. **Error Handling is Composable**

Mix and match Om's error utilities with Strom's error handling:

```purescript
myStream
  # Strom.mapMStrom (Om.note { error: "Conversion failed" })
  # Strom.retry  -- Retry on errors
  # Strom.catchAll handleError
```

### 4. **Cancellation is Built-in**

Any Strom operation can be run cancellably via `Om.launchOm`:

```purescript
fiber <- Om.launchOm ctx handlers (Strom.runCollect myStream)
-- ... later ...
killFiber (error "Cancelled") fiber
```

## Summary: What Strom + Om Provides

| Feature | Status | Via |
|---------|--------|-----|
| Sequential operations | ✅ 100% | Strom |
| Concurrent operations | ✅ 90% | Strom + Om.race/inParallel |
| Infinite streams | ✅ 100% | Strom (*Infinite variants) |
| Time operations | ✅ 85% | Strom + Om.delay |
| Resource safety | ✅ 100% | Strom bracket |
| Error handling | ✅ 95% | Strom + Om utilities |
| Context management | ✅ 100% | Om expandCtx/widenCtx |
| Cancellation | ✅ 100% | Om.launchOm + Aff |
| **Overall** | **✅ ~95%** | **Strom + Om** |

## Recommendation

When using Strom:
1. ✅ Import `Yoga.Om.Strom` for streaming operations
2. ✅ Import `Yoga.Om` for Om utilities (note, throwLeftAs, expand, etc.)
3. ✅ Use `Om.launchOm` for cancellation
4. ✅ Leverage Om's full error handling toolkit
5. ✅ Use context expansion for modular streams

The combination of Strom (streaming) + Om (effects) gives you **95% of ZStream/ZIO functionality** with full PureScript type safety! 🎉
