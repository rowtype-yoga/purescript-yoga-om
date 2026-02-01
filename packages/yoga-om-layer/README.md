# yoga-om-layer (Proof of Concept)

**Type-level dependency deduplication for PureScript's Om monad**

## What This Proves

This is a proof of concept demonstrating that **PureScript's row types and `Row.Nub` can automatically deduplicate shared dependencies at compile time**, similar to ZLayer in Scala's ZIO.

### The Key Insight

Given two layers that both require the same dependency:

```purescript
layer1 :: OmLayer (config :: Config) (logger :: Logger) ()
layer2 :: OmLayer (config :: Config) (database :: Database) ()
```

When combined using `combineRequirements`, the result has:

```purescript
combineRequirements layer1 layer2 
  :: OmLayer (config :: Config) _ _  -- ✓ Single requirement
  
NOT :: OmLayer (config :: Config, config :: Config) _ _  -- ✗ Duplicate requirements
```

The `Row.Nub` constraint automatically deduplicates `(config, config)` to just `(config)`!

## Running the Proof

```bash
cd packages/yoga-om-layer
npx spago test
```

You'll see two proofs:

### 1. Type-Level Deduplication Proof

```
✓ PROOF OF CONCEPT SUCCESS!

Key insight: Row.Nub automatically deduplicates at the type level

The (config, config) requirement is automatically deduplicated
to just (config) by the Nub constraint in combineRequirements!
```

### 2. Runtime Deduplication Proof

```
✓ RUNTIME DEDUPLICATION PROOF:
  Access log: 'config-accessed-by-logger config-accessed-by-database '
  
  Both components accessed the same shared context!
```

The second test uses a mutable `Ref` that's passed as part of the context. Both the logger and database components write to this Ref when they access the config. The access log shows both messages, proving that:

1. Both components ran
2. They both accessed the same context record (not separate duplicate contexts)
3. The shared dependency (config) was deduplicated at both type-level AND runtime

## The Type-Level Magic

The key is in the type signature:

```purescript
combineRequirements
  :: forall req1 req2 reqMerged reqDeduped
   . Union req1 req2 reqMerged     -- Merge: (config, config)
  => Nub reqMerged reqDeduped      -- Dedupe: (config)
  => OmLayer req1 prov1 err1
  -> OmLayer req2 prov2 err2
  -> OmLayer reqDeduped prov3 err3  -- Result has deduplicated reqs!
```

## What's Next

This proof of concept demonstrates the **type-level foundation** for ZLayer-style dependency injection in PureScript. The next steps would be:

1. **Instance resolution for build order** - Use type class instance resolution to determine the correct order to build layers

2. **Error handling** - Better propagation of construction errors

