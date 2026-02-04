import * as $runtime from "../runtime.js";
import * as Control$dMonad$dState$dTrans from "../Control.Monad.State.Trans/index.js";
import * as Control$dMonad$dWriter$dTrans from "../Control.Monad.Writer.Trans/index.js";
import * as Data$dArray from "../Data.Array/index.js";
import * as Data$dEq from "../Data.Eq/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Data$dMap$dInternal from "../Data.Map.Internal/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dMonoid from "../Data.Monoid/index.js";
import * as Data$dOrd from "../Data.Ord/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import * as Test$dSpec$dReporter$dBase from "../Test.Spec.Reporter.Base/index.js";
import * as Test$dSpec$dStyle from "../Test.Spec.Style/index.js";
import * as Test$dSpec$dSummary from "../Test.Spec.Summary/index.js";
import * as Test$dSpec$dTree from "../Test.Spec.Tree/index.js";
const $PrintAction = (tag, _1, _2) => ({tag, _1, _2});
const eq = /* #__PURE__ */ (() => Data$dEq.eqArrayImpl(Test$dSpec$dTree.pathItemEq.eq))();
const intercalate = sep => xs => Data$dFoldable.foldlArray(v => v1 => {
  if (v.init) { return {init: false, acc: v1}; }
  return {init: false, acc: v.acc + sep + v1};
})({init: true, acc: ""})(xs).acc;
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
const PrintTest = value0 => value1 => $PrintAction("PrintTest", value0, value1);
const PrintPending = value0 => $PrintAction("PrintPending", value0);
const printSummary = dictMonadWriter => {
  const Monad1 = dictMonadWriter.MonadTell1().Monad1();
  const $0 = Monad1.Bind1();
  return x => {
    const $1 = Test$dSpec$dSummary.summarize(x);
    const $2 = $1.failed;
    const $3 = $1.passed;
    const $4 = $1.pending;
    return $0.bind(dictMonadWriter.MonadTell1().tell("\n"))(() => $0.bind(dictMonadWriter.MonadTell1().tell(Test$dSpec$dStyle.styled(Test$dSpec$dStyle.bold)("Summary") + "\n"))(() => $0.bind((() => {
      const total = $3 + $2 | 0;
      return dictMonadWriter.MonadTell1().tell(Test$dSpec$dStyle.styled($2 > 0 ? Test$dSpec$dStyle.red : Test$dSpec$dStyle.dim)(Data$dShow.showIntImpl($3) + "/" + Data$dShow.showIntImpl(total) + " " + (total === 1
        ? "test"
        : "tests") + " passed") + "\n");
    })())(() => $0.bind($4 > 0
      ? dictMonadWriter.MonadTell1().tell(Test$dSpec$dStyle.styled(Test$dSpec$dStyle.yellow)(Data$dShow.showIntImpl($4) + " " + ($4 === 1 ? "test" : "tests") + " pending") + "\n")
      : Monad1.Applicative0().pure())(() => dictMonadWriter.MonadTell1().tell("\n")))));
  };
};
const printSummary1 = /* #__PURE__ */ printSummary(monadWriterStateT);
const print = dictMonadState => {
  const Monad0 = dictMonadState.Monad0();
  const Bind1 = Monad0.Bind1();
  const get1 = dictMonadState.state(s => Data$dTuple.$Tuple(s, s));
  return dictMonadWriter => path => a => Bind1.bind(get1)(s => Bind1.bind(s.lastPrintedSuitePath.tag === "Just" && eq(s.lastPrintedSuitePath._1)(path)
    ? Monad0.Applicative0().pure()
    : Bind1.bind(dictMonadWriter.MonadTell1().tell(Test$dSpec$dStyle.styled([...Test$dSpec$dStyle.bold, ...Test$dSpec$dStyle.magenta])(intercalate(" » ")(Data$dArray.mapMaybe(x => x.name)(path))) + "\n"))(() => {
        const $0 = {...s, lastPrintedSuitePath: Data$dMaybe.$Maybe("Just", path)};
        return dictMonadState.state(v => Data$dTuple.$Tuple(undefined, $0));
      }))(() => {
    if (a.tag === "PrintTest") {
      if (a._2.tag === "Success") {
        return dictMonadWriter.MonadTell1().tell("  " + Test$dSpec$dStyle.styled(Test$dSpec$dStyle.green)("✓︎ ") + Test$dSpec$dStyle.styled(Test$dSpec$dStyle.dim)(a._1) + "\n");
      }
      if (a._2.tag === "Failure") {
        const $0 = a._2._1;
        return Bind1.bind(dictMonadWriter.MonadTell1().tell("  " + Test$dSpec$dStyle.styled(Test$dSpec$dStyle.red)("✗ " + a._1 + ":") + "\n"))(() => Bind1.bind(dictMonadWriter.MonadTell1().tell("\n"))(() => dictMonadWriter.MonadTell1().tell("  " + Test$dSpec$dStyle.styled(Test$dSpec$dStyle.red)(Effect$dException.message($0)) + "\n")));
      }
      $runtime.fail();
    }
    if (a.tag === "PrintPending") { return dictMonadWriter.MonadTell1().tell("  " + Test$dSpec$dStyle.styled(Test$dSpec$dStyle.cyan)("~ " + a._1) + "\n"); }
    $runtime.fail();
  }));
};
const print1 = /* #__PURE__ */ print(monadStateStateT)(monadWriterStateT);
const initialState = {runningItems: Data$dMap$dInternal.Leaf, lastPrintedSuitePath: Data$dMaybe.Nothing};
const consoleReporter = /* #__PURE__ */ Test$dSpec$dReporter$dBase.defaultReporter(initialState)(/* #__PURE__ */ Test$dSpec$dReporter$dBase.defaultUpdate({
  getRunningItems: v => v.runningItems,
  putRunningItems: b => a => ({...a, runningItems: b}),
  printFinishedItem: path => v => {
    if (v.tag === "RunningTest") {
      if (v._2.tag === "Just") { return print1(path)($PrintAction("PrintTest", v._1, v._2._1)); }
      return applicativeStateT.pure();
    }
    if (v.tag === "RunningPending") { return print1(path)($PrintAction("PrintPending", v._1)); }
    return applicativeStateT.pure();
  },
  update: v => {
    if (v.tag === "TestEnd") {
      const $0 = v._2;
      const $1 = v._1;
      const $2 = v._3;
      return bind($$get)(v1 => {
        const $3 = lookup($1)(v1.runningItems);
        const $4 = print1($1)($PrintAction("PrintTest", $0, $2));
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
        const $2 = print1($1)($PrintAction("PrintPending", $0));
        if (v1.runningItems.tag === "Leaf") { return $2; }
        return applicativeStateT.pure();
      });
    }
    if (v.tag === "End") { return printSummary1(v._1); }
    return applicativeStateT.pure();
  }
}));
export {
  $PrintAction,
  PrintPending,
  PrintTest,
  applicativeStateT,
  bind,
  consoleReporter,
  eq,
  $$get as get,
  initialState,
  intercalate,
  lookup,
  monadStateStateT,
  monadWriterStateT,
  monadWriterT,
  print,
  print1,
  printSummary,
  printSummary1
};
