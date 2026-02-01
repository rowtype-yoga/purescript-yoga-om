# Try the Error Messages!

## Super Easy Method

1. Open `test/Playground.purs` in your editor
2. **Uncomment ONE example** (lines have `-- example1`, `-- example2`, etc.)
3. Run:
   ```bash
   cd packages/yoga-om-layer
   npx spago build -p yoga-om-layer
   ```
4. See the beautiful error message! 🎉

## Examples to Try

### Example 1: Missing Everything ❌
Uncomment:
```purescript
example1 :: Om (Record ()) () (Record (logger :: Logger))
example1 = runLayer {} loggerLayer
```

**Error shows:**
- First missing field: `"config"`
- Required: `(config :: { ... })`
- Provided: `()`

---

### Example 2: Partial Context ❌
Uncomment:
```purescript
example2 :: Om (Record (logger :: Logger)) () (Record (cache :: Cache))
example2 = runLayer { logger: { log: \_ -> pure unit } } cacheLayer
```

**Error shows:**
- First missing field: `"database"`
- Required: `(logger :: {...}, database :: {...})`
- Provided: `(logger :: {...})`

You can see `logger` ✅ is there but `database` ❌ is missing!

---

### Example 3: Multiple Missing ❌
Uncomment:
```purescript
combined :: OmLayer (config :: Config) (logger :: Logger, database :: Database) ()
combined = combineRequirements loggerLayer databaseLayer

example3 :: Om (Record ()) () (Record (logger :: Logger, database :: Database))
example3 = runLayer {} combined
```

**Error shows the full diff** with multiple missing dependencies!

---

### Example 4: Success! ✅
Uncomment:
```purescript
example4 :: Om (Record (config :: Config)) () (Record (logger :: Logger))
example4 = runLayer { config: { port: 5432, host: "localhost" } } loggerLayer
```

**This one compiles!** No errors because all dependencies are satisfied.

---

## Tips

- Try uncommenting MULTIPLE examples at once to see different errors
- Modify the type signatures to create your own error scenarios
- Add more layers and combine them to see how deduplication works
- Check out the test suite in `test/Test/Main.purs` for working examples

## Quick Test

```bash
# Run the full test suite
cd packages/yoga-om-layer
npx spago test

# Run negative error tests
./test-errors.sh
```
