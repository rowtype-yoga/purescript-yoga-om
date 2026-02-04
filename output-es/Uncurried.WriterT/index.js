// | This module defines the writer monad transformer, `WriterT`.
import * as $runtime from "../runtime.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Uncurried$dRWSET from "../Uncurried.RWSET/index.js";
const WriterT = x => x;
const semigroupWriterT = dictMonoid => Uncurried$dRWSET.semigroupRWSET(dictMonoid);
const monoidWriterT = dictMonoid => Uncurried$dRWSET.monoidRWSET(dictMonoid);
const monadWriterWriterT = dictMonoid => Uncurried$dRWSET.monadWriterRWSET(dictMonoid);
const monadWriterT = dictMonoid => Uncurried$dRWSET.monadRWSET(dictMonoid);
const monadTransWriterT = dictMonoid => {
  const mempty = dictMonoid.mempty;
  return {lift: dictMonad => m => (v, state, v1, lift$p, v2, done) => lift$p(dictMonad.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, mempty))(m))};
};
const monadThrowWriterT = dictMonoid => {
  const mempty = dictMonoid.mempty;
  const monadWriterT1 = Uncurried$dRWSET.monadRWSET(dictMonoid);
  return dictMonadThrow => (
    {
      throwError: (() => {
        const $0 = dictMonadThrow.Monad0();
        return x => {
          const $1 = dictMonadThrow.throwError(x);
          return (v, state, v1, lift$p, v2, done) => lift$p($0.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, mempty))($1));
        };
      })(),
      Monad0: () => monadWriterT1
    }
  );
};
const monadTellWriterT = dictMonoid => Uncurried$dRWSET.monadTellRWSET(dictMonoid);
const monadStateWriterT = dictMonoid => {
  const mempty = dictMonoid.mempty;
  const monadWriterT1 = Uncurried$dRWSET.monadRWSET(dictMonoid);
  return dictMonadState => (
    {
      state: (() => {
        const $0 = dictMonadState.Monad0();
        return x => {
          const $1 = dictMonadState.state(x);
          return (v, state, v1, lift$p, v2, done) => lift$p($0.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, mempty))($1));
        };
      })(),
      Monad0: () => monadWriterT1
    }
  );
};
const monadRecWriterT = dictMonoid => Uncurried$dRWSET.monadRecRWSET(dictMonoid);
const monadErrorWriterT = dictMonoid => {
  const monadThrowWriterT1 = monadThrowWriterT(dictMonoid);
  return dictMonadRec => {
    const runRWSET = Uncurried$dRWSET.runRWSET(dictMonadRec);
    return dictMonadError => {
      const MonadThrow0 = dictMonadError.MonadThrow0();
      const $0 = MonadThrow0.Monad0().Bind1().Apply0().Functor0();
      const monadThrowWriterT2 = monadThrowWriterT1(MonadThrow0);
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
        MonadThrow0: () => monadThrowWriterT2
      };
    };
  };
};
const monadEffectWriterT = dictMonoid => Uncurried$dRWSET.monadEffectRWSET(dictMonoid);
const monadAskWriterT = dictMonoid => {
  const mempty = dictMonoid.mempty;
  const monadWriterT1 = Uncurried$dRWSET.monadRWSET(dictMonoid);
  return dictMonadAsk => (
    {
      ask: (() => {
        const $0 = dictMonadAsk.Monad0();
        const $1 = dictMonadAsk.ask;
        return (v, state, v1, lift$p, v2, done) => lift$p($0.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, mempty))($1));
      })(),
      Monad0: () => monadWriterT1
    }
  );
};
const monadReaderWriterT = dictMonoid => {
  const monadAskWriterT1 = monadAskWriterT(dictMonoid);
  return dictMonadRec => {
    const runRWSET = Uncurried$dRWSET.runRWSET(dictMonadRec);
    return dictMonadReader => {
      const MonadAsk0 = dictMonadReader.MonadAsk0();
      const $0 = MonadAsk0.Monad0().Bind1().Apply0().Functor0();
      const monadAskWriterT2 = monadAskWriterT1(MonadAsk0);
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
        MonadAsk0: () => monadAskWriterT2
      };
    };
  };
};
const lazyWriterT = dictMonoid => ({defer: f => (environment, state0, more, lift$p, error, done) => f()(environment, state0, more, lift$p, error, done)});
const functorWriterT = dictMonoid => Uncurried$dRWSET.functorRWSET;
const bindWriterT = dictMonoid => Uncurried$dRWSET.bindRWSET(dictMonoid);
const applyWriterT = dictMonoid => Uncurried$dRWSET.applyRWSET(dictMonoid);
const applicativeWriterT = dictMonoid => Uncurried$dRWSET.applicativeRWSET(dictMonoid);
const writerT = dictFunctor => dictMonoid => k => (v, v1, more, lift, v2, done) => more(v3 => lift(dictFunctor.map(v4 => {
  const $0 = v4._1;
  const $1 = v4._2;
  return v5 => done(undefined, $0, $1);
})(k)));
const runWriterT = dictMonoid => dictMonadRec => {
  const runRWSET = Uncurried$dRWSET.runRWSET(dictMonadRec);
  return v => dictMonadRec.Monad0().Bind1().Apply0().Functor0().map(v1 => {
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
    if (v1._2._1.tag === "Right") { return Data$dTuple.$Tuple(v1._2._1._1, v1._2._2); }
    $runtime.fail();
  })(runRWSET()()(v));
};
const mapWriterT = dictMonoid => dictMonoid1 => dictMonadRec => {
  const runWriterT2 = runWriterT(dictMonoid)(dictMonadRec);
  return dictFunctor => f => k => (v, v1, v2, lift$p, v3, done) => lift$p(dictFunctor.map(v4 => {
    const $0 = v4._1;
    const $1 = v4._2;
    return v5 => done(undefined, $0, $1);
  })(f(runWriterT2(k))));
};
const hoistWriterT = f => v => (environment, state, more, lift$p, error, done) => v(environment, state, more, x => lift$p(f(x)), error, done);
const execWriterT = dictMonoid => dictMonadRec => {
  const runWriterT2 = runWriterT(dictMonoid)(dictMonadRec);
  return k => dictMonadRec.Monad0().Bind1().Apply0().Functor0().map(Data$dTuple.snd)(runWriterT2(k));
};
const evalWriterT = dictMonoid => dictMonadRec => {
  const runWriterT2 = runWriterT(dictMonoid)(dictMonadRec);
  return k => dictMonadRec.Monad0().Bind1().Apply0().Functor0().map(Data$dTuple.fst)(runWriterT2(k));
};
export {
  WriterT,
  applicativeWriterT,
  applyWriterT,
  bindWriterT,
  evalWriterT,
  execWriterT,
  functorWriterT,
  hoistWriterT,
  lazyWriterT,
  mapWriterT,
  monadAskWriterT,
  monadEffectWriterT,
  monadErrorWriterT,
  monadReaderWriterT,
  monadRecWriterT,
  monadStateWriterT,
  monadTellWriterT,
  monadThrowWriterT,
  monadTransWriterT,
  monadWriterT,
  monadWriterWriterT,
  monoidWriterT,
  runWriterT,
  semigroupWriterT,
  writerT
};
