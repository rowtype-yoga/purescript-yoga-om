import * as $runtime from "../runtime.js";
import * as Control$dMonad$dWriter$dTrans from "../Control.Monad.Writer.Trans/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dEq from "../Data.Eq/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dSemigroup from "../Data.Semigroup/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Data$dVariant from "../Data.Variant/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Test$dSpec from "../Test.Spec/index.js";
import * as Test$dSpec$dAssertions from "../Test.Spec.Assertions/index.js";
import * as Test$dSpec$dTree from "../Test.Spec.Tree/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
import * as Yoga$dOm$dNode from "../Yoga.Om.Node/index.js";
const shouldEqual = /* #__PURE__ */ Test$dSpec$dAssertions.shouldEqual(Effect$dAff.monadThrowAff);
const shouldEqual1 = /* #__PURE__ */ shouldEqual(Data$dShow.showString)(Data$dEq.eqString);
const shouldEqual2 = /* #__PURE__ */ shouldEqual(Data$dShow.showBoolean)(Data$dEq.eqBoolean);
const spec = /* #__PURE__ */ (() => {
  const $0 = Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind((() => {
    const $0 = Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("lookupEnv returns Maybe String")(Effect$dAff._bind((() => {
      const $0 = {exception: v => Effect$dAff._pure(Data$dMaybe.Nothing)};
      return Effect$dAff._bind(Yoga$dOm.runRWSET({})()(Yoga$dOm$dNode.lookupEnv("PATH")))(v1 => {
        if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
        if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1._2._1._1); }
        $runtime.fail();
      });
    })())(result => {
      if (result.tag === "Just") { return Effect$dAff._pure(); }
      if (result.tag === "Nothing") { return Effect$dAff._pure(); }
      $runtime.fail();
    })))(() => Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("getEnv throws error when variable not found")(Effect$dAff._bind((() => {
      const $0 = {exception: v => Effect$dAff._pure("exception"), envNotFound: v => Effect$dAff._pure("not found: " + v.variable)};
      return Effect$dAff._bind(Yoga$dOm.runRWSET({})()(Yoga$dOm$dNode.getEnv("THIS_VARIABLE_SHOULD_NOT_EXIST_12345")))(v1 => {
        if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
        if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1._2._1._1); }
        $runtime.fail();
      });
    })())(result => shouldEqual1(result)("not found: THIS_VARIABLE_SHOULD_NOT_EXIST_12345"))))(() => Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("cwd returns current working directory")(Effect$dAff._bind((() => {
      const $0 = {exception: v => Effect$dAff._pure("")};
      return Effect$dAff._bind(Yoga$dOm.runRWSET({})()(Yoga$dOm$dNode.cwd))(v1 => {
        if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
        if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1._2._1._1); }
        $runtime.fail();
      });
    })())(result => shouldEqual2(result !== "")(true)))));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Environment variables"), $0._2)]);
  })())(() => {
    const $0 = Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind(Test$dSpec.monadTellWriterT(Data$dIdentity.monadIdentity).tell([
      Test$dSpec$dTree.$Tree("Leaf", "readTextFile reads file contents", Data$dMaybe.Nothing)
    ]))(() => Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind(Test$dSpec.monadTellWriterT(Data$dIdentity.monadIdentity).tell([
      Test$dSpec$dTree.$Tree("Leaf", "writeTextFile writes file contents", Data$dMaybe.Nothing)
    ]))(() => Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind(Test$dSpec.monadTellWriterT(Data$dIdentity.monadIdentity).tell([
      Test$dSpec$dTree.$Tree("Leaf", "exists checks file existence", Data$dMaybe.Nothing)
    ]))(() => Test$dSpec.monadTellWriterT(Data$dIdentity.monadIdentity).tell([Test$dSpec$dTree.$Tree("Leaf", "File operations throw appropriate errors", Data$dMaybe.Nothing)]))));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "File operations"), $0._2)]);
  });
  return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Yoga.Om.Node"), $0._2)]);
})();
export {shouldEqual, shouldEqual1, shouldEqual2, spec};
