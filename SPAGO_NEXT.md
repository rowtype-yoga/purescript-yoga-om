# Using Spago Next with yoga-om

## Quick Start

This project uses **Spago Next (v0.93.45+)** with `spago.yaml` configuration for proper workspace support.

### Installation

```bash
# 1. Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# 2. Install Spago Next using Bun
bun install -g spago@next

# 3. Verify installation
spago version
# Output: 0.93.45 (or higher)

# 4. Install dependencies
bun install     # Install JS/TS dependencies
spago install   # Install PureScript dependencies

# 5. Build
spago build

# 6. Test
bun test
```

## Why Spago Next?

### ✅ Benefits

- **Workspace Support** - True monorepo with multiple packages
- **YAML Configuration** - Modern, readable configuration
- **Colocated Tests** - Tests live with the code they test
- **Independent Packages** - Each package can be built/tested separately
- **Better Performance** - Faster builds and incremental compilation
- **Registry System** - Direct package set from PureScript registry

### ❌ Old Spago (v0.21.x)

- Uses `spago.dhall` (legacy)
- No proper workspace support
- Centralised test configuration
- Slower builds

## Configuration

### Workspace Root: `spago.yaml`

```yaml
workspace:
  package_set:
    registry: 51.1.0
```

This defines the workspace and package set version.

### Package Config: `packages/*/spago.yaml`

Each package has its own configuration:

```yaml
package:
  name: yoga-om-core
  dependencies:
    - prelude: ">=6.0.0 <7.0.0"
    - aff: ">=7.0.0 <8.0.0"
    # ...
  test:
    main: Test.Main
    dependencies:
      - spec: ">=7.0.0 <8.0.0"
```

## Commands

### Building

```bash
# Build all packages
spago build

# Build specific package
spago build -p yoga-om-core

# Watch mode
spago build --watch
```

### Testing

```bash
# Test all packages
./test-all.sh

# Test specific package
cd packages/yoga-om-core && spago test

# Watch mode
cd packages/yoga-om-core && spago test --watch
```

### Installing Dependencies

```bash
# Install all workspace dependencies
spago install

# Install specific dependency
spago install arrays

# Install in specific package
cd packages/yoga-om-core && spago install arrays
```

### Package Management

```bash
# List packages
spago ls packages

# Show dependency graph
spago graph packages
```

## Workspace Structure

```
yoga-om/
├── spago.yaml              # Workspace config (defines registry)
├── packages/
│   ├── yoga-om-core/
│   │   ├── spago.yaml      # Package config
│   │   ├── src/            # Implementation
│   │   └── test/           # Tests (colocated!)
│   ├── yoga-om-node/
│   │   ├── spago.yaml
│   │   ├── src/
│   │   └── test/
│   └── yoga-om-streams/
│       ├── spago.yaml
│       ├── src/
│       └── test/
└── .legacy/
    ├── spago.dhall         # Old config (deprecated)
    └── packages.dhall      # Old packages (deprecated)
```

## Package Dependencies

Packages can depend on each other:

```yaml
# In packages/yoga-om-node/spago.yaml
dependencies:
  - yoga-om-core: "*"  # Workspace package
```

The `"*"` version means "use the workspace version".

## Testing Workflow

### 1. Test Single Package (Fast)

```bash
cd packages/yoga-om-core
spago test
```

Only builds and tests that package.

### 2. Test All Packages

```bash
./test-all.sh
```

Tests each package independently.

### 3. Watch Mode

```bash
cd packages/yoga-om-core
spago test --watch
```

Auto-runs tests on file changes.

## CI/CD

GitHub Actions configuration:

```yaml
- name: Install Spago Next
  uses: purescript-contrib/setup-purescript@main
  with:
    purescript: "0.15.15"
    spago: "0.93.45"

- name: Test yoga-om-core
  run: cd packages/yoga-om-core && spago test

- name: Test yoga-om-node
  run: cd packages/yoga-om-node && spago test
```

Each package tests independently in parallel.

## IDE Setup

### VS Code

Install [PureScript IDE](https://marketplace.visualstudio.com/items?itemName=nwolverson.ide-purescript):

```json
// .vscode/settings.json
{
  "purescript.buildCommand": "spago build",
  "purescript.addSpagoSources": true,
  "purescript.packagePath": "spago.yaml"
}
```

### Vim/Neovim

With [psc-ide-vim](https://github.com/FrigoEU/psc-ide-vim):

```vim
" Use spago
let g:psc_ide_use_spago = 1
```

## Troubleshooting

### "There's no spago.dhall"

You're using old Spago. Install Spago Next:

```bash
npm uninstall -g spago
npm install -g spago@next
```

### "Module not found"

Install dependencies:

```bash
spago install
```

### Tests don't run

Make sure you're in the package directory:

```bash
cd packages/yoga-om-core
spago test
```

Or use the test script:

```bash
./test-all.sh
```

## Resources

- [Spago Next Documentation](https://github.com/purescript/spago)
- [PureScript Registry](https://github.com/purescript/registry)
- [Migration Guide](./MIGRATION.md)
- [Testing Guide](./TESTING.md)

## Version Information

- **Spago Next**: 0.93.45+
- **PureScript**: 0.15.15+
- **Package Set**: registry:51.1.0

Check versions:

```bash
spago version    # Should be 0.93.45+
purs --version   # Should be 0.15.15+
```
