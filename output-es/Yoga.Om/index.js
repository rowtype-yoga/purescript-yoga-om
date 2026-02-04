// @inline export tap arity=2
// @inline export tapM arity=2
// @inline export note arity=2
// @inline export fromAff arity=1
// @inline export runOm arity=2
import * as $runtime from "../runtime.js";
import * as Control$dMonad$dError$dClass from "../Control.Monad.Error.Class/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dMonoid from "../Data.Monoid/index.js";
import * as Data$dTraversable from "../Data.Traversable/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Data$dVariant from "../Data.Variant/index.js";
import * as Effect$dAVar from "../Effect.AVar/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Effect$dAff$dAVar from "../Effect.Aff.AVar/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import * as Partial from "../Partial/index.js";
import * as Record$dStudio$dShrink from "../Record.Studio.Shrink/index.js";
import * as Record$dUnsafe$dUnion from "../Record.Unsafe.Union/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
import * as Uncurried$dRWSET from "../Uncurried.RWSET/index.js";
import * as Unsafe$dCoerce from "../Unsafe.Coerce/index.js";
import * as Yoga$dOm$dError from "../Yoga.Om.Error/index.js";
const semigroupRWSET = /* #__PURE__ */ Uncurried$dRWSET.semigroupRWSET(Data$dMonoid.monoidUnit);
const runRWSET = /* #__PURE__ */ Uncurried$dRWSET.runRWSET(Effect$dAff.monadRecAff);
const $$try = /* #__PURE__ */ Control$dMonad$dError$dClass.try(Effect$dAff.monadErrorAff);
const lift = m => (v, state, v1, lift$p, v2, done) => lift$p(Effect$dAff._map(a => v3 => done(state, a, undefined))(m));
const exceptionIsSymbol = {reflectSymbol: () => "exception"};
const singletonVariantRecord = /* #__PURE__ */ Yoga$dOm$dError.singletonVariantRecord()()()(exceptionIsSymbol);
const ParOm = x => x;
const Om = x => x;
const semigroupOm = dictSemigroup => semigroupRWSET(dictSemigroup);
const newtypeOm_ = {Coercible0: () => {}};
const monadThrowVariantExceptio = /* #__PURE__ */ Uncurried$dRWSET.monadThrowRWSET(Data$dMonoid.monoidUnit);
const monadRecOm = /* #__PURE__ */ Uncurried$dRWSET.monadRecRWSET(Data$dMonoid.monoidUnit);
const monadReaderOm = /* #__PURE__ */ Uncurried$dRWSET.monadReaderRWSET(Data$dMonoid.monoidUnit);
const monadOm = /* #__PURE__ */ Uncurried$dRWSET.monadRWSET(Data$dMonoid.monoidUnit);
const monadErrorVariantExceptio = /* #__PURE__ */ Uncurried$dRWSET.monadErrorRWSET(Data$dMonoid.monoidUnit);
const monadAskOm = /* #__PURE__ */ Uncurried$dRWSET.monadAskRWSET(Data$dMonoid.monoidUnit);
const functorParOm = Uncurried$dRWSET.functorRWSET;
const functorOm = Uncurried$dRWSET.functorRWSET;
const bindOm = /* #__PURE__ */ Uncurried$dRWSET.bindRWSET(Data$dMonoid.monoidUnit);
const applyOm = /* #__PURE__ */ Uncurried$dRWSET.applyRWSET(Data$dMonoid.monoidUnit);
const applicativeOm = /* #__PURE__ */ Uncurried$dRWSET.applicativeRWSET(Data$dMonoid.monoidUnit);
const altOm = /* #__PURE__ */ Uncurried$dRWSET.altRWSET(Data$dMonoid.monoidUnit);
const widenCtx = () => () => toUnion => v => (environment1, state1, more, lift$p, error$1, done) => v(
  Record$dUnsafe$dUnion.unsafeUnionFn(toUnion, environment1),
  undefined,
  more,
  lift$p,
  error$1,
  done
);
const throwLeftAsM = dictMonadThrow => {
  const Monad0 = dictMonadThrow.Monad0();
  const $0 = Monad0.Bind1();
  const throwError2 = dictMonadThrow.throwError;
  const pure3 = Monad0.Applicative0().pure;
  return toError => v2 => {
    if (v2.tag === "Left") { return $0.bind(toError(v2._1))(throwError2); }
    if (v2.tag === "Right") { return pure3(v2._1); }
    $runtime.fail();
  };
};
const throwLeftAs = dictMonadThrow => {
  const pure3 = dictMonadThrow.Monad0().Applicative0().pure;
  return toError => v2 => {
    if (v2.tag === "Left") { return dictMonadThrow.throwError(toError(v2._1)); }
    if (v2.tag === "Right") { return pure3(v2._1); }
    $runtime.fail();
  };
};
const tapM = f => ma => bindOm.bind(ma)(a => {
  const $0 = f(a);
  return (environment, state0, more, lift$p, error$1, done) => more(v1 => $0(environment, state0, more, lift$p, error$1, (state1, a$1, w) => more(v2 => done(state1, a, w))));
});
const tap = f => a => {
  const $0 = f(a);
  return (environment, state0, more, lift$p, error$1, done) => more(v1 => $0(environment, state0, more, lift$p, error$1, (state1, a$1, w) => more(v2 => done(state1, a, w))));
};
const runOm = () => () => () => ctx => errorHandlers => v => Effect$dAff._bind(runRWSET(ctx)()(v))(v1 => {
  if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
  if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()(errorHandlers)(Data$dVariant.case_)(v1._2._1._1); }
  $runtime.fail();
});
const readerT = dictFunctor => k => (environment, state0, more, lift$1, error$1, done) => more(v => lift$1(dictFunctor.map(v1 => {
  const $0 = v1._2._1;
  const $1 = v1._1;
  const $2 = v1._2._2;
  return v2 => {
    if ($0.tag === "Left") { return error$1($1, $0._1, $2); }
    if ($0.tag === "Right") { return done($1, $0._1, $2); }
    $runtime.fail();
  };
})(dictFunctor.map(x => Data$dTuple.$Tuple(undefined, Data$dTuple.$Tuple(x, undefined)))(k(environment)))));
const readerT1 = k => (environment, state0, more, lift$1, error$1, done) => more(v => lift$1(Effect$dAff._parAffMap(v1 => {
  const $0 = v1._2._1;
  const $1 = v1._1;
  const $2 = v1._2._2;
  return v2 => {
    if ($0.tag === "Left") { return error$1($1, $0._1, $2); }
    if ($0.tag === "Right") { return done($1, $0._1, $2); }
    $runtime.fail();
  };
})(Effect$dAff._parAffMap(x => Data$dTuple.$Tuple(undefined, Data$dTuple.$Tuple(x, undefined)))(k(environment)))));
const readerT2 = k => (environment, state0, more, lift$1, error$1, done) => more(v => lift$1(Effect$dAff._map(v1 => {
  const $0 = v1._2._1;
  const $1 = v1._1;
  const $2 = v1._2._2;
  return v2 => {
    if ($0.tag === "Left") { return error$1($1, $0._1, $2); }
    if ($0.tag === "Right") { return done($1, $0._1, $2); }
    $runtime.fail();
  };
})(Effect$dAff._map(x => Data$dTuple.$Tuple(undefined, Data$dTuple.$Tuple(x, undefined)))(k(environment)))));
const parOmToAff = ctx => v => Effect$dAff._map(v1 => v1._2._1)(runRWSET(ctx)()((environment, state, more, lift$p, error$1, done) => v(
  environment,
  state,
  more,
  x => lift$p(Effect$dAff._sequential(x)),
  error$1,
  done
)));
const altParOm = {
  alt: x => y => readerT1(ctx => Effect$dAff._parAffAlt(Effect$dAff._bind(parOmToAff(ctx)(x))(res => {
    if (res.tag === "Left") { return Effect$dAff._throwError(Yoga$dOm$dError.newParallelError(res._1)); }
    if (res.tag === "Right") { return Effect$dAff._pure(Data$dEither.$Either("Right", res._1)); }
    $runtime.fail();
  }))(Effect$dAff._bind(parOmToAff(ctx)(y))(res => {
    if (res.tag === "Left") { return Effect$dAff._throwError(Yoga$dOm$dError.newParallelError(res._1)); }
    if (res.tag === "Right") { return Effect$dAff._pure(Data$dEither.$Either("Right", res._1)); }
    $runtime.fail();
  }))),
  Functor0: () => Uncurried$dRWSET.functorRWSET
};
const applyParOm = {
  apply: f => a => readerT1(ctx => Effect$dAff.supervise(Effect$dAff._bind(Effect$dAff$dAVar.empty)(functionVar => Effect$dAff._bind(Effect$dAff$dAVar.empty)(valueVar => Effect$dAff._bind(Effect$dAff._map(v => {})(Effect$dAff.forkAff(Effect$dAff._bind(parOmToAff(ctx)(f))(res => {
    if (res.tag === "Right") { return Effect$dAff$dAVar.put(res._1)(functionVar); }
    if (res.tag === "Left") {
      const $0 = Yoga$dOm$dError.newParallelError(res._1);
      return Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dAVar._killVar(Effect$dAVar.ffiUtil, $0, valueVar)))(() => Effect$dAff._liftEffect(Effect$dAVar._killVar(
        Effect$dAVar.ffiUtil,
        $0,
        functionVar
      )));
    }
    $runtime.fail();
  }))))(() => Effect$dAff._bind(Effect$dAff._map(v => {})(Effect$dAff.forkAff(Effect$dAff._bind(parOmToAff(ctx)(a))(res => {
    if (res.tag === "Right") { return Effect$dAff$dAVar.put(res._1)(valueVar); }
    if (res.tag === "Left") {
      const $0 = Yoga$dOm$dError.newParallelError(res._1);
      return Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dAVar._killVar(Effect$dAVar.ffiUtil, $0, functionVar)))(() => Effect$dAff._liftEffect(Effect$dAVar._killVar(
        Effect$dAVar.ffiUtil,
        $0,
        valueVar
      )));
    }
    $runtime.fail();
  }))))(() => Effect$dAff._bind(Effect$dAff$dAVar.take(functionVar))($$function => Effect$dAff._bind(Effect$dAff$dAVar.take(valueVar))(value => Effect$dAff._pure(Data$dEither.$Either(
    "Right",
    $$function(value)
  )))))))))),
  Functor0: () => Uncurried$dRWSET.functorRWSET
};
const applicativeParOm = {pure: v => readerT1(v1 => Effect$dAff._pure(Data$dEither.$Either("Right", v))), Apply0: () => applyParOm};
const parallelParOmOm = {
  sequential: par => readerT2(ctx => Effect$dAff._bind(Effect$dAff$dAVar.empty)(resultVar => Effect$dAff._bind(Effect$dAff._map(v => {})(Effect$dAff.forkAff(Effect$dAff._bind($$try(parOmToAff(ctx)(par)))(res => {
    if (res.tag === "Right") { return Effect$dAff$dAVar.put(res._1)(resultVar); }
    if (res.tag === "Left") {
      const $0 = Yoga$dOm$dError.toParallelErrorImpl(Data$dMaybe.Just, Data$dMaybe.Nothing, res._1);
      if ($0.tag === "Just") { return Effect$dAff$dAVar.put(Data$dEither.$Either("Left", Yoga$dOm$dError.getParallelError($0._1)))(resultVar); }
    }
    if (res.tag === "Left") { return Effect$dAff._throwError(res._1); }
    $runtime.fail();
  }))))(() => Effect$dAff$dAVar.take(resultVar)))),
  parallel: v => readerT1(ctx => Effect$dAff._map(v1 => v1._2._1)(runRWSET(ctx)()(v))),
  Apply0: () => applyOm,
  Apply1: () => applyParOm
};
const noteM = dictMonadThrow => {
  const Monad0 = dictMonadThrow.Monad0();
  const $0 = Monad0.Bind1();
  const throwError2 = dictMonadThrow.throwError;
  const pure3 = Monad0.Applicative0().pure;
  return err => {
    const $1 = $0.bind(err)(throwError2);
    return v2 => {
      if (v2.tag === "Nothing") { return $1; }
      if (v2.tag === "Just") { return pure3(v2._1); }
      $runtime.fail();
    };
  };
};
const launchOm = () => () => () => ctx => handlers => om => {
  const $0 = Effect$dAff._makeFiber(
    Effect$dAff.ffiUtil,
    Effect$dAff._bind(runRWSET(ctx)()(om))(v1 => {
      if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
      if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()(handlers)(Data$dVariant.case_)(v1._2._1._1); }
      $runtime.fail();
    })
  );
  return () => {
    const fiber = $0();
    fiber.run();
    return fiber;
  };
};
const launchOm_ = () => () => () => ctx => handlers => om => {
  const $0 = launchOm()()()(ctx)(handlers)(om);
  return () => {$0();};
};
const inParallel = /* #__PURE__ */ (() => {
  const $0 = Data$dTraversable.traversableArray.traverse(applicativeParOm)(x => parallelParOmOm.parallel(x));
  return x => parallelParOmOm.sequential($0(x));
})();
const expandErr = () => Unsafe$dCoerce.unsafeCoerce;
const expandCtx = () => dictKeys => {
  const shrink1 = Record$dStudio$dShrink.shrinkImpl(dictKeys.keys(Type$dProxy.Proxy));
  return v => (environment1, state1, more, lift$p, error$1, done) => v(shrink1(environment1), state1, more, lift$p, error$1, done);
};
const expand = () => () => dictKeys => expandCtx()(dictKeys);
const error = dictSingletonVariantRecord => dictSingletonVariantRecord.singletonRecordToVariant;
const $$throw = dictSingletonVariantRecord => dictMonadThrow => x => dictMonadThrow.throwError(dictSingletonVariantRecord.singletonRecordToVariant(x));
const fromAff = e => bindOm.bind(lift($$try(e)))(v2 => {
  if (v2.tag === "Left") { return monadThrowVariantExceptio.throwError(singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return applicativeOm.pure(v2._1); }
  $runtime.fail();
});
const handleErrors$p = handle => v => bindOm.bind(monadAskOm.ask)(ctx => bindOm.bind(bindOm.bind(lift($$try(Effect$dAff._map(v1 => v1._2._1)(runRWSET(ctx)()(v)))))(v2 => {
  if (v2.tag === "Left") { return monadThrowVariantExceptio.throwError(singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return applicativeOm.pure(v2._1); }
  $runtime.fail();
}))(result => {
  if (result.tag === "Left") { return handle(result._1); }
  if (result.tag === "Right") { return applicativeOm.pure(result._1); }
  $runtime.fail();
}));
const runReader = ctx => om => {
  const $0 = {exception: exception => Effect$dAff._pure(Data$dEither.$Either("Left", singletonVariantRecord.singletonRecordToVariant({exception})))};
  return Effect$dAff._bind(runRWSET(ctx)()(handleErrors$p(x => applicativeOm.pure(Data$dEither.$Either("Left", x)))((environment, state0, more, lift$p, error$1, done) => more(v1 => om(
    environment,
    state0,
    more,
    lift$p,
    error$1,
    (state1, a, w) => more(v2 => done(state1, Data$dEither.$Either("Right", a), w))
  )))))(v1 => {
    if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
    if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1._2._1._1); }
    $runtime.fail();
  });
};
const unliftAff = om => (environment, state0, more, lift$p, error$1, done) => more(v1 => monadAskOm.ask(
  environment,
  state0,
  more,
  lift$p,
  error$1,
  (state1, a, w) => more(v2 => done(state1, runReader(a)(om), w))
));
const unliftAffFn = om => bindOm.bind(monadAskOm.ask)(ctx => applicativeOm.pure(arg => Effect$dAff._bind(runReader(ctx)(om(arg)))(v2 => {
  if (v2.tag === "Left") {
    if (v2._1.type === "exception") { return Effect$dAff._throwError(v2._1.value); }
    return Partial._crashWith("Data.Variant: pattern match failure [" + v2._1.type + "]");
  }
  if (v2.tag === "Right") { return Effect$dAff._pure(v2._1); }
  $runtime.fail();
})));
const monadEffectOm = {
  liftEffect: x => bindOm.bind(lift($$try(Effect$dAff._liftEffect(x))))(v2 => {
    if (v2.tag === "Left") { return monadThrowVariantExceptio.throwError(singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
    if (v2.tag === "Right") { return applicativeOm.pure(v2._1); }
    $runtime.fail();
  }),
  Monad0: () => monadOm
};
const monadAffOm = {liftAff: fromAff, MonadEffect0: () => monadEffectOm};
const handleErrors = () => () => () => cases => v => bindOm.bind(monadAskOm.ask)(ctx => bindOm.bind(bindOm.bind(lift($$try(Effect$dAff._map(v1 => v1._2._1)(runRWSET(ctx)()(v)))))(v2 => {
  if (v2.tag === "Left") { return monadThrowVariantExceptio.throwError(singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return applicativeOm.pure(v2._1); }
  $runtime.fail();
}))(err => {
  if (err.tag === "Left") { return Data$dVariant.onMatch()()()(cases)(monadThrowVariantExceptio.throwError)(err._1); }
  if (err.tag === "Right") { return applicativeOm.pure(err._1); }
  $runtime.fail();
}));
const plusOm = /* #__PURE__ */ (() => (
  {
    empty: bindOm.bind(lift($$try(Effect$dAff._throwError(Effect$dException.error("Always fails")))))(v2 => {
      if (v2.tag === "Left") { return monadThrowVariantExceptio.throwError(singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
      if (v2.tag === "Right") { return applicativeOm.pure(v2._1); }
      $runtime.fail();
    }),
    Alt0: () => altOm
  }
))();
const plusParOm = /* #__PURE__ */ (() => ({empty: parallelParOmOm.parallel(plusOm.empty), Alt0: () => altParOm}))();
const alternativeParOm = {Applicative0: () => applicativeParOm, Plus1: () => plusParOm};
const race = /* #__PURE__ */ (() => {
  const $0 = Data$dFoldable.foldrArray(x => altParOm.alt(parallelParOmOm.parallel(x)))(parallelParOmOm.parallel(plusOm.empty));
  return x => parallelParOmOm.sequential($0(x));
})();
const note = dictSingletonVariantRecord => dictMonadThrow => {
  const pure3 = dictMonadThrow.Monad0().Applicative0().pure;
  return err => {
    const $0 = dictMonadThrow.throwError(dictSingletonVariantRecord.singletonRecordToVariant(err));
    return v2 => {
      if (v2.tag === "Nothing") { return $0; }
      if (v2.tag === "Just") { return pure3(v2._1); }
      $runtime.fail();
    };
  };
};
const delay = dictMonadAff => dictDuration => x => dictMonadAff.liftAff(Effect$dAff._delay(Data$dEither.Right, dictDuration.fromDuration(x)));
export {
  Om,
  ParOm,
  altOm,
  altParOm,
  alternativeParOm,
  applicativeOm,
  applicativeParOm,
  applyOm,
  applyParOm,
  bindOm,
  delay,
  error,
  exceptionIsSymbol,
  expand,
  expandCtx,
  expandErr,
  fromAff,
  functorOm,
  functorParOm,
  handleErrors,
  handleErrors$p,
  inParallel,
  launchOm,
  launchOm_,
  lift,
  monadAffOm,
  monadAskOm,
  monadEffectOm,
  monadErrorVariantExceptio,
  monadOm,
  monadReaderOm,
  monadRecOm,
  monadThrowVariantExceptio,
  newtypeOm_,
  note,
  noteM,
  parOmToAff,
  parallelParOmOm,
  plusOm,
  plusParOm,
  race,
  readerT,
  readerT1,
  readerT2,
  runOm,
  runRWSET,
  runReader,
  semigroupOm,
  semigroupRWSET,
  singletonVariantRecord,
  tap,
  tapM,
  $$throw as throw,
  throwLeftAs,
  throwLeftAsM,
  $$try as try,
  unliftAff,
  unliftAffFn,
  widenCtx
};
