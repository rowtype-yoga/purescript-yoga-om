# Testing Guide

## Prerequisites

This project uses **Bun** and **Spago Next (v0.93.45+)** with `spago.yaml` configuration and **file-level test colocation**.

```bash
# Install Bun (required!)
curl -fsSL https://bun.sh/install | bash

# Install Spago Next using Bun
bun install -g spago@next

# Verify versions
bun --version     # Should show 1.0+
spago version     # Should show 0.93.45+
```

> **Important:** Tests will not work with old Spago v0.21.x or npm-based workflow. See [MIGRATION.md](./MIGRATION.md) for upgrade instructions.

## Overview

Tests are **colocated at the file level** with their implementations. Each test file has a `.test.purs` suffix and lives right next to the code it tests.

## Test Structure

### File-Level Colocation

```
packages/
  yoga-om-core/
    src/
      Yoga/
        Om.purs                 # ← Implementation
        Om.test.purs            # ← Tests right next to it! ⭐
        Om/
          Error.purs
          Error.js
      Test/
        Main.purs               # Test runner entry point
    spago.yaml                  # Includes test config + exclude patterns
  
  yoga-om-node/
    src/
      Yoga/
        Om/
          Node.purs             # ← Implementation
          Node.test.purs        # ← Tests right next to it! ⭐
      Test/
        Main.purs               # Test runner entry point
    spago.yaml
  
  yoga-om-rom/
    src/
      Yoga/
        Om/
          Rom.purs              # ← Implementation
          Rom.test.purs         # ← Tests right next to it! ⭐
      Test/
        Main.purs               # Test runner entry point
    spago.yaml

  yoga-om-strom/
    src/
      Yoga/
        Om/
          Strom.purs            # ← Implementation
          Strom.test.purs       # ← Tests right next to it! ⭐
          Strom/
            Do.purs             # ← Implementation
            Do.test.purs        # ← Tests right next to it! ⭐
            Examples.purs
      Test/
        Main.purs               # Test runner entry point
    spago.yaml
```

### Benefits of This Structure

1. **Immediate Context**: Tests are right there when you're reading/editing implementation
2. **Easy Refactoring**: Move/rename a module, the test moves with it
3. **Clear Ownership**: No guessing which test tests which module
4. **Modern Best Practice**: Same pattern as Rust, Go, TypeScript
5. **Publishing Safety**: Tests are excluded from published packages via `exclude` patterns

## Running Tests

### All Tests

Run tests for all packages:

```bash
# Using npm/bun scripts
bun test
# or
npm test

# Using shell script directly
./test-all.sh
```

### Individual Package Tests

Run tests for a specific package:

```bash
# yoga-om-core
bun test:core
cd packages/yoga-om-core && spago test

# yoga-om-node
bun test:node
cd packages/yoga-om-node && spago test

# yoga-om-rom
bun test:rom
cd packages/yoga-om-rom && spago test

# yoga-om-strom
bun test:strom
cd packages/yoga-om-strom && spago test
```

### Watch Mode

Run tests in watch mode (re-runs on file changes):

```bash
cd packages/yoga-om-core && spago test --watch
```

## Writing Tests

### Test File Naming

Test files use the `.test.purs` suffix and are colocated with the implementation:

```
Yoga/Om/Node.purs       # Implementation
Yoga/Om/Node.test.purs  # Tests
```

### Test Module Naming

Test modules follow the pattern `<Module>.Test`:

```purescript
-- In Yoga/Om/Node.test.purs
module Yoga.Om.Node.Test where

import Yoga.Om.Node as Node  -- Import what you're testing

spec :: Spec Unit
spec = do
  describe "Yoga.Om.Node" do
    it "does something" do
      -- test code
```

### Test Framework

We use **purescript-spec** for testing:

```purescript
module Yoga.Om.MyModule.Test where

import Prelude

import Test.Spec (Spec, describe, it, pending)
import Test.Spec.Assertions (shouldEqual, shouldReturn, fail)
import Yoga.Om as Om
import Yoga.Om.MyModule as MyModule

spec :: Spec Unit
spec = do
  describe "MyModule" do
    
    describe "Feature X" do
      
      it "works correctly" do
        result <- runOm $ MyModule.doSomething
        result `shouldEqual` expectedValue
      
      it "handles errors" do
        result <- runOm $ MyModule.doSomethingThatFails
        result `shouldEqual` fallbackValue
      
      pending "future feature not yet implemented"
```

### Test Runner

Each package has a test runner at `src/Test/Main.purs`:

