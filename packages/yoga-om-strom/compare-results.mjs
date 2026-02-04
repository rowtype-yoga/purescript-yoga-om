#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resultsDir = path.join(__dirname, 'benchmark-results');

// Parse benchmark results from a file
function parseResults(content) {
  const results = {};
  const lines = content.split('\n');
  
  let currentBench = null;
  for (const line of lines) {
    // Look for benchmark name: "🏃 benchmark-name (runs: N)"
    const nameMatch = line.match(/^🏃\s+([a-zA-Z0-9-_]+)\s+\(runs:/);
    if (nameMatch) {
      currentBench = nameMatch[1];
      results[currentBench] = {};
      continue;
    }
    
    // Look for statistics lines
    if (currentBench) {
      const minMatch = line.match(/^\s+min:\s+([\d.]+)\s+ms/);
      const medianMatch = line.match(/^\s+median:\s+([\d.]+)\s+ms/);
      const meanMatch = line.match(/^\s+mean:\s+([\d.]+)\s+ms/);
      const maxMatch = line.match(/^\s+max:\s+([\d.]+)\s+ms/);
      
      if (minMatch) results[currentBench].min = parseFloat(minMatch[1]);
      if (medianMatch) results[currentBench].median = parseFloat(medianMatch[1]);
      if (meanMatch) results[currentBench].mean = parseFloat(meanMatch[1]);
      if (maxMatch) results[currentBench].max = parseFloat(maxMatch[1]);
    }
  }
  
  return results;
}

// Get the latest result files
function getLatestResults() {
  if (!fs.existsSync(resultsDir)) {
    console.error('❌ No benchmark-results directory found');
    console.error('   Run ./run-minibench-all.sh first');
    process.exit(1);
  }

  const files = fs.readdirSync(resultsDir);
  
  const nodeFiles = files.filter(f => f.startsWith('node_')).sort().reverse();
  const bunFiles = files.filter(f => f.startsWith('bun_')).sort().reverse();
  const denoFiles = files.filter(f => f.startsWith('deno_')).sort().reverse();
  
  if (nodeFiles.length === 0 || bunFiles.length === 0 || denoFiles.length === 0) {
    console.error('❌ Missing benchmark results for one or more runtimes');
    console.error(`   Found: Node=${nodeFiles.length}, Bun=${bunFiles.length}, Deno=${denoFiles.length}`);
    process.exit(1);
  }
  
  return {
    node: { file: nodeFiles[0], path: path.join(resultsDir, nodeFiles[0]) },
    bun: { file: bunFiles[0], path: path.join(resultsDir, bunFiles[0]) },
    deno: { file: denoFiles[0], path: path.join(resultsDir, denoFiles[0]) }
  };
}

// Format number with color based on comparison
function formatWithComparison(value, isMin, isMid, isMax) {
  const formatted = value.toFixed(2).padStart(8);
  if (isMin) return `\x1b[32m${formatted}\x1b[0m`; // Green (fastest)
  if (isMax) return `\x1b[31m${formatted}\x1b[0m`; // Red (slowest)
  if (isMid) return `\x1b[33m${formatted}\x1b[0m`; // Yellow (middle)
  return formatted;
}

// Calculate speedup
function speedup(baseline, comparison) {
  return (baseline / comparison).toFixed(2);
}

// Main comparison
function compareResults() {
  console.log('📊 Strom Runtime Performance Comparison\n');
  
  const latest = getLatestResults();
  
  console.log('Using results from:');
  console.log(`  🟢 Node: ${latest.node.file}`);
  console.log(`  🟠 Bun:  ${latest.bun.file}`);
  console.log(`  🔵 Deno: ${latest.deno.file}`);
  console.log();
  
  const nodeResults = parseResults(fs.readFileSync(latest.node.path, 'utf-8'));
  const bunResults = parseResults(fs.readFileSync(latest.bun.path, 'utf-8'));
  const denoResults = parseResults(fs.readFileSync(latest.deno.path, 'utf-8'));
  
  // Get all benchmark names
  const benchmarks = [...new Set([
    ...Object.keys(nodeResults),
    ...Object.keys(bunResults),
    ...Object.keys(denoResults)
  ])].sort();
  
  if (benchmarks.length === 0) {
    console.error('❌ No benchmark results found in files');
    process.exit(1);
  }
  
  // Header
  console.log('━'.repeat(100));
  console.log('Benchmark Name'.padEnd(35) + 
              'Node (ms)'.padStart(12) + 
              'Bun (ms)'.padStart(12) + 
              'Deno (ms)'.padStart(12) +
              'Fastest'.padStart(12) +
              'Speedup'.padStart(17));
  console.log('━'.repeat(100));
  
  let nodeFastestCount = 0;
  let bunFastestCount = 0;
  let denoFastestCount = 0;
  
  // Data rows
  for (const benchmark of benchmarks) {
    const node = nodeResults[benchmark]?.median;
    const bun = bunResults[benchmark]?.median;
    const deno = denoResults[benchmark]?.median;
    
    if (!node || !bun || !deno) {
      console.log(`${benchmark.padEnd(35)} ${'N/A'.padStart(12).repeat(5)}`);
      continue;
    }
    
    const values = [
      { name: 'Node', value: node },
      { name: 'Bun', value: bun },
      { name: 'Deno', value: deno }
    ].sort((a, b) => a.value - b.value);
    
    const fastest = values[0].name;
    const slowest = values[2].value;
    const fastestValue = values[0].value;
    
    if (fastest === 'Node') nodeFastestCount++;
    if (fastest === 'Bun') bunFastestCount++;
    if (fastest === 'Deno') denoFastestCount++;
    
    const nodeFormatted = formatWithComparison(node, fastest === 'Node', fastest !== 'Node' && slowest !== node, slowest === node);
    const bunFormatted = formatWithComparison(bun, fastest === 'Bun', fastest !== 'Bun' && slowest !== bun, slowest === bun);
    const denoFormatted = formatWithComparison(deno, fastest === 'Deno', fastest !== 'Deno' && slowest !== deno, slowest === deno);
    
    const speedupRatio = speedup(slowest, fastestValue);
    
    console.log(
      benchmark.padEnd(35) +
      nodeFormatted +
      '    ' +
      bunFormatted +
      '    ' +
      denoFormatted +
      '    ' +
      fastest.padStart(8) +
      `${speedupRatio}x`.padStart(9)
    );
  }
  
  console.log('━'.repeat(100));
  
  // Summary
  console.log('\n📈 Summary:');
  console.log(`  🟢 Node fastest: ${nodeFastestCount} times`);
  console.log(`  🟠 Bun fastest:  ${bunFastestCount} times`);
  console.log(`  🔵 Deno fastest: ${denoFastestCount} times`);
  console.log();
  
  // Overall winner
  const winner = [
    { name: 'Node', count: nodeFastestCount },
    { name: 'Bun', count: bunFastestCount },
    { name: 'Deno', count: denoFastestCount }
  ].sort((a, b) => b.count - a.count)[0];
  
  console.log(`🏆 Overall Winner: ${winner.name} (fastest in ${winner.count}/${benchmarks.length} benchmarks)\n`);
  
  // Calculate geometric mean for each runtime
  const nodeMean = Math.pow(benchmarks.reduce((acc, b) => acc * (nodeResults[b]?.median || 1), 1), 1 / benchmarks.length);
  const bunMean = Math.pow(benchmarks.reduce((acc, b) => acc * (bunResults[b]?.median || 1), 1), 1 / benchmarks.length);
  const denoMean = Math.pow(benchmarks.reduce((acc, b) => acc * (denoResults[b]?.median || 1), 1), 1 / benchmarks.length);
  
  console.log('⚡ Geometric Mean Performance (lower is better):');
  console.log(`  🟢 Node: ${nodeMean.toFixed(2)}ms`);
  console.log(`  🟠 Bun:  ${bunMean.toFixed(2)}ms`);
  console.log(`  🔵 Deno: ${denoMean.toFixed(2)}ms`);
  console.log();
}

compareResults();
