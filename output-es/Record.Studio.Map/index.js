import * as Record$dBuilder from "../Record.Builder/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
const $MapRecord = _1 => ({tag: "MapRecord", _1});
const identity = x => x;
const MapRecord = value0 => $MapRecord(value0);
const foldingWithIndexMapRecord = dictIsSymbol => () => () => (
  {foldingWithIndex: v => prop => rin => x => x$1 => Record$dBuilder.unsafeInsert(dictIsSymbol.reflectSymbol(prop))(x)(rin(x$1))}
);
const foldingWithIndexMapRecord1 = dictIsSymbol => () => () => (
  {
    foldingWithIndex: v => prop => rin => a => {
      const $0 = Record$dBuilder.insert()()(dictIsSymbol)(prop)(v._1(a));
      return x => $0(rin(x));
    }
  }
);
const mapRecord = dictHFoldlWithIndex => f => {
  const $0 = dictHFoldlWithIndex.hfoldlWithIndex($MapRecord(f))(identity);
  return x => $0(x)({});
};
const foldingWithIndexMapRecord2 = dictIsSymbol => () => () => () => dictFoldlRecord => {
  const mapRecord1 = mapRecord({hfoldlWithIndex: f => x => dictFoldlRecord.foldlRecordRowList(f)(x)(Type$dProxy.Proxy)});
  return {
    foldingWithIndex: v => prop => rin => x => {
      const $0 = Record$dBuilder.insert()()(dictIsSymbol)(prop)(mapRecord1(v._1)(x));
      return x$1 => $0(rin(x$1));
    }
  };
};
export {$MapRecord, MapRecord, foldingWithIndexMapRecord, foldingWithIndexMapRecord1, foldingWithIndexMapRecord2, identity, mapRecord};
