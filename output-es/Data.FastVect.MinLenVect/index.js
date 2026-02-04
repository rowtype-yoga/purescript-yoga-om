import * as Data$dArray from "../Data.Array/index.js";
import * as Data$dArray$dNonEmpty$dInternal from "../Data.Array.NonEmpty.Internal/index.js";
import * as Data$dEq from "../Data.Eq/index.js";
import * as Data$dEuclideanRing from "../Data.EuclideanRing/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dFoldableWithIndex from "../Data.FoldableWithIndex/index.js";
import * as Data$dFunction from "../Data.Function/index.js";
import * as Data$dFunctor from "../Data.Functor/index.js";
import * as Data$dFunctorWithIndex from "../Data.FunctorWithIndex/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dOrd from "../Data.Ord/index.js";
import * as Data$dSemigroup$dTraversable from "../Data.Semigroup.Traversable/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dTraversable from "../Data.Traversable/index.js";
import * as Data$dTraversableWithIndex from "../Data.TraversableWithIndex/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
import * as Unsafe$dCoerce from "../Unsafe.Coerce/index.js";
import {indexImpl, modifyImpl} from "./foreign.js";
const traversableWithIndexIntMi = Data$dTraversableWithIndex.traversableWithIndexArray;
const traversableMinLenVect = Data$dTraversable.traversableArray;
const showMinLenVect = dictShow => dictReflectable => (
  {show: v => "MinLenVect " + Data$dShow.showIntImpl(dictReflectable.reflectType(Type$dProxy.Proxy)) + " " + Data$dShow.showArrayImpl(dictShow.show)(v)}
);
const ordMinLenVect = dictOrd => Data$dOrd.ordArray(dictOrd);
const isVectMinLenVect = {TraversableWithIndex0: () => Data$dTraversableWithIndex.traversableWithIndexArray};
const functorWithIndexIntMinLen = Data$dFunctorWithIndex.functorWithIndexArray;
const functorMinLenVect = Data$dFunctor.functorArray;
const foldableWithIndexIntMinLe = Data$dFoldableWithIndex.foldableWithIndexArray;
const foldableMinLenVect = Data$dFoldable.foldableArray;
const eqMinLenVect = dictEq => ({eq: Data$dEq.eqArrayImpl(dictEq.eq)});
const applyMinLenVect = {apply: v => v1 => Data$dArray.zipWithImpl(Data$dFunction.apply, v, v1), Functor0: () => Data$dFunctor.functorArray};
const semigroupMinLenVect = dictSemigroup => (
  {
    append: (() => {
      const $0 = dictSemigroup.append;
      return a => b => Data$dArray.zipWithImpl(Data$dFunction.apply, Data$dFunctor.arrayMap($0)(a), b);
    })()
  }
);
const toVect = dictReflectable => () => proxy => v => {
  if (v.length === dictReflectable.reflectType(proxy)) { return Data$dMaybe.$Maybe("Just", v); }
  return Data$dMaybe.Nothing;
};
const toNonEmptyArray = () => v => v;
const foldable1MinLenVect = () => (
  {
    foldMap1: dictSemigroup => Data$dArray$dNonEmpty$dInternal.foldable1NonEmptyArray.foldMap1(dictSemigroup),
    foldr1: f => xs => Data$dArray$dNonEmpty$dInternal.foldr1Impl(f, xs),
    foldl1: f => xs => Data$dArray$dNonEmpty$dInternal.foldl1Impl(f, xs),
    Foldable0: () => Data$dFoldable.foldableArray
  }
);
const foldable1MinLenVect1 = /* #__PURE__ */ foldable1MinLenVect();
const traversable1MinLenVect = () => (
  {
    traverse1: dictApply => {
      const $0 = traversable1MinLenVect();
      const sequence12 = $0.sequence1(dictApply);
      return f => ta => sequence12($0.Traversable1().Functor0().map(f)(ta));
    },
    sequence1: dictApply => {
      const sequence11 = Data$dArray$dNonEmpty$dInternal.traversable1NonEmptyArray.traverse1(dictApply)(Data$dSemigroup$dTraversable.identity);
      return xs => dictApply.Functor0().map(x => x)(sequence11(xs));
    },
    Foldable10: () => foldable1MinLenVect1,
    Traversable1: () => Data$dTraversable.traversableArray
  }
);
const toArray = () => v => v;
const take = () => dictReflectable => () => () => proxy => v => {
  const $0 = dictReflectable.reflectType(proxy);
  if ($0 < 1) { return []; }
  return Data$dArray.sliceImpl(0, $0, v);
};
const splitAt = () => dictReflectable => () => () => proxy => v => {
  const v1 = Data$dArray.splitAt(dictReflectable.reflectType(proxy))(v);
  return {before: v1.before, after: v1.after};
};
const snoc = () => dictReflectable => () => v => elem => Data$dArray.snoc(v)(elem);
const singleton = elem => [elem];
const replicate = () => dictReflectable => proxy => elem => Data$dArray.replicateImpl(dictReflectable.reflectType(proxy), elem);
const applicativeMinLenVect = () => dictReflectable => ({pure: replicate()(dictReflectable)(Type$dProxy.Proxy), Apply0: () => applyMinLenVect});
const monoidMinLenVect = () => dictReflectable => dictMonoid => {
  const semigroupMinLenVect1 = {
    append: (() => {
      const $0 = dictMonoid.Semigroup0().append;
      return a => b => Data$dArray.zipWithImpl(Data$dFunction.apply, Data$dFunctor.arrayMap($0)(a), b);
    })()
  };
  return {mempty: Data$dArray.replicateImpl(dictReflectable.reflectType(Type$dProxy.Proxy), dictMonoid.mempty), Semigroup0: () => semigroupMinLenVect1};
};
const semiringMinLenVect = () => dictReflectable => dictSemiring => (
  {
    add: (() => {
      const $0 = dictSemiring.add;
      return a => b => Data$dArray.zipWithImpl(Data$dFunction.apply, Data$dFunctor.arrayMap($0)(a), b);
    })(),
    zero: Data$dArray.replicateImpl(dictReflectable.reflectType(Type$dProxy.Proxy), dictSemiring.zero),
    mul: (() => {
      const $0 = dictSemiring.mul;
      return a => b => Data$dArray.zipWithImpl(Data$dFunction.apply, Data$dFunctor.arrayMap($0)(a), b);
    })(),
    one: Data$dArray.replicateImpl(dictReflectable.reflectType(Type$dProxy.Proxy), dictSemiring.one)
  }
);
const ringMinLenVect = () => dictReflectable => dictRing => {
  const semiringMinLenVect3 = semiringMinLenVect()(dictReflectable)(dictRing.Semiring0());
  return {
    sub: (() => {
      const $0 = dictRing.sub;
      return a => b => Data$dArray.zipWithImpl(Data$dFunction.apply, Data$dFunctor.arrayMap($0)(a), b);
    })(),
    Semiring0: () => semiringMinLenVect3
  };
};
const commutativeRingMinLenVect = () => dictReflectable => dictCommutativeRing => {
  const ringMinLenVect3 = ringMinLenVect()(dictReflectable)(dictCommutativeRing.Ring0());
  return {Ring0: () => ringMinLenVect3};
};
const reifyMinLenVect = arr => f => f(arr);
const modify = dictReflectable => () => () => () => proxy => modifyImpl(dictReflectable.reflectType(proxy));
const $$set = dictReflectable => () => () => () => proxy => {
  const $0 = modifyImpl(dictReflectable.reflectType(proxy));
  return x => $0(v => x);
};
const mapWithTerm = dictReflectable => () => f => {
  const f1 = f()();
  return vect => Data$dFunctorWithIndex.mapWithIndexArray(i => elem => f1({reflectType: v1 => i})(Type$dProxy.Proxy)(elem))(vect);
};
const last = () => dictReflectable => indexImpl(dictReflectable.reflectType(Type$dProxy.Proxy) - 1 | 0);
const indexModulo = () => dictReflectable => i => indexImpl(Data$dEuclideanRing.intMod(i)(dictReflectable.reflectType(Type$dProxy.Proxy)));
const index = dictReflectable => () => () => () => x => indexImpl(dictReflectable.reflectType(x));
const head = () => indexImpl(0);
const generate = dictReflectable => () => v => f => {
  const f1 = f()();
  return Data$dFunctor.arrayMap(i => f1({reflectType: v1 => i})(Type$dProxy.Proxy))(Data$dArray.rangeImpl(0, dictReflectable.reflectType(Type$dProxy.Proxy) - 1 | 0));
};
const distributiveMinLenVect = () => dictReflectable => (
  {
    distribute: dictFunctor => xss => generate(dictReflectable)()(Type$dProxy.Proxy)(() => () => dictReflectable1 => v => dictFunctor.map(indexImpl(dictReflectable1.reflectType(Type$dProxy.Proxy)))(xss)),
    collect: dictFunctor => {
      const distribute2 = distributiveMinLenVect()(dictReflectable).distribute(dictFunctor);
      return f => {
        const $0 = dictFunctor.map(f);
        return x => distribute2($0(x));
      };
    },
    Functor0: () => Data$dFunctor.functorArray
  }
);
const bindMinLenVect = () => dictReflectable => {
  const distribute = distributiveMinLenVect()(dictReflectable).distribute(Data$dFunctor.functorFn);
  return {bind: vec => f => Data$dArray.zipWithImpl(Data$dFunction.apply, distribute(f), vec), Apply0: () => applyMinLenVect};
};
const monadMinLenVect = () => dictReflectable => {
  const bindMinLenVect2 = bindMinLenVect()(dictReflectable);
  return {Applicative0: () => ({pure: replicate()(dictReflectable)(Type$dProxy.Proxy), Apply0: () => applyMinLenVect}), Bind1: () => bindMinLenVect2};
};
const fromVect = Unsafe$dCoerce.unsafeCoerce;
const fromUnsizedNonEmptyArray = array => array;
const fromUnsizedArray = array => array;
const fromArray = dictReflectable => () => v => v1 => {
  if (v1.length >= dictReflectable.reflectType(v)) { return Data$dMaybe.$Maybe("Just", v1); }
  return Data$dMaybe.Nothing;
};
const fromNonEmptyArray = dictReflectable => () => proxy => x => {
  if (x.length >= dictReflectable.reflectType(proxy)) { return Data$dMaybe.$Maybe("Just", x); }
  return Data$dMaybe.Nothing;
};
const empty = [];
const drop = () => dictReflectable => () => () => proxy => v => {
  const $0 = dictReflectable.reflectType(proxy);
  if ($0 < 1) { return v; }
  return Data$dArray.sliceImpl($0, v.length, v);
};
const cons = () => () => elem => v => [elem, ...v];
const append = () => () => dictReflectable => () => v => v1 => [...v, ...v1];
export {
  append,
  applicativeMinLenVect,
  applyMinLenVect,
  bindMinLenVect,
  commutativeRingMinLenVect,
  cons,
  distributiveMinLenVect,
  drop,
  empty,
  eqMinLenVect,
  foldable1MinLenVect,
  foldable1MinLenVect1,
  foldableMinLenVect,
  foldableWithIndexIntMinLe,
  fromArray,
  fromNonEmptyArray,
  fromUnsizedArray,
  fromUnsizedNonEmptyArray,
  fromVect,
  functorMinLenVect,
  functorWithIndexIntMinLen,
  generate,
  head,
  index,
  indexModulo,
  isVectMinLenVect,
  last,
  mapWithTerm,
  modify,
  monadMinLenVect,
  monoidMinLenVect,
  ordMinLenVect,
  reifyMinLenVect,
  replicate,
  ringMinLenVect,
  semigroupMinLenVect,
  semiringMinLenVect,
  $$set as set,
  showMinLenVect,
  singleton,
  snoc,
  splitAt,
  take,
  toArray,
  toNonEmptyArray,
  toVect,
  traversable1MinLenVect,
  traversableMinLenVect,
  traversableWithIndexIntMi
};
export * from "./foreign.js";
