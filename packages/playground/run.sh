#!/usr/bin/env bash
# Run the playground project

cd "$(dirname "$0")"

# Check if we have spago-next
if ! command -v spago &> /dev/null || spago version | grep -q "^0\.2[0-9]\."; then
    echo "❌ This project requires Spago Next (0.93.45+)"
    echo "📦 You currently have Spago $(spago version 2>/dev/null || echo 'not installed')"
    echo ""
    echo "To install Spago Next using Bun:"
    echo "  bun install -g spago@next"
    echo ""
    echo "Or using npm:"
    echo "  npm uninstall -g spago"
    echo "  npm install -g spago@next"
    echo ""
    exit 1
fi

echo "🏃 Running playground..."
spago run
