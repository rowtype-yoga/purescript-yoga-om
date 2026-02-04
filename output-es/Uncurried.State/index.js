// | This module defines the `State` monad.
import * as Control$dMonad$dRec$dClass from "../Control.Monad.Rec.Class/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Uncurried$dStateT from "../Uncurried.StateT/index.js";
const runStateT = /* #__PURE__ */ Uncurried$dStateT.runStateT(Control$dMonad$dRec$dClass.monadRecIdentity);
const mapStateT = /* #__PURE__ */ Uncurried$dStateT.mapStateT(Control$dMonad$dRec$dClass.monadRecIdentity)(Data$dIdentity.functorIdentity);
const execStateT = /* #__PURE__ */ Uncurried$dStateT.execStateT(Control$dMonad$dRec$dClass.monadRecIdentity);
const evalStateT = /* #__PURE__ */ Uncurried$dStateT.evalStateT(Control$dMonad$dRec$dClass.monadRecIdentity);
const withState = Uncurried$dStateT.withStateT;
const state = x => (v, state0, more, lift1, v1, done) => more(v2 => lift1((() => {
  const $0 = x(state0);
  const $1 = $0._1;
  const $2 = $0._2;
  return v4 => done($2, $1, undefined);
})()));
const runState = s => runStateT(s);
const mapState = f => mapStateT(f);
const execState = s => execStateT(s);
const evalState = s => evalStateT(s);
export {evalState, evalStateT, execState, execStateT, mapState, mapStateT, runState, runStateT, state, withState};
