import * as Data$dList$dTypes from "../Data.List.Types/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dTraversable from "../Data.Traversable/index.js";
import * as Data$dVariant$dInternal from "../Data.Variant.Internal/index.js";
import * as Partial from "../Partial/index.js";
import * as Record$dUnsafe from "../Record.Unsafe/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
import * as Unsafe$dCoerce from "../Unsafe.Coerce/index.js";
const UnvariantF = x => x;
const variantFShows = dict => dict.variantFShows;
const variantFMaps = dict => dict.variantFMaps;
const unvariantF = v => f => f({
  reflectSymbol: (() => {
    const $0 = v.type;
    return v$1 => $0;
  })()
})()({map: v.map})(Type$dProxy.Proxy)(v.value);
const traverseVFRL = dict => dict.traverseVFRL;
const traverseSome = () => () => () => dictVariantTags => dictVariantFMaps => () => () => dictFunctor => r => k => v => {
  if (Record$dUnsafe.unsafeHas(v.type)(r)) {
    const map1 = Data$dVariant$dInternal.lookup("map")(v.type)(dictVariantTags.variantTags(Type$dProxy.Proxy))(dictVariantFMaps.variantFMaps(Type$dProxy.Proxy));
    return dictFunctor.map(value => ({type: v.type, map: map1, value}))(Record$dUnsafe.unsafeGet(v.type)(r)(v.value));
  }
  return k(v);
};
const traverse = () => () => () => dictVariantTags => dictVariantFMaps => () => () => dictApplicative => {
  const Functor0 = dictApplicative.Apply0().Functor0();
  return dictTraversable => {
    const traverse1 = dictTraversable.traverse(dictApplicative);
    return r => f => traverseSome()()()(dictVariantTags)(dictVariantFMaps)()()(Functor0)(r)((() => {
      const $0 = traverse1(f);
      const $1 = Functor0.map(Unsafe$dCoerce.unsafeCoerce);
      return x => $1($0(x));
    })());
  };
};
const showVariantFNil = {variantFShows: v => v1 => Data$dList$dTypes.Nil};
const showVariantFCons = dictVariantFShows => dictShow => {
  const show1 = dictShow.show;
  return dictShow1 => ({variantFShows: v => p => Data$dList$dTypes.$List("Cons", show1, dictVariantFShows.variantFShows(Type$dProxy.Proxy)(p))});
};
const showVariantF = () => dictVariantTags => dictVariantFShows => dictShow => (
  {
    show: v1 => "(inj @" + Data$dShow.showStringImpl(v1.type) + " " + Data$dVariant$dInternal.lookup("show")(v1.type)(dictVariantTags.variantTags(Type$dProxy.Proxy))(dictVariantFShows.variantFShows(Type$dProxy.Proxy)(Type$dProxy.Proxy))(v1.value) + ")"
  }
);
const overSome = () => () => () => dictVariantTags => dictVariantFMaps => () => () => r => k => v => {
  if (Record$dUnsafe.unsafeHas(v.type)(r)) {
    return {
      type: v.type,
      map: Data$dVariant$dInternal.lookup("map")(v.type)(dictVariantTags.variantTags(Type$dProxy.Proxy))(dictVariantFMaps.variantFMaps(Type$dProxy.Proxy)),
      value: Record$dUnsafe.unsafeGet(v.type)(r)(v.value)
    };
  }
  return k(v);
};
const onMatch = () => () => () => r => k => v => {
  if (Record$dUnsafe.unsafeHas(v.type)(r)) { return Record$dUnsafe.unsafeGet(v.type)(r)(v.value); }
  return k(v);
};
const on = () => dictIsSymbol => p => f => g => r => {
  if (r.type === dictIsSymbol.reflectSymbol(p)) { return f(r.value); }
  return g(r);
};
const prj = () => dictAlternative => {
  const empty = dictAlternative.Plus1().empty;
  return dictIsSymbol => p => r => {
    if (r.type === dictIsSymbol.reflectSymbol(p)) { return dictAlternative.Applicative0().pure(r.value); }
    return empty;
  };
};
const mapVariantFNil = {variantFMaps: v => Data$dList$dTypes.Nil};
const mapVariantFCons = dictVariantFMaps => dictFunctor => {
  const map1 = dictFunctor.map;
  return {variantFMaps: v => Data$dList$dTypes.$List("Cons", map1, dictVariantFMaps.variantFMaps(Type$dProxy.Proxy))};
};
const inj = () => dictIsSymbol => dictFunctor => {
  const map1 = dictFunctor.map;
  return p => value => ({type: dictIsSymbol.reflectSymbol(p), value, map: map1});
};
const overOne = () => () => dictIsSymbol => dictFunctor => {
  const map1 = dictFunctor.map;
  return p => f => g => r => {
    if (r.type === dictIsSymbol.reflectSymbol(p)) { return {type: dictIsSymbol.reflectSymbol(p), value: f(r.value), map: map1}; }
    return g(r);
  };
};
const revariantF = v => v(dictIsSymbol => () => dictFunctor => {
  const map1 = dictFunctor.map;
  return p => value => ({type: dictIsSymbol.reflectSymbol(p), value, map: map1});
});
const traverseOne = () => () => dictIsSymbol => dictFunctor => {
  const map1 = dictFunctor.map;
  return dictFunctor1 => p => f => {
    const $0 = dictFunctor1.map(value => ({type: dictIsSymbol.reflectSymbol(p), value, map: map1}));
    return g => r => {
      if (r.type === dictIsSymbol.reflectSymbol(p)) { return $0(f(r.value)); }
      return g(r);
    };
  };
};
const functorVariantF = {map: f => a => ({type: a.type, value: a.map(f)(a.value), map: a.map})};
const over = () => () => () => dictVariantTags => dictVariantFMaps => () => () => r => f => overSome()()()(dictVariantTags)(dictVariantFMaps)()()(r)(x => (
  {type: x.type, value: x.map(f)(x.value), map: x.map}
));
const foldrVFRL = dict => dict.foldrVFRL;
const foldlVFRL = dict => dict.foldlVFRL;
const foldMapVFRL = dict => dict.foldMapVFRL;
const foldableCons = dictIsSymbol => dictFoldable => dictFoldableVFRL => () => (
  {
    foldrVFRL: v => f => b => {
      const $0 = dictFoldable.foldr(f)(b);
      const $1 = dictFoldableVFRL.foldrVFRL(Type$dProxy.Proxy)(f)(b);
      return r => {
        if (r.type === dictIsSymbol.reflectSymbol(Type$dProxy.Proxy)) { return $0(r.value); }
        return $1(r);
      };
    },
    foldlVFRL: v => f => b => {
      const $0 = dictFoldable.foldl(f)(b);
      const $1 = dictFoldableVFRL.foldlVFRL(Type$dProxy.Proxy)(f)(b);
      return r => {
        if (r.type === dictIsSymbol.reflectSymbol(Type$dProxy.Proxy)) { return $0(r.value); }
        return $1(r);
      };
    },
    foldMapVFRL: dictMonoid => {
      const foldMap1 = dictFoldable.foldMap(dictMonoid);
      const foldMapVFRL2 = dictFoldableVFRL.foldMapVFRL(dictMonoid);
      return v => f => {
        const $0 = foldMap1(f);
        const $1 = foldMapVFRL2(Type$dProxy.Proxy)(f);
        return r => {
          if (r.type === dictIsSymbol.reflectSymbol(Type$dProxy.Proxy)) { return $0(r.value); }
          return $1(r);
        };
      };
    }
  }
);
const foldableVariantF = () => dictFoldableVFRL => (
  {
    foldr: dictFoldableVFRL.foldrVFRL(Type$dProxy.Proxy),
    foldl: dictFoldableVFRL.foldlVFRL(Type$dProxy.Proxy),
    foldMap: dictMonoid => dictFoldableVFRL.foldMapVFRL(dictMonoid)(Type$dProxy.Proxy)
  }
);
const traversableVariantF = () => dictTraversableVFRL => {
  const $0 = dictTraversableVFRL.FoldableVFRL0();
  const foldableVariantF2 = {foldr: $0.foldrVFRL(Type$dProxy.Proxy), foldl: $0.foldlVFRL(Type$dProxy.Proxy), foldMap: dictMonoid => $0.foldMapVFRL(dictMonoid)(Type$dProxy.Proxy)};
  return {
    traverse: dictApplicative => dictTraversableVFRL.traverseVFRL(dictApplicative)(Type$dProxy.Proxy),
    sequence: dictApplicative => traversableVariantF()(dictTraversableVFRL).traverse(dictApplicative)(Data$dTraversable.identity),
    Functor0: () => functorVariantF,
    Foldable1: () => foldableVariantF2
  };
};
const expand = () => Unsafe$dCoerce.unsafeCoerce;
const traversableCons = dictIsSymbol => dictTraversable => {
  const map1 = dictTraversable.Functor0().map;
  const foldableCons2 = foldableCons(dictIsSymbol)(dictTraversable.Foldable1());
  return dictTraversableVFRL => {
    const foldableCons3 = foldableCons2(dictTraversableVFRL.FoldableVFRL0())();
    return () => () => (
      {
        traverseVFRL: dictApplicative => {
          const traverse2 = dictTraversable.traverse(dictApplicative);
          const $0 = dictApplicative.Apply0().Functor0();
          const traverseVFRL2 = dictTraversableVFRL.traverseVFRL(dictApplicative);
          return v => f => {
            const $1 = traverse2(f);
            const $2 = $0.map(value => ({type: dictIsSymbol.reflectSymbol(Type$dProxy.Proxy), value, map: map1}));
            const $3 = traverseVFRL2(Type$dProxy.Proxy)(f);
            const $4 = $0.map(Unsafe$dCoerce.unsafeCoerce);
            return r => {
              if (r.type === dictIsSymbol.reflectSymbol(Type$dProxy.Proxy)) { return $2($1(r.value)); }
              return $4($3(r));
            };
          };
        },
        FoldableVFRL0: () => foldableCons3
      }
    );
  };
};
const $$default = a => v => a;
const contract = dictAlternative => dictContractable => {
  const contractWith = dictContractable.contractWith(dictAlternative);
  return v => contractWith(Type$dProxy.Proxy)(Type$dProxy.Proxy)(v.type)(v);
};
const case_ = r => Partial._crashWith("Data.Functor.Variant: pattern match failure [" + r.type + "]");
const foldableNil = {foldrVFRL: v => v1 => v2 => case_, foldlVFRL: v => v1 => v2 => case_, foldMapVFRL: dictMonoid => v => v1 => case_};
const match = () => () => () => r => onMatch()()()(r)(case_);
const traversableNil = {traverseVFRL: dictApplicative => v => v1 => case_, FoldableVFRL0: () => foldableNil};
export {
  UnvariantF,
  case_,
  contract,
  $$default as default,
  expand,
  foldMapVFRL,
  foldableCons,
  foldableNil,
  foldableVariantF,
  foldlVFRL,
  foldrVFRL,
  functorVariantF,
  inj,
  mapVariantFCons,
  mapVariantFNil,
  match,
  on,
  onMatch,
  over,
  overOne,
  overSome,
  prj,
  revariantF,
  showVariantF,
  showVariantFCons,
  showVariantFNil,
  traversableCons,
  traversableNil,
  traversableVariantF,
  traverse,
  traverseOne,
  traverseSome,
  traverseVFRL,
  unvariantF,
  variantFMaps,
  variantFShows
};
