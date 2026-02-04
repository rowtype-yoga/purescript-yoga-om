import * as $runtime from "../runtime.js";
import * as Data$dVariant from "../Data.Variant/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Record$dUnsafe$dUnion from "../Record.Unsafe.Union/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
const OmLayer = x => x;
const newtypeOmLayer_ = {Coercible0: () => {}};
const runLayer = () => _ctx => layer => layer;
const makeLayer = OmLayer;
const provide = () => () => () => () => dictKeys => {
  const expand1 = Yoga$dOm.expandCtx()(dictKeys);
  return dictKeys1 => {
    const expand2 = Yoga$dOm.expandCtx()(dictKeys1);
    return v => v1 => Yoga$dOm.bindOm.bind(expand1(v1))(prov1 => {
      const $0 = {exception: v2 => Effect$dAff._pure({})};
      return Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._bind(Yoga$dOm.runRWSET(prov1)()(expand2(v)))(v1$1 => {
        if (v1$1._2._1.tag === "Right") { return Effect$dAff._pure(v1$1._2._1._1); }
        if (v1$1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1$1._2._1._1); }
        $runtime.fail();
      }))))(v2 => {
        if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
        if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
        $runtime.fail();
      });
    });
  };
};
const combineRequirements = () => () => () => () => () => () => () => () => dictKeys => {
  const expand1 = Yoga$dOm.expandCtx()(dictKeys);
  return dictKeys1 => {
    const expand2 = Yoga$dOm.expandCtx()(dictKeys1);
    return v => v1 => Yoga$dOm.bindOm.bind(expand1(v))(rec1 => Yoga$dOm.bindOm.bind(expand2(v1))(rec2 => Yoga$dOm.applicativeOm.pure(Record$dUnsafe$dUnion.unsafeUnionFn(rec1, rec2))));
  };
};
const checkLabelExistsNotFound = undefined;
const checkLabelExistsKeepLooking = () => ({});
const checkLabelExistsFound = dictTypeEquals => ({});
const checkAllProvidedImpl = () => () => () => ({});
const checkAllLabelsNil = {};
const checkAllLabelsCons = () => () => ({});
export {
  OmLayer,
  checkAllLabelsCons,
  checkAllLabelsNil,
  checkAllProvidedImpl,
  checkLabelExistsFound,
  checkLabelExistsKeepLooking,
  checkLabelExistsNotFound,
  combineRequirements,
  makeLayer,
  newtypeOmLayer_,
  provide,
  runLayer
};
