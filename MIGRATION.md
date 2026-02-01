# Migration Guide: Spago v0.21 → Spago Next (v0.93.45)

## Overview

This project has been migrated from **Spago v0.21.0** (using `spago.dhall`) to **Spago Next v0.93.45** (using `spago.yaml`). This enables proper workspace support with colocated tests.

## What Changed

### Configuration Files

**Before (spago.dhall):**
```dhall
{ name = "yoga-om"
, dependencies = [ "aff", "arrays", ... ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}
```

**After (spago.yaml):**
```yaml
workspace:
  package_set:
    registry: 51.1.0
```

### Test Structure

**Before:**
- Centralised tests in `/test`
- Tests run with `spago -x test.dhall test`
- Single monolithic test configuration

**After:**
- Tests colocated with each package in `packages/*/test/`
- Each package has its own test configuration
- Tests run independently per package

## Installation

### 1. Install Bun

```bash
# Install Bun first
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
```

### 2. Install Spago Next

```bash
# Uninstall old spago (if installed globally)
npm uninstall -g spago

# Install Spago Next using Bun
bun install -g spago@next

# Or use the project's local version
bun install  # Installs spago@0.93.45 from package.json
```

### 2. Verify Installation

```bash
spago version
# Should show: 0.93.45 or higher
```

### 3. Install Dependencies

```bash
# From workspace root
spago install

# This will install all workspace dependencies
```

## Running Tests (New Way)

### All Tests
```bash
# Using npm/bun scripts
bun test

# Using shell script
./test-all.sh

# Individual packages
./test-all.sh core
./test-all.sh node
./test-all.sh streams
```

### Individual Package Tests
```bash
# yoga-om-core
cd packages/yoga-om-core && spago test

# yoga-om-node
cd packages/yoga-om-node && spago test

# yoga-om-streams
cd packages/yoga-om-streams && spago test
```

### Watch Mode
```bash
cd packages/yoga-om-core && spago test --watch
```

## Building (New Way)

### All Packages
```bash
spago build
```

### Individual Packages
```bash
spago build -p yoga-om-core
spago build -p yoga-om-node
spago build -p yoga-om-streams
```

## Migration Checklist

If you're working on this project:

- [ ] Install Spago Next (v0.93.45+)
- [ ] Remove old spago installation: `npm uninstall -g spago`
- [ ] Install dependencies: `spago install`
- [ ] Run tests: `bun test` or `./test-all.sh`
- [ ] Update IDE/editor settings to use new spago

## Breaking Changes

### ❌ These No Longer Work

```bash
spago -x test.dhall test    # Old way - NO LONGER WORKS
spago test                   # Without cd to package - DOESN'T RUN TESTS
```

### ✅ Use These Instead

```bash
./test-all.sh               # Test all packages
bun test                    # Same
cd packages/yoga-om-core && spago test  # Test one package
```

## Legacy Files

Legacy Spago v0.21 configuration files have been moved to `.legacy/`:

```
.legacy/
  spago.dhall       # Old workspace config
  packages.dhall    # Old package set
  README.md         # Explanation
```

These are kept for reference but are **not used** by the build system.

## IDE Configuration

### VS Code (PureScript IDE)

Update `.vscode/settings.json`:

```json
{
  "purescript.buildCommand": "spago build",
  "purescript.addSpagoSources": true,
  "purescript.packagePath": "spago.yaml"
}
```

### Vim/Neovim

If using psc-ide-vim or similar:

```vim
" Use workspace root
let g:psc_ide_server_port = 4242
```

## Troubleshooting

### Error: "There's no spago.dhall"

**Problem:** You're using old Spago v0.21

**Solution:**
```bash
npm uninstall -g spago
npm install -g spago@next
```

### Error: "Module X not found"

**Problem:** Dependencies not installed

**Solution:**
```bash
spago install
```

### Error: "Invalid option --watch"

**Problem:** Old spago version

**Solution:** Upgrade to Spago Next (see above)

### Tests Don't Run

**Problem:** Running `spago test` from wrong directory

**Solution:**
```bash
# Either use the test script
./test-all.sh

# Or cd to a specific package
cd packages/yoga-om-core && spago test
```

## Benefits of New Setup

✅ **True Workspace Support** - Proper monorepo with independent packages  
✅ **Colocated Tests** - Tests live with the code they test  
✅ **Independent Testing** - Test only what you're working on  
✅ **Modern Tooling** - Latest Spago features  
✅ **Better CI** - Run tests independently in parallel  
✅ **Faster Builds** - Incremental compilation per package  

## Documentation

Updated documentation:
- [TESTING.md](./TESTING.md) - Testing guide
- [STRUCTURE.md](./STRUCTURE.md) - Workspace structure
- [COLOCATION_SUMMARY.md](./COLOCATION_SUMMARY.md) - Test colocation changes

## Questions?

See the [README](./README.md) or check [Spago Next documentation](https://github.com/purescript/spago).