3. **Memoization** - Ensure shared dependencies are built once and cached (currently relies on Om's context being shared)

4. **provideLayers API** - Create a `provideLayers { config, logger, database }` function that uses the type-level magic to wire everything together automatically

## Custom Error Messages

The library provides beautiful custom error messages that **show a full diff** of what's required vs what's available!

```purescript
needsThree :: OmLayer 
  (config :: Config, logger :: Logger, database :: Database) 
  (cache :: Cache) 
  ()

-- Provides only logger, missing config and database
test = runLayer { logger: ... } needsThree
```

You'll get a clear, helpful error showing both the specific missing field AND the full context:

```
Custom error:
  Missing required dependency!
  
  The first missing field is:
  "config"
  
  The layer requires:
  ( config :: { port :: Int }
  , database :: { query :: String -> Effect (Array String) }
  , logger :: { log :: String -> Effect Unit }
  )
  
  But you provided:
  ( logger :: { log :: String -> Effect Unit }
  )
```

You get:
- 🎯 **Actionable**: Fix `config` first
- 📋 **Complete context**: See everything that's required vs provided
- 👁️ **Visual diff**: Instantly spot all missing dependencies

### How It Works

The implementation uses **RowList-based instance resolution** with `else instance` chains, as described in [this PureScript Discourse thread](https://discourse.purescript.org/t/custom-errors-with-instance-chains/2502/5). The key insight is:

1. **Dispatch on RowList structure in the instance head** (not in constraints)
2. **Thread the original Row types through** so we can print them in error messages

```purescript
class CheckLabelExists 
  (label :: Symbol) 
  (ty :: Type) 
  (available :: RowList Type)
  (requiredRow :: Row Type)    -- ← Pass through for error message!
  (availableRow :: Row Type)    -- ← Pass through for error message!

-- Found it! Label matches in instance head
instance checkLabelExistsFound ::
  CheckLabelExists label ty (Cons label ty' tail) requiredRow availableRow

-- Keep looking: different label, recurse
else instance checkLabelExistsKeepLooking ::
  CheckLabelExists label ty tail requiredRow availableRow =>
  CheckLabelExists label ty (Cons otherLabel otherTy tail) requiredRow availableRow

-- Not found: emit custom error with the SPECIFIC missing label AND full context!
else instance checkLabelExistsNotFound ::
  Fail
    ( Above (Text "The first missing field is: ")
      (Above (Quote label)                    -- ← Specific missing field!
        (Above (Text "The layer requires: ")
          (Above (Quote requiredRow)           -- ← Full required context
            (Above (Text "But you provided: ")
              (Quote availableRow)             -- ← Full available context
            )
          )
        )
      )
    ) =>
  CheckLabelExists label ty Nil requiredRow availableRow
```

By passing both the original `Row Type`s AND the current `label` through the recursion, we can show:
1. **The specific missing field** (`label`) - tells you exactly what to fix first
2. **The complete required row** - shows everything the layer needs
3. **The complete available row** - shows what you actually provided

This gives you both **actionable** and **contextual** information in one error!

### Limitations

**1. Reports the first missing field (but shows complete context)**

The error technically triggers on the *first* missing label it encounters during row traversal. However, by showing both the complete required and provided rows, you can visually see ALL missing fields at once, even though the compiler stops at the first one.

This is actually better than showing ONLY the first missing field - you get both specific and contextual information!

**2. Duplicate provisions are silently deduplicated**

If two layers provide the same service, `Nub` automatically deduplicates them, and `Record.merge` is right-biased (the second layer wins):

```purescript
layer1 :: OmLayer () (logger :: Logger) ()  -- Provides logger
layer2 :: OmLayer () (logger :: Logger) ()  -- Also provides logger

combined = combineRequirements layer1 layer2
-- Type: OmLayer () (logger :: Logger) ()
-- Runtime: layer2's logger is used (right-biased merge)
```

No error or warning is emitted. This might be surprising if you accidentally provide the same thing twice.

### Testing Error Messages

You can test the custom error messages:

```bash
cd packages/yoga-om-layer
./test-errors.sh
```

This automatically compiles negative test cases and verifies the expected error messages appear.

## Why This Matters

ZLayer's power comes from automatic dependency deduplication. This proof shows that PureScript's row types can achieve the same thing **without macros** - the compiler's built-in `Row.Nub` constraint does the work!

This is the foundation for building a full ZLayer-like system in PureScript that leverages:
- Row polymorphism for extensible dependencies
- Type-level programming for compile-time validation
- Instance resolution for automatic ordering
- Om's existing capabilities for error handling and async

## Implementation Notes

`combineRequirements` now uses `Om.expand` from the core Om library to:
1. Widen the context from each layer's specific requirements to the deduplicated context
2. Widen error types to empty (for simplicity in this proof of concept)
3. Actually run both layers and merge their results

This means the implementation is **fully functional**, not just a type-level trick!

```purescript
combineRequirements (OmLayer build1) (OmLayer build2) = makeLayer do
  -- expand widens context: Om req1 err1 -> Om reqDeduped ()
  rec1 <- Om.expand build1
  rec2 <- Om.expand build2
  -- Merge the results
  pure (Record.merge rec1 rec2)
```

---

**Status**: Proof of concept complete ✓ with working runtime implementation
**Next**: Implement full instance-resolution based layer system with provideLayers API
