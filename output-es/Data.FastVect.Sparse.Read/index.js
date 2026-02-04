import * as $runtime from "../runtime.js";
import * as Data$dArray from "../Data.Array/index.js";
import * as Data$dEq from "../Data.Eq/index.js";
import * as Data$dEuclideanRing from "../Data.EuclideanRing/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dFunction from "../Data.Function/index.js";
import * as Data$dFunctor from "../Data.Functor/index.js";
import * as Data$dMap$dInternal from "../Data.Map.Internal/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dOrd from "../Data.Ord/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Data$dUnfoldable from "../Data.Unfoldable/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
const ordMap = /* #__PURE__ */ Data$dMap$dInternal.ordMap(Data$dOrd.ordInt);
const fromFoldable = /* #__PURE__ */ Data$dMap$dInternal.fromFoldable(Data$dOrd.ordInt)(Data$dFoldable.foldableArray);
const toUnfoldableUnordered = /* #__PURE__ */ (() => {
  const $0 = Data$dUnfoldable.unfoldableArray.unfoldr(Data$dMap$dInternal.stepUnfoldrUnordered);
  return x => $0(Data$dMap$dInternal.$MapIter("IterNode", x, Data$dMap$dInternal.IterLeaf));
})();
const alter = /* #__PURE__ */ Data$dMap$dInternal.alter(Data$dOrd.ordInt);
const lookup = k => {
  const go = go$a0$copy => {
    let go$a0 = go$a0$copy, go$c = true, go$r;
    while (go$c) {
      const v = go$a0;
      if (v.tag === "Leaf") {
        go$c = false;
        go$r = Data$dMaybe.Nothing;
        continue;
      }
      if (v.tag === "Node") {
        const v1 = Data$dOrd.ordInt.compare(k)(v._3);
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
          go$r = Data$dMaybe.$Maybe("Just", v._4);
          continue;
        }
      }
      $runtime.fail();
    }
    return go$r;
  };
  return go;
};
const traversableWithIndexIntVe = Data$dMap$dInternal.traversableWithIndexMap;
const traversableVect = Data$dMap$dInternal.traversableMap;
const showVect = dictShow => dictReflectable => (
  {
    show: v => "Vect.Sparse.Read " + Data$dShow.showIntImpl(dictReflectable.reflectType(Type$dProxy.Proxy)) + " " + Data$dMap$dInternal.showMap(Data$dShow.showInt)(dictShow).show(v)
  }
);
const ordVect = dictOrd => ordMap(dictOrd);
const isVectVect = {TraversableWithIndex0: () => Data$dMap$dInternal.traversableWithIndexMap};
const functorWithIndexIntVect = Data$dMap$dInternal.functorWithIndexMap;
const functorVect = Data$dMap$dInternal.functorMap;
const foldableWithIndexIntVect = Data$dMap$dInternal.foldableWithIndexMap;
const foldableVect = Data$dMap$dInternal.foldableMap;
const eqVect = dictEq => Data$dMap$dInternal.eqMap(Data$dEq.eqInt)(dictEq);
const applyVect = {
  apply: m1 => m2 => Data$dMap$dInternal.unsafeIntersectionWith(Data$dOrd.ordInt.compare, Data$dMap$dInternal.identity, m1, m2),
  Functor0: () => Data$dMap$dInternal.functorMap
};
const toMap = () => v => v;
const take = () => dictReflectable => () => () => proxy => v => {
  const takes = dictReflectable.reflectType(proxy);
  return fromFoldable(Data$dArray.filterImpl(x => x._1 < takes, toUnfoldableUnordered(v)));
};
const splitAt = () => dictReflectable => () => () => proxy => v => {
  const splits = dictReflectable.reflectType(proxy);
  const $0 = Data$dArray.partitionImpl(x => x._1 < splits, toUnfoldableUnordered(v));
  return {before: fromFoldable($0.yes), after: fromFoldable($0.no)};
};
const sparse = Data$dMap$dInternal.Leaf;
const snoc = () => dictReflectable => () => v => elem => Data$dMap$dInternal.insert(Data$dOrd.ordInt)(dictReflectable.reflectType(Type$dProxy.Proxy))(elem)(v);
const singleton = elem => Data$dMap$dInternal.$$$Map("Node", 1, 1, 0, elem, Data$dMap$dInternal.Leaf, Data$dMap$dInternal.Leaf);
const $$set = dictReflectable => () => () => () => proxy => a => v => alter(v$1 => Data$dMaybe.$Maybe("Just", a))(dictReflectable.reflectType(proxy))(v);
const replicate = () => dictReflectable => proxy => elem => {
  const terminus = dictReflectable.reflectType(proxy);
  return fromFoldable(Data$dUnfoldable.unfoldableArray.unfoldr(v => {
    if (v._1 === terminus) { return Data$dMaybe.Nothing; }
    return Data$dMaybe.$Maybe("Just", Data$dTuple.$Tuple(v, Data$dTuple.$Tuple(v._1 + 1 | 0, v._2)));
  })(Data$dTuple.$Tuple(0, elem)));
};
const applicativeVect = () => dictReflectable => ({pure: replicate()(dictReflectable)(Type$dProxy.Proxy), Apply0: () => applyVect});
const modify = dictReflectable => () => () => () => proxy => f => v => Data$dMap$dInternal.update(Data$dOrd.ordInt)(x => Data$dMaybe.$Maybe("Just", f(x)))(dictReflectable.reflectType(proxy))(v);
const mapWithTerm = dictReflectable => () => f => {
  const f1 = f()();
  return xs => {
    const go = v => {
      if (v.tag === "Leaf") { return Data$dMap$dInternal.Leaf; }
      if (v.tag === "Node") {
        return Data$dMap$dInternal.$$$Map(
          "Node",
          v._1,
          v._2,
          v._3,
          (() => {
            const $0 = v._3;
            return f1({reflectType: v1 => $0})(Type$dProxy.Proxy)(v._4);
          })(),
          go(v._5),
          go(v._6)
        );
      }
      $runtime.fail();
    };
    return go(xs);
  };
};
const indexModulo = () => dictReflectable => i => v => lookup(Data$dEuclideanRing.intMod(i)(dictReflectable.reflectType(Type$dProxy.Proxy)))(v);
const index = dictReflectable => () => () => () => proxy => v => lookup(dictReflectable.reflectType(proxy))(v);
const head = () => v => lookup(0)(v);
const generate = dictReflectable => () => v => f => {
  const f1 = f()();
  return fromFoldable(Data$dFunctor.arrayMap(i => Data$dTuple.$Tuple(i, f1({reflectType: v1 => i})(Type$dProxy.Proxy)))(Data$dArray.rangeImpl(
    0,
    dictReflectable.reflectType(Type$dProxy.Proxy) - 1 | 0
  )));
};
const fromMap = dictReflectable => () => v => v1 => {
  const $0 = Data$dMap$dInternal.findMax(v1);
  if ($0.tag === "Just" && $0._1.key < dictReflectable.reflectType(v) && $0._1.key >= 0) { return Data$dMaybe.$Maybe("Just", v1); }
  return Data$dMaybe.Nothing;
};
const empty = Data$dMap$dInternal.Leaf;
const drop = () => dictReflectable => () => () => proxy => v => {
  const drops = dictReflectable.reflectType(proxy);
  return fromFoldable(Data$dArray.mapMaybe(v1 => {
    if (v1._1 >= drops) { return Data$dMaybe.$Maybe("Just", Data$dTuple.$Tuple(v1._1 - drops | 0, v1._2)); }
    return Data$dMaybe.Nothing;
  })(toUnfoldableUnordered(v)));
};
const cons = () => () => elem => v => Data$dMap$dInternal.insert(Data$dOrd.ordInt)(0)(elem)(fromFoldable(Data$dFunctor.arrayMap(v$1 => Data$dTuple.$Tuple(1 + v$1._1 | 0, v$1._2))(toUnfoldableUnordered(v))));
const append = () => () => dictReflectable => () => v => v1 => Data$dMap$dInternal.unsafeUnionWith(
  Data$dOrd.ordInt.compare,
  Data$dFunction.const,
  v,
  fromFoldable(Data$dFunctor.arrayMap((() => {
    const $0 = dictReflectable.reflectType(Type$dProxy.Proxy);
    return v$1 => Data$dTuple.$Tuple($0 + v$1._1 | 0, v$1._2);
  })())(toUnfoldableUnordered(v1)))
);
export {
  alter,
  append,
  applicativeVect,
  applyVect,
  cons,
  drop,
  empty,
  eqVect,
  foldableVect,
  foldableWithIndexIntVect,
  fromFoldable,
  fromMap,
  functorVect,
  functorWithIndexIntVect,
  generate,
  head,
  index,
  indexModulo,
  isVectVect,
  lookup,
  mapWithTerm,
  modify,
  ordMap,
  ordVect,
  replicate,
  $$set as set,
  showVect,
  singleton,
  snoc,
  sparse,
  splitAt,
  take,
  toMap,
  toUnfoldableUnordered,
  traversableVect,
  traversableWithIndexIntVe
};
