import * as $runtime from "../runtime.js";
import * as Control$dMonad$dState$dTrans from "../Control.Monad.State.Trans/index.js";
import * as Control$dMonad$dWriter$dTrans from "../Control.Monad.Writer.Trans/index.js";
import * as Data$dFunctor from "../Data.Functor/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Data$dMonoid from "../Data.Monoid/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dString$dCommon from "../Data.String.Common/index.js";
import * as Data$dString$dRegex from "../Data.String.Regex/index.js";
import * as Data$dString$dRegex$dUnsafe from "../Data.String.Regex.Unsafe/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import * as Test$dSpec$dReporter$dBase from "../Test.Spec.Reporter.Base/index.js";
import * as Test$dSpec$dSummary from "../Test.Spec.Summary/index.js";
const tellLn = /* #__PURE__ */ (() => {
  const $0 = Control$dMonad$dState$dTrans.monadWriterStateT(Control$dMonad$dWriter$dTrans.monadWriterWriterT(Data$dMonoid.monoidString)(Data$dIdentity.monadIdentity));
  return l => $0.MonadTell1().tell(l + "\n");
})();
const monadWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadWriterT(Data$dMonoid.monoidString)(Data$dIdentity.monadIdentity);
const bindStateT = /* #__PURE__ */ Control$dMonad$dState$dTrans.bindStateT(monadWriterT);
const monadStateStateT = /* #__PURE__ */ Control$dMonad$dState$dTrans.monadStateStateT(monadWriterT);
const $$get = /* #__PURE__ */ (() => monadStateStateT.state(s => Data$dTuple.$Tuple(s, s)))();
const pure = /* #__PURE__ */ (() => Control$dMonad$dState$dTrans.applicativeStateT(monadWriterT).pure)();
const escTitle = /* #__PURE__ */ Data$dString$dRegex.replace(/* #__PURE__ */ Data$dString$dRegex$dUnsafe.unsafeRegex("#")(/* #__PURE__ */ Data$dString$dRegex.parseFlags("g")))("");
const escMsg = /* #__PURE__ */ Data$dString$dRegex.replace(/* #__PURE__ */ Data$dString$dRegex$dUnsafe.unsafeRegex("^")(/* #__PURE__ */ Data$dString$dRegex.parseFlags("gm")))("  ");
const tapReporter = /* #__PURE__ */ Test$dSpec$dReporter$dBase.defaultReporter(1)(v => {
  if (v.tag === "Start") { return tellLn("1.." + Data$dShow.showIntImpl(v._1)); }
  if (v.tag === "Pending") {
    const $0 = v._2;
    return bindStateT.bind($$get)(n => bindStateT.bind(tellLn("ok " + Data$dShow.showIntImpl(n) + " " + escTitle($0) + " # SKIP -"))(() => monadStateStateT.state(s => Data$dTuple.$Tuple(
      undefined,
      s + 1 | 0
    ))));
  }
  if (v.tag === "TestEnd") {
    if (v._3.tag === "Success") {
      const $0 = v._2;
      return bindStateT.bind($$get)(n => bindStateT.bind(tellLn("ok " + Data$dShow.showIntImpl(n) + " " + escTitle($0)))(() => monadStateStateT.state(s => Data$dTuple.$Tuple(
        undefined,
        s + 1 | 0
      ))));
    }
    if (v._3.tag === "Failure") {
      const $0 = v._3._1;
      const $1 = v._2;
      return bindStateT.bind($$get)(n => bindStateT.bind(tellLn("not ok " + Data$dShow.showIntImpl(n) + " " + escTitle($1)))(() => bindStateT.bind(tellLn(escMsg(Effect$dException.message($0))))(() => bindStateT.bind((() => {
        const v1 = Effect$dException.stack($0);
        if (v1.tag === "Nothing") { return pure(); }
        if (v1.tag === "Just") { return tellLn(Data$dString$dCommon.joinWith("\n")(Data$dFunctor.arrayMap($2 => "    " + $2)(Data$dString$dCommon.split("\n")(v1._1)))); }
        $runtime.fail();
      })())(() => monadStateStateT.state(s => Data$dTuple.$Tuple(undefined, s + 1 | 0))))));
    }
    return pure();
  }
  if (v.tag === "End") {
    const v1 = Test$dSpec$dSummary.summarize(v._1);
    const $0 = v1.failed;
    const $1 = v1.passed;
    const $2 = v1.pending;
    return bindStateT.bind(tellLn("# tests " + Data$dShow.showIntImpl(($0 + $1 | 0) + $2 | 0)))(() => bindStateT.bind(tellLn("# pass " + Data$dShow.showIntImpl($1 + $2 | 0)))(() => tellLn("# fail " + Data$dShow.showIntImpl($0))));
  }
  return pure();
});
export {bindStateT, escMsg, escTitle, $$get as get, monadStateStateT, monadWriterT, pure, tapReporter, tellLn};
