# yoga-om-streams

Bolson-based streaming/FRP integration for yoga-om, bridging Om computations with Bolson's event system.

## Installation

```bash
spago install yoga-om-core yoga-om-streams bolson
```

## What's Included

- **Event conversion**: `omToEvent`, `eventToOm` for converting between Om and Events
- **Streaming**: `streamOms` for streaming multiple Om computations as events
- **Combinators**: `raceEvents`, `filterMapOm`, `foldOms` for event manipulation
- **Context integration**: `withEventStream` for working with events within Om context

## Usage

### Converting Om to Event

```purescript
import Yoga.Om.Streams as Streams

myEvent :: Event User
myEvent = Streams.omToEvent ctx handlers fetchUser

-- Use with Bolson's event combinators
userEvent = myEvent <#> _.name
```

### Converting Event to Om

```purescript
import Yoga.Om.Streams as Streams

processClicks :: Om _ _ Unit
processClicks = do
  clickData <- Streams.eventToOm buttonClickEvent
  -- Process the first click
  Console.log $ "Clicked: " <> show clickData
```

### Streaming Multiple Oms

```purescript
import Yoga.Om.Streams as Streams

allUsers :: Event User
allUsers = Streams.streamOms ctx handlers
  [ fetchUser 1
  , fetchUser 2
  , fetchUser 3
  ]
```

### Event Fold with Om

```purescript
import Yoga.Om.Streams as Streams

runningTotal :: Event Int
runningTotal = Streams.foldOms
  (\total value -> do
    -- Can do Om operations here
    Console.log $ "Adding " <> show value
    pure (total + value)
  )
  0
  ctx
  handlers
  numberEvent
```

### Working with Event Streams in Om Context

```purescript
import Yoga.Om.Streams as Streams

reactToEvents :: Om { logger :: Logger } _ (Event String)
reactToEvents = Streams.withEventStream inputEvent \input -> do
  { logger } <- Om.ask
  -- Process input within Om context
  log logger input
  pure (String.toUpper input)
```

## Integration with Bolson

This package is designed to work seamlessly with Bolson's FRP system. You can:

- Convert Om computations to Events for use in Bolson components
- Handle user interactions (clicks, input) through Events and process them with Om
- Combine async Om operations with reactive event streams
- Maintain Om's error handling and dependency injection within event processing

## See Also

- **[yoga-om-core](../yoga-om-core)** - Core Om functionality (required)
- **[yoga-om-node](../yoga-om-node)** - Node.js-specific extensions
- **[Bolson documentation](https://pursuit.purescript.org/packages/purescript-bolson)** - FRP application builder

For more examples, see the [tests](../../test/Test/Streams.purs).
