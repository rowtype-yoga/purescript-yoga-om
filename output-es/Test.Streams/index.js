import * as Control$dMonad$dWriter$dTrans from "../Control.Monad.Writer.Trans/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dSemigroup from "../Data.Semigroup/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Test$dSpec from "../Test.Spec/index.js";
import * as Test$dSpec$dTree from "../Test.Spec.Tree/index.js";
const streamsSpec = /* #__PURE__ */ (() => {
  const $0 = Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind((() => {
    const $0 = Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind(Test$dSpec.monadTellWriterT(Data$dIdentity.monadIdentity).tell([
      Test$dSpec$dTree.$Tree("Leaf", "omToEvent converts Om to Event", Data$dMaybe.Nothing)
    ]))(() => Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind(Test$dSpec.monadTellWriterT(Data$dIdentity.monadIdentity).tell([
      Test$dSpec$dTree.$Tree("Leaf", "eventToOm converts Event to Om", Data$dMaybe.Nothing)
    ]))(() => Test$dSpec.monadTellWriterT(Data$dIdentity.monadIdentity).tell([Test$dSpec$dTree.$Tree("Leaf", "streamOms streams multiple Oms as events", Data$dMaybe.Nothing)])));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Event integration"), $0._2)]);
  })())(() => Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind((() => {
    const $0 = Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind(Test$dSpec.monadTellWriterT(Data$dIdentity.monadIdentity).tell([
      Test$dSpec$dTree.$Tree("Leaf", "raceEvents races multiple events", Data$dMaybe.Nothing)
    ]))(() => Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind(Test$dSpec.monadTellWriterT(Data$dIdentity.monadIdentity).tell([
      Test$dSpec$dTree.$Tree("Leaf", "filterMapOm filters and maps Om computations", Data$dMaybe.Nothing)
    ]))(() => Test$dSpec.monadTellWriterT(Data$dIdentity.monadIdentity).tell([Test$dSpec$dTree.$Tree("Leaf", "foldOms folds over Om computations", Data$dMaybe.Nothing)])));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Event combinators"), $0._2)]);
  })())(() => {
    const $0 = Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind(Test$dSpec.monadTellWriterT(Data$dIdentity.monadIdentity).tell([
      Test$dSpec$dTree.$Tree("Leaf", "withEventStream preserves Om context", Data$dMaybe.Nothing)
    ]))(() => Test$dSpec.monadTellWriterT(Data$dIdentity.monadIdentity).tell([Test$dSpec$dTree.$Tree("Leaf", "Event streams handle errors appropriately", Data$dMaybe.Nothing)]));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Context handling"), $0._2)]);
  }));
  return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Yoga.Om.Streams"), $0._2)]);
})();
export {streamsSpec};
