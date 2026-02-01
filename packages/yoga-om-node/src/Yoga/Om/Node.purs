module Yoga.Om.Node
  ( readFile
  , readTextFile
  , writeFile
  , writeTextFile
  , appendFile
  , appendTextFile
  , exists
  , mkdir
  , rmdir
  , unlink
  , getEnv
  , lookupEnv
  , setEnv
  , cwd
  , FileError
  , EnvError
  ) where

import Prelude

import Data.Either (Either(..))
import Data.Maybe (Maybe, maybe)
import Effect.Aff (Aff)
import Effect.Class (liftEffect)
import Node.Buffer (Buffer)
import Node.Encoding (Encoding(..))
import Node.FS.Aff as FS
import Node.Path (FilePath)
import Node.Process as Process
import Yoga.Om (Om)
import Yoga.Om as Om

-- | Error types for file operations
type FileError r =
  ( fileNotFound :: { path :: FilePath }
  , fileReadError :: { path :: FilePath, message :: String }
  , fileWriteError :: { path :: FilePath, message :: String }
  , fileSystemError :: { message :: String }
  | r
  )

-- | Error types for environment variable operations
type EnvError r =
  ( envNotFound :: { variable :: String }
  | r
  )

-- | Read a file as a Buffer
readFile
  :: forall ctx err
   . FilePath
  -> Om ctx (FileError err) Buffer
readFile path = do
  result <- Om.fromAff $ FS.readFile path
  pure result

-- | Read a file as text with UTF-8 encoding
readTextFile
  :: forall ctx err
   . FilePath
  -> Om ctx (FileError err) String
readTextFile path = do
  result <- Om.fromAff $ FS.readTextFile UTF8 path
  pure result

-- | Write a Buffer to a file
writeFile
  :: forall ctx err
   . FilePath
  -> Buffer
  -> Om ctx (FileError err) Unit
writeFile path buffer = do
  Om.fromAff $ FS.writeFile path buffer

-- | Write text to a file with UTF-8 encoding
writeTextFile
  :: forall ctx err
   . FilePath
  -> String
  -> Om ctx (FileError err) Unit
writeTextFile path content = do
  Om.fromAff $ FS.writeTextFile UTF8 path content

-- | Append a Buffer to a file
appendFile
  :: forall ctx err
   . FilePath
  -> Buffer
  -> Om ctx (FileError err) Unit
appendFile path buffer = do
  Om.fromAff $ FS.appendFile path buffer

-- | Append text to a file with UTF-8 encoding
appendTextFile
  :: forall ctx err
   . FilePath
  -> String
  -> Om ctx (FileError err) Unit
appendTextFile path content = do
  Om.fromAff $ FS.appendTextFile UTF8 path content

-- | Check if a file or directory exists
exists
  :: forall ctx err
   . FilePath
  -> Om ctx err Boolean
exists path = do
  (Om.fromAff $ FS.stat path $> true)
    # Om.handleErrors { exception: \_ -> pure false }

-- | Create a directory
mkdir
  :: forall ctx err
   . FilePath
  -> Om ctx (FileError err) Unit
mkdir path = do
  Om.fromAff $ FS.mkdir path

-- | Remove a directory
rmdir
  :: forall ctx err
   . FilePath
  -> Om ctx (FileError err) Unit
rmdir path = do
  Om.fromAff $ FS.rmdir path

-- | Delete a file
unlink
  :: forall ctx err
   . FilePath
  -> Om ctx (FileError err) Unit
unlink path = do
  Om.fromAff $ FS.unlink path

-- | Get an environment variable, throwing an error if not found
getEnv
  :: forall ctx err
   . String
  -> Om ctx (EnvError err) String
getEnv variable = do
  value <- lookupEnv variable
  value # Om.note { envNotFound: { variable } }

-- | Look up an environment variable, returning Maybe
lookupEnv
  :: forall ctx err
   . String
  -> Om ctx err (Maybe String)
lookupEnv variable = do
  Om.fromAff $ liftEffect $ Process.lookupEnv variable

-- | Set an environment variable
setEnv
  :: forall ctx err
   . String
  -> String
  -> Om ctx err Unit
setEnv variable value = do
  Om.fromAff $ liftEffect $ Process.setEnv variable value

-- | Get the current working directory
cwd
  :: forall ctx err
   . Om ctx err FilePath
cwd = do
  Om.fromAff $ liftEffect $ Process.cwd
