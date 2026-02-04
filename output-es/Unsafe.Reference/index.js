import {reallyUnsafeRefEq} from "./foreign.js";
const UnsafeRefEqFallback = x => x;
const UnsafeRefEq = x => x;
const unsafeRefEq = reallyUnsafeRefEq;
const eqUnsafeRefEqFallback = dictEq => ({eq: v => v1 => reallyUnsafeRefEq(v)(v1) || dictEq.eq(v)(v1)});
const eqUnsafeRefEq = {eq: v => v1 => reallyUnsafeRefEq(v)(v1)};
export {UnsafeRefEq, UnsafeRefEqFallback, eqUnsafeRefEq, eqUnsafeRefEqFallback, unsafeRefEq};
export * from "./foreign.js";
