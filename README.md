# 🕉️ yoga-om

A powerful general purpose type for writing applications with dependency injection and checked exceptions.

> **⚠️ Important:** This project uses **Spago Next (v0.93.45+)** with `spago.yaml`. It will not work with old Spago v0.21.x. See [SPAGO_NEXT.md](./SPAGO_NEXT.md) or [MIGRATION.md](./MIGRATION.md).

This workspace contains four packages:

- **[yoga-om-core](./packages/yoga-om-core)** - Core Om types and operations (platform-agnostic)
- **[yoga-om-node](./packages/yoga-om-node)** - Node.js-specific extensions
- **[yoga-om-rom](./packages/yoga-om-rom)** - Reactive Om: Bolson-based FRP integration (push-based events)
- **[yoga-om-strom](./packages/yoga-om-strom)** - Stream Om: Pull-based streaming library for data processing

For an extensive overview, check out the tests in each package:
- [yoga-om-core tests](./packages/yoga-om-core/test/)
- [yoga-om-node tests](./packages/yoga-om-node/test/)
- [yoga-om-rom tests](./packages/yoga-om-rom/test/)
- [yoga-om-strom tests](./packages/yoga-om-strom/test/)

## Prerequisites

This project requires:
- **Bun** - Fast JavaScript runtime and package manager
- **Spago Next (v0.93.45+)** - For workspace and yaml configuration support
- **PureScript (v0.15.15+)** - The PureScript compiler

## Installation

### 1. Install Bun

```bash
# Install Bun (fast JavaScript runtime & package manager)
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version  # Should show 1.0+
```

### 2. Install Spago Next

```bash
# Install Spago Next globally using Bun
bun install -g spago@next

# Verify installation
spago version  # Should show 0.93.45+
```

> **Important:** This project uses `spago.yaml` (Spago Next) and **will not work** with old Spago v0.21.x. See [MIGRATION.md](./MIGRATION.md) if migrating from old Spago.

### 3. Install Dependencies

```bash
# Install workspace dependencies
bun install

# Install PureScript dependencies
spago install
```

### 4. Build and Test

```bash
# Build all packages
bun run build

# Run all tests
bun test

# Or test individual packages
bun test:core    # Test yoga-om-core
bun test:node    # Test yoga-om-node
bun test:rom     # Test yoga-om-rom
bun test:strom   # Test yoga-om-strom
```

### Adding Packages to Your Project

### Core Package (Required)

```bash
spago install yoga-om-core
```

### Node.js Extensions (Optional)

```bash
spago install yoga-om-node
```

### Reactive FRP Integration (Optional)

```bash
spago install yoga-om-rom
```

### Pull-Based Streaming (Optional)

```bash
spago install yoga-om-strom
```

## Quickstart

