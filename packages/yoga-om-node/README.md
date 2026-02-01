# yoga-om-node

Node.js-specific extensions for yoga-om, providing convenient wrappers for file system operations, environment variables, and more.

## Installation

```bash
spago install yoga-om-core yoga-om-node
```

## What's Included

- **File operations**: `readFile`, `writeFile`, `readTextFile`, `writeTextFile`, `appendFile`, etc.
- **File system**: `exists`, `mkdir`, `rmdir`, `unlink`
- **Environment variables**: `getEnv`, `lookupEnv`, `setEnv`
- **Process**: `cwd` for current working directory

All operations are wrapped in `Om` with proper error types.

## Usage

### Reading Environment Variables

```purescript
import Yoga.Om.Node as Node

loadConfig :: Om {} (envNotFound :: { variable :: String }) Config
loadConfig = do
  apiKey <- Node.getEnv "API_KEY"
  dbUrl <- Node.getEnv "DATABASE_URL"
  pure { apiKey, dbUrl }
```

### File Operations

```purescript
import Yoga.Om.Node as Node

processFile :: Om {} (fileReadError :: _, fileWriteError :: _) Unit
processFile = do
  content <- Node.readTextFile "input.txt"
  let processed = String.toUpper content
  Node.writeTextFile "output.txt" processed
```

### Checking File Existence

```purescript
import Yoga.Om.Node as Node

safeRead :: FilePath -> Om {} _ (Maybe String)
safeRead path = do
  fileExists <- Node.exists path
  if fileExists
    then Just <$> Node.readTextFile path
    else pure Nothing
```

## Error Types

The package defines error type aliases for common failures:

- `FileError` - Includes `fileNotFound`, `fileReadError`, `fileWriteError`, `fileSystemError`
- `EnvError` - Includes `envNotFound`

These can be extended with your own error types:

```purescript
type MyErrors r = Node.FileError + Node.EnvError + 
  ( customError :: String | r )
```

## Testing

Tests are colocated with the implementation in the `test/` directory:

```bash
# Run tests
cd packages/yoga-om-node && spago test

# Or from workspace root
bun test:node
```

See [test/Test/Node.purs](./test/Test/Node.purs) for test examples.

## Package Structure

```
yoga-om-node/
├── src/
│   └── Yoga/
│       └── Om/
│           └── Node.purs       # Node.js extensions
└── test/                        # Tests colocated here!
    └── Test/
        ├── Main.purs           # Test runner
        └── Node.purs           # Node-specific tests
```

## See Also

- **[yoga-om-core](../yoga-om-core)** - Core Om functionality (required)
- **[yoga-om-rom](../yoga-om-rom)** - Reactive Om: Bolson FRP integration
- **[yoga-om-strom](../yoga-om-strom)** - Stream Om: Pull-based streaming

For more examples, see the [tests](./test/) and [main README](../../README.md).
