import * as $runtime from "../runtime.js";
import * as Control$dMonad$dRec$dClass from "../Control.Monad.Rec.Class/index.js";
import * as Data$dArray from "../Data.Array/index.js";
import * as Data$dEq from "../Data.Eq/index.js";
import * as Data$dEuclideanRing from "../Data.EuclideanRing/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dFunctor from "../Data.Functor/index.js";
import * as Data$dInt from "../Data.Int/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dOrd from "../Data.Ord/index.js";
import * as Data$dSemiring from "../Data.Semiring/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dTraversable from "../Data.Traversable/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Data$dVariant from "../Data.Variant/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Effect$dConsole from "../Effect.Console/index.js";
import * as Effect$dNow from "../Effect.Now/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
import * as Yoga$dOm$dStrom from "../Yoga.Om.Strom/index.js";
const sequence = /* #__PURE__ */ (() => Data$dTraversable.traversableArray.traverse(Effect$dAff.applicativeAff)(Data$dTraversable.identity))();
const changesStrom = /* #__PURE__ */ Yoga$dOm$dStrom.changesStrom(Data$dEq.eqInt);
const runOm = om => {
  const $0 = {exception: err => Effect$dAff._throwError(err)};
  return Effect$dAff._bind(Yoga$dOm.runRWSET({})()(om))(v1 => {
    if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
    if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1._2._1._1); }
    $runtime.fail();
  });
};
const benchAff = name => runs => action => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("\n🏃 " + name + " (runs: " + Data$dShow.showIntImpl(runs) + ")")))(() => Effect$dAff._bind(sequence(Data$dArray.replicateImpl(
  runs,
  Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(action)(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._pure(end + -start))))
)))(times => {
  const sorted = Data$dArray.sortBy(Data$dOrd.ordNumber.compare)(times);
  const min = 0 < sorted.length ? Data$dMaybe.$Maybe("Just", sorted[0]) : Data$dMaybe.Nothing;
  const $0 = $runtime.intDiv(runs, 2);
  if ($0 >= 0 && $0 < sorted.length) {
    const mean = Data$dFoldable.foldlArray(Data$dSemiring.numAdd)(0.0)(times) / Data$dInt.toNumber(runs);
    const $1 = sorted.length - 1 | 0;
    if ($1 >= 0 && $1 < sorted.length) {
      return Effect$dAff._liftEffect((() => {
        const $2 = (() => {
          if (min.tag === "Just") { return Effect$dConsole.log("  min:    " + Data$dShow.showNumberImpl(min._1) + " ms"); }
          if (min.tag === "Nothing") { return () => {}; }
          $runtime.fail();
        })();
        return () => {
          $2();
          Effect$dConsole.log("  median: " + Data$dShow.showNumberImpl(sorted[$0]) + " ms")();
          Effect$dConsole.log("  mean:   " + Data$dShow.showNumberImpl(mean) + " ms")();
          return Effect$dConsole.log("  max:    " + Data$dShow.showNumberImpl(sorted[$1]) + " ms")();
        };
      })());
    }
    return Effect$dAff._liftEffect((() => {
      const $2 = (() => {
        if (min.tag === "Just") { return Effect$dConsole.log("  min:    " + Data$dShow.showNumberImpl(min._1) + " ms"); }
        if (min.tag === "Nothing") { return () => {}; }
        $runtime.fail();
      })();
      return () => {
        $2();
        Effect$dConsole.log("  median: " + Data$dShow.showNumberImpl(sorted[$0]) + " ms")();
        Effect$dConsole.log("  mean:   " + Data$dShow.showNumberImpl(mean) + " ms")();
      };
    })());
  }
  const mean = Data$dFoldable.foldlArray(Data$dSemiring.numAdd)(0.0)(times) / Data$dInt.toNumber(runs);
  const $1 = sorted.length - 1 | 0;
  if ($1 >= 0 && $1 < sorted.length) {
    return Effect$dAff._liftEffect((() => {
      const $2 = (() => {
        if (min.tag === "Just") { return Effect$dConsole.log("  min:    " + Data$dShow.showNumberImpl(min._1) + " ms"); }
        if (min.tag === "Nothing") { return () => {}; }
        $runtime.fail();
      })();
      return () => {
        $2();
        Effect$dConsole.log("  mean:   " + Data$dShow.showNumberImpl(mean) + " ms")();
        return Effect$dConsole.log("  max:    " + Data$dShow.showNumberImpl(sorted[$1]) + " ms")();
      };
    })());
  }
  return Effect$dAff._liftEffect((() => {
    const $2 = (() => {
      if (min.tag === "Just") { return Effect$dConsole.log("  min:    " + Data$dShow.showNumberImpl(min._1) + " ms"); }
      if (min.tag === "Nothing") { return () => {}; }
      $runtime.fail();
    })();
    return () => {
      $2();
      Effect$dConsole.log("  mean:   " + Data$dShow.showNumberImpl(mean) + " ms")();
    };
  })());
}));
const main = /* #__PURE__ */ (() => {
  const $0 = Effect$dAff._makeFiber(
    Effect$dAff.ffiUtil,
    Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("🔥 Strom Performance Benchmark Suite")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("=====================================")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("")))(() => Effect$dAff._bind(benchAff("map-2M")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      {
        pull: Yoga$dOm.bindOm.bind((() => {
          const rangeHelper = current => limit => {
            if (current >= limit) { return Yoga$dOm$dStrom.empty; }
            const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
            const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
            return {
              pull: chunkEnd >= limit
                ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
                : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
            };
          };
          return rangeHelper(1)(2000001).pull;
        })())(step => {
          if (step.tag === "Done") {
            if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            if (step._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(v => v + 1 | 0)(step._1._1))));
            }
            $runtime.fail();
          }
          if (step.tag === "Loop") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(
                (() => {
                  const $0 = Data$dFunctor.arrayMap(v => v + 1 | 0);
                  if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                  return Data$dMaybe.Nothing;
                })(),
                Yoga$dOm$dStrom.mapStrom(v => v + 1 | 0)(step._1._2)
              )
            ));
          }
          $runtime.fail();
        })
      }
    )))))(() => Effect$dAff._bind(benchAff("filter-2M-50pct")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      {
        pull: Yoga$dOm.bindOm.bind((() => {
          const rangeHelper = current => limit => {
            if (current >= limit) { return Yoga$dOm$dStrom.empty; }
            const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
            const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
            return {
              pull: chunkEnd >= limit
                ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
                : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
            };
          };
          return rangeHelper(1)(2000001).pull;
        })())(step => {
          if (step.tag === "Done") {
            if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            if (step._1.tag === "Just") {
              const filtered = Data$dArray.filterImpl(n => Data$dEuclideanRing.intMod(n)(2) === 0, step._1._1);
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", filtered.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", filtered)));
            }
            $runtime.fail();
          }
          if (step.tag === "Loop") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(
                (() => {
                  if (step._1._1.tag === "Nothing") { return Data$dMaybe.Nothing; }
                  if (step._1._1.tag === "Just") {
                    const filtered = Data$dArray.filterImpl(n => Data$dEuclideanRing.intMod(n)(2) === 0, step._1._1._1);
                    if (filtered.length === 0) { return Data$dMaybe.Nothing; }
                    return Data$dMaybe.$Maybe("Just", filtered);
                  }
                  $runtime.fail();
                })(),
                Yoga$dOm$dStrom.filterStrom(n => Data$dEuclideanRing.intMod(n)(2) === 0)(step._1._2)
              )
            ));
          }
          $runtime.fail();
        })
      }
    )))))(() => Effect$dAff._bind(benchAff("map-chain-3x-2M")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      {
        pull: Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind((() => {
          const rangeHelper = current => limit => {
            if (current >= limit) { return Yoga$dOm$dStrom.empty; }
            const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
            const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
            return {
              pull: chunkEnd >= limit
                ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
                : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
            };
          };
          return rangeHelper(1)(2000001).pull;
        })())(step => {
          if (step.tag === "Done") {
            if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            if (step._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(v => v + 1 | 0)(step._1._1))));
            }
            $runtime.fail();
          }
          if (step.tag === "Loop") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(
                (() => {
                  const $0 = Data$dFunctor.arrayMap(v => v + 1 | 0);
                  if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                  return Data$dMaybe.Nothing;
                })(),
                Yoga$dOm$dStrom.mapStrom(v => v + 1 | 0)(step._1._2)
              )
            ));
          }
          $runtime.fail();
        }))(step => {
          if (step.tag === "Done") {
            if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            if (step._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(v => v * 2 | 0)(step._1._1))));
            }
            $runtime.fail();
          }
          if (step.tag === "Loop") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(
                (() => {
                  const $0 = Data$dFunctor.arrayMap(v => v * 2 | 0);
                  if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                  return Data$dMaybe.Nothing;
                })(),
                Yoga$dOm$dStrom.mapStrom(v => v * 2 | 0)(step._1._2)
              )
            ));
          }
          $runtime.fail();
        }))(step => {
          if (step.tag === "Done") {
            if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            if (step._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(v => v - 1 | 0)(step._1._1))));
            }
            $runtime.fail();
          }
          if (step.tag === "Loop") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(
                (() => {
                  const $0 = Data$dFunctor.arrayMap(v => v - 1 | 0);
                  if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                  return Data$dMaybe.Nothing;
                })(),
                Yoga$dOm$dStrom.mapStrom(v => v - 1 | 0)(step._1._2)
              )
            ));
          }
          $runtime.fail();
        })
      }
    )))))(() => Effect$dAff._bind(benchAff("pipeline-map-filter-map-2M")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      {
        pull: Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind((() => {
          const rangeHelper = current => limit => {
            if (current >= limit) { return Yoga$dOm$dStrom.empty; }
            const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
            const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
            return {
              pull: chunkEnd >= limit
                ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
                : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
            };
          };
          return rangeHelper(1)(2000001).pull;
        })())(step => {
          if (step.tag === "Done") {
            if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            if (step._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(v => v + 1 | 0)(step._1._1))));
            }
            $runtime.fail();
          }
          if (step.tag === "Loop") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(
                (() => {
                  const $0 = Data$dFunctor.arrayMap(v => v + 1 | 0);
                  if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                  return Data$dMaybe.Nothing;
                })(),
                Yoga$dOm$dStrom.mapStrom(v => v + 1 | 0)(step._1._2)
              )
            ));
          }
          $runtime.fail();
        }))(step => {
          if (step.tag === "Done") {
            if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            if (step._1.tag === "Just") {
              const filtered = Data$dArray.filterImpl(n => Data$dEuclideanRing.intMod(n)(3) === 0, step._1._1);
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", filtered.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", filtered)));
            }
            $runtime.fail();
          }
          if (step.tag === "Loop") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(
                (() => {
                  if (step._1._1.tag === "Nothing") { return Data$dMaybe.Nothing; }
                  if (step._1._1.tag === "Just") {
                    const filtered = Data$dArray.filterImpl(n => Data$dEuclideanRing.intMod(n)(3) === 0, step._1._1._1);
                    if (filtered.length === 0) { return Data$dMaybe.Nothing; }
                    return Data$dMaybe.$Maybe("Just", filtered);
                  }
                  $runtime.fail();
                })(),
                Yoga$dOm$dStrom.filterStrom(n => Data$dEuclideanRing.intMod(n)(3) === 0)(step._1._2)
              )
            ));
          }
          $runtime.fail();
        }))(step => {
          if (step.tag === "Done") {
            if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            if (step._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(v => v * 2 | 0)(step._1._1))));
            }
            $runtime.fail();
          }
          if (step.tag === "Loop") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(
                (() => {
                  const $0 = Data$dFunctor.arrayMap(v => v * 2 | 0);
                  if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                  return Data$dMaybe.Nothing;
                })(),
                Yoga$dOm$dStrom.mapStrom(v => v * 2 | 0)(step._1._2)
              )
            ));
          }
          $runtime.fail();
        })
      }
    )))))(() => Effect$dAff._bind(benchAff("fold-sum-1M")(10)(Effect$dAff._map(v => {})(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(acc => n => acc + n | 0)($0)(step._1._1)));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(acc => n => acc + n | 0)($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      0,
      (() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(1000001);
      })()
    ))))))(() => Effect$dAff._bind(benchAff("collect-50k")(10)(Effect$dAff._map(v => {})(runOm(Yoga$dOm$dStrom.runCollect((() => {
      const rangeHelper = current => limit => {
        if (current >= limit) { return Yoga$dOm$dStrom.empty; }
        const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
        const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
        return {
          pull: chunkEnd >= limit
            ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
            : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
        };
      };
      return rangeHelper(1)(50001);
    })())))))(() => Effect$dAff._bind(benchAff("take-5k-from-2M")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      (() => {
        const takeHelper = remaining => s => {
          if (remaining <= 0) { return Yoga$dOm$dStrom.empty; }
          return {
            pull: Yoga$dOm.bindOm.bind(s.pull)(step => {
              if (step.tag === "Done") {
                if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
                if (step._1.tag === "Just") {
                  const taken = remaining < 1 ? [] : Data$dArray.sliceImpl(0, remaining, step._1._1);
                  if (taken.length === 0) { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", taken)));
                }
                $runtime.fail();
              }
              if (step.tag === "Loop") {
                if (step._1._1.tag === "Nothing") {
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, takeHelper(remaining)(step._1._2))));
                }
                if (step._1._1.tag === "Just") {
                  const taken = remaining < 1 ? [] : Data$dArray.sliceImpl(0, remaining, step._1._1._1);
                  const numTaken = taken.length;
                  const newRemaining = remaining - numTaken | 0;
                  if (numTaken === 0) { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
                  if (newRemaining <= 0) { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", taken))); }
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                    "Loop",
                    Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", taken), takeHelper(newRemaining)(step._1._2))
                  ));
                }
              }
              $runtime.fail();
            })
          };
        };
        return takeHelper(5000)((() => {
          const rangeHelper = current => limit => {
            if (current >= limit) { return Yoga$dOm$dStrom.empty; }
            const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
            const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
            return {
              pull: chunkEnd >= limit
                ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
                : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
            };
          };
          return rangeHelper(1)(2000001);
        })());
      })()
    )))))(() => Effect$dAff._bind(benchAff("mergeND-2x1M")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.mergeND((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(1000001);
      })())((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1000001)(2000001);
      })())
    )))))(() => Effect$dAff._bind(benchAff("mapPar-concurrency4-5k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      (() => {
        const chunksOf = n => arr => {
          if (n <= 0 || arr.length === 0) { return []; }
          const rest = n < 1 ? arr : Data$dArray.sliceImpl(n, arr.length, arr);
          const group = n < 1 ? [] : Data$dArray.sliceImpl(0, n, arr);
          if (group.length === 0) { return []; }
          return [group, ...chunksOf(n)(rest)];
        };
        return {
          pull: Yoga$dOm.bindOm.bind((() => {
            const rangeHelper = current => limit => {
              if (current >= limit) { return Yoga$dOm$dStrom.empty; }
              const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
              const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
              return {
                pull: chunkEnd >= limit
                  ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
                  : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
              };
            };
            return rangeHelper(1)(5001).pull;
          })())(step => {
            if (step.tag === "Done") {
              if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
              if (step._1.tag === "Just") {
                return Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.traverse(group => Yoga$dOm.inParallel(Data$dFunctor.arrayMap(n => Yoga$dOm.applicativeOm.pure(n * 2 | 0))(group)))(chunksOf(4)(step._1._1)))(results => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Done",
                  Data$dMaybe.$Maybe("Just", Data$dArray.concat(results))
                )));
              }
              $runtime.fail();
            }
            if (step.tag === "Loop") {
              const $0 = step._1._2;
              return Yoga$dOm.bindOm.bind((() => {
                if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Data$dMaybe.Nothing); }
                if (step._1._1.tag === "Just") {
                  return Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.traverse(group => Yoga$dOm.inParallel(Data$dFunctor.arrayMap(n => Yoga$dOm.applicativeOm.pure(n * 2 | 0))(group)))(chunksOf(4)(step._1._1._1)))(results => Yoga$dOm.applicativeOm.pure(Data$dMaybe.$Maybe(
                    "Just",
                    Data$dArray.concat(results)
                  )));
                }
                $runtime.fail();
              })())(mappedChunk => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(mappedChunk, Yoga$dOm$dStrom.mapPar(4)(n => Yoga$dOm.applicativeOm.pure(n * 2 | 0))($0))
              )));
            }
            $runtime.fail();
          })
        };
      })()
    )))))(() => Effect$dAff._bind(benchAff("scan-running-sum-2M")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      (() => {
        const scanHelper = acc => s => (
          {
            pull: Yoga$dOm.bindOm.bind(s.pull)(step => {
              if (step.tag === "Done") {
                if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
                if (step._1.tag === "Just") {
                  const $0 = Data$dFoldable.foldlArray(v1 => {
                    const $0 = v1._2;
                    const $1 = v1._1;
                    return item => {
                      const newAcc = $1 + item | 0;
                      return Data$dTuple.$Tuple(newAcc, Data$dArray.snoc($0)(newAcc));
                    };
                  })(Data$dTuple.$Tuple(acc, []))(step._1._1)._2;
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", $0)));
                }
                $runtime.fail();
              }
              if (step.tag === "Loop") {
                if (step._1._1.tag === "Nothing") {
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, scanHelper(acc)(step._1._2))));
                }
                if (step._1._1.tag === "Just") {
                  const v = Data$dFoldable.foldlArray(v1 => {
                    const $0 = v1._2;
                    const $1 = v1._1;
                    return item => {
                      const currAcc = $1 + item | 0;
                      return Data$dTuple.$Tuple(currAcc, Data$dArray.snoc($0)(currAcc));
                    };
                  })(Data$dTuple.$Tuple(acc, []))(step._1._1._1);
                  if (v._2.length === 0) {
                    return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, scanHelper(v._1)(step._1._2))));
                  }
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", v._2), scanHelper(v._1)(step._1._2))));
                }
              }
              $runtime.fail();
            })
          }
        );
        return scanHelper(0)((() => {
          const rangeHelper = current => limit => {
            if (current >= limit) { return Yoga$dOm$dStrom.empty; }
            const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
            const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
            return {
              pull: chunkEnd >= limit
                ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
                : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
            };
          };
          return rangeHelper(1)(2000001);
        })());
      })()
    )))))(() => Effect$dAff._bind(benchAff("unfold-10k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.unfoldStrom(n => {
        if (n > 10000) { return Data$dMaybe.Nothing; }
        return Data$dMaybe.$Maybe("Just", Data$dTuple.$Tuple(n, n + 1 | 0));
      })(1)
    )))))(() => Effect$dAff._bind(benchAff("infinite-iterate-take-10k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      (() => {
        const takeHelper = remaining => s => {
          if (remaining <= 0) { return Yoga$dOm$dStrom.empty; }
          return {
            pull: Yoga$dOm.bindOm.bind(s.pull)(step => {
              if (step.tag === "Done") {
                if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
                if (step._1.tag === "Just") {
                  const taken = remaining < 1 ? [] : Data$dArray.sliceImpl(0, remaining, step._1._1);
                  if (taken.length === 0) { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", taken)));
                }
                $runtime.fail();
              }
              if (step.tag === "Loop") {
                if (step._1._1.tag === "Nothing") {
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, takeHelper(remaining)(step._1._2))));
                }
                if (step._1._1.tag === "Just") {
                  const taken = remaining < 1 ? [] : Data$dArray.sliceImpl(0, remaining, step._1._1._1);
                  const numTaken = taken.length;
                  const newRemaining = remaining - numTaken | 0;
                  if (numTaken === 0) { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
                  if (newRemaining <= 0) { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", taken))); }
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                    "Loop",
                    Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", taken), takeHelper(newRemaining)(step._1._2))
                  ));
                }
              }
              $runtime.fail();
            })
          };
        };
        return takeHelper(10000)(Yoga$dOm$dStrom.iterateStromInfinite(v => v + 1 | 0)(0));
      })()
    )))))(() => Effect$dAff._bind(benchAff("bind-5kx10")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.bindStrom1.bind((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(5001);
      })())(n => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(n)(n + 10 | 0);
      })
    )))))(() => Effect$dAff._bind(benchAff("zip-2x500k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      (() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        const $0 = rangeHelper(1)(500001);
        const rangeHelper$1 = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $1 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $1)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $1), rangeHelper$1(chunkEnd)(limit))))
          };
        };
        const $1 = rangeHelper$1(500001)(1000001);
        return {
          pull: Yoga$dOm.bindOm.bind($0.pull)(step1 => Yoga$dOm.bindOm.bind($1.pull)(step2 => {
            if (step1.tag === "Done") {
              if (step1._1.tag === "Just") {
                if (step2.tag === "Done") {
                  if (step2._1.tag === "Just") {
                    return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                      "Done",
                      Data$dMaybe.$Maybe("Just", Data$dArray.zipWithImpl(Data$dTuple.Tuple, step1._1._1, step2._1._1))
                    ));
                  }
                  if (step2._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
                  $runtime.fail();
                }
                if (step2.tag === "Loop") {
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                    "Loop",
                    Data$dTuple.$Tuple(Data$dMaybe.Nothing, Yoga$dOm$dStrom.zipWithStrom(Data$dTuple.Tuple)($0)(step2._1._2))
                  ));
                }
                $runtime.fail();
              }
              if (step1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
              if (step2.tag === "Done") {
                if (step2._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
                $runtime.fail();
              }
              if (step2.tag === "Loop") {
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Loop",
                  Data$dTuple.$Tuple(Data$dMaybe.Nothing, Yoga$dOm$dStrom.zipWithStrom(Data$dTuple.Tuple)($0)(step2._1._2))
                ));
              }
              $runtime.fail();
            }
            if (step2.tag === "Done") {
              if (step2._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
              if (step1.tag === "Loop") {
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Loop",
                  Data$dTuple.$Tuple(Data$dMaybe.Nothing, Yoga$dOm$dStrom.zipWithStrom(Data$dTuple.Tuple)(step1._1._2)($1))
                ));
              }
              $runtime.fail();
            }
            if (step1.tag === "Loop") {
              if (step2.tag === "Loop") {
                if (step1._1._1.tag === "Just" && step2._1._1.tag === "Just") {
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                    "Loop",
                    Data$dTuple.$Tuple(
                      Data$dMaybe.$Maybe("Just", Data$dArray.zipWithImpl(Data$dTuple.Tuple, step1._1._1._1, step2._1._1._1)),
                      Yoga$dOm$dStrom.zipWithStrom(Data$dTuple.Tuple)(step1._1._2)(step2._1._2)
                    )
                  ));
                }
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Loop",
                  Data$dTuple.$Tuple(Data$dMaybe.Nothing, Yoga$dOm$dStrom.zipWithStrom(Data$dTuple.Tuple)(step1._1._2)(step2._1._2))
                ));
              }
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(Data$dMaybe.Nothing, Yoga$dOm$dStrom.zipWithStrom(Data$dTuple.Tuple)(step1._1._2)($1))
              ));
            }
            if (step2.tag === "Loop") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(Data$dMaybe.Nothing, Yoga$dOm$dStrom.zipWithStrom(Data$dTuple.Tuple)($0)(step2._1._2))
              ));
            }
            $runtime.fail();
          }))
        };
      })()
    )))))(() => Effect$dAff._bind(benchAff("fromArray-1M")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(undefined, Yoga$dOm$dStrom.fromArray(Data$dArray.rangeImpl(1, 1000000)))))))(() => Effect$dAff._bind(benchAff("iterateStrom-10k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(undefined, Yoga$dOm$dStrom.iterateStrom(v => v + 1 | 0)(0))))))(() => Effect$dAff._bind(benchAff("repeatStrom-10k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(undefined, Yoga$dOm$dStrom.fromArray(Data$dArray.replicateImpl(10000, 42)))))))(() => Effect$dAff._bind(benchAff("mapM-effect-50k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.mapMStrom(n => Yoga$dOm.applicativeOm.pure(n * 2 | 0))((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(50001);
      })())
    )))))(() => Effect$dAff._bind(benchAff("tap-50k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.tapStrom(v => {})((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(50001);
      })())
    )))))(() => Effect$dAff._bind(benchAff("collect-filter-map-50k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.collectStrom(n => {
        if (Data$dEuclideanRing.intMod(n)(2) === 0) { return Data$dMaybe.$Maybe("Just", n * 2 | 0); }
        return Data$dMaybe.Nothing;
      })((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(50001);
      })())
    )))))(() => Effect$dAff._bind(benchAff("changes-50k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(undefined, changesStrom(Yoga$dOm$dStrom.fromArray([...Data$dArray.replicateImpl(50000, 1), 2])))))))(() => Effect$dAff._bind(benchAff("takeWhile-50k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.takeWhileStrom(v => v < 50000)((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(1000001);
      })())
    )))))(() => Effect$dAff._bind(benchAff("drop-5k-from-1M")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.dropStrom(5000)((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(1000001);
      })())
    )))))(() => Effect$dAff._bind(benchAff("dropWhile-half-1M")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.dropWhileStrom(v => v < 500000)((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(1000001);
      })())
    )))))(() => Effect$dAff._bind(benchAff("grouped-chunks-of-100-from-50k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.groupedStrom(100)((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(50001);
      })())
    )))))(() => Effect$dAff._bind(benchAff("partition-even-odd-50k")(10)(runOm((() => {
      const v = Yoga$dOm$dStrom.partition(n => Data$dEuclideanRing.intMod(n)(2) === 0)((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(50001);
      })());
      return Yoga$dOm.monadRecOm.tailRecM(v$1 => {
        const $0 = v$1._1;
        return Yoga$dOm.bindOm.bind(v$1._2.pull)(step => {
          if (step.tag === "Done") {
            if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
            if (step._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$2 => v1 => {})($0)(step._1._1)));
            }
            $runtime.fail();
          }
          if (step.tag === "Loop") {
            if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
            if (step._1._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$2 => v1 => {})($0)(step._1._1._1), step._1._2)
              ));
            }
          }
          $runtime.fail();
        });
      })(Data$dTuple.$Tuple(undefined, Yoga$dOm$dStrom.appendStrom(v._1)(v._2)));
    })())))(() => Effect$dAff._bind(benchAff("append-2x500k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.appendStrom((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(500001);
      })())((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(500001)(1000001);
      })())
    )))))(() => Effect$dAff._bind(benchAff("concat-10x10k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      (() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return Data$dFoldable.foldrArray(b => a => Yoga$dOm$dStrom.appendStrom(a)(b))(Yoga$dOm$dStrom.empty)(Data$dArray.replicateImpl(10, rangeHelper(1)(10001)));
      })()
    )))))(() => Effect$dAff._bind(benchAff("zipWith-add-2x500k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      (() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        const $0 = rangeHelper(1)(500001);
        const rangeHelper$1 = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $1 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $1)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $1), rangeHelper$1(chunkEnd)(limit))))
          };
        };
        const $1 = rangeHelper$1(1)(500001);
        return {
          pull: Yoga$dOm.bindOm.bind($0.pull)(step1 => Yoga$dOm.bindOm.bind($1.pull)(step2 => {
            if (step1.tag === "Done") {
              if (step1._1.tag === "Just") {
                if (step2.tag === "Done") {
                  if (step2._1.tag === "Just") {
                    return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                      "Done",
                      Data$dMaybe.$Maybe("Just", Data$dArray.zipWithImpl(Data$dSemiring.intAdd, step1._1._1, step2._1._1))
                    ));
                  }
                  if (step2._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
                  $runtime.fail();
                }
                if (step2.tag === "Loop") {
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                    "Loop",
                    Data$dTuple.$Tuple(Data$dMaybe.Nothing, Yoga$dOm$dStrom.zipWithStrom(Data$dSemiring.intAdd)($0)(step2._1._2))
                  ));
                }
                $runtime.fail();
              }
              if (step1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
              if (step2.tag === "Done") {
                if (step2._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
                $runtime.fail();
              }
              if (step2.tag === "Loop") {
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Loop",
                  Data$dTuple.$Tuple(Data$dMaybe.Nothing, Yoga$dOm$dStrom.zipWithStrom(Data$dSemiring.intAdd)($0)(step2._1._2))
                ));
              }
              $runtime.fail();
            }
            if (step2.tag === "Done") {
              if (step2._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
              if (step1.tag === "Loop") {
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Loop",
                  Data$dTuple.$Tuple(Data$dMaybe.Nothing, Yoga$dOm$dStrom.zipWithStrom(Data$dSemiring.intAdd)(step1._1._2)($1))
                ));
              }
              $runtime.fail();
            }
            if (step1.tag === "Loop") {
              if (step2.tag === "Loop") {
                if (step1._1._1.tag === "Just" && step2._1._1.tag === "Just") {
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                    "Loop",
                    Data$dTuple.$Tuple(
                      Data$dMaybe.$Maybe("Just", Data$dArray.zipWithImpl(Data$dSemiring.intAdd, step1._1._1._1, step2._1._1._1)),
                      Yoga$dOm$dStrom.zipWithStrom(Data$dSemiring.intAdd)(step1._1._2)(step2._1._2)
                    )
                  ));
                }
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Loop",
                  Data$dTuple.$Tuple(Data$dMaybe.Nothing, Yoga$dOm$dStrom.zipWithStrom(Data$dSemiring.intAdd)(step1._1._2)(step2._1._2))
                ));
              }
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(Data$dMaybe.Nothing, Yoga$dOm$dStrom.zipWithStrom(Data$dSemiring.intAdd)(step1._1._2)($1))
              ));
            }
            if (step2.tag === "Loop") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(Data$dMaybe.Nothing, Yoga$dOm$dStrom.zipWithStrom(Data$dSemiring.intAdd)($0)(step2._1._2))
              ));
            }
            $runtime.fail();
          }))
        };
      })()
    )))))(() => Effect$dAff._bind(benchAff("interleave-2x50k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.interleave((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(50001);
      })())((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(50001)(100001);
      })())
    )))))(() => Effect$dAff._bind(benchAff("merge-2x500k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      Yoga$dOm$dStrom.merge((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(1)(500001);
      })())((() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return rangeHelper(500001)(1000001);
      })())
    )))))(() => Effect$dAff._bind(benchAff("mergeAll-10x10k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      (() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return Data$dFoldable.foldlArray(Yoga$dOm$dStrom.merge)(Yoga$dOm$dStrom.empty)(Data$dArray.replicateImpl(10, rangeHelper(1)(10001)));
      })()
    )))))(() => Effect$dAff._bind(benchAff("race-2x50k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      (() => {
        const rangeHelper = current => limit => {
          if (current >= limit) { return Yoga$dOm$dStrom.empty; }
          const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
          const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
          return {
            pull: chunkEnd >= limit
              ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
              : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
          };
        };
        return {
          pull: Yoga$dOm.race([
            rangeHelper(1)(50001).pull,
            (() => {
              const rangeHelper$1 = current => limit => {
                if (current >= limit) { return Yoga$dOm$dStrom.empty; }
                const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
                const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
                return {
                  pull: chunkEnd >= limit
                    ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
                    : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper$1(chunkEnd)(limit))))
                };
              };
              return rangeHelper$1(50001)(100001).pull;
            })()
          ])
        };
      })()
    )))))(() => Effect$dAff._bind(benchAff("foreachPar-concurrency8-1k")(10)(runOm(Yoga$dOm$dStrom.foreachPar(8)(v => Yoga$dOm.applicativeOm.pure())((() => {
      const rangeHelper = current => limit => {
        if (current >= limit) { return Yoga$dOm$dStrom.empty; }
        const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
        const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
        return {
          pull: chunkEnd >= limit
            ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
            : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
        };
      };
      return rangeHelper(1)(1001);
    })()))))(() => Effect$dAff._bind(benchAff("mapMPar-concurrency8-1k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      (() => {
        const chunksOf = n => arr => {
          if (n <= 0 || arr.length === 0) { return []; }
          const rest = n < 1 ? arr : Data$dArray.sliceImpl(n, arr.length, arr);
          const group = n < 1 ? [] : Data$dArray.sliceImpl(0, n, arr);
          if (group.length === 0) { return []; }
          return [group, ...chunksOf(n)(rest)];
        };
        return {
          pull: Yoga$dOm.bindOm.bind((() => {
            const rangeHelper = current => limit => {
              if (current >= limit) { return Yoga$dOm$dStrom.empty; }
              const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
              const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
              return {
                pull: chunkEnd >= limit
                  ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
                  : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
              };
            };
            return rangeHelper(1)(1001).pull;
          })())(step => {
            if (step.tag === "Done") {
              if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
              if (step._1.tag === "Just") {
                return Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.traverse(group => Yoga$dOm.inParallel(Data$dFunctor.arrayMap(n => Yoga$dOm.applicativeOm.pure(n * 2 | 0))(group)))(chunksOf(8)(step._1._1)))(results => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Done",
                  Data$dMaybe.$Maybe("Just", Data$dArray.concat(results))
                )));
              }
              $runtime.fail();
            }
            if (step.tag === "Loop") {
              const $0 = step._1._2;
              return Yoga$dOm.bindOm.bind((() => {
                if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Data$dMaybe.Nothing); }
                if (step._1._1.tag === "Just") {
                  return Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.traverse(group => Yoga$dOm.inParallel(Data$dFunctor.arrayMap(n => Yoga$dOm.applicativeOm.pure(n * 2 | 0))(group)))(chunksOf(8)(step._1._1._1)))(results => Yoga$dOm.applicativeOm.pure(Data$dMaybe.$Maybe(
                    "Just",
                    Data$dArray.concat(results)
                  )));
                }
                $runtime.fail();
              })())(mappedChunk => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(mappedChunk, Yoga$dOm$dStrom.mapPar(8)(n => Yoga$dOm.applicativeOm.pure(n * 2 | 0))($0))
              )));
            }
            $runtime.fail();
          })
        };
      })()
    )))))(() => Effect$dAff._bind(benchAff("catchAll-no-errors-50k")(10)(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1))); }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)
            ));
          }
        }
        $runtime.fail();
      });
    })(Data$dTuple.$Tuple(
      undefined,
      {
        pull: Yoga$dOm.handleErrors$p(err => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", [0]))))((() => {
          const rangeHelper = current => limit => {
            if (current >= limit) { return Yoga$dOm$dStrom.empty; }
            const chunkEnd = Yoga$dOm$dStrom.min(current + 1000 | 0)(limit);
            const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
            return {
              pull: chunkEnd >= limit
                ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
                : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
            };
          };
          return rangeHelper(1)(50001).pull;
        })())
      }
    )))))(() => Effect$dAff._liftEffect(Effect$dConsole.log("\n✨ Benchmark suite complete!")))))))))))))))))))))))))))))))))))))))))
  );
  return () => {
    const fiber = $0();
    fiber.run();
  };
})();
export {benchAff, changesStrom, main, runOm, sequence};
