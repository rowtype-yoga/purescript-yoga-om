#!/usr/bin/env -S deno run --allow-all

console.log("🚀 Running benchmarks on Deno", Deno.version.deno);
console.log("=".repeat(60));

import("../../output-es/Benchmark.MinibenchMain/index.js").then(m => m.main());
