import * as $runtime from "../runtime.js";
import * as Control$dApply from "../Control.Apply/index.js";
import * as Control$dMonad$dError$dClass from "../Control.Monad.Error.Class/index.js";
import * as Data$dArray from "../Data.Array/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dFunction from "../Data.Function/index.js";
import * as Data$dFunctor from "../Data.Functor/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Data$dInt from "../Data.Int/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dNumber from "../Data.Number/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dTraversable from "../Data.Traversable/index.js";
import * as Effect$dAVar from "../Effect.AVar/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Effect$dAff$dAVar from "../Effect.Aff.AVar/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import * as Effect$dNow from "../Effect.Now/index.js";
import * as Pipes from "../Pipes/index.js";
import * as Pipes$dCore from "../Pipes.Core/index.js";
import * as Pipes$dInternal from "../Pipes.Internal/index.js";
import * as Test$dSpec from "../Test.Spec/index.js";
import * as Test$dSpec$dConfig from "../Test.Spec.Config/index.js";
import * as Test$dSpec$dConsole from "../Test.Spec.Console/index.js";
import * as Test$dSpec$dResult from "../Test.Spec.Result/index.js";
import * as Test$dSpec$dRunner$dEvent from "../Test.Spec.Runner.Event/index.js";
import * as Test$dSpec$dSpeed from "../Test.Spec.Speed/index.js";
import * as Test$dSpec$dStyle from "../Test.Spec.Style/index.js";
import * as Test$dSpec$dSummary from "../Test.Spec.Summary/index.js";
import * as Test$dSpec$dTree from "../Test.Spec.Tree/index.js";
import {exit} from "./foreign.js";
const bindProxy = /* #__PURE__ */ Pipes$dInternal.bindProxy(Effect$dAff.monadAff);
const applyProxy = /* #__PURE__ */ Pipes$dInternal.applyProxy(Effect$dAff.monadAff);
const applicativeProxy = /* #__PURE__ */ (() => {
  const applyProxy1 = Pipes$dInternal.applyProxy(Effect$dAff.monadAff);
  return {pure: Pipes$dInternal.Pure, Apply0: () => applyProxy1};
})();
const parTraverse = dictTraversable => {
  const traverse = dictTraversable.traverse(Effect$dAff.applicativeParAff);
  return f => {
    const $0 = traverse(x => f(x));
    return x => Effect$dAff._sequential($0(x));
  };
};
const runEffectRec = /* #__PURE__ */ Pipes$dCore.runEffectRec(Effect$dAff.monadRecAff);
const $$try = /* #__PURE__ */ Control$dMonad$dError$dClass.try(Effect$dAff.monadErrorAff);
const identity = x => x;
const liftEffect1 = /* #__PURE__ */ (() => Pipes$dInternal.proxyMonadEffect(Effect$dAff.monadEffectAff).liftEffect)();
const map = /* #__PURE__ */ (() => Pipes$dInternal.functorProxy(Effect$dAff.monadAff).map)();
const $$for = /* #__PURE__ */ (() => {
  const traverse2 = Data$dTraversable.traversableArray.traverse(applicativeProxy);
  return x => f => traverse2(f)(x);
})();
const runEffect = /* #__PURE__ */ Pipes$dCore.runEffect(Effect$dAff.monadAff);
const mergeProducers = dictTraversable => {
  const parTraverse1 = parTraverse(dictTraversable);
  return ps => bindProxy.bind(Pipes$dInternal.monadTransProxy.lift(Effect$dAff.monadAff)(Effect$dAff$dAVar.empty))($$var => bindProxy.bind(Pipes$dInternal.monadTransProxy.lift(Effect$dAff.monadAff)(Effect$dAff.forkAff(Effect$dAff._bind(parTraverse1(p => runEffectRec(Pipes$dCore.composeResponse(Effect$dAff.monadAff)(p)(i => applyProxy.apply(applyProxy.Functor0().map(v => Control$dApply.identity)(Pipes$dInternal.monadTransProxy.lift(Effect$dAff.monadAff)(Effect$dAff$dAVar.put(i)($$var))))(applicativeProxy.pure()))))(ps))(x => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dAVar._killVar(
    Effect$dAVar.ffiUtil,
    Effect$dException.error("finished"),
    $$var
  )))(() => Effect$dAff._pure(x))))))(fib => {
    const loop$lazy = $runtime.binding(() => bindProxy.bind(Pipes$dInternal.monadTransProxy.lift(Effect$dAff.monadAff)($$try(Effect$dAff$dAVar.take($$var))))(res => {
      if (res.tag === "Left") { return Pipes$dInternal.monadTransProxy.lift(Effect$dAff.monadAff)(Effect$dAff.joinFiber(fib)); }
      if (res.tag === "Right") { return bindProxy.bind(Pipes$dInternal.$$$Proxy("Respond", res._1, Pipes$dInternal.Pure))(() => loop$lazy()); }
      $runtime.fail();
    }));
    const loop = loop$lazy();
    return loop;
  }));
};
const mergeProducers1 = /* #__PURE__ */ mergeProducers(Data$dTraversable.traversableArray);
const makeTimeout = v => Effect$dAff._bind(Effect$dAff._delay(Data$dEither.Right, v))(() => Effect$dAff.makeAff(cb => {
  const $0 = cb(Data$dEither.$Either("Left", Effect$dException.error("test timed out after " + Data$dShow.showIntImpl(Data$dInt.unsafeClamp(Data$dNumber.round(v))) + "ms")));
  return () => {
    $0();
    return Effect$dAff.nonCanceler;
  };
}));
const timeout = time => t => Effect$dAff._bind(Effect$dAff._sequential(Effect$dAff._parAffAlt($$try(makeTimeout(time)))($$try(t))))(v2 => {
  if (v2.tag === "Left") { return Effect$dAff._throwError(v2._1); }
  if (v2.tag === "Right") { return Effect$dAff._pure(v2._1); }
  $runtime.fail();
});
const _run = dictFunctor => {
  const collect = Test$dSpec.collect(dictFunctor);
  return config => {
    const runItem = keepRunningVar => v => {
      const $0 = v.isParallelizable;
      const $1 = v.test;
      return bindProxy.bind(liftEffect1(() => keepRunningVar.value))(keepRunning => {
        if ($1.tag === "Leaf") {
          if ($1._2.tag === "Just") {
            if (keepRunning) {
              return bindProxy.bind(Pipes$dInternal.$$$Proxy(
                "Respond",
                Test$dSpec$dRunner$dEvent.$Event("Test", $0 ? Test$dSpec$dRunner$dEvent.Parallel : Test$dSpec$dRunner$dEvent.Sequential, $1._1._2, $1._1._1),
                Pipes$dInternal.Pure
              ))(() => bindProxy.bind(Pipes$dInternal.monadTransProxy.lift(Effect$dAff.monadAff)(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(Effect$dAff.try((() => {
                if (config.timeout.tag === "Nothing") { return identity; }
                if (config.timeout.tag === "Just") { return timeout(config.timeout._1); }
                $runtime.fail();
              })()($1._2._1.example(a => a()))))(e => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => {
                const duration = end + -start;
                return Effect$dAff._pure((() => {
                  const $2 = Test$dSpec$dResult.$Result(
                    "Success",
                    (() => {
                      if (duration > config.slow) { return Test$dSpec$dSpeed.Slow; }
                      if (duration > config.slow / 2.0) { return Test$dSpec$dSpeed.Medium; }
                      return Test$dSpec$dSpeed.Fast;
                    })(),
                    duration
                  );
                  if (e.tag === "Left") { return Test$dSpec$dResult.$Result("Failure", e._1); }
                  if (e.tag === "Right") { return $2; }
                  $runtime.fail();
                })());
              })))))(res => bindProxy.bind(res.tag === "Failure" && config.failFast ? liftEffect1(() => keepRunningVar.value = false) : applicativeProxy.pure())(() => bindProxy.bind(Pipes$dInternal.$$$Proxy(
                "Respond",
                Test$dSpec$dRunner$dEvent.$Event("TestEnd", $1._1._2, $1._1._1, res),
                Pipes$dInternal.Pure
              ))(() => applicativeProxy.pure([Test$dSpec$dTree.$Tree("Leaf", $1._1._1, Data$dMaybe.$Maybe("Just", res))])))));
            }
            return applicativeProxy.pure([Test$dSpec$dTree.$Tree("Leaf", $1._1._1, Data$dMaybe.Nothing)]);
          }
          if ($1._2.tag === "Nothing") {
            const $2 = $1._1._1;
            return bindProxy.bind(keepRunning
              ? Pipes$dInternal.$$$Proxy("Respond", Test$dSpec$dRunner$dEvent.$Event("Pending", $1._1._2, $2), Pipes$dInternal.Pure)
              : applicativeProxy.pure())(() => applicativeProxy.pure([Test$dSpec$dTree.$Tree("Leaf", $2, Data$dMaybe.Nothing)]));
          }
          $runtime.fail();
        }
        if ($1.tag === "Node") {
          if ($1._1.tag === "Right") {
            return applyProxy.apply(applyProxy.Functor0().map(Data$dFunction.const)(loop(keepRunningVar)($1._2)))(Pipes$dInternal.monadTransProxy.lift(Effect$dAff.monadAff)($1._1._1()));
          }
          if ($1._1.tag === "Left") {
            const $2 = $1._1._1._1;
            const $3 = $1._1._1._2;
            const $4 = $1._2;
            return bindProxy.bind(keepRunning
              ? Pipes$dInternal.$$$Proxy(
                  "Respond",
                  Test$dSpec$dRunner$dEvent.$Event("Suite", $0 ? Test$dSpec$dRunner$dEvent.Parallel : Test$dSpec$dRunner$dEvent.Sequential, $3, $2),
                  Pipes$dInternal.Pure
                )
              : applicativeProxy.pure())(() => bindProxy.bind(loop(keepRunningVar)($4))(res => bindProxy.bind(keepRunning
              ? Pipes$dInternal.$$$Proxy("Respond", Test$dSpec$dRunner$dEvent.$Event("SuiteEnd", $3), Pipes$dInternal.Pure)
              : applicativeProxy.pure())(() => applicativeProxy.pure([Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", $2), res)]))));
          }
        }
        $runtime.fail();
      });
    };
    const loop = keepRunningVar => tests => map(Data$dArray.concat)($$for(Data$dArray.groupBy(a => b => a.isParallelizable === b.isParallelizable)(Data$dFunctor.arrayMap(test => (
      {isParallelizable: Test$dSpec$dTree.isAllParallelizable(test), test}
    ))(tests)))(g => {
      if (
        (() => {
          if (0 < g.length) { return g[0].isParallelizable; }
          $runtime.fail();
        })()
      ) {
        return map(Data$dArray.concat)(mergeProducers1(Data$dFunctor.arrayMap(runItem(keepRunningVar))(g)));
      }
      return map(Data$dArray.concat)($$for(g)(runItem(keepRunningVar)));
    }));
    const $0 = dictFunctor.map(tests => bindProxy.bind(Pipes$dInternal.$$$Proxy(
      "Respond",
      Test$dSpec$dRunner$dEvent.$Event("Start", Test$dSpec$dTree.countTests(tests)),
      Pipes$dInternal.Pure
    ))(() => bindProxy.bind(liftEffect1(() => ({value: true})))(keepRunningVar => bindProxy.bind(loop(keepRunningVar)(Test$dSpec$dTree.annotateWithPaths(config.filterTree(tests))))(r => bindProxy.bind(Pipes$dInternal.$$$Proxy(
      "Respond",
      Test$dSpec$dRunner$dEvent.$Event("End", r),
      Pipes$dInternal.Pure
    ))(() => applicativeProxy.pure(r))))));
    return x => $0(collect(x));
  };
};
const runSpecT = dictFunctor => {
  const _run1 = _run(dictFunctor);
  return config => reporters => spec => dictFunctor.map(runner => {
    const reportedEvents = runEffect(Pipes$dCore.composeResponse(Effect$dAff.monadAff)(Data$dFoldable.foldlArray(Pipes.composePipes(Effect$dAff.monadAff))(runner)(reporters))(v => applicativeProxy.pure()));
    if (config.exit) {
      return Effect$dAff._bind($$try(reportedEvents))(v => {
        if (v.tag === "Left") {
          const $0 = v._1;
          return Effect$dAff._bind(Effect$dAff._liftEffect(Test$dSpec$dConsole.write(Test$dSpec$dStyle.styled(Test$dSpec$dStyle.red)(Effect$dException.showErrorImpl($0) + "\n"))))(() => Effect$dAff._bind(Effect$dAff._liftEffect(exit(1)))(() => Effect$dAff._throwError($0)));
        }
        if (v.tag === "Right") {
          const $0 = v._1;
          return Effect$dAff._liftEffect((() => {
            const $1 = exit(Test$dSpec$dSummary.summarize($0).failed === 0 ? 0 : 1);
            return () => {
              $1();
              return $0;
            };
          })());
        }
        $runtime.fail();
      });
    }
    return reportedEvents;
  })(_run1(config)(spec));
};
const runSpecT1 = /* #__PURE__ */ runSpecT(Data$dIdentity.functorIdentity);
const runSpec$p = config => reporters => spec => Effect$dAff._map(v => {})(runSpecT1(config)(reporters)(spec));
const run = () => runSpec$p(Test$dSpec$dConfig.defaultConfig);
const runSpec = reporters => spec => Effect$dAff._map(v => {})(runSpecT1(Test$dSpec$dConfig.defaultConfig)(reporters)(spec));
export {
  _run,
  applicativeProxy,
  applyProxy,
  bindProxy,
  $$for as for,
  identity,
  liftEffect1,
  makeTimeout,
  map,
  mergeProducers,
  mergeProducers1,
  parTraverse,
  run,
  runEffect,
  runEffectRec,
  runSpec,
  runSpec$p,
  runSpecT,
  runSpecT1,
  timeout,
  $$try as try
};
export * from "./foreign.js";
