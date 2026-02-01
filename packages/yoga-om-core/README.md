# yoga-om-core

Core Om types and operations for writing applications with dependency injection and checked exceptions.

This is the base package that provides the `Om` type and all core operations. It works in both browser and Node.js environments.

## Installation

```bash
spago install yoga-om-core
```

## What's Included

- **Om type**: The core monad transformer stack combining `ReaderT`, `ExceptV`, and `Aff`
- **Error handling**: `throw`, `handleErrors`, `expand` for mix-and-match error types
- **Dependency injection**: `ask`, `asks` for accessing context
- **Parallel computations**: `race`, `inParallel` for concurrent operations
- **Helpers**: `note`, `delay`, `unliftAff` and more

## Basic Usage

```purescript
import Yoga.Om (Om)
import Yoga.Om as Om

myApp :: Om { dbUrl :: String } (dbError :: String) Unit
myApp = do
  { dbUrl } <- Om.ask
  -- Your application logic here
  pure unit

main = myApp 
  # Om.launchOm_ 
      { dbUrl: "postgresql://localhost" }
      { exception: \e -> Console.error (show e)
      , dbError: \err -> Console.error err
      }
```

## Features

### Context (Dependency Injection)

```purescript
getUser :: Om { db :: Database } _ User
getUser = do
  { db } <- Om.ask
  -- Use db to fetch user
```

### Error Handling

```purescript
saveUser :: Om _ (dbError :: String, validationError :: String) Unit
saveUser = do
  -- Can throw either dbError or validationError
  Om.throw { validationError: "Invalid email" }
```

### Parallel Operations

```purescript
fetchMultiple :: Om _ _ (Array User)
fetchMultiple = Om.inParallel
  [ fetchUser 1
  , fetchUser 2
  , fetchUser 3
  ]
```

## See Also

- **[yoga-om-node](../yoga-om-node)** - Node.js-specific extensions
- **[yoga-om-streams](../yoga-om-streams)** - Bolson FRP integration

For more examples, see the [main README](../../README.md) and [tests](../../test).
