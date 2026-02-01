# 🕉️ yoga-om

A powerful general purpose type for writing applications with dependency injection and checked exceptions.

This workspace contains three packages:

- **[yoga-om-core](./packages/yoga-om-core)** - Core Om types and operations (platform-agnostic)
- **[yoga-om-node](./packages/yoga-om-node)** - Node.js-specific extensions
- **[yoga-om-streams](./packages/yoga-om-streams)** - Bolson-based streaming/FRP integration

For an extensive overview checkout the [tests](./test/Test/Main.purs).

## Installation

This project recommends [Bun](https://bun.sh) as the package manager for faster installs and better performance (~3x faster than npm).

```bash
# Install Bun (recommended)
curl -fsSL https://bun.sh/install | bash

# Install workspace dependencies
bun install

# Build all packages
bun run build

# Run tests
bun run test
```

> **Note:** While npm/yarn will work, Bun is recommended for the best developer experience. The `packageManager` field in `package.json` indicates the preferred tool.

### Adding Packages to Your Project

### Core Package (Required)

```bash
spago install yoga-om-core
```

### Node.js Extensions (Optional)

```bash
spago install yoga-om-node
```

### Streaming/FRP Integration (Optional)

```bash
spago install yoga-om-streams
```

## Quickstart

Check out the [minimal example](#running-an-om)!

## Which Package Should I Use?

- **yoga-om-core**: Start here! This is the base package that provides the `Om` type and all core operations. It works in both browser and Node.js environments.

- **yoga-om-node**: Add this if you're building a Node.js application and want convenient wrappers for file system operations, environment variables, etc.

- **yoga-om-streams**: Add this if you're integrating with Bolson's FRP system for event-driven or reactive programming.

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
