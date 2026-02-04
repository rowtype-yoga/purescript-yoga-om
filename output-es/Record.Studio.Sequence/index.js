import * as Record$dBuilder from "../Record.Builder/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
const $SequenceRecord = () => ({tag: "SequenceRecord"});
const identity = x => x;
const SequenceRecord = /* #__PURE__ */ $SequenceRecord();
const foldingWithIndexSequenceR = dictApplicative => dictIsSymbol => () => () => (
  {foldingWithIndex: v => prop => rin => x => dictApplicative.Apply0().Functor0().map(v1 => x$1 => Record$dBuilder.unsafeInsert(dictIsSymbol.reflectSymbol(prop))(x)(v1(x$1)))(rin)}
);
const foldingWithIndexSequenceR1 = dictApplicative => {
  const Apply0 = dictApplicative.Apply0();
  const $0 = Apply0.Functor0();
  return dictIsSymbol => () => () => (
    {foldingWithIndex: v => prop => rin => a => Apply0.apply($0.map(f => g => x => g(f(x)))(rin))($0.map(Record$dBuilder.insert()()(dictIsSymbol)(prop))(a))}
  );
};
const sequenceRecord = dictApplicative => dictHFoldlWithIndex => {
  const $0 = dictApplicative.Apply0().Functor0().map(a => a({}));
  const $1 = dictHFoldlWithIndex.hfoldlWithIndex(SequenceRecord)(dictApplicative.pure(identity));
  return x => $0($1(x));
};
const foldingWithIndexSequenceR2 = dictApplicative => {
  const Apply0 = dictApplicative.Apply0();
  const Functor0 = Apply0.Functor0();
  return dictIsSymbol => () => () => () => dictFoldlRecord => {
    const sequenceRecord2 = sequenceRecord(dictApplicative)({hfoldlWithIndex: f => x => dictFoldlRecord.foldlRecordRowList(f)(x)(Type$dProxy.Proxy)});
    return {
      foldingWithIndex: v => prop => rin => x => Apply0.apply(Functor0.map(f => g => x$1 => g(f(x$1)))(rin))(Functor0.map(Record$dBuilder.insert()()(dictIsSymbol)(prop))(sequenceRecord2(x)))
    };
  };
};
export {$SequenceRecord, SequenceRecord, foldingWithIndexSequenceR, foldingWithIndexSequenceR1, foldingWithIndexSequenceR2, identity, sequenceRecord};
