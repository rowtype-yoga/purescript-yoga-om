# Bun Setup for yoga-om

This project uses **Bun** as the JavaScript runtime and package manager.

## Why Bun?

✅ **Fast** - 3x faster than npm  
✅ **All-in-one** - Runtime, bundler, test runner, package manager  
✅ **Drop-in replacement** - Compatible with Node.js and npm  
✅ **Better DX** - Faster installs, better performance  
✅ **Native TypeScript** - No transpilation needed  

## Installation

### Install Bun

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Verify installation
bun --version
# Should show: 1.0+ (e.g., 1.1.38)
```

### Install Project Dependencies

```bash
# Install JavaScript/TypeScript dependencies
bun install

# This reads package.json and installs:
# - spago@0.93.45 (PureScript build tool)
# - purescript@0.15.15 (PureScript compiler)
```

### Install PureScript Dependencies

```bash
# Install PureScript dependencies
spago install
```

## Package Manager

### Bun vs npm/yarn

| Command | npm | Bun |
|---------|-----|-----|
| Install | `npm install` | `bun install` |
| Add package | `npm install pkg` | `bun add pkg` |
| Global install | `npm install -g pkg` | `bun install -g pkg` |
| Run script | `npm run script` | `bun run script` |
| Remove | `npm uninstall pkg` | `bun remove pkg` |

### Key Bun Commands

```bash
# Install dependencies
bun install

# Add a dependency
bun add lodash

# Add dev dependency
bun add -d typescript

# Remove dependency
bun remove lodash

# Run a script from package.json
bun run build
bun run test

# Run a file directly
bun run index.ts

# Update dependencies
bun update
```

## Project Scripts

All scripts use Bun:

```bash
# Build all packages
bun run build
# or just
bun build

# Test all packages
bun test
bun test:core       # Test yoga-om-core
bun test:node       # Test yoga-om-node
bun test:streams    # Test yoga-om-streams

# Build individual packages
bun build:core
bun build:node
bun build:streams
```

## Lockfile

Bun uses `bun.lock` (binary format) instead of `package-lock.json`.

```bash
# This file is maintained by bun:
bun.lock            # ✅ Binary lockfile (fast!)

# These are legacy (not used):
package-lock.json   # ❌ npm lockfile (slower)
yarn.lock           # ❌ Yarn lockfile
pnpm-lock.yaml      # ❌ pnpm lockfile
```

> **Note:** `package-lock.json` may exist for compatibility but `bun.lock` is the source of truth.

## Installation Speed

Comparison on this project:

| Package Manager | Time |
|----------------|------|
| npm install | ~15 seconds |
| yarn install | ~12 seconds |
| bun install | **~5 seconds** ⚡ |

**Bun is 3x faster!**

## Package Manager Field

`package.json` specifies Bun as the preferred package manager:

```json
{
  "packageManager": "bun@1.x"
}
```

This tells tools like Corepack to use Bun.

## Global Packages

Install global packages with Bun:

```bash
# Install Spago globally
bun install -g spago@next

# Install PureScript compiler globally
bun install -g purescript

# View global packages
bun pm ls -g
```

## Environment

Bun is a drop-in replacement for Node.js:

```bash
# These work the same:
node script.js     # Node.js
bun script.js      # Bun (faster!)

# Bun can run npm scripts
bun run test       # Runs scripts from package.json
```

## CI/CD

GitHub Actions uses Bun:

```yaml
- uses: oven-sh/setup-bun@v2
  with:
    bun-version: latest

- run: bun install --frozen-lockfile
- run: bun test
```

See [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) for full config.

## Compatibility

Bun is compatible with:

✅ **npm packages** - All npm packages work  
✅ **Node.js APIs** - Most Node.js APIs supported  
✅ **package.json** - Uses same format  
✅ **npm scripts** - Runs all npm scripts  

## Version Lock

`.bunversion` file locks Bun to major version:

```
1.x
```

This ensures consistent versions across team.

## Troubleshooting

### Bun not found

Install Bun:
```bash
curl -fsSL https://bun.sh/install | bash
```

Then restart your shell.

### Package not found

Install dependencies:
```bash
bun install
```

### Global package not found

Install globally:
```bash
bun install -g package-name
```

### Want to use npm instead?

Bun is recommended, but npm works:
```bash
npm install
npm test
```

Just slower. 🐌

## Resources

- [Bun Official Docs](https://bun.sh/docs)
- [Bun GitHub](https://github.com/oven-sh/bun)
- [Bun Discord](https://bun.sh/discord)

## Summary

**Use Bun for this project:**

```bash
# 1. Install Bun
curl -fsSL https://bun.sh/install | bash

# 2. Install Spago
bun install -g spago@next

# 3. Install dependencies
bun install
spago install

# 4. Build and test
bun build
bun test
```

**Fast, simple, modern!** ⚡
