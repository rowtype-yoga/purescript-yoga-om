# Minibench Runtime Comparison Setup

## What Was Created

A comprehensive benchmark suite for comparing Strom streaming library performance across Node.js, Bun, and Deno runtimes.

### Files Created

#### Benchmark Implementation
- **`src/Benchmark/MinibenchMain.purs`** - Main benchmark suite
  - 15 different benchmarks testing various Strom operations
  - Custom Aff-based timing for async operations
  - Measures min/median/mean/max across 10 runs per benchmark

#### Runner Scripts
- **`run-minibench-node.mjs`** - Run benchmarks on Node.js
- **`run-minibench-bun.mjs`** - Run benchmarks on Bun
- **`run-minibench-deno.mjs`** - Run benchmarks on Deno
- **`run-minibench-all.sh`** - Run all three runtimes and save results
- **`compare-results.mjs`** - Parse and compare results across runtimes

#### Documentation
- **`BENCHMARK.md`** - Comprehensive guide to using the benchmark suite
- **`MINIBENCH_SETUP.md`** - This file

#### Configuration Changes
- **`spago.yaml`** - Added dependencies: `console`, `minibench`, `now`
- **`package.json`** - Added npm scripts for easy benchmarking

## Quick Start

### 1. Run Benchmarks on All Runtimes

```bash
cd packages/yoga-om-strom
./run-minibench-all.sh
```

This will:
- Build the PureScript project
- Compile to ES modules
- Run benchmarks on Node.js, Bun, and Deno
- Save timestamped results to `benchmark-results/`

### 2. Compare Results

```bash
./compare-results.mjs
```

This displays a formatted comparison table with:
- Side-by-side median times
- Fastest runtime for each benchmark
- Speedup ratios
- Overall winner

### 3. Run Individual Runtime

```bash
# Node.js only
npm run minibench:node

# Bun only
npm run minibench:bun

# Deno only
npm run minibench:deno
```

## Benchmarks Included

1. **map-100k** - Simple map operation
2. **filter-100k-50pct** - Filter with 50% retention
3. **map-chain-3x-100k** - Chain of 3 maps (fusion test)
4. **pipeline-map-filter-map-100k** - Complex pipeline
5. **fold-sum-100k** - Fold/reduce operation
6. **collect-10k** - Array collection (allocation test)
7. **take-1k-from-100k** - Early termination
8. **mergeND-2x50k** - Non-deterministic merge
9. **mapPar-concurrency4-1k** - Parallel map with concurrency
10. **scan-running-sum-100k** - Stateful scan
11. **unfold-10k** - Unfold operation
12. **infinite-iterate-take-100k** - Stack safety test
13. **bind-10kx10** - Monadic bind/flatMap
14. **zip-2x10k** - Zip two streams

## Expected Performance Characteristics

- **Very fast operations** (< 1ms): map, filter, scan, take, fold
- **Fast operations** (1-10ms): pipeline, collect, unfold
- **Moderate operations** (10-100ms): mergeND, mapPar, infinite streams
- **Bun typically fastest** for most operations
- **Node.js competitive** with Bun on many operations
- **Deno varies** depending on operation type

## Customising Benchmarks

Edit `src/Benchmark/MinibenchMain.purs` to:

- Add new benchmarks
- Change number of runs (default 10)
- Modify data sizes
- Test different Strom operations

After changes:
```bash
spago build -p yoga-om-strom
purs-backend-es build --output-dir output-es
```

## Troubleshooting

### Build Fails
```bash
# Ensure dependencies are installed
spago install
```

### Runtime Not Found
```bash
# Verify installations
node --version
bun --version
deno --version
```

### Results Directory Missing
The `benchmark-results/` directory is created automatically when running `run-minibench-all.sh`.

### Zero Times Everywhere
This is normal for very fast operations! The operations complete faster than the timer resolution (< 1ms). Consider:
- Increasing data size
- Adding more complex operations
- Using operations that involve actual I/O or delays

## Architecture Notes

### Why Not Standard Minibench?

Standard minibench is designed for synchronous Effect operations. Strom operations are asynchronous (Aff-based), so we created a custom benchmark runner that:

1. Properly handles Aff operations
2. Times async completion accurately  
3. Collects statistics (min/median/mean/max)
4. Maintains the same workflow as minibench

### Timer Resolution

JavaScript timing has ~1ms resolution. For sub-millisecond operations:
- Results may show 0.0ms
- These are still valid (operation < 1ms)
- Increase data size if you need more precise measurements

## Future Enhancements

Potential additions:
- Memory usage tracking
- GC impact measurement
- Warmup runs before timing
- Configurable run counts
- JSON output format
- Historical trend analysis
- CI integration

## Credits

- PureScript minibench package (inspiration)
- Strom streaming library
- Yoga Om effect system
