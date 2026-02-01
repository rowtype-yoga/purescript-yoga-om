#!/usr/bin/env bash

# Helper script to quickly try different error examples

if [ -z "$1" ]; then
  echo "Usage: ./try-error.sh <example-number>"
  echo ""
  echo "Available examples:"
  echo "  1 - Missing config entirely"
  echo "  2 - Partial context (have logger, missing database)"
  echo "  3 - Multiple missing dependencies"
  echo "  4 - Success case (all dependencies provided)"
  echo ""
  echo "Example: ./try-error.sh 1"
  exit 1
fi

PLAYGROUND="test/Playground.purs"

# Comment out all examples first
sed -i.bak 's/^example/-- example/g' "$PLAYGROUND"
sed -i.bak 's/^combined/-- combined/g' "$PLAYGROUND"

case "$1" in
  1)
    echo "🔍 Trying Example 1: Missing config entirely"
    sed -i.bak 's/^-- example1/example1/g' "$PLAYGROUND"
    ;;
  2)
    echo "🔍 Trying Example 2: Partial context"
    sed -i.bak 's/^-- example2/example2/g' "$PLAYGROUND"
    ;;
  3)
    echo "🔍 Trying Example 3: Multiple missing dependencies"
    sed -i.bak 's/^-- combined/combined/g' "$PLAYGROUND"
    sed -i.bak 's/^-- example3/example3/g' "$PLAYGROUND"
    ;;
  4)
    echo "✅ Trying Example 4: Success case"
    sed -i.bak 's/^-- example4/example4/g' "$PLAYGROUND"
    ;;
  *)
    echo "Invalid example number. Use 1, 2, 3, or 4"
    exit 1
    ;;
esac

echo ""
cd /Users/mark/Developer/purescript-yoga-om
npx spago build -p yoga-om-layer 2>&1 | grep -A 30 "Custom error\|Build succeeded" | head -35

# Restore backup
mv "$PLAYGROUND.bak" "$PLAYGROUND" 2>/dev/null

echo ""
echo "---"
echo "To try another example, run: ./try-error.sh <number>"
