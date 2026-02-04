import * as $runtime from "../runtime.js";
import * as Control$dMonad$dState$dTrans from "../Control.Monad.State.Trans/index.js";
import * as Control$dMonad$dWriter$dTrans from "../Control.Monad.Writer.Trans/index.js";
import * as Data$dArray from "../Data.Array/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Data$dInt from "../Data.Int/index.js";
import * as Data$dMap$dInternal from "../Data.Map.Internal/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dMonoid from "../Data.Monoid/index.js";
import * as Data$dNumber from "../Data.Number/index.js";
import * as Data$dOrd from "../Data.Ord/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dString$dCodeUnits from "../Data.String.CodeUnits/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Test$dSpec$dReporter$dBase from "../Test.Spec.Reporter.Base/index.js";
import * as Test$dSpec$dStyle from "../Test.Spec.Style/index.js";
import * as Test$dSpec$dTree from "../Test.Spec.Tree/index.js";
const $PrintAction = (tag, _1, _2) => ({tag, _1, _2});
const monadWriterT = /* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadWriterT(Data$dMonoid.monoidString)(Data$dIdentity.monadIdentity);
const monadStateStateT = /* #__PURE__ */ Control$dMonad$dState$dTrans.monadStateStateT(monadWriterT);
const monadWriterStateT = /* #__PURE__ */ Control$dMonad$dState$dTrans.monadWriterStateT(/* #__PURE__ */ Control$dMonad$dWriter$dTrans.monadWriterWriterT(Data$dMonoid.monoidString)(Data$dIdentity.monadIdentity));
const applicativeStateT = /* #__PURE__ */ Control$dMonad$dState$dTrans.applicativeStateT(monadWriterT);
const bind = /* #__PURE__ */ (() => Control$dMonad$dState$dTrans.bindStateT(monadWriterT).bind)();
const $$get = /* #__PURE__ */ (() => monadStateStateT.state(s => Data$dTuple.$Tuple(s, s)))();
const lookup = /* #__PURE__ */ (() => {
  const $0 = Data$dOrd.ordArray(Test$dSpec$dTree.pathItemOrd);
  return k => {
    const go = go$a0$copy => {
      let go$a0 = go$a0$copy, go$c = true, go$r;
      while (go$c) {
        const v = go$a0;
        if (v.tag === "Leaf") {
          go$c = false;
          go$r = Data$dMaybe.Nothing;
          continue;
        }
        if (v.tag === "Node") {
          const v1 = $0.compare(k)(v._3);
          if (v1 === "LT") {
            go$a0 = v._5;
            continue;
          }
          if (v1 === "GT") {
            go$a0 = v._6;
            continue;
          }
          if (v1 === "EQ") {
            go$c = false;
            go$r = Data$dMaybe.$Maybe("Just", v._4);
            continue;
          }
        }
        $runtime.fail();
      }
      return go$r;
    };
    return go;
  };
})();
const defaultSummary = /* #__PURE__ */ Test$dSpec$dReporter$dBase.defaultSummary(monadWriterStateT);
const PrintSuite = value0 => $PrintAction("PrintSuite", value0);
const PrintTest = value0 => value1 => $PrintAction("PrintTest", value0, value1);
const PrintPending = value0 => $PrintAction("PrintPending", value0);
const print = dictMonadState => dictMonadWriter => path => v => {
  if (v.tag === "PrintSuite") { return dictMonadWriter.MonadTell1().tell(Data$dString$dCodeUnits.fromCharArray(Data$dArray.replicateImpl(path.length, " ")) + v._1 + "\n"); }
  if (v.tag === "PrintTest") {
    if (v._2.tag === "Success") {
      return dictMonadWriter.MonadTell1().tell(Data$dString$dCodeUnits.fromCharArray(Data$dArray.replicateImpl(path.length, " ")) + Test$dSpec$dStyle.styled(Test$dSpec$dStyle.green)("✓︎ ") + Test$dSpec$dStyle.styled(Test$dSpec$dStyle.dim)(v._1) + (v._2._1 === "Fast"
        ? ""
        : Test$dSpec$dStyle.styled((() => {
            if (v._2._1 === "Fast") { return Test$dSpec$dStyle.dim; }
            if (v._2._1 === "Medium") { return Test$dSpec$dStyle.yellow; }
            if (v._2._1 === "Slow") { return Test$dSpec$dStyle.red; }
            $runtime.fail();
          })())(" (" + Data$dShow.showIntImpl(Data$dInt.unsafeClamp(Data$dNumber.round(v._2._2))) + "ms)")) + "\n");
    }
    if (v._2.tag === "Failure") {
      const $0 = v._1;
      return dictMonadState.Monad0().Bind1().bind(dictMonadState.state(s => {
        const s$p = {...s, numFailures: s.numFailures + 1 | 0};
        return Data$dTuple.$Tuple(s$p, s$p);
      }))(v1 => dictMonadWriter.MonadTell1().tell(Data$dString$dCodeUnits.fromCharArray(Data$dArray.replicateImpl(path.length, " ")) + Test$dSpec$dStyle.styled(Test$dSpec$dStyle.red)(Data$dShow.showIntImpl(v1.numFailures) + ") " + $0) + "\n"));
    }
    $runtime.fail();
  }
  if (v.tag === "PrintPending") {
    return dictMonadWriter.MonadTell1().tell(Data$dString$dCodeUnits.fromCharArray(Data$dArray.replicateImpl(path.length, " ")) + Test$dSpec$dStyle.styled(Test$dSpec$dStyle.cyan)("- " + v._1) + "\n");
  }
  $runtime.fail();
};
const initialState = {runningItems: Data$dMap$dInternal.Leaf, numFailures: 0};
const specReporter = /* #__PURE__ */ Test$dSpec$dReporter$dBase.defaultReporter(initialState)(/* #__PURE__ */ Test$dSpec$dReporter$dBase.defaultUpdate({
  getRunningItems: v => v.runningItems,
  putRunningItems: b => a => ({...a, runningItems: b}),
  printFinishedItem: path => v => {
    if (v.tag === "RunningTest") {
      if (v._2.tag === "Just") { return print(monadStateStateT)(monadWriterStateT)(path)($PrintAction("PrintTest", v._1, v._2._1)); }
      return applicativeStateT.pure();
    }
    if (v.tag === "RunningPending") { return print(monadStateStateT)(monadWriterStateT)(path)($PrintAction("PrintPending", v._1)); }
    if (v.tag === "RunningSuite" && v._2) { return print(monadStateStateT)(monadWriterStateT)(path)($PrintAction("PrintSuite", v._1)); }
    return applicativeStateT.pure();
  },
  update: v => {
    if (v.tag === "Suite") {
      if (v._1 === "Sequential") { return print(monadStateStateT)(monadWriterStateT)(v._2)($PrintAction("PrintSuite", v._3)); }
      return applicativeStateT.pure();
    }
    if (v.tag === "TestEnd") {
      const $0 = v._2;
      const $1 = v._1;
      const $2 = v._3;
      return bind($$get)(v1 => {
        const $3 = lookup($1)(v1.runningItems);
        const $4 = print(monadStateStateT)(monadWriterStateT)($1)($PrintAction("PrintTest", $0, $2));
        if (
          (() => {
            if ($3.tag === "Nothing") { return true; }
            if ($3.tag === "Just") { return false; }
            $runtime.fail();
          })()
        ) {
          return $4;
        }
        return applicativeStateT.pure();
      });
    }
    if (v.tag === "Pending") {
      const $0 = v._2;
      const $1 = v._1;
      return bind($$get)(v1 => {
        const $2 = print(monadStateStateT)(monadWriterStateT)($1)($PrintAction("PrintPending", $0));
        if (v1.runningItems.tag === "Leaf") { return $2; }
        return applicativeStateT.pure();
      });
    }
    if (v.tag === "End") { return defaultSummary(v._1); }
    return applicativeStateT.pure();
  }
}));
export {
  $PrintAction,
  PrintPending,
  PrintSuite,
  PrintTest,
  applicativeStateT,
  bind,
  defaultSummary,
  $$get as get,
  initialState,
  lookup,
  monadStateStateT,
  monadWriterStateT,
  monadWriterT,
  print,
  specReporter
};
