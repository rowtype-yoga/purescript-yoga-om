// | This module defines the `RWSE` monad.
import * as $runtime from "../runtime.js";
import * as Control$dMonad$dRec$dClass from "../Control.Monad.Rec.Class/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Uncurried$dRWSET from "../Uncurried.RWSET/index.js";
const runRWSET = /* #__PURE__ */ Uncurried$dRWSET.runRWSET(Control$dMonad$dRec$dClass.monadRecIdentity);
const mapRWSET = /* #__PURE__ */ Uncurried$dRWSET.mapRWSET(Control$dMonad$dRec$dClass.monadRecIdentity)(Data$dIdentity.functorIdentity);
const execRWSET = /* #__PURE__ */ Uncurried$dRWSET.execRWSET(Control$dMonad$dRec$dClass.monadRecIdentity);
const evalRWSET = /* #__PURE__ */ Uncurried$dRWSET.evalRWSET(Control$dMonad$dRec$dClass.monadRecIdentity);
const withRWSE = Uncurried$dRWSET.withRWSET;
const rwse = dictMonoid => x => (environment, state0, more, lift, error, done) => more(v => lift((() => {
  const $0 = x(environment)(state0);
  const $1 = $0._2._1;
  const $2 = $0._1;
  const $3 = $0._2._2;
  return v2 => {
    if ($1.tag === "Left") { return error($2, $1._1, $3); }
    if ($1.tag === "Right") { return done($2, $1._1, $3); }
    $runtime.fail();
  };
})()));
const runRWSE = dictMonoid => r => s => runRWSET(r)(s);
const mapRWSE = f => mapRWSET(f);
const execRWSE = dictMonoid => r => s => execRWSET(r)(s);
const evalRWSE = dictMonoid => r => s => evalRWSET(r)(s);
export {evalRWSE, evalRWSET, execRWSE, execRWSET, mapRWSE, mapRWSET, runRWSE, runRWSET, rwse, withRWSE};
