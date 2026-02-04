# Benchmarking Strom Performance

This workspace includes a comprehensive benchmark suite for comparing Strom streaming library performance across different JavaScript runtimes (Node.js, Bun, and Deno).

## Location

All benchmark files are in:
```
packages/yoga-om-strom/
```

## Quick Start

```bash
cd packages/yoga-om-strom
./run-minibench-all.sh
./compare-results.mjs
```

## Documentation

See [`packages/yoga-om-strom/BENCHMARK.md`](packages/yoga-om-strom/BENCHMARK.md) for:
- Complete benchmark list
- Running instructions
- Result interpretation
- Customisation guide
- Troubleshooting

See [`packages/yoga-om-strom/MINIBENCH_SETUP.md`](packages/yoga-om-strom/MINIBENCH_SETUP.md) for:
- Implementation details
- Architecture notes
- File descriptions

## What Gets Benchmarked

- **Basic operations**: map, filter, scan, fold
- **Pipelines**: chained transformations
- **Concurrency**: parallel operations, merges
- **Early termination**: take operations
- **Stack safety**: infinite streams
- **Memory allocation**: collect operations

## Runtimes Compared

- 🟢 **Node.js** - Traditional JavaScript runtime
- 🟠 **Bun** - Modern, fast JavaScript runtime
- 🔵 **Deno** - Secure JavaScript/TypeScript runtime

## Results

Results are saved with timestamps in:
```
packages/yoga-om-strom/benchmark-results/
```

Use the comparison script to see which runtime is fastest for each operation.
