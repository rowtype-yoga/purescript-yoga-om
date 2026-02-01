# Example Error Messages

## Before: Only First Missing Dependency

In our initial implementation, you would only see:

```
Custom error:
  Missing required dependency!
  The layer requires: "config"
```

You'd have to fix `config`, recompile, then see:
```
Missing required dependency!
The layer requires: "logger"
```

And so on... one at a time.

## After: Full Diff!

Now you see everything at once:

```purescript
needsThree :: OmLayer 
  (config :: Config, logger :: Logger, database :: Database) 
  (cache :: Cache) 
  ()

test = runLayer { logger: { log: \_ -> pure unit } } needsThree
```

Error shows **both** the specific problem AND the complete picture:

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

Now you get:
- 🎯 **Actionable**: "Fix `config` first" - specific field name
- 📋 **Complete context**: Full diff of required vs provided
- 👁️ **Visual comparison**: Instantly see:
  - ✅ `logger` is provided
  - ❌ `config` is missing  
  - ❌ `database` is missing

**Best of both worlds**: Specific actionable error + full context to understand the complete situation!

## How It Works

The trick is to **thread the original `Row Type`s through the RowList recursion**:

```purescript
class CheckLabelExists 
  (label :: Symbol) 
  (ty :: Type) 
  (available :: RowList Type)
  (requiredRow :: Row Type)    -- ← Thread through!
  (availableRow :: Row Type)    -- ← Thread through!
```

When we hit the error case (missing label), we have both complete rows available to print:

```purescript
else instance checkLabelExistsNotFound ::
  Fail
    ( Above (Text "The layer requires: ")
      (Above (Quote requiredRow)          -- ← Show complete required
        (Above (Text "But you provided: ")
          (Quote availableRow)              -- ← Show complete available
        )
      )
    ) =>
  CheckLabelExists label ty Nil requiredRow availableRow
```

This gives you a **full context diff** instead of just the first error!
