// | This module defines the reader-writer-state-error monad
// | transformer, `RWSET`.
import * as $runtime from "../runtime.js";
import * as Control$dMonad$dRec$dClass from "../Control.Monad.Rec.Class/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
const $RunRWSET = (tag, _1, _2, _3) => ({tag, _1, _2, _3});
const More = value0 => $RunRWSET("More", value0);
const Lift = value0 => $RunRWSET("Lift", value0);
const Stop = value0 => value1 => value2 => $RunRWSET("Stop", value0, value1, value2);
const RWSET = x => x;
const monadTransRWSET = dictMonoid => {
  const mempty = dictMonoid.mempty;
  return {lift: dictMonad => m => (v, state, v1, lift$p, v2, done) => lift$p(dictMonad.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, mempty))(m))};
};
const lazyRWSET = dictMonoid => ({defer: f => (environment, state0, more, lift$p, error, done) => f()(environment, state0, more, lift$p, error, done)});
const functorRWSET = {
  map: f => v => (environment, state0, more, lift$p, error, done) => more(v1 => v(environment, state0, more, lift$p, error, (state1, a, w) => more(v2 => done(state1, f(a), w))))
};
const applyRWSET = dictMonoid => (
  {
    apply: v => v1 => (environment, state0, more, lift$p, error, done) => more(v2 => v(
      environment,
      state0,
      more,
      lift$p,
      error,
      (state1, f, w0) => more(v3 => v1(environment, state1, more, lift$p, error, (state2, a, w1) => more(v4 => done(state2, f(a), dictMonoid.Semigroup0().append(w0)(w1)))))
    )),
    Functor0: () => functorRWSET
  }
);
const bindRWSET = dictMonoid => {
  const applyRWSET1 = applyRWSET(dictMonoid);
  return {
    bind: v => f => (environment, state0, more, lift$p, error, done) => more(v1 => v(
      environment,
      state0,
      more,
      lift$p,
      error,
      (state1, x, w0) => more(v2 => f(x)(environment, state1, more, lift$p, error, (state2, y, w1) => more(v4 => done(state2, y, dictMonoid.Semigroup0().append(w0)(w1)))))
    )),
    Apply0: () => applyRWSET1
  };
};
const semigroupRWSET = dictMonoid => {
  const $0 = applyRWSET(dictMonoid);
  return dictSemigroup => (
    {
      append: (() => {
        const $1 = dictSemigroup.append;
        return a => b => $0.apply($0.Functor0().map($1)(a))(b);
      })()
    }
  );
};
const applicativeRWSET = dictMonoid => {
  const mempty = dictMonoid.mempty;
  const applyRWSET1 = applyRWSET(dictMonoid);
  return {pure: a => (v, state, v1, v2, v3, done) => done(state, a, mempty), Apply0: () => applyRWSET1};
};
const monadRWSET = dictMonoid => {
  const applicativeRWSET1 = applicativeRWSET(dictMonoid);
  const bindRWSET1 = bindRWSET(dictMonoid);
  return {Applicative0: () => applicativeRWSET1, Bind1: () => bindRWSET1};
};
const monadAskRWSET = dictMonoid => {
  const mempty = dictMonoid.mempty;
  const monadRWSET1 = monadRWSET(dictMonoid);
  return {ask: (environment, state, v, v1, v2, done) => done(state, environment, mempty), Monad0: () => monadRWSET1};
};
const monadReaderRWSET = dictMonoid => {
  const monadAskRWSET1 = monadAskRWSET(dictMonoid);
  return {
    local: f => v => (environment, state0, more, lift$p, error, done) => more(v1 => v(f(environment), state0, more, lift$p, error, (state1, a, w) => more(v2 => done(state1, a, w)))),
    MonadAsk0: () => monadAskRWSET1
  };
};
const monadEffectRWSET = dictMonoid => {
  const mempty = dictMonoid.mempty;
  const monadRWSET1 = monadRWSET(dictMonoid);
  return dictMonadEffect => (
    {
      liftEffect: (() => {
        const $0 = dictMonadEffect.Monad0();
        return x => {
          const $1 = dictMonadEffect.liftEffect(x);
          return (v, state, v1, lift$p, v2, done) => lift$p($0.Bind1().Apply0().Functor0().map(a => v3 => done(state, a, mempty))($1));
        };
      })(),
      Monad0: () => monadRWSET1
    }
  );
};
const monadRecRWSET = dictMonoid => {
  const $0 = dictMonoid.Semigroup0();
  const mempty = dictMonoid.mempty;
  const monadRWSET1 = monadRWSET(dictMonoid);
  return {
    tailRecM: f => a0 => (environment, state0, more, lift, error, done) => {
      const loop = (state1, a1, w1) => gas => f(a1)(
        environment,
        state1,
        more,
        lift,
        error,
        (state2, s, w2) => {
          if (s.tag === "Loop") {
            if (gas === 0) { return more(v1 => loop(state2, s._1, $0.append(w1)(w2))(30)); }
            return loop(state2, s._1, $0.append(w1)(w2))(gas - 1 | 0);
          }
          if (s.tag === "Done") { return done(state2, s._1, $0.append(w1)(w2)); }
          $runtime.fail();
        }
      );
      return loop(state0, a0, mempty)(30);
    },
    Monad0: () => monadRWSET1
  };
};
const monadStateRWSET = dictMonoid => {
  const mempty = dictMonoid.mempty;
  const monadRWSET1 = monadRWSET(dictMonoid);
  return {
    state: f => (v, state0, v1, v2, v3, done) => {
      const v4 = f(state0);
      return done(v4._2, v4._1, mempty);
    },
    Monad0: () => monadRWSET1
  };
};
const monadTellRWSET = dictMonoid => {
  const Semigroup0 = dictMonoid.Semigroup0();
  const monadRWSET1 = monadRWSET(dictMonoid);
  return {tell: w => (v, state, v1, v2, v3, done) => done(state, undefined, w), Semigroup0: () => Semigroup0, Monad1: () => monadRWSET1};
};
const monadWriterRWSET = dictMonoid => {
  const monadTellRWSET1 = monadTellRWSET(dictMonoid);
  return {
    listen: v => (environment, state0, more, lift$p, error, done) => more(v1 => v(
      environment,
      state0,
      more,
      lift$p,
      error,
      (state1, a, w) => more(v2 => done(state1, Data$dTuple.$Tuple(a, w), w))
    )),
    pass: v => (environment, state0, more, lift$p, error, done) => more(v1 => v(
      environment,
      state0,
      more,
      lift$p,
      error,
      (state1, v2, $0) => {
        const $1 = v2._1;
        return more(v3 => done(state1, $1, v2._2($0)));
      }
    )),
    Monoid0: () => dictMonoid,
    MonadTell1: () => monadTellRWSET1
  };
};
const monadThrowRWSET = dictMonoid => {
  const mempty = dictMonoid.mempty;
  const monadRWSET1 = monadRWSET(dictMonoid);
  return {throwError: e => (v, state, v1, v2, error, v3) => error(state, e, mempty), Monad0: () => monadRWSET1};
};
const monadErrorRWSET = dictMonoid => {
  const monadThrowRWSET1 = monadThrowRWSET(dictMonoid);
  return {
    catchError: v => f => (environment, state0, more, lift$p, error, done) => more(v1 => v(
      environment,
      state0,
      more,
      lift$p,
      (state1, e, w0) => more(v2 => f(e)(environment, state1, more, lift$p, error, (state2, b, w1) => done(state2, b, dictMonoid.Semigroup0().append(w0)(w1)))),
      done
    )),
    MonadThrow0: () => monadThrowRWSET1
  };
};
const monoidRWSET = dictMonoid => {
  const semigroupRWSET1 = semigroupRWSET(dictMonoid);
  return dictMonoid1 => {
    const semigroupRWSET2 = semigroupRWSET1(dictMonoid1.Semigroup0());
    return {mempty: applicativeRWSET(dictMonoid).pure(dictMonoid1.mempty), Semigroup0: () => semigroupRWSET2};
  };
};
const altRWSET = dictMonoid => (
  {
    alt: v => v1 => (environment, state0, more, lift, error, done) => more(v2 => v(
      environment,
      state0,
      more,
      lift,
      (state1, v3, v4) => more(v5 => v1(environment, state1, more, lift, error, done)),
      done
    )),
    Functor0: () => functorRWSET
  }
);
const withRWSET = f => v => (environment1, state1, more, lift$p, error, done) => {
  const v1 = f(environment1)(state1);
  return v(v1._1, v1._2, more, lift$p, error, done);
};
const rwseT = dictFunctor => dictMonoid => f => (environment, state0, more, lift, error, done) => more(v => lift(dictFunctor.map(v1 => {
  const $0 = v1._2._1;
  const $1 = v1._1;
  const $2 = v1._2._2;
  return v2 => {
    if ($0.tag === "Left") { return error($1, $0._1, $2); }
    if ($0.tag === "Right") { return done($1, $0._1, $2); }
    $runtime.fail();
  };
})(f(environment)(state0))));
const runRWSET = dictMonadRec => {
  const Monad0 = dictMonadRec.Monad0();
  return r => s => v => {
    const go = go$a0$copy => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const step = go$a0;
        const v1 = step();
        if (v1.tag === "More") {
          go$a0 = v1._1;
          continue;
        }
        if (v1.tag === "Lift") {
          go$c = false;
          go$r = Monad0.Bind1().Apply0().Functor0().map(Control$dMonad$dRec$dClass.Loop)(v1._1);
          continue;
        }
        if (v1.tag === "Stop") {
          go$c = false;
          go$r = Monad0.Applicative0().pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dTuple.$Tuple(v1._1, Data$dTuple.$Tuple(v1._2, v1._3))));
          continue;
        }
        $runtime.fail();
      }
      return go$r;
    };
    return dictMonadRec.tailRecM(go)(v1 => v(
      r,
      s,
      More,
      Lift,
      (s$p, e, w) => $RunRWSET("Stop", s$p, Data$dEither.$Either("Left", e), w),
      (s$p, a, w) => $RunRWSET("Stop", s$p, Data$dEither.$Either("Right", a), w)
    ));
  };
};
const mapRWSET = dictMonadRec => {
  const runRWSET1 = runRWSET(dictMonadRec);
  return dictFunctor => f => k => (environment, state, v, lift$p, error, done) => lift$p(dictFunctor.map(v1 => {
    const $0 = v1._2._1;
    const $1 = v1._1;
    const $2 = v1._2._2;
    return v2 => {
      if ($0.tag === "Left") { return error($1, $0._1, $2); }
      if ($0.tag === "Right") { return done($1, $0._1, $2); }
      $runtime.fail();
    };
  })(f(runRWSET1(environment)(state)(k))));
};
const hoistRWSET = f => v => (environment, state, more, lift$p, error, done) => v(environment, state, more, x => lift$p(f(x)), error, done);
const execRWSET = dictMonadRec => {
  const runRWSET1 = runRWSET(dictMonadRec);
  return r => s => k => dictMonadRec.Monad0().Bind1().Apply0().Functor0().map(m => Data$dTuple.$Tuple(m._1, m._2._2))(runRWSET1(r)(s)(k));
};
const evalRWSET = dictMonadRec => {
  const runRWSET1 = runRWSET(dictMonadRec);
  return r => s => k => dictMonadRec.Monad0().Bind1().Apply0().Functor0().map(Data$dTuple.snd)(runRWSET1(r)(s)(k));
};
export {
  $RunRWSET,
  Lift,
  More,
  RWSET,
  Stop,
  altRWSET,
  applicativeRWSET,
  applyRWSET,
  bindRWSET,
  evalRWSET,
  execRWSET,
  functorRWSET,
  hoistRWSET,
  lazyRWSET,
  mapRWSET,
  monadAskRWSET,
  monadEffectRWSET,
  monadErrorRWSET,
  monadRWSET,
  monadReaderRWSET,
  monadRecRWSET,
  monadStateRWSET,
  monadTellRWSET,
  monadThrowRWSET,
  monadTransRWSET,
  monadWriterRWSET,
  monoidRWSET,
  runRWSET,
  rwseT,
  semigroupRWSET,
  withRWSET
};
