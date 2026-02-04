import * as $runtime from "../runtime.js";
import * as Data$dList$dTypes from "../Data.List.Types/index.js";
import * as Data$dMap$dInternal from "../Data.Map.Internal/index.js";
import * as Data$dOrd from "../Data.Ord/index.js";
import * as FRP$dEvent$dKeyboard from "../FRP.Event.Keyboard/index.js";
const fromFoldable = /* #__PURE__ */ (() => {
  const go = go$a0$copy => go$a1$copy => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
    while (go$c) {
      const b = go$a0, v = go$a1;
      if (v.tag === "Nil") {
        go$c = false;
        go$r = b;
        continue;
      }
      if (v.tag === "Cons") {
        go$a0 = Data$dMap$dInternal.insert(Data$dOrd.ordString)(v._1)()(b);
        go$a1 = v._2;
        continue;
      }
      $runtime.fail();
    }
    return go$r;
  };
  const $0 = go(Data$dMap$dInternal.Leaf);
  return x => $0((() => {
    const go$1 = (m$p, z$p) => {
      if (m$p.tag === "Leaf") { return z$p; }
      if (m$p.tag === "Node") { return go$1(m$p._5, Data$dList$dTypes.$List("Cons", m$p._3, go$1(m$p._6, z$p))); }
      $runtime.fail();
    };
    return go$1(x, Data$dList$dTypes.Nil);
  })());
})();
const member = k => {
  const go = go$a0$copy => {
    let go$a0 = go$a0$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0;
      if (v.tag === "Leaf") {
        go$c = false;
        go$r = false;
        continue;
      }
      if (v.tag === "Node") {
        const v1 = Data$dOrd.ordString.compare(k)(v._3);
        if (v1 === "LT") {
          go$a0 = v._5;
          continue;
        }
        if (v1 === "GT") {
          go$a0 = v._6;
          continue;
        }
        if (v1 === "EQ") {
          go$c = false;
          go$r = true;
          continue;
        }
      }
      $runtime.fail();
    }
    return go$r;
  };
  return go;
};
const keys = keyboard => e => {
  const $0 = FRP$dEvent$dKeyboard.withKeys(keyboard)(e);
  return (b, k) => $0(
    b,
    a => {
      const $1 = a.value(fromFoldable(a.keys));
      return k($1);
    }
  );
};
const key = keyboard => k => {
  const $0 = member(k);
  return e => keys(keyboard)((b, k$1) => e(b, a => k$1(x => a($0(x)))));
};
export {fromFoldable, key, keys, member};
