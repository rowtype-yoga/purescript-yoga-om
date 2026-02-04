// | Functions that expose the KeyboardEvent API.
// |
// | https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
// |
// | Note: The deprecated attributes `.keyCode`, `.charCode`, and
// | `.which` are deliberately omitted. It is currently recommended to use
// | `KeyboardEvent.key` instead.
// |
// | If browser support for `KeyboardEvent.key` is not yet widespread
// | enough for your use case, consider using a polyfill
// | (e.g. https://github.com/inexorabletash/polyfill#keyboard-events)
// | or use the purescript FFI to access the deprecated attributes you
// | want to work with.
// |
import * as $runtime from "../runtime.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dOrdering from "../Data.Ordering/index.js";
import * as Unsafe$dCoerce from "../Unsafe.Coerce/index.js";
import * as Web$dInternal$dFFI from "../Web.Internal.FFI/index.js";
import {altKey, code, ctrlKey, getModifierState, isComposing, key, locationIndex, metaKey, repeat, shiftKey} from "./foreign.js";
const $KeyLocation = tag => tag;
const Standard = /* #__PURE__ */ $KeyLocation("Standard");
const Left = /* #__PURE__ */ $KeyLocation("Left");
const Right = /* #__PURE__ */ $KeyLocation("Right");
const Numpad = /* #__PURE__ */ $KeyLocation("Numpad");
const toUIEvent = Unsafe$dCoerce.unsafeCoerce;
const toEvent = Unsafe$dCoerce.unsafeCoerce;
const toEnumKeyLocation = v => {
  if (v === 0) { return Data$dMaybe.$Maybe("Just", Standard); }
  if (v === 1) { return Data$dMaybe.$Maybe("Just", Left); }
  if (v === 2) { return Data$dMaybe.$Maybe("Just", Right); }
  if (v === 3) { return Data$dMaybe.$Maybe("Just", Numpad); }
  return Data$dMaybe.Nothing;
};
const fromUIEvent = /* #__PURE__ */ Web$dInternal$dFFI.unsafeReadProtoTagged("KeyboardEvent");
const fromEvent = /* #__PURE__ */ Web$dInternal$dFFI.unsafeReadProtoTagged("KeyboardEvent");
const fromEnumKeyLocation = v => {
  if (v === "Standard") { return 0; }
  if (v === "Left") { return 1; }
  if (v === "Right") { return 2; }
  if (v === "Numpad") { return 3; }
  $runtime.fail();
};
const eqKeyLocation = {
  eq: x => y => {
    if (x === "Standard") { return y === "Standard"; }
    if (x === "Left") { return y === "Left"; }
    if (x === "Right") { return y === "Right"; }
    return x === "Numpad" && y === "Numpad";
  }
};
const ordKeyLocation = {
  compare: x => y => {
    if (x === "Standard") {
      if (y === "Standard") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Standard") { return Data$dOrdering.GT; }
    if (x === "Left") {
      if (y === "Left") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Left") { return Data$dOrdering.GT; }
    if (x === "Right") {
      if (y === "Right") { return Data$dOrdering.EQ; }
      return Data$dOrdering.LT;
    }
    if (y === "Right") { return Data$dOrdering.GT; }
    if (x === "Numpad" && y === "Numpad") { return Data$dOrdering.EQ; }
    $runtime.fail();
  },
  Eq0: () => eqKeyLocation
};
const enumKeyLocation = {
  succ: a => {
    const $0 = (() => {
      if (a === "Standard") { return 1; }
      if (a === "Left") { return 2; }
      if (a === "Right") { return 3; }
      if (a === "Numpad") { return 4; }
      $runtime.fail();
    })();
    if ($0 === 0) { return Data$dMaybe.$Maybe("Just", Standard); }
    if ($0 === 1) { return Data$dMaybe.$Maybe("Just", Left); }
    if ($0 === 2) { return Data$dMaybe.$Maybe("Just", Right); }
    if ($0 === 3) { return Data$dMaybe.$Maybe("Just", Numpad); }
    return Data$dMaybe.Nothing;
  },
  pred: a => {
    const $0 = (() => {
      if (a === "Standard") { return -1; }
      if (a === "Left") { return 0; }
      if (a === "Right") { return 1; }
      if (a === "Numpad") { return 2; }
      $runtime.fail();
    })();
    if ($0 === 0) { return Data$dMaybe.$Maybe("Just", Standard); }
    if ($0 === 1) { return Data$dMaybe.$Maybe("Just", Left); }
    if ($0 === 2) { return Data$dMaybe.$Maybe("Just", Right); }
    if ($0 === 3) { return Data$dMaybe.$Maybe("Just", Numpad); }
    return Data$dMaybe.Nothing;
  },
  Ord0: () => ordKeyLocation
};
const boundedKeyLocation = {bottom: Standard, top: Numpad, Ord0: () => ordKeyLocation};
const boundedEnumKeyLocation = {cardinality: 4, toEnum: toEnumKeyLocation, fromEnum: fromEnumKeyLocation, Bounded0: () => boundedKeyLocation, Enum1: () => enumKeyLocation};
const location = () => x => {
  const $0 = locationIndex(x);
  if ($0 === 0) { return Standard; }
  if ($0 === 1) { return Left; }
  if ($0 === 2) { return Right; }
  if ($0 === 3) { return Numpad; }
  $runtime.fail();
};
export {
  $KeyLocation,
  Left,
  Numpad,
  Right,
  Standard,
  boundedEnumKeyLocation,
  boundedKeyLocation,
  enumKeyLocation,
  eqKeyLocation,
  fromEnumKeyLocation,
  fromEvent,
  fromUIEvent,
  location,
  ordKeyLocation,
  toEnumKeyLocation,
  toEvent,
  toUIEvent
};
export * from "./foreign.js";
