import * as Control$dMonad$dReader$dTrans from "../Control.Monad.Reader.Trans/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
const $BracketCondition = (tag, _1) => ({tag, _1});
const Completed = value0 => $BracketCondition("Completed", value0);
const Failed = value0 => $BracketCondition("Failed", value0);
const Killed = value0 => $BracketCondition("Killed", value0);
const uninterruptible = dict => dict.uninterruptible;
const suspend = dict => dict.suspend;
const never = dict => dict.never;
const monadForkAff = {
  suspend: Effect$dAff.suspendAff,
  fork: Effect$dAff.forkAff,
  join: Effect$dAff.joinFiber,
  Monad0: () => Effect$dAff.monadAff,
  Functor1: () => Effect$dAff.functorFiber
};
const monadKillAff = {kill: Effect$dAff.killFiber, MonadFork0: () => monadForkAff, MonadThrow1: () => Effect$dAff.monadThrowAff};
const monadBracketAff = {
  bracket: acquire => release => run => Effect$dAff.generalBracket(acquire)({
    completed: x => release($BracketCondition("Completed", x)),
    failed: x => release($BracketCondition("Failed", x)),
    killed: x => release($BracketCondition("Killed", x))
  })(run),
  uninterruptible: Effect$dAff.invincible,
  never: Effect$dAff.never,
  MonadKill0: () => monadKillAff,
  MonadError1: () => Effect$dAff.monadErrorAff
};
const kill = dict => dict.kill;
const join = dict => dict.join;
const fork = dict => dict.fork;
const monadForkReaderT = dictMonadFork => {
  const monadReaderT = Control$dMonad$dReader$dTrans.monadReaderT(dictMonadFork.Monad0());
  const Functor1 = dictMonadFork.Functor1();
  return {
    suspend: v => x => dictMonadFork.suspend(v(x)),
    fork: v => x => dictMonadFork.fork(v(x)),
    join: x => {
      const $0 = dictMonadFork.join(x);
      return v => $0;
    },
    Monad0: () => monadReaderT,
    Functor1: () => Functor1
  };
};
const monadKillReaderT = dictMonadKill => {
  const monadForkReaderT1 = monadForkReaderT(dictMonadKill.MonadFork0());
  const monadThrowReaderT = Control$dMonad$dReader$dTrans.monadThrowReaderT(dictMonadKill.MonadThrow1());
  return {
    kill: e => {
      const $0 = dictMonadKill.kill(e);
      return x => {
        const $1 = $0(x);
        return v => $1;
      };
    },
    MonadFork0: () => monadForkReaderT1,
    MonadThrow1: () => monadThrowReaderT
  };
};
const bracket = dict => dict.bracket;
const monadBracketReaderT = dictMonadBracket => {
  const monadKillReaderT1 = monadKillReaderT(dictMonadBracket.MonadKill0());
  const monadErrorReaderT = Control$dMonad$dReader$dTrans.monadErrorReaderT(dictMonadBracket.MonadError1());
  return {
    bracket: v => release => run => r => dictMonadBracket.bracket(v(r))(c => a => release(c)(a)(r))(a => run(a)(r)),
    uninterruptible: k => r => dictMonadBracket.uninterruptible(k(r)),
    never: (() => {
      const $0 = dictMonadBracket.never;
      return v => $0;
    })(),
    MonadKill0: () => monadKillReaderT1,
    MonadError1: () => monadErrorReaderT
  };
};
export {
  $BracketCondition,
  Completed,
  Failed,
  Killed,
  bracket,
  fork,
  join,
  kill,
  monadBracketAff,
  monadBracketReaderT,
  monadForkAff,
  monadForkReaderT,
  monadKillAff,
  monadKillReaderT,
  never,
  suspend,
  uninterruptible
};
