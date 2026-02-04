// | This module defines the state monad transformer, `StateT`.
import * as $runtime from "../runtime.js";
import * as Data$dMonoid from "../Data.Monoid/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Uncurried$dRWSET from "../Uncurried.RWSET/index.js";
const semigroupRWSET = /* #__PURE__ */ Uncurried$dRWSET.semigroupRWSET(Data$dMonoid.monoidUnit);
const monoidRWSET = /* #__PURE__ */ Uncurried$dRWSET.monoidRWSET(Data$dMonoid.monoidUnit);
const identity = x => x;
const monadEffectRWSET = /* #__PURE__ */ Uncurried$dRWSET.monadEffectRWSET(Data$dMonoid.monoidUnit);
const StateT = x => x;
const semigroupStateT = dictSemigroup => semigroupRWSET(dictSemigroup);
const monoidStateT = dictMonoid => monoidRWSET(dictMonoid);
const monadTransStateT = {lift: dictMonad => m => (v, state, v1, lift$p, v2, done) => lift$p(dictMonad.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, undefined))(m))};
const monadStateT = /* #__PURE__ */ Uncurried$dRWSET.monadRWSET(Data$dMonoid.monoidUnit);
const monadTellStateT = dictMonoid => dictMonadTell => {
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
    Monad1: () => monadStateT
  };
};
const monadWriterStateT = dictMonoid => dictMonadRec => {
  const $0 = dictMonadRec.Monad0().Bind1().Apply0().Functor0();
  const runRWSET = Uncurried$dRWSET.runRWSET(dictMonadRec);
  return dictMonadWriter => {
    const Monoid0 = dictMonadWriter.Monoid0();
    const monadTellStateT1 = monadTellStateT(Monoid0)(dictMonadWriter.MonadTell1());
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
      MonadTell1: () => monadTellStateT1
    };
  };
};
const monadThrowStateT = dictMonadThrow => (
  {
    throwError: (() => {
      const $0 = dictMonadThrow.Monad0();
      return x => {
        const $1 = dictMonadThrow.throwError(x);
        return (v, state, v1, lift$p, v2, done) => lift$p($0.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, undefined))($1));
      };
    })(),
    Monad0: () => monadStateT
  }
);
const monadStateStateT = /* #__PURE__ */ Uncurried$dRWSET.monadStateRWSET(Data$dMonoid.monoidUnit);
const monadRecStateT = /* #__PURE__ */ Uncurried$dRWSET.monadRecRWSET(Data$dMonoid.monoidUnit);
const monadErrorStateT = dictMonadRec => {
  const runRWSET = Uncurried$dRWSET.runRWSET(dictMonadRec);
  return dictMonadError => {
    const MonadThrow0 = dictMonadError.MonadThrow0();
    const $0 = MonadThrow0.Monad0().Bind1().Apply0().Functor0();
    const monadThrowStateT1 = monadThrowStateT(MonadThrow0);
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
      MonadThrow0: () => monadThrowStateT1
    };
  };
};
const monadEffectStateT = dictMonadEffect => monadEffectRWSET(dictMonadEffect);
const monadAskStateT = dictMonadAsk => (
  {
    ask: (() => {
      const $0 = dictMonadAsk.Monad0();
      const $1 = dictMonadAsk.ask;
      return (v, state, v1, lift$p, v2, done) => lift$p($0.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, undefined))($1));
    })(),
    Monad0: () => monadStateT
  }
);
const monadReaderStateT = dictMonadRec => {
  const runRWSET = Uncurried$dRWSET.runRWSET(dictMonadRec);
  return dictMonadReader => {
    const MonadAsk0 = dictMonadReader.MonadAsk0();
    const $0 = MonadAsk0.Monad0().Bind1().Apply0().Functor0();
    const monadAskStateT1 = monadAskStateT(MonadAsk0);
    return {
      local: f => v => (environment, state, v1, lift$p, error, done) => lift$p($0.map(v2 => {
        const $1 = v2._2._1;
        const $2 = v2._1;
        const $3 = v2._2._2;
        return v3 => {
          if ($1.tag === "Left") { return error($2, $1._1, $3); }
          if ($1.tag === "Right") { return done($2, $1._1, $3); }
          $runtime.fail();
        };
      })(dictMonadReader.local(f)(runRWSET(environment)(state)(v)))),
      MonadAsk0: () => monadAskStateT1
    };
  };
};
const lazyStateT = {defer: f => (environment, state0, more, lift$p, error, done) => f()(environment, state0, more, lift$p, error, done)};
const functorStateT = Uncurried$dRWSET.functorRWSET;
const bindStateT = /* #__PURE__ */ Uncurried$dRWSET.bindRWSET(Data$dMonoid.monoidUnit);
const applyStateT = /* #__PURE__ */ Uncurried$dRWSET.applyRWSET(Data$dMonoid.monoidUnit);
const applicativeStateT = /* #__PURE__ */ Uncurried$dRWSET.applicativeRWSET(Data$dMonoid.monoidUnit);
const withStateT = f => v => (environment, state, more, lift$p, error, done) => v(environment, f(state), more, lift$p, error, done);
const stateT = dictFunctor => k => (v, state0, more, lift1, v1, done) => more(v2 => lift1(dictFunctor.map(v3 => {
  const $0 = v3._1;
  const $1 = v3._2;
  return v4 => done($1, $0, undefined);
})(k(state0))));
const runStateT = dictMonadRec => {
  const runRWSET = Uncurried$dRWSET.runRWSET(dictMonadRec);
  return s => v => dictMonadRec.Monad0().Bind1().Apply0().Functor0().map(v1 => {
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
    if (v1._2._1.tag === "Right") { return Data$dTuple.$Tuple(v1._2._1._1, v1._1); }
    $runtime.fail();
  })(runRWSET()(s)(v));
};
const mapStateT = dictMonadRec => {
  const runStateT1 = runStateT(dictMonadRec);
  return dictFunctor => f => k => (v, state, v1, lift$p, v2, done) => lift$p(dictFunctor.map(v3 => {
    const $0 = v3._1;
    const $1 = v3._2;
    return v4 => done($1, $0, undefined);
  })(f(runStateT1(state)(k))));
};
const hoistStateT = f => v => (environment, state, more, lift$p, error, done) => v(environment, state, more, x => lift$p(f(x)), error, done);
const execStateT = dictMonadRec => {
  const runStateT1 = runStateT(dictMonadRec);
  return s => k => dictMonadRec.Monad0().Bind1().Apply0().Functor0().map(Data$dTuple.snd)(runStateT1(s)(k));
};
const evalStateT = dictMonadRec => {
  const runStateT1 = runStateT(dictMonadRec);
  return s => k => dictMonadRec.Monad0().Bind1().Apply0().Functor0().map(Data$dTuple.fst)(runStateT1(s)(k));
};
export {
  StateT,
  applicativeStateT,
  applyStateT,
  bindStateT,
  evalStateT,
  execStateT,
  functorStateT,
  hoistStateT,
  identity,
  lazyStateT,
  mapStateT,
  monadAskStateT,
  monadEffectRWSET,
  monadEffectStateT,
  monadErrorStateT,
  monadReaderStateT,
  monadRecStateT,
  monadStateStateT,
  monadStateT,
  monadTellStateT,
  monadThrowStateT,
  monadTransStateT,
  monadWriterStateT,
  monoidRWSET,
  monoidStateT,
  runStateT,
  semigroupRWSET,
  semigroupStateT,
  stateT,
  withStateT
};
