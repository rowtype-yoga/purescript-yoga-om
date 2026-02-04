import * as $runtime from "../runtime.js";
import * as Data$dOrd from "../Data.Ord/index.js";
import * as Data$dOrdering from "../Data.Ordering/index.js";
import * as FRP$dEvent from "../FRP.Event/index.js";
import * as FRP$dEvent$dVBus from "../FRP.Event.VBus/index.js";
const $Child = (tag, _1) => ({tag, _1});
const $Entity = (tag, _1) => ({tag, _1});
const $Scope = (tag, _1) => ({tag, _1});
const Local = value0 => $Scope("Local", value0);
const Global = /* #__PURE__ */ $Scope("Global");
const Element = x => x;
const Insert = value0 => $Child("Insert", value0);
const Remove = /* #__PURE__ */ $Child("Remove");
const Logic = value0 => $Child("Logic", value0);
const DynamicChildren$p = value0 => $Entity("DynamicChildren'", value0);
const FixedChildren$p = value0 => $Entity("FixedChildren'", value0);
const EventfulElement$p = value0 => $Entity("EventfulElement'", value0);
const Element$p = value0 => $Entity("Element'", value0);
const DynamicChildren = x => x;
const FixedChildren = x => x;
const EventfulElement = x => x;
const eqScope = {
  eq: x => y => {
    if (x.tag === "Local") { return y.tag === "Local" && x._1 === y._1; }
    return x.tag === "Global" && y.tag === "Global";
  }
};
const ordScope = {
  compare: x => y => {
    if (x.tag === "Local") {
      if (y.tag === "Local") { return Data$dOrd.ordString.compare(x._1)(y._1); }
      return Data$dOrdering.LT;
    }
    if (y.tag === "Local") { return Data$dOrdering.GT; }
    if (x.tag === "Global" && y.tag === "Global") { return Data$dOrdering.EQ; }
    $runtime.fail();
  },
  Eq0: () => eqScope
};
const vbussed = () => dictVBus => px => f => $Entity("EventfulElement'", FRP$dEvent$dVBus.vbackdoor.vbus()(dictVBus)(px)(f));
const fixed = a => $Entity("FixedChildren'", a);
const envy = a => $Entity("EventfulElement'", a);
const dyn = a => $Entity("DynamicChildren'", a);
const bussed = f => $Entity("EventfulElement'", FRP$dEvent.backdoor.bus(f));
export {
  $Child,
  $Entity,
  $Scope,
  DynamicChildren,
  DynamicChildren$p,
  Element,
  Element$p,
  EventfulElement,
  EventfulElement$p,
  FixedChildren,
  FixedChildren$p,
  Global,
  Insert,
  Local,
  Logic,
  Remove,
  bussed,
  dyn,
  envy,
  eqScope,
  fixed,
  ordScope,
  vbussed
};
