import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dMap$dInternal from "../Data.Map.Internal/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dOrd from "../Data.Ord/index.js";
import * as Data$dSet from "../Data.Set/index.js";
import * as Effect from "../Effect/index.js";
import * as FRP$dEvent from "../FRP.Event/index.js";
import * as Web$dEvent$dEventTarget from "../Web.Event.EventTarget/index.js";
import * as Web$dHTML from "../Web.HTML/index.js";
import * as Web$dInternal$dFFI from "../Web.Internal.FFI/index.js";
import * as Web$dUIEvent$dKeyboardEvent from "../Web.UIEvent.KeyboardEvent/index.js";
const traverse_ = /* #__PURE__ */ Data$dFoldable.traverse_(Effect.applicativeEffect)(Data$dFoldable.foldableMaybe);
const withKeys = v => e => {
  const $0 = v.keys;
  return FRP$dEvent.backdoor.makeEvent(k => FRP$dEvent.backdoor.subscribe(e)(value => () => {
    const keysValue = $0.value;
    return k({value, keys: keysValue})();
  }));
};
const up = /* #__PURE__ */ (() => FRP$dEvent.backdoor.makeEvent(k => () => {
  const target = Web$dHTML.window();
  const keyUpListener = Web$dEvent$dEventTarget.eventListener(e => traverse_(ke => k(Web$dUIEvent$dKeyboardEvent.code(ke)))(Web$dInternal$dFFI._unsafeReadProtoTagged(
    Data$dMaybe.Nothing,
    Data$dMaybe.Just,
    "KeyboardEvent",
    e
  )))();
  Web$dEvent$dEventTarget.addEventListener("keyup")(keyUpListener)(false)(target)();
  return Web$dEvent$dEventTarget.removeEventListener("keyup")(keyUpListener)(false)(target);
}))();
const getKeyboard = () => {
  const keys = {value: Data$dMap$dInternal.Leaf};
  const target = Web$dHTML.window();
  const keyDownListener = Web$dEvent$dEventTarget.eventListener(e => traverse_(ke => {
    const $0 = Data$dSet.insert(Data$dOrd.ordString)(Web$dUIEvent$dKeyboardEvent.code(ke));
    return () => {
      const $1 = keys.value;
      return keys.value = $0($1);
    };
  })(Web$dInternal$dFFI._unsafeReadProtoTagged(Data$dMaybe.Nothing, Data$dMaybe.Just, "KeyboardEvent", e)))();
  const keyUpListener = Web$dEvent$dEventTarget.eventListener(e => traverse_(ke => {
    const $0 = Data$dMap$dInternal.delete(Data$dOrd.ordString)(Web$dUIEvent$dKeyboardEvent.code(ke));
    return () => {
      const $1 = keys.value;
      return keys.value = $0($1);
    };
  })(Web$dInternal$dFFI._unsafeReadProtoTagged(Data$dMaybe.Nothing, Data$dMaybe.Just, "KeyboardEvent", e)))();
  Web$dEvent$dEventTarget.addEventListener("keydown")(keyDownListener)(false)(target)();
  Web$dEvent$dEventTarget.addEventListener("keyup")(keyUpListener)(false)(target)();
  return {
    keys,
    dispose: (() => {
      const $0 = Web$dEvent$dEventTarget.removeEventListener("keydown")(keyDownListener)(false)(target);
      return () => {
        $0();
        return Web$dEvent$dEventTarget.removeEventListener("keyup")(keyUpListener)(false)(target)();
      };
    })()
  };
};
const down = /* #__PURE__ */ (() => FRP$dEvent.backdoor.makeEvent(k => () => {
  const target = Web$dHTML.window();
  const keyDownListener = Web$dEvent$dEventTarget.eventListener(e => traverse_(ke => k(Web$dUIEvent$dKeyboardEvent.code(ke)))(Web$dInternal$dFFI._unsafeReadProtoTagged(
    Data$dMaybe.Nothing,
    Data$dMaybe.Just,
    "KeyboardEvent",
    e
  )))();
  Web$dEvent$dEventTarget.addEventListener("keydown")(keyDownListener)(false)(target)();
  return Web$dEvent$dEventTarget.removeEventListener("keydown")(keyDownListener)(false)(target);
}))();
const disposeKeyboard = v => v.dispose;
export {disposeKeyboard, down, getKeyboard, traverse_, up, withKeys};
