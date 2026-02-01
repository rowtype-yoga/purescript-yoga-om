# Workspace Structure

This is a monorepo workspace containing multiple PureScript packages for the yoga-om effect system.

## Package Structure

```
purescript-yoga-om/
├── packages/
│   ├── yoga-om-core/          # Core Om types and operations
│   │   ├── src/
│   │   │   └── Yoga/
│   │   │       ├── Om.purs
│   │   │       └── Om/
│   │   │           ├── Error.purs
│   │   │           └── Error.js
│   │   ├── test/               # ⭐ Tests colocated with implementation
│   │   │   └── Test/
│   │   │       ├── Main.purs
│   │   │       └── Om/
│   │   │           └── Core.purs
│   │   ├── spago.yaml
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── yoga-om-node/          # Node.js extensions
│   │   ├── src/
│   │   │   └── Yoga/
│   │   │       └── Om/
│   │   │           └── Node.purs
│   │   ├── test/               # ⭐ Tests colocated with implementation
│   │   │   └── Test/
│   │   │       ├── Main.purs
│   │   │       └── Node.purs
│   │   ├── spago.yaml
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── yoga-om-rom/           # Reactive Om: Bolson FRP integration
│   │   ├── src/
│   │   │   └── Yoga/
│   │   │       └── Om/
│   │   │           └── Rom.purs
│   │   ├── test/               # ⭐ Tests colocated with implementation
│   │   │   └── Test/
│   │   │       ├── Main.purs
│   │   │       └── Rom.purs
│   │   ├── spago.yaml
│   │   ├── package.json
│   │   └── README.md
│   │
│   ├── yoga-om-strom/         # Stream Om: Pull-based streaming
│   │   ├── src/
│   │   │   └── Yoga/
│   │   │       └── Om/
│   │   │           ├── Strom.purs
│   │   │           └── Strom/
│   │   ├── test/
│   │   │   └── Test/
│   │   ├── spago.yaml
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── yoga-om-strom/         # Advanced streaming (Strom)
│       ├── src/
│       │   └── Yoga/
│       │       └── Om/
│       │           ├── Strom.purs
│       │           └── Strom/
│       │               ├── Do.purs
│       │               └── Examples.purs
│       ├── test/               # ⭐ Tests colocated with implementation
│       │   ├── Main.purs
│       │   └── Test/
│       │       ├── Strom.purs
│       │       └── Strom/
│       │           ├── Spec.purs
│       │           └── DoNotation.purs
│       ├── examples/
│       │   ├── DoVsOperators.purs
│       │   ├── KafkaIntegration.purs
│       │   ├── KafkaIntegration.js
│       │   ├── MergingShowcase.purs
│       │   └── RealWorldDo.purs
│       ├── spago.yaml
│       ├── package.json
│       └── [... documentation files ...]
│
├── src/                       # Legacy: kept for backwards compatibility
│   └── Yoga/
│       └── Om/
│           ├── Error.purs
│           ├── Error.js
│           └── Om.purs
│
├── test/                      # Legacy: now deprecated, use package tests
│   └── Test/
│       ├── Main.purs
│       └── Main.js
│
├── spago.yaml                 # Workspace configuration
├── package.json               # Workspace scripts
├── test-all.sh                # Run all package tests
├── TESTING.md                 # Testing guide
└── README.md
```

## Key Principles

### 🏗️ **Workspace Organisation**
- Monorepo with multiple independent packages
- Each package is self-contained and publishable
- Shared workspace configuration via root `spago.yaml`

### 📦 **Package Independence**
- Each package has its own:
  - `spago.yaml` - Dependencies and configuration
  - `package.json` - NPM metadata
  - `README.md` - Package-specific documentation
  - `src/` - Implementation code
  - `test/` - Test code

### ✅ **Colocated Tests**
- Tests live in each package's `test/` directory
- Clear ownership: tests are next to the code they test
- Independent testing: test each package separately
- Fast feedback: run only relevant tests

### 🔗 **Dependencies**
```
yoga-om-core           (base package)
    ↓
    ├── yoga-om-node   (depends on core)
    ├── yoga-om-rom    (depends on core)
    └── yoga-om-strom  (depends on core)
```

## Testing

### Run All Tests
```bash
bun test              # Run all package tests
./test-all.sh         # Same, via shell script
```

### Run Individual Package Tests
```bash
bun test:core         # Test yoga-om-core
bun test:node         # Test yoga-om-node
bun test:rom          # Test yoga-om-rom
bun test:strom        # Test yoga-om-strom

# Or directly
cd packages/yoga-om-core && spago test
```

See [TESTING.md](./TESTING.md) for detailed testing guide.

## Building

### Build All Packages
```bash
bun run build         # Build all workspace packages
spago build           # Same
```

### Build Individual Packages
```bash
bun run build:core    # Build yoga-om-core
bun run build:node    # Build yoga-om-node
bun run build:rom     # Build yoga-om-rom
bun run build:strom   # Build yoga-om-strom

# Or directly
cd packages/yoga-om-core && spago build
```

## Adding a New Package

1. Create package directory:
   ```bash
   mkdir -p packages/my-package/src packages/my-package/test
   ```

2. Create `spago.yaml`:
   ```yaml
   package:
     name: my-package
     dependencies:
       - prelude: ">=6.0.0 <7.0.0"
       - yoga-om-core: "*"
     test:
       main: Test.Main
       dependencies:
         - spec: ">=7.0.0 <8.0.0"
   ```

3. Create `package.json`:
   ```json
   {
     "name": "purescript-my-package",
     "version": "1.0.0",
     "license": "MIT"
   }
   ```

4. Add implementation in `src/`
5. Add tests in `test/`
6. Add to workspace scripts in root `package.json`

## Legacy Cleanup

The root `src/` and `test/` directories have been removed. All code now lives in the package structure under `packages/`.

### Package Structure Migration Complete

All packages are now organised under `packages/`:
```
packages/yoga-om-core/    → Core Om functionality
packages/yoga-om-node/    → Node.js extensions
packages/yoga-om-rom/     → Reactive Om (FRP/Bolson)
packages/yoga-om-strom/   → Stream Om (pull-based streaming)
```

## Documentation

- **[README.md](./README.md)** - Main project README
- **[TESTING.md](./TESTING.md)** - Testing guide
- **[STRUCTURE.md](./STRUCTURE.md)** - This file
- **Package READMEs** - Each package has its own README

### Package-Specific Docs

- [yoga-om-core README](./packages/yoga-om-core/README.md)
- [yoga-om-node README](./packages/yoga-om-node/README.md)
- [yoga-om-rom README](./packages/yoga-om-rom/README.md)
- [yoga-om-strom documentation](./packages/yoga-om-strom/) (extensive)

## Benefits of This Structure

✅ **Clear Organisation** - Each package is self-contained  
✅ **Independent Testing** - Test packages in isolation  
✅ **Faster Development** - Work on one package at a time  
✅ **Better Scalability** - Easy to add new packages  
✅ **Improved Navigation** - Tests are colocated with code  
✅ **Package Publishing** - Each package can be published independently  
✅ **Better CI** - Run only affected tests  

## Questions?

See [TESTING.md](./TESTING.md) for testing-specific questions, or check individual package READMEs for package-specific documentation.
