#!/usr/bin/env bash
set -e

echo "Testing custom error messages..."
echo ""

WORKSPACE_ROOT="/Users/mark/Developer/purescript-yoga-om"
PACKAGE_DIR="$WORKSPACE_ROOT/packages/yoga-om-layer"
TEST_DIR="$PACKAGE_DIR/test-negative"
SRC_DIR="$PACKAGE_DIR/src"

if [ ! -d "$TEST_DIR" ]; then
  echo "❌ Test directory not found: $TEST_DIR"
  exit 1
fi

passed=0
failed=0

# First, ensure the main package compiles (without negative tests)
echo "Building main package..."
cd "$WORKSPACE_ROOT"
if ! bunx spago build -p yoga-om-layer > /dev/null 2>&1; then
  echo "❌ Main package failed to build"
  exit 1
fi
echo "✓ Main package builds successfully"
echo ""

# Now test each negative test individually
for test_file in "$TEST_DIR"/*.purs; do
  if [ ! -f "$test_file" ]; then
    continue
  fi
  
  base_name=$(basename "$test_file" .purs)
  expected_file="$TEST_DIR/$base_name.expected"
  
  if [ ! -f "$expected_file" ]; then
    echo "⚠️  No .expected file for $base_name, skipping"
    continue
  fi
  
  expected_content=$(cat "$expected_file")
  
  echo -n "Testing $base_name... "
  
  # Compile this specific test file with the already-built package
  # First ensure output exists
  if [ ! -d "$WORKSPACE_ROOT/output" ]; then
    echo "❌ Output directory not found, run 'npx spago build' first"
    exit 1
  fi
  
  error_output=$(cd "$WORKSPACE_ROOT" && \
    bunx purs compile \
      "$test_file" \
      "$SRC_DIR/**/*.purs" \
      "packages/yoga-om-core/src/**/*.purs" \
      "output/**/*.js" \
      2>&1 || true)
  
  # Special case: should compile successfully
  if [ "$expected_content" = "SHOULD_COMPILE" ]; then
    if echo "$error_output" | grep -q "Error"; then
      echo "❌ (should compile but doesn't)"
      echo "$error_output" | head -20
      ((failed++))
    else
      echo "✅ (compiles as expected)"
      ((passed++))
    fi
    continue
  fi
  
  # Check if expected error appears in output
  if echo "$error_output" | grep -q "$expected_content"; then
    echo "✅"
    ((passed++))
  else
    echo "❌"
    echo "Expected to find:"
    echo "$expected_content"
    echo ""
    echo "But got:"
    echo "$error_output" | grep -A 10 "Error" | head -20
    echo ""
    ((failed++))
  fi
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Results: $passed passed, $failed failed"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $failed -gt 0 ]; then
  exit 1
fi
