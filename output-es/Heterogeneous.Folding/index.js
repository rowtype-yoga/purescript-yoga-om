import * as $runtime from "../runtime.js";
import * as Data$dFunctor$dVariant from "../Data.Functor.Variant/index.js";
import * as Data$dVariant from "../Data.Variant/index.js";
import * as Record$dUnsafe from "../Record.Unsafe/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
const ConstFolding = x => x;
const hfoldlWithIndexRowListNil = {hfoldlWithIndex: v => x => v1 => x};
const hfoldlWithIndex = dict => dict.hfoldlWithIndex;
const hfoldlRowList = dictHFoldlWithIndex => ({hfoldl: f => dictHFoldlWithIndex.hfoldlWithIndex(f)});
const hfoldl = dict => dict.hfoldl;
const functionFoldingWithIndex = {foldingWithIndex: f => f};
const functionFolding = {folding: f => f};
const foldlVariantRowList = dict => dict.foldlVariantRowList;
const hfoldlVariant = () => dictFoldlVariant => ({hfoldl: dictFoldlVariant.foldlVariantRowList(Type$dProxy.Proxy)});
const hfoldlVariantWithIndex = () => dictFoldlVariant => ({hfoldlWithIndex: dictFoldlVariant.foldlVariantRowList(Type$dProxy.Proxy)});
const foldlVariantNil = {foldlVariantRowList: v => v1 => v2 => Data$dVariant.case_};
const foldlVariantFRowList = dict => dict.foldlVariantFRowList;
const hfoldlVariantF = () => dictFoldlVariantF => ({hfoldl: dictFoldlVariantF.foldlVariantFRowList(Type$dProxy.Proxy)});
const hfoldlVariantFWithIndex = () => dictFoldlVariantF => ({hfoldlWithIndex: dictFoldlVariantF.foldlVariantFRowList(Type$dProxy.Proxy)});
const foldlVariantFNil = {foldlVariantFRowList: v => v1 => v2 => Data$dFunctor$dVariant.case_};
const foldlRecordRowList = dict => dict.foldlRecordRowList;
const hfoldlRecord = () => dictFoldlRecord => ({hfoldl: f => x => dictFoldlRecord.foldlRecordRowList(f)(x)(Type$dProxy.Proxy)});
const hfoldlRecordWithIndex = () => dictFoldlRecord => ({hfoldlWithIndex: f => x => dictFoldlRecord.foldlRecordRowList(f)(x)(Type$dProxy.Proxy)});
const foldlRecordNil = {foldlRecordRowList: v => x => v1 => v2 => x};
const foldingWithIndex = dict => dict.foldingWithIndex;
const foldlRecordCons = dictIsSymbol => () => dictFoldingWithIndex => dictFoldlRecord => (
  {
    foldlRecordRowList: f => x => v => r => dictFoldlRecord.foldlRecordRowList(f)(dictFoldingWithIndex.foldingWithIndex(f)(Type$dProxy.Proxy)(x)(Record$dUnsafe.unsafeGet(dictIsSymbol.reflectSymbol(Type$dProxy.Proxy))(r)))(Type$dProxy.Proxy)(r)
  }
);
const foldlVariantCons = dictIsSymbol => () => dictFoldingWithIndex => dictFoldlVariant => (
  {
    foldlVariantRowList: v => f => x => {
      const $0 = dictFoldingWithIndex.foldingWithIndex(f)(Type$dProxy.Proxy)(x);
      const $1 = dictFoldlVariant.foldlVariantRowList(Type$dProxy.Proxy)(f)(x);
      return r => {
        if (r.type === dictIsSymbol.reflectSymbol(Type$dProxy.Proxy)) { return $0(r.value); }
        return $1(r);
      };
    }
  }
);
const foldlVariantFCons = dictIsSymbol => () => dictFoldingWithIndex => dictFoldlVariantF => (
  {
    foldlVariantFRowList: v => f => x => {
      const $0 = dictFoldingWithIndex.foldingWithIndex(f)(Type$dProxy.Proxy)(x);
      const $1 = dictFoldlVariantF.foldlVariantFRowList(Type$dProxy.Proxy)(f)(x);
      return r => {
        if (r.type === dictIsSymbol.reflectSymbol(Type$dProxy.Proxy)) { return $0(r.value); }
        return $1(r);
      };
    }
  }
);
const hfoldlWithIndexApp = dictFoldableWithIndex => dictFoldingWithIndex => (
  {hfoldlWithIndex: f => x => v => dictFoldableWithIndex.foldlWithIndex(dictFoldingWithIndex.foldingWithIndex(f))(x)(v)}
);
const hfoldlWithIndexRowListCons = dictFoldingWithIndex => dictHFoldlWithIndex => (
  {hfoldlWithIndex: f => x => v => dictHFoldlWithIndex.hfoldlWithIndex(f)(dictFoldingWithIndex.foldingWithIndex(f)(Type$dProxy.Proxy)(x)(Type$dProxy.Proxy))(Type$dProxy.Proxy)}
);
const folding = dict => dict.folding;
const hfoldlApp = dictFoldable => dictFolding => ({hfoldl: f => x => v => dictFoldable.foldl(dictFolding.folding(f))(x)(v)});
const hfoldlEither = dictFolding => dictFolding1 => (
  {
    hfoldl: f => x => v => {
      if (v.tag === "Left") { return dictFolding.folding(f)(x)(v._1); }
      if (v.tag === "Right") { return dictFolding1.folding(f)(x)(v._1); }
      $runtime.fail();
    }
  }
);
const hfoldlTuple = dictFolding => dictFolding1 => ({hfoldl: f => x => v => dictFolding1.folding(f)(dictFolding.folding(f)(x)(v._1))(v._2)});
const constFolding = dictFolding => ({foldingWithIndex: v => v1 => dictFolding.folding(v)});
export {
  ConstFolding,
  constFolding,
  folding,
  foldingWithIndex,
  foldlRecordCons,
  foldlRecordNil,
  foldlRecordRowList,
  foldlVariantCons,
  foldlVariantFCons,
  foldlVariantFNil,
  foldlVariantFRowList,
  foldlVariantNil,
  foldlVariantRowList,
  functionFolding,
  functionFoldingWithIndex,
  hfoldl,
  hfoldlApp,
  hfoldlEither,
  hfoldlRecord,
  hfoldlRecordWithIndex,
  hfoldlRowList,
  hfoldlTuple,
  hfoldlVariant,
  hfoldlVariantF,
  hfoldlVariantFWithIndex,
  hfoldlVariantWithIndex,
  hfoldlWithIndex,
  hfoldlWithIndexApp,
  hfoldlWithIndexRowListCons,
  hfoldlWithIndexRowListNil
};
