# Playground

A playground project for experimenting with yoga-om-layer.

## Prerequisites

This project requires **Spago Next (0.93.45+)**. If you have the old Spago (0.21.x), you need to upgrade:

```bash
# Using Bun (recommended)
bun install -g spago@next

# Or using npm
npm uninstall -g spago
npm install -g spago@next

# Verify installation
spago version  # Should be 0.93.45+
```

## Running

From the playground directory:

```bash
# Easy way - using the run script
./run.sh

# Or directly with spago
spago run
```

## What's in the playground?

The `src/Main.purs` file contains a simple example that demonstrates:
- Creating services (Logger and Config)
- Building a layer that provides multiple services
- Running a function that consumes services from the layer

Feel free to modify and experiment!

## Example modifications to try

1. **Add a new service:**
   ```purescript
   type Database = { query :: String -> Effect (Array String) }
   
   database :: Database
   database = { query: \q -> do
       Console.log $ "Querying: " <> q
       pure ["result1", "result2"]
   }
   ```

2. **Update the layer to provide it:**
   ```purescript
   appLayer =
     layer
       # provide (Proxy :: _ "logger") logger
       # provide (Proxy :: _ "config") config
       # provide (Proxy :: _ "db") database
   ```

3. **Use it in your app:**
   ```purescript
   runApp :: ( "logger" ::: Logger, "config" ::: Config, "db" ::: Database ) :> {} -> Effect Unit
   runApp =
     layer
       # run \{ logger: l, config: c, db } -> do
           l.log "Starting..."
           results <- db.query "SELECT * FROM users"
           l.log $ "Got " <> show (length results) <> " results"
   ```
