import * as $runtime from "../runtime.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dVariant from "../Data.Variant/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as FRP$dEvent from "../FRP.Event/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
const withEventStream = event => f => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(ctx => Yoga$dOm.applicativeOm.pure(FRP$dEvent.backdoor.makeEvent(push => FRP$dEvent.backdoor.subscribe(event)(value => {
  const $0 = Effect$dAff._makeFiber(
    Effect$dAff.ffiUtil,
    Effect$dAff._bind(Yoga$dOm.runReader(ctx)(f(value)))(result => {
      const $0 = Effect$dAff._pure();
      if (result.tag === "Left") { return $0; }
      if (result.tag === "Right") { return Effect$dAff._liftEffect(push(result._1)); }
      $runtime.fail();
    })
  );
  return () => {
    const fiber = $0();
    fiber.run();
  };
}))));
const raceEvents = events => Data$dFoldable.foldrArray(FRP$dEvent.altEvent.alt)(FRP$dEvent.backdoor.makeEvent(v => () => () => {}))(events);
const omToEvent = () => () => () => ctx => handlers => om => FRP$dEvent.backdoor.makeEvent(push => {
  const $0 = Effect$dAff._makeFiber(
    Effect$dAff.ffiUtil,
    Effect$dAff._bind(Effect$dAff._bind(Yoga$dOm.runRWSET(ctx)()(om))(v1 => {
      if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
      if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()(handlers)(Data$dVariant.case_)(v1._2._1._1); }
      $runtime.fail();
    }))(result => Effect$dAff._liftEffect(push(result)))
  );
  return () => {
    const fiber = $0();
    fiber.run();
    return () => {};
  };
});
const streamOms = () => () => () => ctx => handlers => oms => Data$dFoldable.foldrArray(om => acc => {
  const $0 = omToEvent()()()(ctx)(handlers)(om);
  return (tf, k) => {
    const a$p = $0(tf, k);
    const a$p$1 = acc(tf, k);
    return () => {
      a$p();
      return a$p$1();
    };
  };
})(FRP$dEvent.backdoor.makeEvent(v => () => () => {}))(oms);
const foldOms = () => () => () => f => initial => ctx => handlers => event => FRP$dEvent.backdoor.makeEvent(push => () => {
  let accRef = initial;
  return FRP$dEvent.backdoor.subscribe(event)(value => {
    const $0 = Effect$dAff._makeFiber(
      Effect$dAff.ffiUtil,
      Effect$dAff._bind(Effect$dAff._liftEffect(() => accRef))(currentAcc => Effect$dAff._bind(Effect$dAff._bind(Yoga$dOm.runRWSET(ctx)()(f(currentAcc)(value)))(v1 => {
        if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
        if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()(handlers)(Data$dVariant.case_)(v1._2._1._1); }
        $runtime.fail();
      }))(newAcc => Effect$dAff._liftEffect(() => {
        accRef = newAcc;
        return push(newAcc)();
      })))
    );
    return () => {
      const fiber = $0();
      fiber.run();
    };
  })();
});
const filterMapOm = () => () => () => f => ctx => handlers => event => FRP$dEvent.backdoor.makeEvent(push => FRP$dEvent.backdoor.subscribe(event)(value => {
  const $0 = Effect$dAff._makeFiber(
    Effect$dAff.ffiUtil,
    Effect$dAff._bind(Effect$dAff._bind(Yoga$dOm.runRWSET(ctx)()(f(value)))(v1 => {
      if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
      if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()(handlers)(Data$dVariant.case_)(v1._2._1._1); }
      $runtime.fail();
    }))(result => {
      if (result.tag === "Just") { return Effect$dAff._liftEffect(push(result._1)); }
      if (result.tag === "Nothing") { return Effect$dAff._pure(); }
      $runtime.fail();
    })
  );
  return () => {
    const fiber = $0();
    fiber.run();
  };
}));
const eventToOm = event => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._bind(Effect$dAff._liftEffect(() => ({value: Data$dMaybe.Nothing})))(resultRef => Effect$dAff._bind(Effect$dAff._liftEffect(FRP$dEvent.backdoor.subscribe(event)(value => () => resultRef.value = Data$dMaybe.$Maybe(
  "Just",
  value
))))(canceller => {
  const checkValue$lazy = $runtime.binding(() => Effect$dAff._bind(Effect$dAff._liftEffect(() => resultRef.value))(maybeValue => {
    if (maybeValue.tag === "Just") {
      const $0 = maybeValue._1;
      return Effect$dAff._bind(Effect$dAff._liftEffect(canceller))(() => Effect$dAff._pure($0));
    }
    if (maybeValue.tag === "Nothing") { return checkValue$lazy(); }
    $runtime.fail();
  }));
  const checkValue = checkValue$lazy();
  return checkValue;
})))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
});
export {eventToOm, filterMapOm, foldOms, omToEvent, raceEvents, streamOms, withEventStream};
