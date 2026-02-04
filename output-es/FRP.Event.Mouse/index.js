import * as $runtime from "../runtime.js";
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
import * as Web$dUIEvent$dMouseEvent from "../Web.UIEvent.MouseEvent/index.js";
const traverse_ = /* #__PURE__ */ Data$dFoldable.traverse_(Effect.applicativeEffect)(Data$dFoldable.foldableMaybe);
const withPosition = v => e => {
  const $0 = v.position;
  return FRP$dEvent.backdoor.makeEvent(k => FRP$dEvent.backdoor.subscribe(e)(value => () => {
    const pos = $0.value;
    return k({value, pos})();
  }));
};
const withButtons = v => e => {
  const $0 = v.buttons;
  return FRP$dEvent.backdoor.makeEvent(k => FRP$dEvent.backdoor.subscribe(e)(value => () => {
    const buttonsValue = $0.value;
    return k({value, buttons: buttonsValue})();
  }));
};
const up = /* #__PURE__ */ (() => FRP$dEvent.backdoor.makeEvent(k => () => {
  const target = Web$dHTML.window();
  const mouseUpListener = Web$dEvent$dEventTarget.eventListener(e => traverse_(me => k(Web$dUIEvent$dMouseEvent.button(me)))(Web$dInternal$dFFI._unsafeReadProtoTagged(
    Data$dMaybe.Nothing,
    Data$dMaybe.Just,
    "MouseEvent",
    e
  )))();
  Web$dEvent$dEventTarget.addEventListener("mouseup")(mouseUpListener)(false)(target)();
  return Web$dEvent$dEventTarget.removeEventListener("mouseup")(mouseUpListener)(false)(target);
}))();
const move = m => {
  const $0 = withPosition(m)((v, k) => {
    k(undefined);
    return () => {};
  });
  return (tf, k) => $0(
    tf,
    a => {
      if (a.pos.tag === "Just") {
        const $1 = a.pos._1;
        return k($1);
      }
      if (a.pos.tag === "Nothing") { return; }
      $runtime.fail();
    }
  );
};
const getMouse = () => {
  const position = {value: Data$dMaybe.Nothing};
  const buttons = {value: Data$dMap$dInternal.Leaf};
  const target = Web$dHTML.window();
  const mouseMoveListener = Web$dEvent$dEventTarget.eventListener(e => traverse_(me => {
    const $0 = Data$dMaybe.$Maybe("Just", {x: Web$dUIEvent$dMouseEvent.clientX(me), y: Web$dUIEvent$dMouseEvent.clientY(me)});
    return () => position.value = $0;
  })(Web$dInternal$dFFI._unsafeReadProtoTagged(Data$dMaybe.Nothing, Data$dMaybe.Just, "MouseEvent", e)))();
  const mouseDownListener = Web$dEvent$dEventTarget.eventListener(e => traverse_(me => {
    const $0 = Data$dSet.insert(Data$dOrd.ordInt)(Web$dUIEvent$dMouseEvent.button(me));
    return () => {
      const $1 = buttons.value;
      return buttons.value = $0($1);
    };
  })(Web$dInternal$dFFI._unsafeReadProtoTagged(Data$dMaybe.Nothing, Data$dMaybe.Just, "MouseEvent", e)))();
  const mouseUpListener = Web$dEvent$dEventTarget.eventListener(e => traverse_(me => {
    const $0 = Data$dMap$dInternal.delete(Data$dOrd.ordInt)(Web$dUIEvent$dMouseEvent.button(me));
    return () => {
      const $1 = buttons.value;
      return buttons.value = $0($1);
    };
  })(Web$dInternal$dFFI._unsafeReadProtoTagged(Data$dMaybe.Nothing, Data$dMaybe.Just, "MouseEvent", e)))();
  Web$dEvent$dEventTarget.addEventListener("mousemove")(mouseMoveListener)(false)(target)();
  Web$dEvent$dEventTarget.addEventListener("mousedown")(mouseDownListener)(false)(target)();
  Web$dEvent$dEventTarget.addEventListener("mouseup")(mouseUpListener)(false)(target)();
  return {
    position,
    buttons,
    dispose: (() => {
      const $0 = Web$dEvent$dEventTarget.removeEventListener("mousemove")(mouseMoveListener)(false)(target);
      return () => {
        $0();
        Web$dEvent$dEventTarget.removeEventListener("mousedown")(mouseDownListener)(false)(target)();
        return Web$dEvent$dEventTarget.removeEventListener("mouseup")(mouseUpListener)(false)(target)();
      };
    })()
  };
};
const down = /* #__PURE__ */ (() => FRP$dEvent.backdoor.makeEvent(k => () => {
  const target = Web$dHTML.window();
  const mouseDownListener = Web$dEvent$dEventTarget.eventListener(e => traverse_(me => k(Web$dUIEvent$dMouseEvent.button(me)))(Web$dInternal$dFFI._unsafeReadProtoTagged(
    Data$dMaybe.Nothing,
    Data$dMaybe.Just,
    "MouseEvent",
    e
  )))();
  Web$dEvent$dEventTarget.addEventListener("mousedown")(mouseDownListener)(false)(target)();
  return Web$dEvent$dEventTarget.removeEventListener("mousedown")(mouseDownListener)(false)(target);
}))();
const disposeMouse = v => v.dispose;
export {disposeMouse, down, getMouse, move, traverse_, up, withButtons, withPosition};
