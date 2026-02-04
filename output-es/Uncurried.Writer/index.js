// | This modules defines the writer monad, `Writer`.
import * as Control$dMonad$dRec$dClass from "../Control.Monad.Rec.Class/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Uncurried$dWriterT from "../Uncurried.WriterT/index.js";
const writer = dictMonoid => x => (v, v1, more, lift, v2, done) => more(v3 => lift((() => {
  const $0 = x._1;
  const $1 = x._2;
  return v5 => done(undefined, $0, $1);
})()));
const runWriter = dictMonoid => Uncurried$dWriterT.runWriterT(dictMonoid)(Control$dMonad$dRec$dClass.monadRecIdentity);
const mapWriter = dictMonoid => dictMonoid1 => Uncurried$dWriterT.mapWriterT(dictMonoid)(dictMonoid1)(Control$dMonad$dRec$dClass.monadRecIdentity)(Data$dIdentity.functorIdentity);
const execWriter = dictMonoid => Uncurried$dWriterT.execWriterT(dictMonoid)(Control$dMonad$dRec$dClass.monadRecIdentity);
const evalWriter = dictMonoid => Uncurried$dWriterT.evalWriterT(dictMonoid)(Control$dMonad$dRec$dClass.monadRecIdentity);
export {evalWriter, execWriter, mapWriter, runWriter, writer};
