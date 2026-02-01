# yoga-om-rom

**Reactive Om** - Bolson-based FRP integration for yoga-om, bridging Om computations with Bolson's event system.

## Installation

```bash
spago install yoga-om-core yoga-om-rom bolson
```

## What's Included

- **Event conversion**: `omToEvent`, `eventToOm` for converting between Om and Events
- **Streaming**: `streamOms` for streaming multiple Om computations as events
- **Combinators**: `raceEvents`, `filterMapOm`, `foldOms` for event manipulation
- **Context integration**: `withEventStream` for working with events within Om context

## Usage

### Converting Om to Event

```purescript
import Yoga.Om.Rom as Rom

myEvent :: Event User
myEvent = Rom.omToEvent ctx handlers fetchUser

-- Use with Bolson's event combinators
userEvent = myEvent <#> _.name
```

### Converting Event to Om

```purescript
import Yoga.Om.Rom as Rom

processClicks :: Om _ _ Unit
processClicks = do
  clickData <- Rom.eventToOm buttonClickEvent
  -- Process the first click
  Console.log $ "Clicked: " <> show clickData
```

### Streaming Multiple Oms

```purescript
import Yoga.Om.Rom as Rom

allUsers :: Event User
allUsers = Rom.streamOms ctx handlers
  [ fetchUser 1
  , fetchUser 2
  , fetchUser 3
  ]
```

### Event Fold with Om

```purescript
import Yoga.Om.Rom as Rom

runningTotal :: Event Int
runningTotal = Rom.foldOms
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
import Yoga.Om.Rom as Rom

reactToEvents :: Om { logger :: Logger } _ (Event String)
reactToEvents = Rom.withEventStream inputEvent \input -> do
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

## Testing

Tests are colocated with the implementation in the `test/` directory:

```bash
# Run tests
cd packages/yoga-om-rom && spago test

# Or from workspace root
bun test:rom
```

See [test/Test/Rom.purs](./test/Test/Rom.purs) for test examples.

## Package Structure

```
yoga-om-rom/
├── src/
│   └── Yoga/
│       └── Om/
│           └── Rom.purs    # Bolson FRP integration
└── test/                    # Tests colocated here!
    └── Test/
        ├── Main.purs       # Test runner
        └── Rom.purs        # Rom tests
```

## See Also

- **[yoga-om-core](../yoga-om-core)** - Core Om functionality (required)
- **[yoga-om-node](../yoga-om-node)** - Node.js-specific extensions
- **[yoga-om-strom](../yoga-om-strom)** - Pull-based streaming library (complementary)
- **[Bolson documentation](https://pursuit.purescript.org/packages/purescript-bolson)** - FRP application builder

For more examples, see the [tests](./test/) and [main README](../../README.md).
