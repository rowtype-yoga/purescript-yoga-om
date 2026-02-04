#!/usr/bin/env bun

console.log("🚀 Running benchmarks on Bun", Bun.version);
console.log("=".repeat(60));

import("../../output-es/Benchmark.MinibenchMain/index.js").then(m => m.main());
