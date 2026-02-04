import * as $runtime from "../runtime.js";
import * as Control$dMonad$dRec$dClass from "../Control.Monad.Rec.Class/index.js";
import * as Data$dArray from "../Data.Array/index.js";
import * as Data$dEuclideanRing from "../Data.EuclideanRing/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dFunctor from "../Data.Functor/index.js";
import * as Data$dInt from "../Data.Int/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Data$dVariant from "../Data.Variant/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Effect$dConsole from "../Effect.Console/index.js";
import * as Effect$dNow from "../Effect.Now/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
import * as Yoga$dOm$dStrom from "../Yoga.Om.Strom/index.js";
const timeOperation = name => action => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("\n🏃 Running: " + name)))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(action)(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("✓ Completed in " + Data$dShow.showNumberImpl(end + -start) + "ms")))(() => Effect$dAff._pure(result))))));
const runOm = om => {
  const $0 = {exception: err => Effect$dAff._throwError(err)};
  return Effect$dAff._bind(Yoga$dOm.runRWSET({})()(om))(v1 => {
    if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
    if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1._2._1._1); }
    $runtime.fail();
  });
};
const reportThroughput = name => elements => duration => {
  const elementsPerSec = 1000.0 * Data$dInt.toNumber(elements) / duration;
  const millions = elementsPerSec / 1000000.0;
  const $0 = Effect$dConsole.log("  📊 " + name + ": " + Data$dShow.showNumberImpl(elementsPerSec) + " elements/sec");
  return () => {
    $0();
    return Effect$dConsole.log("  📊 " + name + ": " + Data$dShow.showNumberImpl(millions) + "M elements/sec")();
  };
};
const main = /* #__PURE__ */ (() => {
  const $0 = Effect$dAff._makeFiber(
    Effect$dAff.ffiUtil,
    Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("🔥 Strom Performance Benchmark Suite")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("=====================================")))(() => Effect$dAff._bind(timeOperation("Map 1M elements")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
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
          return rangeHelper(1)(1000001).pull;
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
    ))))(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(reportThroughput("map")(1000000)(end + -start)))(() => Effect$dAff._pure(result)))))))(() => Effect$dAff._bind(timeOperation("Filter 1M elements (50% kept)")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
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
          return rangeHelper(1)(1000001).pull;
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
    ))))(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(reportThroughput("filter")(1000000)(end + -start)))(() => Effect$dAff._pure(result)))))))(() => Effect$dAff._bind(timeOperation("Chain 3 maps over 1M elements")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
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
          return rangeHelper(1)(1000001).pull;
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
    ))))(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(reportThroughput("3x map")(1000000)(end + -start)))(() => Effect$dAff._pure(result)))))))(() => Effect$dAff._bind(timeOperation("Complex pipeline (map, filter, map) on 1M elements")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
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
          return rangeHelper(1)(1000001).pull;
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
    ))))(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(reportThroughput("pipeline")(1000000)(end + -start)))(() => Effect$dAff._pure(result)))))))(() => Effect$dAff._bind(timeOperation("Fold 1M elements (sum)")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
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
    ))))(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(reportThroughput("fold")(1000000)(end + -start)))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  Result: " + Data$dShow.showIntImpl(result))))(() => Effect$dAff._pure(result))))))))(() => Effect$dAff._bind(timeOperation("Collect 100K elements")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      return rangeHelper(1)(100001);
    })())))(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(reportThroughput("collect")(100000)(end + -start)))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  Array size: " + Data$dShow.showIntImpl(result.length))))(() => Effect$dAff._pure(result))))))))(() => Effect$dAff._bind(timeOperation("Take 10K from 1M elements")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
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
        return takeHelper(10000)((() => {
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
        })());
      })()
    ))))(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  Duration: " + Data$dShow.showNumberImpl(end + -start) + "ms (should be fast!)")))(() => Effect$dAff._pure(result)))))))(() => Effect$dAff._bind(timeOperation("Non-deterministic merge of 2x500K elements")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
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
    ))))(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(reportThroughput("mergeND")(1000000)(end + -start)))(() => Effect$dAff._pure(result)))))))(() => Effect$dAff._bind(timeOperation("Parallel map (concurrency=4) on 1000 elements")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
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
    ))))(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(reportThroughput("mapPar(4)")(1000)(end + -start)))(() => Effect$dAff._pure(result)))))))(() => Effect$dAff._bind(timeOperation("Infinite stream, take 1M elements")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
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
        return takeHelper(1000000)(Yoga$dOm$dStrom.iterateStromInfinite(v => v + 1 | 0)(0));
      })()
    ))))(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(reportThroughput("infinite+take")(1000000)(end + -start)))(() => Effect$dAff._pure(result)))))))(() => Effect$dAff._bind(timeOperation("Scan (running sum) over 1M elements")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
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
          return rangeHelper(1)(1000001);
        })());
      })()
    ))))(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(reportThroughput("scan")(1000000)(end + -start)))(() => Effect$dAff._pure(result)))))))(() => Effect$dAff._bind(timeOperation("Unfold 100K elements")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(start => Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
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
        if (n > 100000) { return Data$dMaybe.Nothing; }
        return Data$dMaybe.$Maybe("Just", Data$dTuple.$Tuple(n, n + 1 | 0));
      })(1)
    ))))(result => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dNow.now))(end => Effect$dAff._bind(Effect$dAff._liftEffect(reportThroughput("unfold")(100000)(end + -start)))(() => Effect$dAff._pure(result)))))))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("\n✨ Benchmark suite complete!")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("\n📈 Summary:")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("- Basic operations (map, filter): should be 1-10M elements/sec")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("- Pipelines: still fast due to chunking")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("- Take/early termination: should be near-instant")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("- Concurrent operations: good speedup")))(() => Effect$dAff._liftEffect(Effect$dConsole.log("- Infinite streams: stack-safe and fast"))))))))))))))))))))))
  );
  return () => {
    const fiber = $0();
    fiber.run();
  };
})();
export {main, reportThroughput, runOm, timeOperation};
