// | This module defines the `Reader` monad.
import * as Control$dMonad$dRec$dClass from "../Control.Monad.Rec.Class/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Uncurried$dReaderT from "../Uncurried.ReaderT/index.js";
const runReaderT = /* #__PURE__ */ Uncurried$dReaderT.runReaderT(Control$dMonad$dRec$dClass.monadRecIdentity);
const withReader = Uncurried$dReaderT.withReaderT;
const runReader = r => runReaderT(r);
const reader = x => (environment, v, more, lift1, v1, done) => more(v2 => lift1((() => {
  const $0 = x(environment);
  return v3 => done(undefined, $0, undefined);
})()));
const mapReader = /* #__PURE__ */ Uncurried$dReaderT.mapReaderT(Control$dMonad$dRec$dClass.monadRecIdentity)(Data$dIdentity.functorIdentity);
export {mapReader, reader, runReader, runReaderT, withReader};
