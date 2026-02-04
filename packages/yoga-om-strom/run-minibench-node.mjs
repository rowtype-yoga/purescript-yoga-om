#!/usr/bin/env node

console.log("🚀 Running benchmarks on Node.js", process.version);
console.log("=" .repeat(60));

import("../../output-es/Benchmark.MinibenchMain/index.js").then(m => m.main());