```purescript
module Test.Main where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (runSpec)
import Yoga.Om.MyModule.Test as MyModuleTest

main :: Effect Unit
main = launchAff_ $ runSpec [consoleReporter] do
  MyModuleTest.spec
```

### Helper for Running Om in Tests

Common pattern for testing Om computations:

```purescript
import Effect.Aff (Aff)
import Test.Spec.Assertions (fail)
import Yoga.Om as Om

-- Helper to run Om computations in tests
runOm :: forall a. Om {} () a -> Aff a
runOm om = Om.runOm {} { exception: \err -> fail (show err) } om

-- Usage in tests
it "test something" do
  result <- runOm $ MyModule.doSomething
  result `shouldEqual` expected
```

## Test Coverage

### yoga-om-core (20 tests)
- Basics (runs safely, launches safely)
- Exception safety
- Context (Reader) composition
- Error helpers and composition
- Helper functions (Maybe, Either lifting)
- Parallel computations (race, inParallel)

### yoga-om-node (3+ tests)
- Environment variable operations
- File operations
- Current working directory

### yoga-om-rom (pending)
- Om to Event conversion
- Event to Om conversion
- Event combinators
- Context handling

### yoga-om-strom (75+ tests)
- Construction (empty, succeed, fromArray, range, iterate, unfold)
- Running/Consuming (runCollect, runDrain, runFold, runForEach)
- Transformations (map, mapOm, mapParallel, bind, scan, tap)
- Selection (take, takeWhile, drop, dropWhile, filter, collect)
- Combining (append, concat, zip, interleave, race)
- Grouping (grouped, chunked, partition)
- Do-notation (guards, comprehensions, cartesian products)
- Monadic laws
- Real-world patterns (Pythagorean triples, primes)

## Publishing Safety

Tests are **excluded from published packages** via `exclude` patterns in `spago.yaml`:

```yaml
package:
  name: yoga-om-core
  publish:
    version: 1.0.0
    license: MIT
    exclude:
      - "src/**/*.test.purs"    # ← Exclude all .test.purs files
      - "src/Test/**"           # ← Exclude test runner
    location:
      githubOwner: rowtype-yoga
      githubRepo: purescript-yoga-om
      subdir: packages/yoga-om-core
```

When you run `spago publish`, test files are automatically excluded. Only the implementation code is published to the Registry.

## CI Integration

Tests run in CI for each package:

```yaml
- name: Test yoga-om-core
  run: cd packages/yoga-om-core && spago test

- name: Test yoga-om-node
  run: cd packages/yoga-om-node && spago test

- name: Test yoga-om-rom
  run: cd packages/yoga-om-rom && spago test

- name: Test yoga-om-strom
  run: cd packages/yoga-om-strom && spago test
```

## Troubleshooting

### Tests not finding modules

Make sure you're running from the correct directory:
```bash
cd packages/yoga-om-core && spago test
```

### Spago version mismatch

Ensure you have Spago Next (0.93.45+):
```bash
spago version  # Should show 0.93.45 or higher
```

### Module not found errors

Rebuild dependencies:
```bash
cd packages/yoga-om-core
rm -rf .spago output
spago build
spago test
```

## Adding New Tests

To add tests for a new module:

1. **Create test file** next to implementation with `.test.purs` suffix:
   ```
   src/Yoga/Om/NewModule.purs       # Implementation
   src/Yoga/Om/NewModule.test.purs  # Tests ← Create this
   ```

2. **Write test module**:
   ```purescript
   module Yoga.Om.NewModule.Test where
   
   import Yoga.Om.NewModule as NewModule
   
   spec :: Spec Unit
   spec = do
     describe "NewModule" do
       it "works" do
         -- test code
   ```

3. **Add to test runner** (`src/Test/Main.purs`):
   ```purescript
   import Yoga.Om.NewModule.Test as NewModuleTest
   
   main = launchAff_ $ runSpec [consoleReporter] do
     NewModuleTest.spec
   ```

4. **Run tests**:
   ```bash
   cd packages/yoga-om-core && spago test
   ```

## Documentation

For more information:

- [COLOCATION_SUMMARY.md](./COLOCATION_SUMMARY.md) - Detailed explanation of test colocation
- [STRUCTURE.md](./STRUCTURE.md) - Workspace structure documentation
- [purescript-spec docs](https://pursuit.purescript.org/packages/purescript-spec) - Test framework documentation
- [Spago README](https://github.com/purescript/spago) - Spago documentation

## Summary

✅ Tests are colocated with implementations using `.test.purs` suffix  
✅ Tests are excluded from published packages  
✅ Each package can be tested independently  
✅ Use `bun test` to run all tests  
✅ Use `bun test:core` (etc.) to run individual packages  
