import * as FRP$dEvent$dTime from "../FRP.Event.Time/index.js";
const instant = e => {
  const $0 = FRP$dEvent$dTime.withTime(e);
  return (b, k) => $0(
    b,
    a => {
      const $1 = a.value(a.time);
      return k($1);
    }
  );
};
const seconds = e => instant((b, k) => e(b, a => k(x => a(x / 1000.0))));
export {instant, seconds};
