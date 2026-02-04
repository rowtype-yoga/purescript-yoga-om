import * as $runtime from "../runtime.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dFunctor$dVariant from "../Data.Functor.Variant/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Data$dVariant from "../Data.Variant/index.js";
import * as Record$dBuilder from "../Record.Builder/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
const identity = x => x;
const ConstMapping = x => x;
const mappingWithIndex = dict => dict.mappingWithIndex;
const mappingFunction = {mapping: k => k};
const mapping = dict => dict.mapping;
const mapVariantWithIndexNil = {mapVariantWithIndex: v => v1 => Data$dVariant.case_};
const mapVariantWithIndex = dict => dict.mapVariantWithIndex;
const mapVariantWithIndexCons = dictIsSymbol => () => () => dictMappingWithIndex => dictMapVariantWithIndex => (
  {
    mapVariantWithIndex: v => fn => {
      const $0 = dictMappingWithIndex.mappingWithIndex(fn)(Type$dProxy.Proxy);
      const $1 = dictMapVariantWithIndex.mapVariantWithIndex(Type$dProxy.Proxy)(fn);
      return r => {
        if (r.type === dictIsSymbol.reflectSymbol(Type$dProxy.Proxy)) { return {type: dictIsSymbol.reflectSymbol(Type$dProxy.Proxy), value: $0(r.value)}; }
        return $1(r);
      };
    }
  }
);
const mapVariantFWithIndexNil = {mapVariantFWithIndex: v => v1 => Data$dFunctor$dVariant.case_};
const mapVariantFWithIndex = dict => dict.mapVariantFWithIndex;
const mapVariantFWithIndexCons = dictIsSymbol => () => () => dictMappingWithIndex => dictMapVariantFWithIndex => dictFunctor => {
  const map1 = dictFunctor.map;
  return {
    mapVariantFWithIndex: v => fn => {
      const $0 = dictMappingWithIndex.mappingWithIndex(fn)(Type$dProxy.Proxy);
      const $1 = dictMapVariantFWithIndex.mapVariantFWithIndex(Type$dProxy.Proxy)(fn);
      return r => {
        if (r.type === dictIsSymbol.reflectSymbol(Type$dProxy.Proxy)) { return {type: dictIsSymbol.reflectSymbol(Type$dProxy.Proxy), value: $0(r.value), map: map1}; }
        return $1(r);
      };
    }
  };
};
const mapRecordWithIndexNil = {mapRecordWithIndexBuilder: v => v1 => identity};
const mapRecordWithIndexBuilder = dict => dict.mapRecordWithIndexBuilder;
const mapRecordWithIndexCons = dictIsSymbol => dictMappingWithIndex => dictMapRecordWithIndex => () => () => (
  {
    mapRecordWithIndexBuilder: v => f => {
      const $0 = Record$dBuilder.modify()()(dictIsSymbol)(Type$dProxy.Proxy)(dictMappingWithIndex.mappingWithIndex(f)(Type$dProxy.Proxy));
      const $1 = dictMapRecordWithIndex.mapRecordWithIndexBuilder(Type$dProxy.Proxy)(f);
      return x => $0($1(x));
    }
  }
);
const hmapWithIndexVariantF = () => dictMapVariantFWithIndex => ({hmapWithIndex: dictMapVariantFWithIndex.mapVariantFWithIndex(Type$dProxy.Proxy)});
const hmapWithIndexVariant = () => dictMapVariantWithIndex => ({hmapWithIndex: dictMapVariantWithIndex.mapVariantWithIndex(Type$dProxy.Proxy)});
const hmapWithIndexRecord = () => dictMapRecordWithIndex => (
  {
    hmapWithIndex: (() => {
      const $0 = dictMapRecordWithIndex.mapRecordWithIndexBuilder(Type$dProxy.Proxy);
      return x => {
        const $1 = $0(x);
        return r1 => $1(Record$dBuilder.copyRecord(r1));
      };
    })()
  }
);
const hmapWithIndexApp = dictFunctorWithIndex => dictMappingWithIndex => ({hmapWithIndex: f => v => dictFunctorWithIndex.mapWithIndex(dictMappingWithIndex.mappingWithIndex(f))(v)});
const hmapWithIndex = dict => dict.hmapWithIndex;
const hmapVariantF = () => dictMapVariantFWithIndex => ({hmap: dictMapVariantFWithIndex.mapVariantFWithIndex(Type$dProxy.Proxy)});
const hmapVariant = () => dictMapVariantWithIndex => ({hmap: dictMapVariantWithIndex.mapVariantWithIndex(Type$dProxy.Proxy)});
const hmapTuple = dictMapping => dictMapping1 => ({hmap: fn => v => Data$dTuple.$Tuple(dictMapping.mapping(fn)(v._1), dictMapping1.mapping(fn)(v._2))});
const hmapRecord = () => dictMapRecordWithIndex => (
  {
    hmap: (() => {
      const $0 = dictMapRecordWithIndex.mapRecordWithIndexBuilder(Type$dProxy.Proxy);
      return x => {
        const $1 = $0(x);
        return r1 => $1(Record$dBuilder.copyRecord(r1));
      };
    })()
  }
);
const hmapEither = dictMapping => dictMapping1 => (
  {
    hmap: fn => v => {
      if (v.tag === "Left") { return Data$dEither.$Either("Left", dictMapping.mapping(fn)(v._1)); }
      if (v.tag === "Right") { return Data$dEither.$Either("Right", dictMapping1.mapping(fn)(v._1)); }
      $runtime.fail();
    }
  }
);
const hmapApp = dictFunctor => dictMapping => ({hmap: f => v => dictFunctor.map(dictMapping.mapping(f))(v)});
const hmap = dict => dict.hmap;
const constMapping = dictMapping => ({mappingWithIndex: v => v1 => dictMapping.mapping(v)});
export {
  ConstMapping,
  constMapping,
  hmap,
  hmapApp,
  hmapEither,
  hmapRecord,
  hmapTuple,
  hmapVariant,
  hmapVariantF,
  hmapWithIndex,
  hmapWithIndexApp,
  hmapWithIndexRecord,
  hmapWithIndexVariant,
  hmapWithIndexVariantF,
  identity,
  mapRecordWithIndexBuilder,
  mapRecordWithIndexCons,
  mapRecordWithIndexNil,
  mapVariantFWithIndex,
  mapVariantFWithIndexCons,
  mapVariantFWithIndexNil,
  mapVariantWithIndex,
  mapVariantWithIndexCons,
  mapVariantWithIndexNil,
  mapping,
  mappingFunction,
  mappingWithIndex
};
