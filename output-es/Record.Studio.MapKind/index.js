import * as Record$dBuilder from "../Record.Builder/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
const $MapRecordKind = _1 => ({tag: "MapRecordKind", _1});
const identity = x => x;
const MapRecordKind = value0 => $MapRecordKind(value0);
const foldingWithIndexMapRecord = dictIsSymbol => () => () => (
  {foldingWithIndex: v => prop => rin => x => x$1 => Record$dBuilder.unsafeInsert(dictIsSymbol.reflectSymbol(prop))(x)(rin(x$1))}
);
const foldingWithIndexMapRecord1 = dictIsSymbol => () => () => (
  {
    foldingWithIndex: v => prop => rin => fa => {
      const $0 = Record$dBuilder.insert()()(dictIsSymbol)(prop)(v._1(fa));
      return x => $0(rin(x));
    }
  }
);
const mapRecordKind = dictHFoldlWithIndex => nt => {
  const $0 = dictHFoldlWithIndex.hfoldlWithIndex($MapRecordKind(nt))(identity);
  return x => $0(x)({});
};
const foldingWithIndexMapRecord2 = dictIsSymbol => () => () => () => dictFoldlRecord => {
  const mapRecordKind1 = mapRecordKind({hfoldlWithIndex: f => x => dictFoldlRecord.foldlRecordRowList(f)(x)(Type$dProxy.Proxy)});
  return {
    foldingWithIndex: v => prop => rin => x => {
      const $0 = Record$dBuilder.insert()()(dictIsSymbol)(prop)(mapRecordKind1(v._1)(x));
      return x$1 => $0(rin(x$1));
    }
  };
};
export {$MapRecordKind, MapRecordKind, foldingWithIndexMapRecord, foldingWithIndexMapRecord1, foldingWithIndexMapRecord2, identity, mapRecordKind};
