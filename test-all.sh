#!/usr/bin/env bash
set -e

echo "🧪 Testing yoga-om workspace packages..."

echo "📦 Testing yoga-om-core..."
cd packages/yoga-om-core && npx spago test
cd ../..

echo "📦 Testing yoga-om-node..."
cd packages/yoga-om-node && npx spago test
cd ../..

echo "📦 Testing yoga-om-rom..."
cd packages/yoga-om-rom && npx spago test
cd ../..

echo "📦 Testing yoga-om-strom..."
cd packages/yoga-om-strom && npx spago test
cd ../..

echo "🎉 All tests passed!"
