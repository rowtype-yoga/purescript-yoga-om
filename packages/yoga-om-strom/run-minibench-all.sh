#!/usr/bin/env bash

# Script to run benchmarks on all three runtimes and compare results
# Usage: ./run-minibench-all.sh

set -e

echo "🔥 Strom Runtime Performance Comparison"
echo "========================================"
echo ""
echo "This will run the Strom benchmark suite on:"
echo "  - Node.js"
echo "  - Bun"
echo "  - Deno"
echo ""

# Navigate to workspace root
cd "$(dirname "$0")/../.."

# Build the project first
echo "📦 Building PureScript project..."
./node_modules/.bin/spago build -p yoga-om-strom --ensure-ranges
echo ""

echo "🔨 Compiling to ES modules..."
./node_modules/.bin/purs-backend-es build --output-dir output-es
echo ""

# Create results directory
RESULTS_DIR="packages/yoga-om-strom/benchmark-results"
mkdir -p "$RESULTS_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "=========================================="
echo "🟢 RUNNING NODE.JS BENCHMARK"
echo "=========================================="
node packages/yoga-om-strom/run-minibench-node.mjs 2>&1 | tee "$RESULTS_DIR/node_${TIMESTAMP}.txt"
echo ""
echo "Waiting 2 seconds..."
sleep 2

echo "=========================================="
echo "🟠 RUNNING BUN BENCHMARK"
echo "=========================================="
bun packages/yoga-om-strom/run-minibench-bun.mjs 2>&1 | tee "$RESULTS_DIR/bun_${TIMESTAMP}.txt"
echo ""
echo "Waiting 2 seconds..."
sleep 2

echo "=========================================="
echo "🔵 RUNNING DENO BENCHMARK"
echo "=========================================="
deno run --allow-all packages/yoga-om-strom/run-minibench-deno.mjs 2>&1 | tee "$RESULTS_DIR/deno_${TIMESTAMP}.txt"
echo ""

echo "=========================================="
echo "✨ BENCHMARK COMPLETE"
echo "=========================================="
echo ""
echo "Results saved to: $RESULTS_DIR"
echo "  - node_${TIMESTAMP}.txt"
echo "  - bun_${TIMESTAMP}.txt"
echo "  - deno_${TIMESTAMP}.txt"
echo ""
echo "📊 To compare results, check the files above"
echo "   Look for lines showing 'min/median/mean/max' for each benchmark"
