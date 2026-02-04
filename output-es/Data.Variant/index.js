import * as $runtime from "../runtime.js";
import * as Data$dList$dTypes from "../Data.List.Types/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dVariant$dInternal from "../Data.Variant.Internal/index.js";
import * as Partial from "../Partial/index.js";
import * as Record$dUnsafe from "../Record.Unsafe/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
import * as Unsafe$dCoerce from "../Unsafe.Coerce/index.js";
const Unvariant = x => x;
const variantShows = dict => dict.variantShows;
const variantOrds = dict => dict.variantOrds;
const variantEqs = dict => dict.variantEqs;
const variantBoundedEnums = dict => dict.variantBoundedEnums;
const variantBounded = dict => dict.variantBounded;
const unvariant = v => f => f({
  reflectSymbol: (() => {
    const $0 = v.type;
    return v$1 => $0;
  })()
})()(Type$dProxy.Proxy)(v.value);
const traverseSome = () => () => () => () => dictFunctor => r => k => v => {
  if (Record$dUnsafe.unsafeHas(v.type)(r)) { return dictFunctor.map(value => ({type: v.type, value}))(Record$dUnsafe.unsafeGet(v.type)(r)(v.value)); }
  return k(v);
};
const traverse = () => () => () => () => dictApplicative => {
  const traverseSome2 = traverseSome()()()()(dictApplicative.Apply0().Functor0());
  return r => traverseSome2(r)(x => dictApplicative.pure(x));
};
const showVariantNil = {variantShows: v => Data$dList$dTypes.Nil};
const showVariantCons = dictVariantShows => dictShow => {
  const show1 = dictShow.show;
  return {variantShows: v => Data$dList$dTypes.$List("Cons", show1, dictVariantShows.variantShows(Type$dProxy.Proxy))};
};
const showVariant = () => dictVariantTags => dictVariantShows => (
  {
    show: v1 => "(inj @" + Data$dShow.showStringImpl(v1.type) + " " + Data$dVariant$dInternal.lookup("show")(v1.type)(dictVariantTags.variantTags(Type$dProxy.Proxy))(dictVariantShows.variantShows(Type$dProxy.Proxy))(v1.value) + ")"
  }
);
const overSome = () => () => () => () => r => k => v => {
  if (Record$dUnsafe.unsafeHas(v.type)(r)) { return {type: v.type, value: Record$dUnsafe.unsafeGet(v.type)(r)(v.value)}; }
  return k(v);
};
const over = () => () => () => () => r => overSome()()()()(r)(Unsafe$dCoerce.unsafeCoerce);
const ordVariantNil = {variantOrds: v => Data$dList$dTypes.Nil};
const ordVariantCons = dictVariantOrds => dictOrd => {
  const compare = dictOrd.compare;
  return {variantOrds: v => Data$dList$dTypes.$List("Cons", compare, dictVariantOrds.variantOrds(Type$dProxy.Proxy))};
};
const onMatch = () => () => () => r => k => v => {
  if (Record$dUnsafe.unsafeHas(v.type)(r)) { return Record$dUnsafe.unsafeGet(v.type)(r)(v.value); }
  return k(v);
};
const on = () => dictIsSymbol => p => f => g => r => {
  if (r.type === dictIsSymbol.reflectSymbol(p)) { return f(r.value); }
  return g(r);
};
const prj = () => dictIsSymbol => dictAlternative => {
  const empty = dictAlternative.Plus1().empty;
  return p => r => {
    if (r.type === dictIsSymbol.reflectSymbol(p)) { return dictAlternative.Applicative0().pure(r.value); }
    return empty;
  };
};
const inj = () => dictIsSymbol => p => value => ({type: dictIsSymbol.reflectSymbol(p), value});
const overOne = dictIsSymbol => () => () => p => f => g => r => {
  if (r.type === dictIsSymbol.reflectSymbol(p)) { return {type: dictIsSymbol.reflectSymbol(p), value: f(r.value)}; }
  return g(r);
};
const revariant = v => v(dictIsSymbol => () => p => value => ({type: dictIsSymbol.reflectSymbol(p), value}));
const traverseOne = dictIsSymbol => () => () => dictFunctor => p => f => {
  const $0 = dictFunctor.map(value => ({type: dictIsSymbol.reflectSymbol(p), value}));
  return g => r => {
    if (r.type === dictIsSymbol.reflectSymbol(p)) { return $0(f(r.value)); }
    return g(r);
  };
};
const expand = () => Unsafe$dCoerce.unsafeCoerce;
const eqVariantNil = {variantEqs: v => Data$dList$dTypes.Nil};
const eqVariantCons = dictVariantEqs => dictEq => {
  const eq1 = dictEq.eq;
  return {variantEqs: v => Data$dList$dTypes.$List("Cons", eq1, dictVariantEqs.variantEqs(Type$dProxy.Proxy))};
};
const eqVariant = () => dictVariantTags => dictVariantEqs => (
  {eq: v1 => v2 => Data$dVariant$dInternal.lookupEq(dictVariantTags.variantTags(Type$dProxy.Proxy))(dictVariantEqs.variantEqs(Type$dProxy.Proxy))(v1)(v2)}
);
const ordVariant = () => dictVariantTags => dictVariantEqs => {
  const eqVariant3 = eqVariant()(dictVariantTags)(dictVariantEqs);
  return dictVariantOrds => (
    {
      compare: v1 => v2 => Data$dVariant$dInternal.lookupOrd(dictVariantTags.variantTags(Type$dProxy.Proxy))(dictVariantOrds.variantOrds(Type$dProxy.Proxy))(v1)(v2),
      Eq0: () => eqVariant3
    }
  );
};
const enumVariant = () => dictVariantTags => dictVariantEqs => {
  const ordVariant3 = ordVariant()(dictVariantTags)(dictVariantEqs);
  return dictVariantOrds => {
    const ordVariant4 = ordVariant3(dictVariantOrds);
    return dictVariantBoundedEnums => {
      const $0 = dictVariantBoundedEnums.VariantBounded0();
      return {
        pred: a => Data$dVariant$dInternal.lookupPred(a)(dictVariantTags.variantTags(Type$dProxy.Proxy))($0.variantBounded(Type$dProxy.Proxy))(dictVariantBoundedEnums.variantBoundedEnums(Type$dProxy.Proxy)),
        succ: a => Data$dVariant$dInternal.lookupSucc(a)(dictVariantTags.variantTags(Type$dProxy.Proxy))($0.variantBounded(Type$dProxy.Proxy))(dictVariantBoundedEnums.variantBoundedEnums(Type$dProxy.Proxy)),
        Ord0: () => ordVariant4
      };
    };
  };
};
const $$default = a => v => a;
const contract = dictAlternative => dictContractable => {
  const contractWith = dictContractable.contractWith(dictAlternative);
  return v => contractWith(Type$dProxy.Proxy)(Type$dProxy.Proxy)(v.type)(v);
};
const case_ = r => Partial._crashWith("Data.Variant: pattern match failure [" + r.type + "]");
const match = () => () => () => r => onMatch()()()(r)(case_);
const boundedVariantNil = {variantBounded: v => Data$dList$dTypes.Nil};
const enumVariantNil = {variantBoundedEnums: v => Data$dList$dTypes.Nil, VariantBounded0: () => boundedVariantNil};
const boundedVariantCons = dictVariantBounded => dictBounded => {
  const top = dictBounded.top;
  const bottom = dictBounded.bottom;
  return {variantBounded: v => Data$dList$dTypes.$List("Cons", {top, bottom}, dictVariantBounded.variantBounded(Type$dProxy.Proxy))};
};
const enumVariantCons = dictVariantBoundedEnums => {
  const $0 = dictVariantBoundedEnums.VariantBounded0();
  return dictBoundedEnum => {
    const Enum1 = dictBoundedEnum.Enum1();
    const pred = Enum1.pred;
    const succ = Enum1.succ;
    const fromEnum = dictBoundedEnum.fromEnum;
    const toEnum = dictBoundedEnum.toEnum;
    const cardinality = dictBoundedEnum.cardinality;
    const $1 = dictBoundedEnum.Bounded0();
    const top = $1.top;
    const boundedVariantCons2 = (() => {
      const bottom = $1.bottom;
      return {variantBounded: v => Data$dList$dTypes.$List("Cons", {top, bottom}, $0.variantBounded(Type$dProxy.Proxy))};
    })();
    return {
      variantBoundedEnums: v => Data$dList$dTypes.$List("Cons", {pred, succ, fromEnum, toEnum, cardinality}, dictVariantBoundedEnums.variantBoundedEnums(Type$dProxy.Proxy)),
      VariantBounded0: () => boundedVariantCons2
    };
  };
};
const boundedVariant = () => dictVariantTags => dictVariantEqs => {
  const ordVariant3 = ordVariant()(dictVariantTags)(dictVariantEqs);
  return dictVariantOrds => {
    const ordVariant4 = ordVariant3(dictVariantOrds);
    return dictVariantBounded => (
      {
        top: Data$dVariant$dInternal.lookupLast("top")(v => v.top)(dictVariantTags.variantTags(Type$dProxy.Proxy))(dictVariantBounded.variantBounded(Type$dProxy.Proxy)),
        bottom: Data$dVariant$dInternal.lookupFirst("bottom")(v => v.bottom)(dictVariantTags.variantTags(Type$dProxy.Proxy))(dictVariantBounded.variantBounded(Type$dProxy.Proxy)),
        Ord0: () => ordVariant4
      }
    );
  };
};
const boundedEnumVariant = () => dictVariantTags => dictVariantEqs => {
  const boundedVariant3 = boundedVariant()(dictVariantTags)(dictVariantEqs);
  const enumVariant3 = enumVariant()(dictVariantTags)(dictVariantEqs);
  return dictVariantOrds => {
    const boundedVariant4 = boundedVariant3(dictVariantOrds);
    const enumVariant4 = enumVariant3(dictVariantOrds);
    return dictVariantBoundedEnums => {
      const boundedVariant5 = boundedVariant4(dictVariantBoundedEnums.VariantBounded0());
      const enumVariant5 = enumVariant4(dictVariantBoundedEnums);
      return {
        cardinality: (() => {
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
          return go(0)(dictVariantBoundedEnums.variantBoundedEnums(Type$dProxy.Proxy));
        })(),
        fromEnum: a => Data$dVariant$dInternal.lookupFromEnum(a)(dictVariantTags.variantTags(Type$dProxy.Proxy))(dictVariantBoundedEnums.variantBoundedEnums(Type$dProxy.Proxy)),
        toEnum: n => {
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
          return go(n)(dictVariantTags.variantTags(Type$dProxy.Proxy))(dictVariantBoundedEnums.variantBoundedEnums(Type$dProxy.Proxy));
        },
        Bounded0: () => boundedVariant5,
        Enum1: () => enumVariant5
      };
    };
  };
};
export {
  Unvariant,
  boundedEnumVariant,
  boundedVariant,
  boundedVariantCons,
  boundedVariantNil,
  case_,
  contract,
  $$default as default,
  enumVariant,
  enumVariantCons,
  enumVariantNil,
  eqVariant,
  eqVariantCons,
  eqVariantNil,
  expand,
  inj,
  match,
  on,
  onMatch,
  ordVariant,
  ordVariantCons,
  ordVariantNil,
  over,
  overOne,
  overSome,
  prj,
  revariant,
  showVariant,
  showVariantCons,
  showVariantNil,
  traverse,
  traverseOne,
  traverseSome,
  unvariant,
  variantBounded,
  variantBoundedEnums,
  variantEqs,
  variantOrds,
  variantShows
};
