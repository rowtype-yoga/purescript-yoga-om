#!/usr/bin/env bash

# Helper script to quickly try different error examples

if [ -z "$1" ]; then
  echo "Usage: ./try-example.sh <example-number>"
  echo ""
  echo "Available examples:"
  echo "  1 - Missing config entirely"
  echo "  2 - Partial context (have logger, missing database)"
  echo "  3 - Multiple missing dependencies"
  echo "  4 - Success case (all dependencies provided)"
  echo ""
  echo "Example: ./try-example.sh 1"
  exit 1
fi

echo "🔍 Trying Example $1..."
echo ""

cd /Users/mark/Developer/purescript-yoga-om

case "$1" in
  1)
    echo "❌ Expected: Missing 'config' dependency"
    npx spago build -p yoga-om-layer 2>&1 | grep -B 2 -A 20 'example1' || echo "No example1 uncommented"
    ;;
  2)
    echo "❌ Expected: Missing 'database' dependency"
    npx spago build -p yoga-om-layer 2>&1 | grep -B 2 -A 20 'example2' || echo "No example2 uncommented"
    ;;
  3)
    echo "❌ Expected: Multiple missing dependencies"
    npx spago build -p yoga-om-layer 2>&1 | grep -B 2 -A 20 'example3' || echo "No example3 uncommented"
    ;;
  4)
    echo "✅ Expected: Success!"
    npx spago build -p yoga-om-layer 2>&1 | grep -E "Build succeeded|example4"
    ;;
  *)
    echo "Invalid example number. Use 1, 2, 3, or 4"
    exit 1
    ;;
esac

echo ""
echo "---"
echo "To see the error, manually uncomment example$1 in test/Playground.purs"
