import * as $runtime from "../runtime.js";
import * as Control$dMonad$dWriter$dTrans from "../Control.Monad.Writer.Trans/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dEq from "../Data.Eq/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Data$dSemigroup from "../Data.Semigroup/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Data$dVariant from "../Data.Variant/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import * as Test$dSpec from "../Test.Spec/index.js";
import * as Test$dSpec$dAssertions from "../Test.Spec.Assertions/index.js";
import * as Test$dSpec$dTree from "../Test.Spec.Tree/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
const shouldEqual = /* #__PURE__ */ Test$dSpec$dAssertions.shouldEqual(Effect$dAff.monadThrowAff);
const shouldEqual1 = /* #__PURE__ */ shouldEqual(Data$dShow.showBoolean)(Data$dEq.eqBoolean);
const shouldEqual2 = /* #__PURE__ */ shouldEqual(Data$dShow.showString)(Data$dEq.eqString);
const spec = /* #__PURE__ */ (() => {
  const $0 = Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("Runs safely")(Effect$dAff._bind((() => {
    const $0 = {exception: v => Effect$dAff._pure(false)};
    return Effect$dAff._bind(Yoga$dOm.runRWSET({})()(Yoga$dOm.applicativeOm.pure(true)))(v1 => {
      if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
      if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1._2._1._1); }
      $runtime.fail();
    });
  })())(result => shouldEqual1(result)(true))))(() => Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("Catches exceptions as `exception`")(Effect$dAff._bind((() => {
    const $0 = {exception: v => Effect$dAff._pure("exception")};
    return Effect$dAff._bind(Yoga$dOm.runRWSET({})()(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._liftEffect(Effect$dException.throwException(Effect$dException.error("Some random exception"))))))(v2 => {
      if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
      if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
      $runtime.fail();
    })))(v1 => {
      if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
      if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1._2._1._1); }
      $runtime.fail();
    });
  })())(result => shouldEqual2(result)("exception"))));
  return Data$dTuple.$Tuple(
    $0._1,
    [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Yoga.Om (Core)"), [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Basics"), $0._2)])]
  );
})();
export {shouldEqual, shouldEqual1, shouldEqual2, spec};
