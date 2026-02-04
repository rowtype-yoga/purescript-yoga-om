import * as $runtime from "../runtime.js";
import * as Control$dApply from "../Control.Apply/index.js";
import * as Control$dMonad$dError$dClass from "../Control.Monad.Error.Class/index.js";
import * as Control$dMonad$dWriter$dTrans from "../Control.Monad.Writer.Trans/index.js";
import * as Control$dSemigroupoid from "../Control.Semigroupoid/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dFunction from "../Data.Function/index.js";
import * as Data$dFunctor from "../Data.Functor/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dMonoid from "../Data.Monoid/index.js";
import * as Data$dSemigroup from "../Data.Semigroup/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Effect$dAVar from "../Effect.AVar/index.js";
import * as Effect$dAff$dAVar from "../Effect.Aff.AVar/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import * as Test$dSpec$dTree from "../Test.Spec.Tree/index.js";
const $ComputationType = (tag, _1) => ({tag, _1});
const $Memoized = (tag, _1) => ({tag, _1});
const monadTellWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadTellWriterT(Data$dMonoid.monoidArray);
const monadThrowWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadThrowWriterT(Data$dMonoid.monoidArray);
const monadStateWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadStateWriterT(Data$dMonoid.monoidArray);
const monadWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadWriterT(Data$dMonoid.monoidArray);
const monadRecWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadRecWriterT(Data$dMonoid.monoidArray);
const monadReaderWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadReaderWriterT(Data$dMonoid.monoidArray);
const monadPlusWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadPlusWriterT(Data$dMonoid.monoidArray);
const monadErrorWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadErrorWriterT(Data$dMonoid.monoidArray);
const monadEffectWriter1 = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadEffectWriter(Data$dMonoid.monoidArray);
const monadContWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadContWriterT(Data$dMonoid.monoidArray);
const monadAskWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadAskWriterT(Data$dMonoid.monoidArray);
const identity = x => x;
const any = /* #__PURE__ */ (() => Data$dFoldable.foldableArray.foldMap((() => {
  const semigroupDisj1 = {append: v => v1 => v || v1};
  return {mempty: false, Semigroup0: () => semigroupDisj1};
})()))();
const applyWriterT = dictApply => {
  const Functor0 = dictApply.Functor0();
  const functorWriterT1 = {map: f => Functor0.map(v => Data$dTuple.$Tuple(f(v._1), v._2))};
  return {apply: v => v1 => dictApply.apply(Functor0.map(v3 => v4 => Data$dTuple.$Tuple(v3._1(v4._1), [...v3._2, ...v4._2]))(v))(v1), Functor0: () => functorWriterT1};
};
const applicativeWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.applicativeWriterT(Data$dMonoid.monoidArray);
const alternativeWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.alternativeWriterT(Data$dMonoid.monoidArray);
const SpecT = x => x;
const MEmpty = /* #__PURE__ */ $Memoized("MEmpty");
const MMemoized = value0 => $Memoized("MMemoized", value0);
const MFailed = value0 => $Memoized("MFailed", value0);
const CleanUpWithContext = value0 => $ComputationType("CleanUpWithContext", value0);
const TestWithName = value0 => $ComputationType("TestWithName", value0);
const warn = () => ({});
const plusSpecT = dictPlus => {
  const $0 = dictPlus.Alt0();
  const $1 = $0.Functor0();
  const functorWriterT1 = {map: f => $1.map(v => Data$dTuple.$Tuple(f(v._1), v._2))};
  const altWriterT1 = {alt: v => v1 => $0.alt(v)(v1), Functor0: () => functorWriterT1};
  return {empty: dictPlus.empty, Alt0: () => altWriterT1};
};
const pending = dictMonad => name => monadTellWriterT(dictMonad).tell([Test$dSpec$dTree.$Tree("Leaf", name, Data$dMaybe.Nothing)]);
const pending$p = dictMonad => name => v => monadTellWriterT(dictMonad).tell([Test$dSpec$dTree.$Tree("Leaf", name, Data$dMaybe.Nothing)]);
const newtypeSpecT = {Coercible0: () => {}};
const monadTransSpecT = {lift: dictMonad => m => dictMonad.Bind1().bind(m)(a => dictMonad.Applicative0().pure(Data$dTuple.$Tuple(a, [])))};
const monadThrowSpecT = dictMonadThrow => monadThrowWriterT(dictMonadThrow);
const monadStateSpecT = dictMonadState => monadStateWriterT(dictMonadState);
const monadSpecT = dictMonad => monadWriterT(dictMonad);
const monadRecSpecT = dictMonadRec => monadRecWriterT(dictMonadRec);
const monadReaderSpecT = dictMonadReader => monadReaderWriterT(dictMonadReader);
const monadPlusSpecT = dictMonadPlus => monadPlusWriterT(dictMonadPlus);
const monadErrorSpecT = dictMonadError => monadErrorWriterT(dictMonadError);
const monadEffectWriter = dictMonadEffect => monadEffectWriter1(dictMonadEffect);
const monadContSpecT = dictMonadCont => monadContWriterT(dictMonadCont);
const monadAskSpecT = dictMonadAsk => monadAskWriterT(dictMonadAsk);
const memoize = dictMonadAff => {
  const Monad0 = dictMonadAff.MonadEffect0().Monad0();
  const Bind1 = Monad0.Bind1();
  const $0 = Bind1.Apply0();
  const $1 = Monad0.Applicative0();
  return dictMonadError => {
    const $2 = dictMonadError.MonadThrow0();
    const $$try = Control$dMonad$dError$dClass.try(dictMonadError);
    return $$var => action => Bind1.bind(dictMonadAff.liftAff(Effect$dAff$dAVar.take($$var)))(v => {
      if (v.tag === "MFailed") { return $2.throwError(Effect$dException.error("exception in beforeAll-hook (see previous failure)")); }
      if (v.tag === "MMemoized") {
        return $0.apply($0.Functor0().map(Data$dFunction.const)($1.pure(v._1)))(dictMonadAff.liftAff(Effect$dAff$dAVar.put($Memoized("MMemoized", v._1))($$var)));
      }
      if (v.tag === "MEmpty") {
        return Bind1.bind($$try(action))(res => Bind1.bind(dictMonadAff.liftAff(Effect$dAff$dAVar.put((() => {
          if (res.tag === "Left") { return $Memoized("MFailed", res._1); }
          if (res.tag === "Right") { return $Memoized("MMemoized", res._1); }
          $runtime.fail();
        })())($$var)))(() => {
          if (res.tag === "Left") { return $2.throwError(res._1); }
          if (res.tag === "Right") { return $1.pure(res._1); }
          $runtime.fail();
        }));
      }
      $runtime.fail();
    });
  };
};
const mapSpecTree = dictFunctor => g => f => {
  const $0 = dictFunctor.map((() => {
    const $0 = Data$dFunctor.arrayMap(f);
    return m => Data$dTuple.$Tuple(m._1, $0(m._2));
  })());
  return v => $0(g(v));
};
const parallel = dictMonad => mapSpecTree(dictMonad.Bind1().Apply0().Functor0())(identity)(Test$dSpec$dTree.bifunctorTree.bimap(identity)(i => (
  {...i, isParallelizable: i.isParallelizable.tag === "Nothing" ? Data$dMaybe.$Maybe("Just", true) : i.isParallelizable}
)));
const sequential = dictMonad => mapSpecTree(dictMonad.Bind1().Apply0().Functor0())(identity)(Test$dSpec$dTree.bifunctorTree.bimap(identity)(i => (
  {...i, isParallelizable: i.isParallelizable.tag === "Nothing" ? Data$dMaybe.$Maybe("Just", false) : i.isParallelizable}
)));
const hoistSpec = dictMonad => {
  const mapSpecTree1 = mapSpecTree(dictMonad.Bind1().Apply0().Functor0());
  return onM => f => mapSpecTree1(onM)(Test$dSpec$dTree.bimapTreeWithPaths(name => around$p => i => f($ComputationType("CleanUpWithContext", name))(around$p(i)))(name => item => (
    {
      ...item,
      example: g => g((() => {
        const $0 = f($ComputationType("TestWithName", name));
        return x => $0(item.example(Data$dFunction.applyFlipped(x)));
      })())
    }
  )));
};
const functorSpecT = dictFunctor => ({map: f => dictFunctor.map(v => Data$dTuple.$Tuple(f(v._1), v._2))});
const focus = () => dictMonad => dictMonad.Bind1().Apply0().Functor0().map(m => Data$dTuple.$Tuple(
  m._1,
  any(Test$dSpec$dTree.foldableTree.foldMap((() => {
    const semigroupDisj1 = {append: v => v1 => v || v1};
    return {mempty: false, Semigroup0: () => semigroupDisj1};
  })())(x => x.isFocused))(m._2)
    ? m._2
    : Data$dFunctor.arrayMap(Test$dSpec$dTree.bifunctorTree.bimap(identity)(v => ({...v, isFocused: true})))(m._2)
));
const exampleMUnit = {evaluateExample: t => around$p => around$p(v => t)};
const exampleFunc = {evaluateExample: t => around$p => around$p(t)};
const evaluateExample = dict => dict.evaluateExample;
const it = dictMonad => dictExample => name => test => monadTellWriterT(dictMonad).tell([
  Test$dSpec$dTree.$Tree("Leaf", name, Data$dMaybe.$Maybe("Just", {isParallelizable: Data$dMaybe.Nothing, isFocused: false, example: dictExample.evaluateExample(test)}))
]);
const itOnly = () => dictMonad => {
  const focus2 = focus()(dictMonad);
  return dictExample => x => x$1 => focus2(it(dictMonad)(dictExample)(x)(x$1));
};
const describe = dictMonad => name => dictMonad.Bind1().Apply0().Functor0().map(m => Data$dTuple.$Tuple(
  m._1,
  [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", name), m._2)]
));
const describeOnly = () => dictMonad => {
  const $0 = Control$dSemigroupoid.semigroupoidFn.compose(focus()(dictMonad));
  return x => $0(dictMonad.Bind1().Apply0().Functor0().map(m => Data$dTuple.$Tuple(m._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", x), m._2)])));
};
const collect = dictFunctor => {
  const $0 = dictFunctor.map(Test$dSpec$dTree.discardUnfocused);
  return x => $0(dictFunctor.map(Data$dTuple.snd)(x));
};
const bindSpecT = dictBind => Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(dictBind);
const aroundWith = dictMonad => {
  const mapSpecTree1 = mapSpecTree(dictMonad.Bind1().Apply0().Functor0());
  return action => mapSpecTree1(identity)(Test$dSpec$dTree.bifunctorTree.bimap(action)(v => ({...v, example: aroundAction => v.example(x => aroundAction(action(x)))})));
};
const around_ = dictMonad => {
  const aroundWith1 = aroundWith(dictMonad);
  return action => aroundWith1(e => a => action(e(a)));
};
const before_ = dictMonad => {
  const around_1 = around_(dictMonad);
  return dictMonad1 => {
    const $0 = dictMonad1.Bind1().Apply0();
    return action => around_1(v => $0.apply($0.Functor0().map(v$1 => Control$dApply.identity)(action))(v));
  };
};
const beforeAll_ = dictMonadEffect => {
  const Monad0 = dictMonadEffect.Monad0();
  const bind = Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Monad0.Bind1()).bind;
  const before_1 = before_(Monad0);
  return dictMonadAff => {
    const before_2 = before_1(dictMonadAff.MonadEffect0().Monad0());
    const memoize1 = memoize(dictMonadAff);
    return dictMonadError => {
      const memoize2 = memoize1(dictMonadError);
      return action => spec => bind(monadEffectWriter1(dictMonadEffect).liftEffect(Effect$dAVar._newVar(MEmpty)))($$var => before_2(memoize2($$var)(action))(spec));
    };
  };
};
const beforeWith = dictMonad => {
  const aroundWith1 = aroundWith(dictMonad);
  return dictMonad1 => action => aroundWith1(e => x => dictMonad1.Bind1().bind(action(x))(e));
};
const around = dictMonad => {
  const aroundWith1 = aroundWith(dictMonad);
  return action => aroundWith1(e => v => action(e));
};
const before = dictMonad => {
  const aroundWith1 = aroundWith(dictMonad);
  return dictMonad1 => action => aroundWith1(e => v => dictMonad1.Bind1().bind(action)(e));
};
const beforeAll = dictMonadEffect => {
  const Monad0 = dictMonadEffect.Monad0();
  const bind = Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Monad0.Bind1()).bind;
  const before1 = before(Monad0);
  return dictMonadAff => {
    const before2 = before1(dictMonadAff.MonadEffect0().Monad0());
    const memoize1 = memoize(dictMonadAff);
    return dictMonadError => {
      const memoize2 = memoize1(dictMonadError);
      return action => spec => bind(monadEffectWriter1(dictMonadEffect).liftEffect(Effect$dAVar._newVar(MEmpty)))($$var => before2(memoize2($$var)(action))(spec));
    };
  };
};
const applySpecT = dictApply => applyWriterT(dictApply);
const applicativeSpecT = dictApplicative => applicativeWriterT(dictApplicative);
const alternativeSpecT = dictAlternative => alternativeWriterT(dictAlternative);
const altSpecT = dictAlt => {
  const $0 = dictAlt.Functor0();
  const functorWriterT1 = {map: f => $0.map(v => Data$dTuple.$Tuple(f(v._1), v._2))};
  return {alt: v => v1 => dictAlt.alt(v)(v1), Functor0: () => functorWriterT1};
};
const afterAll = dictMonad => action => dictMonad.Bind1().Apply0().Functor0().map(m => Data$dTuple.$Tuple(
  m._1,
  [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Right", action), m._2)]
));
const afterAll_ = dictMonad => action => dictMonad.Bind1().Apply0().Functor0().map(m => Data$dTuple.$Tuple(
  m._1,
  [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Right", v => action), m._2)]
));
const after = dictMonad => {
  const aroundWith1 = aroundWith(dictMonad);
  return dictMonadBracket => action => aroundWith1(e => x => {
    const $0 = e(x);
    const $1 = action(x);
    return dictMonadBracket.bracket(dictMonadBracket.MonadError1().MonadThrow0().Monad0().Applicative0().pure())(v => v1 => $1)(v => $0);
  });
};
const after_ = dictMonad => {
  const after1 = after(dictMonad);
  return dictMonadBracket => {
    const after2 = after1(dictMonadBracket);
    return action => after2(v => action);
  };
};
export {
  $ComputationType,
  $Memoized,
  CleanUpWithContext,
  MEmpty,
  MFailed,
  MMemoized,
  SpecT,
  TestWithName,
  after,
  afterAll,
  afterAll_,
  after_,
  altSpecT,
  alternativeSpecT,
  alternativeWriterT,
  any,
  applicativeSpecT,
  applicativeWriterT,
  applySpecT,
  applyWriterT,
  around,
  aroundWith,
  around_,
  before,
  beforeAll,
  beforeAll_,
  beforeWith,
  before_,
  bindSpecT,
  collect,
  describe,
  describeOnly,
  evaluateExample,
  exampleFunc,
  exampleMUnit,
  focus,
  functorSpecT,
  hoistSpec,
  identity,
  it,
  itOnly,
  mapSpecTree,
  memoize,
  monadAskSpecT,
  monadAskWriterT,
  monadContSpecT,
  monadContWriterT,
  monadEffectWriter,
  monadEffectWriter1,
  monadErrorSpecT,
  monadErrorWriterT,
  monadPlusSpecT,
  monadPlusWriterT,
  monadReaderSpecT,
  monadReaderWriterT,
  monadRecSpecT,
  monadRecWriterT,
  monadSpecT,
  monadStateSpecT,
  monadStateWriterT,
  monadTellWriterT,
  monadThrowSpecT,
  monadThrowWriterT,
  monadTransSpecT,
  monadWriterT,
  newtypeSpecT,
  parallel,
  pending,
  pending$p,
  plusSpecT,
  sequential,
  warn
};
