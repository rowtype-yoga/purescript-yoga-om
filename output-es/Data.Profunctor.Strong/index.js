import * as Data$dProfunctor from "../Data.Profunctor/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
const strongFn = /* #__PURE__ */ (() => (
  {first: a2b => v => Data$dTuple.$Tuple(a2b(v._1), v._2), second: Data$dTuple.functorTuple.map, Profunctor0: () => Data$dProfunctor.profunctorFn}
))();
const second = dict => dict.second;
const first = dict => dict.first;
const splitStrong = dictSemigroupoid => dictStrong => l => r => dictSemigroupoid.compose(dictStrong.second(r))(dictStrong.first(l));
const fanout = dictSemigroupoid => dictStrong => {
  const lcmap = Data$dProfunctor.lcmap(dictStrong.Profunctor0());
  return l => r => lcmap(a => Data$dTuple.$Tuple(a, a))(dictSemigroupoid.compose(dictStrong.second(r))(dictStrong.first(l)));
};
export {fanout, first, second, splitStrong, strongFn};
