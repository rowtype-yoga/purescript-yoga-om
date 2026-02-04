import * as $runtime from "../runtime.js";
import * as Data$dList$dTypes from "../Data.List.Types/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dOrd from "../Data.Ord/index.js";
import * as Partial from "../Partial/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
const VariantRep = x => x;
const variantTravNil = {};
const variantTravCons = () => () => () => dictTypeEquals => ({});
const variantTagsNil = {variantTags: v => Data$dList$dTypes.Nil};
const variantTags = dict => dict.variantTags;
const variantTagsCons = dictVariantTags => dictIsSymbol => (
  {variantTags: v => Data$dList$dTypes.$List("Cons", dictIsSymbol.reflectSymbol(Type$dProxy.Proxy), dictVariantTags.variantTags(Type$dProxy.Proxy))}
);
const variantMatchNil = {};
const variantMatchCons = () => () => dictTypeEquals => ({});
const variantMapNil = {};
const variantMapCons = () => () => () => dictTypeEquals => ({});
const variantFTravNil = {};
const variantFTravCons = () => () => () => dictTypeEquals => ({});
const variantFMatchNil = {};
const variantFMatchCons = () => () => dictTypeEquals => ({});
const variantFMapNil = {};
const variantFMapCons = () => () => () => dictTypeEquals => ({});
const lookupToEnum = /* #__PURE__ */ (() => {
  const go = go$a0$copy => go$a1$copy => go$a2$copy => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$a2 = go$a2$copy, go$c = true, go$r;
    while (go$c) {
      const ix = go$a0, v = go$a1, v1 = go$a2;
      if (v.tag === "Cons" && v1.tag === "Cons") {
        if (v1._1.cardinality > ix) {
          const v2 = v1._1.toEnum(ix);
          if (v2.tag === "Just") {
            go$c = false;
            go$r = Data$dMaybe.$Maybe("Just", {type: v._1, value: v2._1});
            continue;
          }
          go$c = false;
          go$r = Data$dMaybe.Nothing;
          continue;
        }
        go$a0 = ix - v1._1.cardinality | 0;
        go$a1 = v._2;
        go$a2 = v1._2;
        continue;
      }
      go$c = false;
      go$r = Data$dMaybe.Nothing;
    }
    return go$r;
  };
  return go;
})();
const lookupTag = tag => {
  const go = go$a0$copy => {
    let go$a0 = go$a0$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0;
      if (v.tag === "Cons") {
        if (v._1 === tag) {
          go$c = false;
          go$r = true;
          continue;
        }
        go$a0 = v._2;
        continue;
      }
      if (v.tag === "Nil") {
        go$c = false;
        go$r = false;
        continue;
      }
      $runtime.fail();
    }
    return go$r;
  };
  return go;
};
const lookupCardinality = /* #__PURE__ */ (() => {
  const go = go$a0$copy => go$a1$copy => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
    while (go$c) {
      const acc = go$a0, v = go$a1;
      if (v.tag === "Cons") {
        go$a0 = acc + v._1.cardinality | 0;
        go$a1 = v._2;
        continue;
      }
      if (v.tag === "Nil") {
        go$c = false;
        go$r = acc;
        continue;
      }
      $runtime.fail();
    }
    return go$r;
  };
  return go(0);
})();
const impossible = str => Partial._crashWith("Data.Variant: impossible `" + str + "`");
const lookup = name => tag => {
  const go = go$a0$copy => go$a1$copy => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0, v1 = go$a1;
      if (v.tag === "Cons" && v1.tag === "Cons") {
        if (v._1 === tag) {
          go$c = false;
          go$r = v1._1;
          continue;
        }
        go$a0 = v._2;
        go$a1 = v1._2;
        continue;
      }
      go$c = false;
      go$r = Partial._crashWith("Data.Variant: impossible `" + name + "`");
    }
    return go$r;
  };
  return go;
};
const lookupEq = tags => eqs => v => v1 => v.type === v1.type && lookup("eq")(v.type)(tags)(eqs)(v.value)(v1.value);
const lookupOrd = tags => ords => v => v1 => {
  const v3 = Data$dOrd.ordString.compare(v.type)(v1.type);
  if (v3 === "EQ") { return lookup("compare")(v.type)(tags)(ords)(v.value)(v1.value); }
  return v3;
};
const lookupFirst = name => f => v => v1 => {
  if (v.tag === "Cons" && v1.tag === "Cons") { return {type: v._1, value: f(v1._1)}; }
  return Partial._crashWith("Data.Variant: impossible `" + name + "`");
};
const lookupFromEnum = v => {
  const go = go$a0$copy => go$a1$copy => go$a2$copy => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$a2 = go$a2$copy, go$c = true, go$r;
    while (go$c) {
      const acc = go$a0, v1 = go$a1, v2 = go$a2;
      if (v1.tag === "Cons" && v2.tag === "Cons") {
        if (v1._1 === v.type) {
          go$c = false;
          go$r = acc + v2._1.fromEnum(v.value) | 0;
          continue;
        }
        go$a0 = acc + v2._1.cardinality | 0;
        go$a1 = v1._2;
        go$a2 = v2._2;
        continue;
      }
      go$c = false;
      go$r = Partial._crashWith("Data.Variant: impossible `fromEnum`");
    }
    return go$r;
  };
  return go(0);
};
const lookupLast = name => f => {
  const go = go$a0$copy => go$a1$copy => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0, v1 = go$a1;
      if (v.tag === "Cons" && v1.tag === "Cons") {
        if (v._2.tag === "Nil" && v1._2.tag === "Nil") {
          go$c = false;
          go$r = {type: v._1, value: f(v1._1)};
          continue;
        }
        go$a0 = v._2;
        go$a1 = v1._2;
        continue;
      }
      go$c = false;
      go$r = Partial._crashWith("Data.Variant: impossible `" + name + "`");
    }
    return go$r;
  };
  return go;
};
const lookupPred = v => {
  const go2 = go2$a0$copy => go2$a1$copy => go2$a2$copy => go2$a3$copy => go2$a4$copy => go2$a5$copy => {
    let go2$a0 = go2$a0$copy, go2$a1 = go2$a1$copy, go2$a2 = go2$a2$copy, go2$a3 = go2$a3$copy, go2$a4 = go2$a4$copy, go2$a5 = go2$a5$copy, go2$c = true, go2$r;
    while (go2$c) {
      const t1 = go2$a0, b1 = go2$a1, v1 = go2$a2, v2 = go2$a3, v3 = go2$a4, v4 = go2$a5;
      if (v2.tag === "Cons" && v3.tag === "Cons" && v4.tag === "Cons") {
        if (v2._1 === v.type) {
          const v5 = v4._1.pred(v.value);
          if (v5.tag === "Nothing") {
            go2$c = false;
            go2$r = Data$dMaybe.$Maybe("Just", {type: t1, value: b1.top});
            continue;
          }
          if (v5.tag === "Just") {
            go2$c = false;
            go2$r = Data$dMaybe.$Maybe("Just", {type: v.type, value: v5._1});
            continue;
          }
          $runtime.fail();
        }
        go2$a0 = v2._1;
        go2$a1 = v3._1;
        go2$a2 = v4._1;
        go2$a3 = v2._2;
        go2$a4 = v3._2;
        go2$a5 = v4._2;
        continue;
      }
      go2$c = false;
      go2$r = Partial._crashWith("Data.Variant: impossible `pred`");
    }
    return go2$r;
  };
  return v1 => v2 => v3 => {
    if (v1.tag === "Cons" && v2.tag === "Cons" && v3.tag === "Cons") {
      if (v1._1 === v.type) {
        const v4 = v3._1.pred(v.value);
        if (v4.tag === "Nothing") { return Data$dMaybe.Nothing; }
        if (v4.tag === "Just") { return Data$dMaybe.$Maybe("Just", {type: v.type, value: v4._1}); }
        $runtime.fail();
      }
      return go2(v1._1)(v2._1)(v3._1)(v1._2)(v2._2)(v3._2);
    }
    return Partial._crashWith("Data.Variant: impossible `pred`");
  };
};
const lookupSucc = v => {
  const go = go$a0$copy => go$a1$copy => go$a2$copy => {
    let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$a2 = go$a2$copy, go$c = true, go$r;
    while (go$c) {
      const v1 = go$a0, v2 = go$a1, v3 = go$a2;
      if (v1.tag === "Cons" && v2.tag === "Cons" && v3.tag === "Cons") {
        if (v1._1 === v.type) {
          const v4 = v3._1.succ(v.value);
          if (v4.tag === "Just") {
            go$c = false;
            go$r = Data$dMaybe.$Maybe("Just", {type: v1._1, value: v4._1});
            continue;
          }
          if (v4.tag === "Nothing") {
            if (v1._2.tag === "Cons" && v2._2.tag === "Cons") {
              go$c = false;
              go$r = Data$dMaybe.$Maybe("Just", {type: v1._2._1, value: v2._2._1.bottom});
              continue;
            }
            go$c = false;
            go$r = Data$dMaybe.Nothing;
            continue;
          }
          $runtime.fail();
        }
        go$a0 = v1._2;
        go$a1 = v2._2;
        go$a2 = v3._2;
        continue;
      }
      go$c = false;
      go$r = Partial._crashWith("Data.Variant: impossible `succ`");
    }
    return go$r;
  };
  return go;
};
const contractWithInstance = () => () => dictVariantTags => (
  {
    contractWith: dictAlternative => {
      const empty = dictAlternative.Plus1().empty;
      return v => v1 => tag => a => {
        if (
          (() => {
            const go = go$a0$copy => {
              let go$a0 = go$a0$copy, go$c = true, go$r;
              while (go$c) {
                const v$1 = go$a0;
                if (v$1.tag === "Cons") {
                  if (v$1._1 === tag) {
                    go$c = false;
                    go$r = true;
                    continue;
                  }
                  go$a0 = v$1._2;
                  continue;
                }
                if (v$1.tag === "Nil") {
                  go$c = false;
                  go$r = false;
                  continue;
                }
                $runtime.fail();
              }
              return go$r;
            };
            return go(dictVariantTags.variantTags(Type$dProxy.Proxy));
          })()
        ) {
          return dictAlternative.Applicative0().pure(a);
        }
        return empty;
      };
    }
  }
);
const contractWith = dict => dict.contractWith;
export {
  VariantRep,
  contractWith,
  contractWithInstance,
  impossible,
  lookup,
  lookupCardinality,
  lookupEq,
  lookupFirst,
  lookupFromEnum,
  lookupLast,
  lookupOrd,
  lookupPred,
  lookupSucc,
  lookupTag,
  lookupToEnum,
  variantFMapCons,
  variantFMapNil,
  variantFMatchCons,
  variantFMatchNil,
  variantFTravCons,
  variantFTravNil,
  variantMapCons,
  variantMapNil,
  variantMatchCons,
  variantMatchNil,
  variantTags,
  variantTagsCons,
  variantTagsNil,
  variantTravCons,
  variantTravNil
};
