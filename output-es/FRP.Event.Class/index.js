import * as $runtime from "../runtime.js";
import * as Data$dFunction from "../Data.Function/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
const identity = x => x;
const sampleOnRight = dict => dict.sampleOnRight;
const sampleOnRightOp = dictIsEvent => ef => ea => dictIsEvent.sampleOnRight(ef)(dictIsEvent.Filterable1().Functor1().map(Data$dFunction.applyFlipped)(ea));
const sampleOnRight_ = dictIsEvent => a => b => dictIsEvent.sampleOnRight(a)(dictIsEvent.Filterable1().Functor1().map(v => identity)(b));
const sampleOnLeft = dict => dict.sampleOnLeft;
const sampleOnLeftOp = dictIsEvent => ef => ea => dictIsEvent.sampleOnLeft(ef)(dictIsEvent.Filterable1().Functor1().map(Data$dFunction.applyFlipped)(ea));
const sampleOnLeft_ = dictIsEvent => a => b => dictIsEvent.sampleOnLeft(a)(dictIsEvent.Filterable1().Functor1().map(Data$dFunction.const)(b));
const keepLatest = dict => dict.keepLatest;
const gateBy = dictIsEvent => {
  const Filterable1 = dictIsEvent.Filterable1();
  const $0 = Filterable1.Functor1();
  const Alternative0 = dictIsEvent.Alternative0();
  return f => sampled => sampler => Filterable1.Compactable0().compact(sampleOnRightOp(dictIsEvent)($0.map(p => x => {
    if (f(p)(x)) { return Data$dMaybe.$Maybe("Just", x); }
    return Data$dMaybe.Nothing;
  })(Alternative0.Plus1().Alt0().alt(Alternative0.Applicative0().pure(Data$dMaybe.Nothing))($0.map(Data$dMaybe.Just)(sampled))))(sampler));
};
const gate = dictIsEvent => gateBy(dictIsEvent)(x => v => {
  if (x.tag === "Nothing") { return false; }
  if (x.tag === "Just") { return x._1; }
  $runtime.fail();
});
const fix = dict => dict.fix;
const fold = dictIsEvent => {
  const Alternative0 = dictIsEvent.Alternative0();
  return f => b => e => dictIsEvent.fix(i => dictIsEvent.sampleOnRight(Alternative0.Plus1().Alt0().alt(i)(Alternative0.Applicative0().pure(b)))(dictIsEvent.Filterable1().Functor1().map(b$1 => a => f(a)(b$1))(e)));
};
const folded = dictIsEvent => {
  const Alternative0 = dictIsEvent.Alternative0();
  return dictMonoid => {
    const $0 = dictMonoid.Semigroup0().append;
    const $1 = dictMonoid.mempty;
    return e => dictIsEvent.fix(i => dictIsEvent.sampleOnRight(Alternative0.Plus1().Alt0().alt(i)(Alternative0.Applicative0().pure($1)))(dictIsEvent.Filterable1().Functor1().map(b => a => $0(a)(b))(e)));
  };
};
const mapAccum = dictIsEvent => {
  const Alternative0 = dictIsEvent.Alternative0();
  return f => acc => xs => dictIsEvent.Filterable1().filterMap(Data$dTuple.snd)(dictIsEvent.fix(i => dictIsEvent.sampleOnRight(Alternative0.Plus1().Alt0().alt(i)(Alternative0.Applicative0().pure(Data$dTuple.$Tuple(
    acc,
    Data$dMaybe.Nothing
  ))))(dictIsEvent.Filterable1().Functor1().map(b => a => {
    const $0 = f(a._1)(b);
    return Data$dTuple.$Tuple($0._1, Data$dMaybe.$Maybe("Just", $0._2));
  })(xs))));
};
const withLast = dictIsEvent => {
  const Alternative0 = dictIsEvent.Alternative0();
  return e => dictIsEvent.Filterable1().filterMap(identity)(dictIsEvent.fix(i => dictIsEvent.sampleOnRight(Alternative0.Plus1().Alt0().alt(i)(Alternative0.Applicative0().pure(Data$dMaybe.Nothing)))(dictIsEvent.Filterable1().Functor1().map(b => a => {
    if (a.tag === "Nothing") { return Data$dMaybe.$Maybe("Just", {now: b, last: Data$dMaybe.Nothing}); }
    if (a.tag === "Just") { return Data$dMaybe.$Maybe("Just", {now: b, last: Data$dMaybe.$Maybe("Just", a._1.now)}); }
    $runtime.fail();
  })(e))));
};
const count = dictIsEvent => {
  const Alternative0 = dictIsEvent.Alternative0();
  return e => dictIsEvent.fix(i => dictIsEvent.sampleOnRight(Alternative0.Plus1().Alt0().alt(i)(Alternative0.Applicative0().pure(0)))(dictIsEvent.Filterable1().Functor1().map(b => a => a + 1 | 0)(e)));
};
const applyOp = dictApplicative => {
  const Apply0 = dictApplicative.Apply0();
  return ea => ef => Apply0.apply(Apply0.Functor0().map(Data$dFunction.applyFlipped)(ea))(ef);
};
export {
  applyOp,
  count,
  fix,
  fold,
  folded,
  gate,
  gateBy,
  identity,
  keepLatest,
  mapAccum,
  sampleOnLeft,
  sampleOnLeftOp,
  sampleOnLeft_,
  sampleOnRight,
  sampleOnRightOp,
  sampleOnRight_,
  withLast
};
