import * as $runtime from "../runtime.js";
import * as Effect$dNow from "../Effect.Now/index.js";
import * as Effect$dTimer from "../Effect.Timer/index.js";
import * as FRP$dEvent from "../FRP.Event/index.js";
import * as FRP$dEvent$dClass from "../FRP.Event.Class/index.js";
const gateBy = /* #__PURE__ */ FRP$dEvent$dClass.gateBy(FRP$dEvent.eventIsEvent);
const withTime = e => FRP$dEvent.backdoor.makeEvent(k => FRP$dEvent.backdoor.subscribe(e)(value => () => {
  const time = Effect$dNow.now();
  return k({time, value})();
}));
const interval = n => FRP$dEvent.backdoor.makeEvent(k => {
  const $0 = Effect$dTimer.setIntervalImpl(n)(() => {
    const time = Effect$dNow.now();
    return k(time)();
  });
  return () => {
    const id = $0();
    return Effect$dTimer.clearIntervalImpl(id);
  };
});
const debounceWith = process => event => {
  const stamped = withTime(event);
  const $0 = FRP$dEvent.fix(processed => process((() => {
    const $0 = gateBy(a => b => {
      if (a.tag === "Nothing") { return true; }
      if (a.tag === "Just") { return a._1 < b.time; }
      $runtime.fail();
    })((() => {
      const $0 = withTime((b, k) => processed(
        b,
        a => {
          const $0 = a.period;
          return k($0);
        }
      ));
      return (b, k) => $0(
        b,
        a => {
          const $1 = a.time + a.value;
          const $2 = $1 >= -8639977881600000.0 && $1 <= 8639977881599999.0 ? $1 : a.time;
          return k($2);
        }
      );
    })())(stamped);
    return (b, k) => $0(
      b,
      a => {
        const $1 = a.value;
        return k($1);
      }
    );
  })()));
  return (b, k) => $0(
    b,
    a => {
      const $1 = a.value;
      return k($1);
    }
  );
};
const debounce = period => debounceWith(v => (b, k) => v(b, a => k({period, value: a})));
export {debounce, debounceWith, gateBy, interval, withTime};
