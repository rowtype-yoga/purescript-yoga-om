# Strom Performance Benchmarks

This directory contains performance benchmarks for the Strom streaming library. The benchmarks use a custom Aff-based timing system to accurately measure asynchronous streaming operations.

## Overview

The benchmark suite tests various Strom operations across different JavaScript runtimes:
- **Node.js** - Traditional JavaScript runtime (typically v18+)
- **Bun** - Modern, fast JavaScript runtime
- **Deno** - Secure JavaScript/TypeScript runtime

Each benchmark measures minimum, median, mean, and maximum execution times across multiple runs (default: 10 runs per benchmark).

## Benchmark Operations

The suite tests the following operations:

1. **map-100k** - Simple map over 100,000 elements
2. **filter-100k-50pct** - Filter operation keeping 50% of elements
3. **map-chain-3x-100k** - Chain of 3 map operations (fusion test)
4. **pipeline-map-filter-map-100k** - Complex pipeline with map, filter, map
5. **fold-sum-100k** - Fold operation summing 100,000 elements
6. **collect-10k** - Collect operation creating array (tests allocation)
7. **take-1k-from-100k** - Early termination test
8. **mergeND-2x50k** - Non-deterministic merge of two streams
9. **mapPar-concurrency4-1k** - Parallel map with concurrency=4
10. **scan-running-sum-100k** - Stateful scan operation
11. **unfold-10k** - Unfold operation
12. **infinite-iterate-take-100k** - Stack safety test with infinite stream
13. **flatMap-10kx10** - FlatMap operation
14. **zip-2x10k** - Zip two streams together

## Running Benchmarks

### Prerequisites

1. Build the project:
   ```bash
   # From workspace root
   spago build -p yoga-om-strom --ensure-ranges
   purs-backend-es build --output-dir output-es
   ```

2. Ensure you have all runtimes installed:
   - Node.js (v18+)
   - Bun (latest)
   - Deno (latest)

### Run Individual Runtime

```bash
# Node.js
./run-minibench-node.mjs

# Bun
./run-minibench-bun.mjs

# Deno
./run-minibench-deno.mjs
```

### Run All Runtimes and Compare

```bash
./run-minibench-all.sh
```

This will:
1. Build the project
2. Run benchmarks on all three runtimes
3. Save results to `benchmark-results/` directory with timestamps
4. Display results in the terminal

## Understanding Results

The benchmark suite outputs results in the following format:

```
🏃 map-100k (runs: 10)
  min:    12.3 ms
  median: 13.1 ms
  mean:   13.5 ms
  max:    15.2 ms
```

This means:
- Minimum time across all runs: 12.3ms
- Median time (middle value): 13.1ms
- Mean time (average): 13.5ms
- Maximum time across all runs: 15.2ms

### Interpreting Zero Times

You may see some operations reporting 0.0ms. This means the operation completed faster than the timer resolution (typically < 1ms). These are extremely fast operations!

### What to Look For

1. **Runtime Comparison**
   - Bun typically shows the fastest times
   - Node.js is usually competitive
   - Deno performance varies by operation

2. **Operation Characteristics**
   - **map/filter/scan**: Should be very fast (< 50ms for 100k elements)
   - **take**: Should be near-instant (early termination)
   - **collect**: Slower due to array allocation
   - **mergeND/mapPar**: Tests concurrent execution

3. **Consistency**
   - Lower variance (max - min) indicates stable performance
   - High variance suggests JIT warmup or GC interference

## Results Storage

Results are saved to `benchmark-results/` with timestamps:
- `node_YYYYMMDD_HHMMSS.txt`
- `bun_YYYYMMDD_HHMMSS.txt`
- `deno_YYYYMMDD_HHMMSS.txt`

This allows tracking performance over time and comparing different versions.

### Comparing Results

After running benchmarks on all runtimes, use the comparison script:

```bash
./compare-results.mjs
```

This will generate a formatted table showing:
- Side-by-side comparison of median times for each runtime
- Colour-coded fastest (green), middle (yellow), and slowest (red) results
- Speedup ratios (fastest vs slowest)
- Overall winner and geometric mean performance

Example output:
```
📊 Strom Runtime Performance Comparison

Using results from:
  🟢 Node: node_20260203_143022.txt
  🟠 Bun:  bun_20260203_143022.txt
  🔵 Deno: deno_20260203_143022.txt

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Benchmark Name                     Node (ms)      Bun (ms)     Deno (ms)     Fastest      Speedup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
map-100k                                0.00        0.00         0.00          Bun      1.00x
mergeND-2x50k                           7.00        4.50         8.00          Bun      1.78x
...
```

## Customising Benchmarks

To modify the benchmark suite, edit `src/Benchmark/MinibenchMain.purs`:

```purescript
-- Change number of runs (default is 10)
liftEffect $ benchAff "my-benchmark" 20 do
  -- Your benchmark code here
  
-- Change data size
runOm $
  Strom.rangeStrom 1 500001  -- 500k instead of 100k
    # Strom.mapStrom (_ + 1)
    # Strom.runDrain
```

After modifying, rebuild:
```bash
spago build -p yoga-om-strom --ensure-ranges
purs-backend-es build --output-dir output-es
```

## Troubleshooting

### Build Errors

If you get build errors, ensure dependencies are up to date:
```bash
spago install
```

### Runtime Not Found

Ensure the runtime is installed and in your PATH:
```bash
node --version
bun --version
deno --version
```

### Deno Permissions

Deno requires explicit permissions. The scripts use `--allow-all` for simplicity. For stricter permissions:
```bash
deno run --allow-read --allow-write --allow-env run-minibench-deno.mjs
```

## Performance Tips

1. **Close other applications** to reduce system noise
2. **Run multiple times** to account for variance
3. **Let system stabilise** between runs (the script waits 2 seconds)
4. **Check system load** before benchmarking
5. **Disable CPU throttling** for consistent results

## Contributing

When adding new benchmarks:
1. Add the test to `MinibenchMain.purs`
2. Use descriptive names
3. Document what the benchmark tests
4. Choose appropriate iteration counts (balance accuracy vs runtime)
5. Update this README with the new benchmark description
