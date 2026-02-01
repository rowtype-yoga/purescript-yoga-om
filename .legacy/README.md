# Legacy Spago v0.21.0 Configuration Files

These files are from the old Spago v0.21.0 setup and are **no longer used**.

## Files

- `spago.dhall` - Old workspace configuration
- `packages.dhall` - Old package set reference

## Why Moved?

The project now uses **Spago Next (v0.93.45+)** with `spago.yaml` configuration files. This provides:

- ✅ True workspace support
- ✅ YAML configuration (no Dhall)
- ✅ Colocated tests
- ✅ Modern tooling
- ✅ Registry-based package management

## Migration

See [../MIGRATION.md](../MIGRATION.md) for upgrade instructions.

## Do Not Use

These files are kept only for reference. The build system uses:
- `../spago.yaml` (workspace config)
- `../packages/*/spago.yaml` (package configs)

---

**These files are deprecated and not used by the build system.**
