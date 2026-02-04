// | This module provides the `bench` function, which prints a short summary
// | of the running times of a synchronous function to the console.
// |
// | For benchmarking tasks which require finer accuracy, or graphs as output,
// | consider using `purescript-benchotron` instead.
import * as $runtime from "../runtime.js";
import * as Data$dInt from "../Data.Int/index.js";
import * as Data$dNumber from "../Data.Number/index.js";
import * as Effect$dConsole from "../Effect.Console/index.js";
import {gc, timeNs, toFixed} from "./foreign.js";
const withUnits = t => {
  if (t < 1000.0) { return toFixed(t) + " ns"; }
  if (t < 1000000.0) { return toFixed(t / 1000.0) + " μs"; }
  if (t < 1000000000.0) { return toFixed(t / 1000000.0) + " ms"; }
  return toFixed(t / 1000000000.0) + " s";
};
const benchWith$p = n => f => () => {
  let sumRef = 0.0;
  let sum2Ref = 0.0;
  let minRef = Data$dNumber.infinity;
  let maxRef = 0.0;
  gc();
  for (const v of $runtime.range(0, n)) {
    const ns = timeNs(f);
    const $0 = sumRef;
    sumRef = $0 + ns;
    const $1 = sum2Ref;
    sum2Ref = $1 + ns * ns;
    const $2 = minRef;
    minRef = Data$dNumber.min($2)(ns);
    const $3 = maxRef;
    maxRef = Data$dNumber.max($3)(ns);
  }
  const sum = sumRef;
  const sum2 = sum2Ref;
  const min$p = minRef;
  const max$p = maxRef;
  const n$p = Data$dInt.toNumber(n);
  const mean = sum / n$p;
  return {mean, stdDev: Data$dNumber.sqrt((sum2 - n$p * mean * mean) / (n$p - 1.0)), min: min$p, max: max$p};
};
const benchWith = n => f => {
  const $0 = benchWith$p(n)(f);
  return () => {
    const res = $0();
    Effect$dConsole.log("mean   = " + withUnits(res.mean))();
    Effect$dConsole.log("stddev = " + withUnits(res.stdDev))();
    Effect$dConsole.log("min    = " + withUnits(res.min))();
    return Effect$dConsole.log("max    = " + withUnits(res.max))();
  };
};
const bench = /* #__PURE__ */ benchWith(1000);
export {bench, benchWith, benchWith$p, withUnits};
export * from "./foreign.js";
