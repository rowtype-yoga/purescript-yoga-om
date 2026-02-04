import * as Unsafe$dCoerce from "../Unsafe.Coerce/index.js";
import * as Web$dInternal$dFFI from "../Web.Internal.FFI/index.js";
import {data_} from "./foreign.js";
const toUIEvent = Unsafe$dCoerce.unsafeCoerce;
const toEvent = Unsafe$dCoerce.unsafeCoerce;
const fromUIEvent = /* #__PURE__ */ Web$dInternal$dFFI.unsafeReadProtoTagged("CompositionEvent");
const fromEvent = /* #__PURE__ */ Web$dInternal$dFFI.unsafeReadProtoTagged("CompositionEvent");
export {fromEvent, fromUIEvent, toEvent, toUIEvent};
export * from "./foreign.js";
