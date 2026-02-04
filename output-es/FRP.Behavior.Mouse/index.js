import * as FRP$dEvent$dMouse from "../FRP.Event.Mouse/index.js";
const position = m => e => {
  const $0 = FRP$dEvent$dMouse.withPosition(m)(e);
  return (b, k) => $0(
    b,
    a => {
      const $1 = a.value(a.pos);
      return k($1);
    }
  );
};
const buttons = m => e => {
  const $0 = FRP$dEvent$dMouse.withButtons(m)(e);
  return (b, k) => $0(
    b,
    a => {
      const $1 = a.value(a.buttons);
      return k($1);
    }
  );
};
export {buttons, position};
