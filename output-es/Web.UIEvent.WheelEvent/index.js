import * as $runtime from "../runtime.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dOrdering from "../Data.Ordering/index.js";
import * as Unsafe$dCoerce from "../Unsafe.Coerce/index.js";
import * as Web$dInternal$dFFI from "../Web.Internal.FFI/index.js";
import {deltaModeIndex, deltaX, deltaY, deltaZ} from "./foreign.js";
const $DeltaMode = tag => tag;
const Pixel = /* #__PURE__ */ $DeltaMode("Pixel");
const Line = /* #__PURE__ */ $DeltaMode("Line");
const Page = /* #__PURE__ */ $DeltaMode("Page");
const toUIEvent = Unsafe$dCoerce.unsafeCoerce;
const toMouseEvent = Unsafe$dCoerce.unsafeCoerce;
const toEvent = Unsafe$dCoerce.unsafeCoerce;
const toEnumDeltaMode = v => {
  if (v === 0) { return Data$dMaybe.$Maybe("Just", Pixel); }
  if (v === 1) { return Data$dMaybe.$Maybe("Just", Line); }
  if (v === 2) { return Data$dMaybe.$Maybe("Just", Page); }
  return Data$dMaybe.Nothing;
};
const fromUIEvent = /* #__PURE__ */ Web$dInternal$dFFI.unsafeReadProtoTagged("WheelEvent");
const fromMouseEvent = /* #__PURE__ */ Web$dInternal$dFFI.unsafeReadProtoTagged("WheelEvent");
const fromEvent = /* #__PURE__ */ Web$dInternal$dFFI.unsafeReadProtoTagged("WheelEvent");
const fromEnumDeltaMode = v => {
  if (v === "Pixel") { return 0; }
  if (v === "Line") { return 1; }
  if (v === "Page") { return 2; }
  $runtime.fail();
};
const eqDeltaMode = {
  eq: x => y => {
    if (x === "Pixel") { return y === "Pixel"; }
    if (x === "Line") { return y === "Line"; }
    return x === "Page" && y === "Page";
  }
};
const ordDeltaMode = {
  compare: x => y => {
    if (x === "Pixel") {
      if (y === "Pixel") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Pixel") { return Data$dOrdering.GT; }
    if (x === "Line") {
      if (y === "Line") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Line") { return Data$dOrdering.GT; }
    if (x === "Page" && y === "Page") { return Data$dOrdering.EQ; }
    $runtime.fail();
  },
  Eq0: () => eqDeltaMode
};
const enumDeltaMode = {
  succ: a => {
    const $0 = (() => {
      if (a === "Pixel") { return 1; }
      if (a === "Line") { return 2; }
      if (a === "Page") { return 3; }
      $runtime.fail();
    })();
    if ($0 === 0) { return Data$dMaybe.$Maybe("Just", Pixel); }
    if ($0 === 1) { return Data$dMaybe.$Maybe("Just", Line); }
    if ($0 === 2) { return Data$dMaybe.$Maybe("Just", Page); }
    return Data$dMaybe.Nothing;
  },
  pred: a => {
    const $0 = (() => {
      if (a === "Pixel") { return -1; }
      if (a === "Line") { return 0; }
      if (a === "Page") { return 1; }
      $runtime.fail();
    })();
    if ($0 === 0) { return Data$dMaybe.$Maybe("Just", Pixel); }
    if ($0 === 1) { return Data$dMaybe.$Maybe("Just", Line); }
    if ($0 === 2) { return Data$dMaybe.$Maybe("Just", Page); }
    return Data$dMaybe.Nothing;
  },
  Ord0: () => ordDeltaMode
};
const boundedDeltaMode = {bottom: Pixel, top: Page, Ord0: () => ordDeltaMode};
const boundedEnumDeltaMode = {cardinality: 3, toEnum: toEnumDeltaMode, fromEnum: fromEnumDeltaMode, Bounded0: () => boundedDeltaMode, Enum1: () => enumDeltaMode};
const deltaMode = () => x => {
  const $0 = deltaModeIndex(x);
  if ($0 === 0) { return Pixel; }
  if ($0 === 1) { return Line; }
  if ($0 === 2) { return Page; }
  $runtime.fail();
};
export {
  $DeltaMode,
  Line,
  Page,
  Pixel,
  boundedDeltaMode,
  boundedEnumDeltaMode,
  deltaMode,
  enumDeltaMode,
  eqDeltaMode,
  fromEnumDeltaMode,
  fromEvent,
  fromMouseEvent,
  fromUIEvent,
  ordDeltaMode,
  toEnumDeltaMode,
  toEvent,
  toMouseEvent,
  toUIEvent
};
export * from "./foreign.js";
