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
import {indexImpl, modifyImpl} from "./foreign.js";
const traversableWithIndexIntVe = Data$dTraversableWithIndex.traversableWithIndexArray;
const traversableVect = Data$dTraversable.traversableArray;
const showVect = dictShow => dictReflectable => (
  {show: v => "Vect " + Data$dShow.showIntImpl(dictReflectable.reflectType(Type$dProxy.Proxy)) + " " + Data$dShow.showArrayImpl(dictShow.show)(v)}
);
const ordVect = dictOrd => Data$dOrd.ordArray(dictOrd);
const isVectVect = {TraversableWithIndex0: () => Data$dTraversableWithIndex.traversableWithIndexArray};
const functorWithIndexIntVect = Data$dFunctorWithIndex.functorWithIndexArray;
const functorVect = Data$dFunctor.functorArray;
const foldableWithIndexIntVect = Data$dFoldableWithIndex.foldableWithIndexArray;
const foldableVect = Data$dFoldable.foldableArray;
const eqVect = dictEq => ({eq: Data$dEq.eqArrayImpl(dictEq.eq)});
const applyVect = {apply: v => v1 => Data$dArray.zipWithImpl(Data$dFunction.apply, v, v1), Functor0: () => Data$dFunctor.functorArray};
const semigroupVect = dictSemigroup => (
  {
    append: (() => {
      const $0 = dictSemigroup.append;
      return a => b => Data$dArray.zipWithImpl(Data$dFunction.apply, Data$dFunctor.arrayMap($0)(a), b);
    })()
  }
);
const toNonEmptyArray = () => v => v;
const foldable1Vect = () => (
  {
    foldMap1: dictSemigroup => Data$dArray$dNonEmpty$dInternal.foldable1NonEmptyArray.foldMap1(dictSemigroup),
    foldr1: f => xs => Data$dArray$dNonEmpty$dInternal.foldr1Impl(f, xs),
    foldl1: f => xs => Data$dArray$dNonEmpty$dInternal.foldl1Impl(f, xs),
    Foldable0: () => Data$dFoldable.foldableArray
  }
);
const foldable1Vect1 = /* #__PURE__ */ foldable1Vect();
const traversable1Vect = () => (
  {
    traverse1: dictApply => {
      const $0 = traversable1Vect();
      const sequence12 = $0.sequence1(dictApply);
      return f => ta => sequence12($0.Traversable1().Functor0().map(f)(ta));
    },
    sequence1: dictApply => {
      const sequence11 = Data$dArray$dNonEmpty$dInternal.traversable1NonEmptyArray.traverse1(dictApply)(Data$dSemigroup$dTraversable.identity);
      return xs => dictApply.Functor0().map(x => x)(sequence11(xs));
    },
    Foldable10: () => foldable1Vect1,
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
const applicativeVect = () => dictReflectable => ({pure: replicate()(dictReflectable)(Type$dProxy.Proxy), Apply0: () => applyVect});
const monoidVect = () => dictReflectable => dictMonoid => {
  const semigroupVect1 = {
    append: (() => {
      const $0 = dictMonoid.Semigroup0().append;
      return a => b => Data$dArray.zipWithImpl(Data$dFunction.apply, Data$dFunctor.arrayMap($0)(a), b);
    })()
  };
  return {mempty: Data$dArray.replicateImpl(dictReflectable.reflectType(Type$dProxy.Proxy), dictMonoid.mempty), Semigroup0: () => semigroupVect1};
};
const semiringVect = () => dictReflectable => dictSemiring => (
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
const ringVect = () => dictReflectable => dictRing => {
  const semiringVect3 = semiringVect()(dictReflectable)(dictRing.Semiring0());
  return {
    sub: (() => {
      const $0 = dictRing.sub;
      return a => b => Data$dArray.zipWithImpl(Data$dFunction.apply, Data$dFunctor.arrayMap($0)(a), b);
    })(),
    Semiring0: () => semiringVect3
  };
};
const commutativeRingVect = () => dictReflectable => dictCommutativeRing => {
  const ringVect3 = ringVect()(dictReflectable)(dictCommutativeRing.Ring0());
  return {Ring0: () => ringVect3};
};
const reifyVect = arr => f => f(arr);
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
const distributiveVect = () => dictReflectable => (
  {
    distribute: dictFunctor => xss => generate(dictReflectable)()(Type$dProxy.Proxy)(() => () => dictReflectable1 => v => dictFunctor.map(indexImpl(dictReflectable1.reflectType(Type$dProxy.Proxy)))(xss)),
    collect: dictFunctor => {
      const distribute2 = distributiveVect()(dictReflectable).distribute(dictFunctor);
      return f => {
        const $0 = dictFunctor.map(f);
        return x => distribute2($0(x));
      };
    },
    Functor0: () => Data$dFunctor.functorArray
  }
);
const bindVect = () => dictReflectable => {
  const distribute = distributiveVect()(dictReflectable).distribute(Data$dFunctor.functorFn);
  return {bind: vec => f => Data$dArray.zipWithImpl(Data$dFunction.apply, distribute(f), vec), Apply0: () => applyVect};
};
const monadVect = () => dictReflectable => {
  const bindVect2 = bindVect()(dictReflectable);
  return {Applicative0: () => ({pure: replicate()(dictReflectable)(Type$dProxy.Proxy), Apply0: () => applyVect}), Bind1: () => bindVect2};
};
const fromArray = dictReflectable => () => v => v1 => {
  if (v1.length === dictReflectable.reflectType(v)) { return Data$dMaybe.$Maybe("Just", v1); }
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
const adjust = dictReflectable => () => proxy => elem => array => {
  const v = array.length - dictReflectable.reflectType(proxy) | 0;
  if (v === 0) { return array; }
  if (v < 0) { return [...Data$dArray.replicateImpl(v >= 0 ? v : -v, elem), ...array]; }
  if (v < 1) { return array; }
  return Data$dArray.sliceImpl(v, array.length, array);
};
const adjustM = dictMonoid => {
  const mempty = dictMonoid.mempty;
  return dictReflectable => () => proxy => adjust(dictReflectable)()(proxy)(mempty);
};
export {
  adjust,
  adjustM,
  append,
  applicativeVect,
  applyVect,
  bindVect,
  commutativeRingVect,
  cons,
  distributiveVect,
  drop,
  empty,
  eqVect,
  foldable1Vect,
  foldable1Vect1,
  foldableVect,
  foldableWithIndexIntVect,
  fromArray,
  functorVect,
  functorWithIndexIntVect,
  generate,
  head,
  index,
  indexModulo,
  isVectVect,
  last,
  mapWithTerm,
  modify,
  monadVect,
  monoidVect,
  ordVect,
  reifyVect,
  replicate,
  ringVect,
  semigroupVect,
  semiringVect,
  $$set as set,
  showVect,
  singleton,
  snoc,
  splitAt,
  take,
  toArray,
  toNonEmptyArray,
  traversable1Vect,
  traversableVect,
  traversableWithIndexIntVe
};
export * from "./foreign.js";