Check out the [minimal example](#running-an-om)!

## Which Package Should I Use?

- **yoga-om-core**: Start here! This is the base package that provides the `Om` type and all core operations. It works in both browser and Node.js environments.

- **yoga-om-node**: Add this if you're building a Node.js application and want convenient wrappers for file system operations, environment variables, etc.

- **yoga-om-rom**: Add this if you're integrating with Bolson's FRP system for push-based reactive/event-driven programming (UI, user interactions).

- **yoga-om-strom**: Add this for pull-based data streaming with features like batching, parallel processing, and resource-safe stream composition (APIs, file I/O, data pipelines).

## Documentation

### 📚 Setup & Configuration
- **[BUN_SETUP.md](./BUN_SETUP.md)** - Bun usage guide
- **[BUN_ONLY.md](./BUN_ONLY.md)** - Why Bun-only (no nvm/npm)
- **[SPAGO_NEXT.md](./SPAGO_NEXT.md)** - Spago Next guide
- **[YAML_ONLY.md](./YAML_ONLY.md)** - YAML configuration (no Dhall)
- **[MIGRATION.md](./MIGRATION.md)** - Migrating from old Spago

### 🏗️ Project Structure
- **[STRUCTURE.md](./STRUCTURE.md)** - Workspace organisation
- **[TESTING.md](./TESTING.md)** - Testing guide
- **[COLOCATION_SUMMARY.md](./COLOCATION_SUMMARY.md)** - Test colocation

### 📦 Package Documentation
- [yoga-om-core README](./packages/yoga-om-core/README.md)
- [yoga-om-node README](./packages/yoga-om-node/README.md)
- [yoga-om-rom README](./packages/yoga-om-rom/README.md)
- [yoga-om-strom README](./packages/yoga-om-strom/README.md)

## What can it do?

An `Om` consists of three parts. 
A *context*, potential *errors*, and the *value* of a concurrent computation.

Conventionally in code, we abbreviate this as `Om ctx errs a`.

### `ctx`: Dependency injection

`Om` supports writing code that `ask`s for dependencies that you only provide
once at the start of the application.

```purescript
myOmThatNeedsDbName = do
  { dbName } <- ask
```

This is an `Om` of the shape `Om { dbName :: String } _ _`. We are only 
concerned about the `ctx` part of `Om` in this section, hence the `_`s.

### `errors`: Mix-and match errors

Dealing with failure in `Om` is just wonderful.

### Throwing errors
To throw an error, simply use the `throwError` function with a record that 
has the name of the error as its label and the error data as its value:

```purescript
myOmThatThrows = Om.throw { myError: "This failed" }
```

This is an `Om _ ( myError :: String ) _`

### Handling errors
To catch one or multiple errors use `handleErrors`

```purescript
myOmHandled = handleErrors { myError: \text -> Console.warn text } myOmThatThrows
```

As stated earlier `myOmThatThrows` has type: `Om _ (myError :: String) _`.

By handling all potential `myError` errors we've produced `myOmHandled` which has 
the type `Om _ () _`.

### Combining errors

A powerful feature of `Om` is that you can easily combine different `Om`
computations that can throw different errors.

```purescript
om1 :: forall otherErrors. Om _ ( ioError :: Int | otherErrors ) _
om1 = throw { ioError: -8 }

om2 :: forall otherErrors. Om _ ( userError :: String | otherErrors ) _
om2 = throw { userError: "Your last name can't be shorter than 0 characters" }

om3 :: forall errs. Om _ ( ioError :: Int, userError :: String | errs ) _ 
om3 = do 
  om1
  om2
```

This means that you can and should only tag a function with the errors it can actually
throw and not the complete set of errors that might happen anywhere in your program.

The compiler helps you out with this.

### Working with `Aff` and `Effect`

In order to transform any `Aff a` into an `Om _ _ a` you may use `liftAff`, or `fromAff`.
To do the same with `Effect` you may use `liftEffect`.

### Running an `Om`

Let's bring it all back home. Eventually you want to actually run an `Om`.
Most probably at the start of your application, in a `main :: Effect Unit` function for
example.

That's the right time to supply the dependencies to your `Om` and to handle any remaining possible errors:

```purescript
module Main where

import Prelude
import Effect.Class.Console as Console
import Effect (Effect)
import Data.Maybe (Maybe)
import Yoga.Om as Om
import Yoga.Om (Om)
import Yoga.Om.Node as Node

main :: Effect Unit
main = do
  greet
    # Om.launchOm_
        {}
        { exception:
            \e -> Console.error ("Unexpected exception: " <> show e)
        , nameNotFound:
            \{ variable } -> Console.error $ "Make sure the $" <> variable <> " env variable is set"
        }

greet :: Om {} (nameNotFound :: { variable :: String }) Unit
greet = do
  name <- Node.getEnv "NAME"
  Console.log $ "Welcome " <> name
```

### Parallel computations

You can run different `Om`s in parallel.

Either the fastest one that does not error out wins:
```purescript
Om.race [ Om.delay (1.0 # Seconds) *> pure "slow" , pure "fast" ]
```

Or you look at all the results and get an `Om _ _ (Array _)`:
```purescript
Om.inParallel
    [ Om.delay (9.0 # Milliseconds) *> pure "1"
    , Om.delay (1.0 # Milliseconds) *> pure "2"
    ]
```

## FAQ

### What if I need `State` and `Writer`? 

Since `Om` combines the powers of `Reader` and supports `Effect`ful computations
it is less clutter (especially on the type signature) to bolt this functionality 
on ad-hoc via `Ref`s in the `ctx` 


### It's so tedious to repeat the labels and keys in `ctx` and `errs`

You will probably prefer to define type aliases:

```purescript
module Main where

import DB as DB
import Cache as Cache
-- ...
import Type.Row (type (+))

myWholeApp :: Om (DB.Ctx + Cache.Ctx ()) (DB.Errs + Cache.Errs ()) Unit
myWholeApp = do
  DB.writeToDB "'); DROP TABLE orders;--"

```

```purescript
module DB where

writeToDB :: forall ctx errs. String -> Om (Ctx ctx) (Errs errs) Unit
writeToDB s = do
  -- ...
  pure unit 


type Ctx r = (dbCtx :: { port :: Int, hostname :: String } | r)

type Errs r = IOErr + TimeoutErr + r
type IOErr r = ( ioError :: { message :: String, code :: Int, details :: String } | r )
type TimeoutErr r = ( timeout :: { query :: String } | r )

```

## Technical behind the scenes info

`Om` is a monad transformer stack built from the stack safe continuation 
passing `RWSET` without `State` or `Writer` with errors specialised to 
polymorphic `Variant`s.


# Special Thanks

We would like to thank all the PureScript contributors, especially the ones whose libraries we depend on.

Special thanks to @reactormonk who has a very similar library ([rave](https://github.com/reactormonk/purescript-rave)) which has the trick to inject variants as single field records instead of the cumbersome `(Proxy :: Proxy "key") value` syntax.
