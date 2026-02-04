import * as $runtime from "../runtime.js";
import * as FRP$dEvent from "../FRP.Event/index.js";
import * as Web$dHTML from "../Web.HTML/index.js";
import * as Web$dHTML$dWindow from "../Web.HTML.Window/index.js";
const animationFrame = /* #__PURE__ */ (() => FRP$dEvent.backdoor.makeEvent(k => () => {
  const w = Web$dHTML.window();
  let cancelled = false;
  const loop$lazy = $runtime.binding(() => {
    const $0 = Web$dHTML$dWindow.requestAnimationFrame((() => {
      const $0 = k();
      return () => {
        $0();
        const b = cancelled;
        if (!b) { return loop$lazy()(); }
        if (b) { return; }
        $runtime.fail();
      };
    })())(w);
    return () => {$0();};
  });
  const loop = loop$lazy();
  loop();
  return () => cancelled = true;
}))();
export {animationFrame};
