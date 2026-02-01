# ✅ YAML-Only Configuration (No Dhall)

This project uses **only** `spago.yaml` files for configuration. All legacy `spago.dhall` files have been removed.

## Configuration Files

### ✅ Used (Modern)

```
spago.yaml                            # Workspace config
packages/yoga-om-core/spago.yaml      # Package config
packages/yoga-om-node/spago.yaml      # Package config
packages/yoga-om-streams/spago.yaml   # Package config
.spago-version                        # Spago version lock (0.93.45)
```

### ❌ Not Used (Legacy)

```
.legacy/spago.dhall      # Old workspace config (moved to .legacy/)
.legacy/packages.dhall   # Old package set (moved to .legacy/)
test.dhall              # Old test config (deleted)
```

## Why YAML Only?

### Benefits

✅ **Modern Tooling** - Spago Next features  
✅ **Readable** - YAML is more accessible than Dhall  
✅ **Standard** - YAML is widely used  
✅ **Workspace Support** - True monorepo with colocated tests  
✅ **Registry System** - Direct from PureScript registry  
✅ **No Dhall** - No need to learn Dhall  

### Legacy Dhall Issues

❌ **Complex** - Dhall syntax requires learning curve  
❌ **Limited Workspace** - No true monorepo support  
❌ **Centralised** - Tests couldn't be colocated  
❌ **Package Sets** - Manual package-sets.dhall management  

## Structure

### Workspace Root: `spago.yaml`

```yaml
workspace:
  package_set:
    registry: 51.1.0
```

Simple and clean. Defines:
- This is a workspace
- Uses registry version 51.1.0

### Package Config: `packages/*/spago.yaml`

```yaml
package:
  name: yoga-om-core
  publish:
    version: 1.0.0
    license: MIT
    location:
      githubOwner: rowtype-yoga
      githubRepo: purescript-yoga-om
      subdir: packages/yoga-om-core
  dependencies:
    - prelude: ">=6.0.0 <7.0.0"
    - aff: ">=7.0.0 <8.0.0"
  test:
    main: Test.Main
    dependencies:
      - spec: ">=7.0.0 <8.0.0"
```

Everything in one file:
- Package metadata
- Dependencies with version ranges
- Test configuration
- Publishing information

## Commands (No Dhall!)

### Building

```bash
spago build              # Build workspace
spago build -p yoga-om-core  # Build package
```

No `-x` flag needed. No dhall files to reference.

### Testing

```bash
cd packages/yoga-om-core
spago test               # Just works!
```

No `spago -x test.dhall test`. Clean and simple.

### Installing Dependencies

```bash
# JavaScript dependencies
bun install              # Install JS/TS packages

# PureScript dependencies
spago install arrays     # Add PureScript dependency
```

Updates `spago.yaml` automatically. No manual dhall editing.

## Migration from Dhall

Old way (Dhall):
```dhall
-- spago.dhall
{ name = "yoga-om"
, dependencies = 
    [ "aff"
    , "arrays"
    -- ... 20 more dependencies
    ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
}

-- test.dhall
let conf = ./spago.dhall
in conf // { sources = conf.sources # [ "test/**/*.purs" ] }
```

New way (YAML):
```yaml
# spago.yaml
workspace:
  package_set:
    registry: 51.1.0
```

That's it. Much simpler.

## Verification

Check your project only uses YAML:

```bash
# Should NOT find any active dhall files
find . -name "*.dhall" -not -path "./.legacy/*"

# Should find these YAML files
find . -name "spago.yaml"
# Output:
# ./spago.yaml
# ./packages/yoga-om-core/spago.yaml
# ./packages/yoga-om-node/spago.yaml
# ./packages/yoga-om-streams/spago.yaml
```

## IDE Support

Modern editors understand `spago.yaml`:

### VS Code

```json
{
  "purescript.packagePath": "spago.yaml"  // Not spago.dhall!
}
```

### Language Server

Automatically finds `spago.yaml` in workspace root.

## CI/CD

GitHub Actions:

```yaml
- uses: purescript-contrib/setup-purescript@main
  with:
    purescript: "0.15.15"
    spago: "0.93.45"        # Spago Next (YAML support)

- run: spago build          # No dhall files needed!
```

## FAQ

### Q: Can I use old Spago?

**No.** Old Spago (v0.21.x) uses dhall and doesn't support workspaces.

Install Spago Next:
```bash
npm install -g spago@next
```

### Q: What happened to dhall files?

Moved to `.legacy/` for reference. Not used by build system.

### Q: How do I add dependencies?

```bash
spago install package-name
```

Or edit `spago.yaml`:
```yaml
dependencies:
  - new-package: ">=1.0.0 <2.0.0"
```

### Q: Where's packages.dhall?

Don't need it. Dependencies come from the [PureScript Registry](https://github.com/purescript/registry).

### Q: How do I override packages?

Use `extra_packages` in `spago.yaml`:

```yaml
workspace:
  extra_packages:
    my-package:
      git: https://github.com/user/my-package
      ref: main
```

## Benefits Summary

| Feature | Dhall (Old) | YAML (New) |
|---------|-------------|------------|
| Configuration | Complex | Simple |
| Workspace Support | ❌ | ✅ |
| Colocated Tests | ❌ | ✅ |
| Registry | Manual | Automatic |
| Learning Curve | High | Low |
| Tooling | Limited | Modern |

## Resources

- [SPAGO_NEXT.md](./SPAGO_NEXT.md) - Spago Next guide
- [MIGRATION.md](./MIGRATION.md) - Migration from old Spago
- [TESTING.md](./TESTING.md) - Testing with YAML config
- [Spago Documentation](https://github.com/purescript/spago)

---

**This project is YAML-only. No dhall files are used.** ✅
