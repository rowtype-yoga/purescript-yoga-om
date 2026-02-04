// | This module defines the reader monad transformer, `ReaderT`.
import * as $runtime from "../runtime.js";
import * as Data$dMonoid from "../Data.Monoid/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Uncurried$dRWSET from "../Uncurried.RWSET/index.js";
const semigroupRWSET = /* #__PURE__ */ Uncurried$dRWSET.semigroupRWSET(Data$dMonoid.monoidUnit);
const monoidRWSET = /* #__PURE__ */ Uncurried$dRWSET.monoidRWSET(Data$dMonoid.monoidUnit);
const identity = x => x;
const monadEffectRWSET = /* #__PURE__ */ Uncurried$dRWSET.monadEffectRWSET(Data$dMonoid.monoidUnit);
const ReaderT = x => x;
const semigroupReaderT = dictSemigroup => semigroupRWSET(dictSemigroup);
const monoidReaderT = dictMonoid => monoidRWSET(dictMonoid);
const monadTransReaderT = {lift: dictMonad => m => (v, state, v1, lift$p, v2, done) => lift$p(dictMonad.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, undefined))(m))};
const monadRecReaderT = /* #__PURE__ */ Uncurried$dRWSET.monadRecRWSET(Data$dMonoid.monoidUnit);
const monadReaderT = /* #__PURE__ */ Uncurried$dRWSET.monadRWSET(Data$dMonoid.monoidUnit);
const monadStateReaderT = dictMonadState => (
  {
    state: (() => {
      const $0 = dictMonadState.Monad0();
      return x => {
        const $1 = dictMonadState.state(x);
        return (v, state, v1, lift$p, v2, done) => lift$p($0.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, undefined))($1));
      };
    })(),
    Monad0: () => monadReaderT
  }
);
const monadTellReaderT = dictMonoid => dictMonadTell => {
  const Semigroup0 = dictMonadTell.Semigroup0();
  return {
    tell: (() => {
      const $0 = dictMonadTell.Monad1();
      return x => {
        const $1 = dictMonadTell.tell(x);
        return (v, state, v1, lift$p, v2, done) => lift$p($0.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, undefined))($1));
      };
    })(),
    Semigroup0: () => Semigroup0,
    Monad1: () => monadReaderT
  };
};
const monadWriterReaderT = dictMonoid => dictMonadRec => {
  const $0 = dictMonadRec.Monad0().Bind1().Apply0().Functor0();
  const runRWSET = Uncurried$dRWSET.runRWSET(dictMonadRec);
  return dictMonadWriter => {
    const Monoid0 = dictMonadWriter.Monoid0();
    const monadTellReaderT1 = monadTellReaderT(Monoid0)(dictMonadWriter.MonadTell1());
    return {
      listen: v => (environment, state, v1, lift$p, error, done) => lift$p($0.map(v2 => {
        const $1 = v2._1._2._1;
        const $2 = v2._1._1;
        const $3 = v2._2;
        return v3 => {
          if ($1.tag === "Left") { return error($2, $1._1, undefined); }
          if ($1.tag === "Right") { return done($2, Data$dTuple.$Tuple($1._1, $3), undefined); }
          $runtime.fail();
        };
      })(dictMonadWriter.listen(runRWSET(environment)(state)(v)))),
      pass: v => (environment, state, v1, lift$p, error, done) => lift$p(dictMonadWriter.pass($0.map(v2 => {
        if (v2._2._1.tag === "Left") {
          const $1 = v2._2._1._1;
          return Data$dTuple.$Tuple(v3 => error(v2._1, $1, v2._2._2), identity);
        }
        if (v2._2._1.tag === "Right") {
          const $1 = v2._2._1._1._1;
          return Data$dTuple.$Tuple(v3 => done(v2._1, $1, v2._2._2), v2._2._1._1._2);
        }
        $runtime.fail();
      })(runRWSET(environment)(state)(v)))),
      Monoid0: () => Monoid0,
      MonadTell1: () => monadTellReaderT1
    };
  };
};
const monadThrowReaderT = dictMonadThrow => (
  {
    throwError: (() => {
      const $0 = dictMonadThrow.Monad0();
      return x => {
        const $1 = dictMonadThrow.throwError(x);
        return (v, state, v1, lift$p, v2, done) => lift$p($0.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, undefined))($1));
      };
    })(),
    Monad0: () => monadReaderT
  }
);
const monadReaderReaderT = /* #__PURE__ */ Uncurried$dRWSET.monadReaderRWSET(Data$dMonoid.monoidUnit);
const monadErrorReaderT = dictMonadRec => {
  const runRWSET = Uncurried$dRWSET.runRWSET(dictMonadRec);
  return dictMonadError => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const $0 = MonadThrow0.Monad0().Bind1().Apply0().Functor0();
    const monadThrowReaderT1 = monadThrowReaderT(MonadThrow0);
    return {
      catchError: v => f => (environment, state, v1, lift$p, error, done) => lift$p($0.map(v2 => {
        const $1 = v2._2._1;
        const $2 = v2._1;
        const $3 = v2._2._2;
        return v3 => {
          if ($1.tag === "Left") { return error($2, $1._1, $3); }
          if ($1.tag === "Right") { return done($2, $1._1, $3); }
          $runtime.fail();
        };
      })(dictMonadError.catchError(runRWSET(environment)(state)(v))(e => runRWSET(environment)(state)(f(e))))),
      MonadThrow0: () => monadThrowReaderT1
    };
  };
};
const monadEffectReaderT = dictMonadEffect => monadEffectRWSET(dictMonadEffect);
const monadAskReaderT = /* #__PURE__ */ Uncurried$dRWSET.monadAskRWSET(Data$dMonoid.monoidUnit);
const lazyReaderT = {defer: f => (environment, state0, more, lift$p, error, done) => f()(environment, state0, more, lift$p, error, done)};
const functorReaderT = Uncurried$dRWSET.functorRWSET;
const bindReaderT = /* #__PURE__ */ Uncurried$dRWSET.bindRWSET(Data$dMonoid.monoidUnit);
const applyReaderT = /* #__PURE__ */ Uncurried$dRWSET.applyRWSET(Data$dMonoid.monoidUnit);
const applicativeReaderT = /* #__PURE__ */ Uncurried$dRWSET.applicativeRWSET(Data$dMonoid.monoidUnit);
const withReaderT = f => v => (environment, state, more, lift$p, error, done) => v(f(environment), state, more, lift$p, error, done);
const runReaderT = dictMonadRec => {
  const runRWSET = Uncurried$dRWSET.runRWSET(dictMonadRec);
  return r => v => dictMonadRec.Monad0().Bind1().Apply0().Functor0().map(v1 => {
    if (v1._2._1.tag === "Left") {
      const spin = spin$a0$copy => {
        let spin$a0 = spin$a0$copy, spin$c = true, spin$r;
        while (spin$c) {
          const v$1 = spin$a0;
          spin$a0 = v$1;
        }
        return spin$r;
      };
      return spin(v1._2._1._1);
    }
    if (v1._2._1.tag === "Right") { return v1._2._1._1; }
    $runtime.fail();
  })(runRWSET(r)()(v));
};
const readerT = dictFunctor => k => (environment, v, more, lift1, v1, done) => more(v2 => lift1(dictFunctor.map(a => v3 => done(undefined, a, undefined))(k(environment))));
const mapReaderT = dictMonadRec => {
  const runReaderT1 = runReaderT(dictMonadRec);
  return dictFunctor => f => k => (environment, v, v1, lift$p, v2, done) => lift$p(dictFunctor.map(a => v3 => done(undefined, a, undefined))(f(runReaderT1(environment)(k))));
};
const hoistReaderT = f => v => (environment, state, more, lift$p, error, done) => v(environment, state, more, x => lift$p(f(x)), error, done);
export {
  ReaderT,
  applicativeReaderT,
  applyReaderT,
  bindReaderT,
  functorReaderT,
  hoistReaderT,
  identity,
  lazyReaderT,
  mapReaderT,
  monadAskReaderT,
  monadEffectRWSET,
  monadEffectReaderT,
  monadErrorReaderT,
  monadReaderReaderT,
  monadReaderT,
  monadRecReaderT,
  monadStateReaderT,
  monadTellReaderT,
  monadThrowReaderT,
  monadTransReaderT,
  monadWriterReaderT,
  monoidRWSET,
  monoidReaderT,
  readerT,
  runReaderT,
  semigroupRWSET,
  semigroupReaderT,
  withReaderT
};
