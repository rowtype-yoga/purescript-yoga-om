module Main where

import Prelude

import Effect (Effect)
import Effect.Console as Console
import Yoga.Om.Layer (type (:::), type (:>), layer, provide, run)

-- Example services for the playground

-- A simple logger service
type Logger = { log :: String -> Effect Unit }

logger :: Logger
logger = { log: Console.log }

-- A config service
type Config = { appName :: String, port :: Int }

config :: Config
config = { appName: "Playground App", port: 3000 }

-- Example layer that provides both services
appLayer :: {} :> ( "logger" ::: Logger, "config" ::: Config )
appLayer =
  layer
    # provide (Proxy :: _ "logger") logger
    # provide (Proxy :: _ "config") config

-- Example function that uses the services from the layer
runApp :: ( "logger" ::: Logger, "config" ::: Config ) :> {} -> Effect Unit
runApp =
  layer
    # run \{ logger: l, config: c } -> do
        l.log "=== Playground App Starting ==="
        l.log $ "App Name: " <> c.appName
        l.log $ "Port: " <> show c.port
        l.log "=== Ready to play! ==="

main :: Effect Unit
main = do
  Console.log "Starting playground..."
  runApp appLayer
  Console.log "\nTry modifying the layer or adding new services!"
