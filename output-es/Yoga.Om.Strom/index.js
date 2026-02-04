// @inline export mkStrom arity=1
// @inline export runStrom arity=1
// @inline export mapStrom arity=2
// @inline export filterStrom arity=2
// @inline export takeStrom arity=2
// @inline export runFold arity=3
// @inline export runDrain arity=1
// @inline export rangeStrom arity=2
// @inline export scanStrom arity=3
// @inline export zipWithStrom arity=3
// @inline export mapPar arity=3
// @inline export bindStrom arity=2
import * as $runtime from "../runtime.js";
import * as Control$dApply from "../Control.Apply/index.js";
import * as Control$dBind from "../Control.Bind/index.js";
import * as Control$dMonad$dRec$dClass from "../Control.Monad.Rec.Class/index.js";
import * as Data$dArray from "../Data.Array/index.js";
import * as Data$dArray$dST$dIterator from "../Data.Array.ST.Iterator/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dFunctor from "../Data.Functor/index.js";
import * as Data$dList$dTypes from "../Data.List.Types/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dMonoid from "../Data.Monoid/index.js";
import * as Data$dOrd from "../Data.Ord/index.js";
import * as Data$dTraversable from "../Data.Traversable/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Effect$dAff$dAVar from "../Effect.Aff.AVar/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import * as Effect$dNow from "../Effect.Now/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
const $StreamId = tag => tag;
const traverse = /* #__PURE__ */ (() => Data$dTraversable.traversableArray.traverse(Yoga$dOm.applicativeOm))();
const intercalate = /* #__PURE__ */ Data$dArray.intercalate1(Data$dMonoid.monoidArray);
const filterA = /* #__PURE__ */ Data$dArray.filterA(Yoga$dOm.applicativeOm);
const min = x => y => {
  const v = Data$dOrd.ordInt.compare(x)(y);
  if (v === "LT") { return x; }
  if (v === "EQ") { return x; }
  if (v === "GT") { return y; }
  $runtime.fail();
};
const identity = x => x;
const StreamId1 = /* #__PURE__ */ $StreamId("StreamId1");
const StreamId2 = /* #__PURE__ */ $StreamId("StreamId2");
const runStrom = v => v.pull;
const traverseStrom_ = f => stream => Yoga$dOm.monadRecOm.tailRecM(s => Yoga$dOm.bindOm.bind(s.pull)(step => {
  if (step.tag === "Done") {
    if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", undefined)); }
    if (step._1.tag === "Just") { return Yoga$dOm.bindOm.bind(traverse(f)(step._1._1))(() => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", undefined))); }
    $runtime.fail();
  }
  if (step.tag === "Loop") {
    const $0 = step._1._2;
    return Yoga$dOm.bindOm.bind((() => {
      if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(); }
      if (step._1._1.tag === "Just") {
        const $1 = traverse(f)(step._1._1._1);
        return (environment, state0, more, lift$p, error, done) => more(v1 => $1(environment, state0, more, lift$p, error, (state1, a, w) => more(v2 => done(state1, undefined, w))));
      }
      $runtime.fail();
    })())(() => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", $0)));
  }
  $runtime.fail();
}))(stream);
const traverseMStrom_ = traverseStrom_;
const runFold = initial => f => stream => Yoga$dOm.monadRecOm.tailRecM(v => {
  const $0 = v._1;
  return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
    if (step.tag === "Done") {
      if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
      if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(f)($0)(step._1._1))); }
      $runtime.fail();
    }
    if (step.tag === "Loop") {
      if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
      if (step._1._1.tag === "Just") {
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dFoldable.foldlArray(f)($0)(step._1._1._1), step._1._2)));
      }
    }
    $runtime.fail();
  });
})(Data$dTuple.$Tuple(initial, stream));
const runDrain = /* #__PURE__ */ runFold()(v => v1 => {});
const runCollect = stream => Yoga$dOm.monadRecOm.tailRecM(v => {
  const $0 = v._1;
  return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
    if (step.tag === "Done") {
      if (step._1.tag === "Nothing") {
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
          "Done",
          Data$dArray.concat((() => {
            const go = go$a0$copy => go$a1$copy => {
              let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
              while (go$c) {
                const v$1 = go$a0, v1 = go$a1;
                if (v1.tag === "Nil") {
                  go$c = false;
                  go$r = v$1;
                  continue;
                }
                if (v1.tag === "Cons") {
                  go$a0 = Data$dList$dTypes.$List("Cons", v1._1, v$1);
                  go$a1 = v1._2;
                  continue;
                }
                $runtime.fail();
              }
              return go$r;
            };
            return Data$dArray.fromFoldableImpl(Data$dList$dTypes.foldableList.foldr, go(Data$dList$dTypes.Nil)($0));
          })())
        ));
      }
      if (step._1.tag === "Just") {
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
          "Done",
          Data$dArray.concat((() => {
            const go = go$a0$copy => go$a1$copy => {
              let go$a0 = go$a0$copy, go$a1 = go$a1$copy, go$c = true, go$r;
              while (go$c) {
                const v$1 = go$a0, v1 = go$a1;
                if (v1.tag === "Nil") {
                  go$c = false;
                  go$r = v$1;
                  continue;
                }
                if (v1.tag === "Cons") {
                  go$a0 = Data$dList$dTypes.$List("Cons", v1._1, v$1);
                  go$a1 = v1._2;
                  continue;
                }
                $runtime.fail();
              }
              return go$r;
            };
            return Data$dArray.fromFoldableImpl(Data$dList$dTypes.foldableList.foldr, go(Data$dList$dTypes.Nil)(Data$dList$dTypes.$List("Cons", step._1._1, $0)));
          })())
        ));
      }
      $runtime.fail();
    }
    if (step.tag === "Loop") {
      if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
      if (step._1._1.tag === "Just") {
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dList$dTypes.$List("Cons", step._1._1._1, $0), step._1._2)));
      }
    }
    $runtime.fail();
  });
})(Data$dTuple.$Tuple(Data$dList$dTypes.Nil, stream));
const race = s1 => s2 => ({pull: Yoga$dOm.race([s1.pull, s2.pull])});
const raceAll = streams => ({pull: Yoga$dOm.race(Data$dFunctor.arrayMap(runStrom)(streams))});
const repeatOmStromInfinite = om => {
  const repeatOmHelper = v => (
    {
      pull: Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(Data$dEither.Right, 0.0))))(v2 => {
        if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
        if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
        $runtime.fail();
      }))(() => Yoga$dOm.bindOm.bind(om)(value => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
        "Loop",
        Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", [value]), repeatOmHelper())
      ))))
    }
  );
  return repeatOmHelper();
};
const repeatStromInfinite = a => {
  const repeatHelper = v => (
    {
      pull: Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(Data$dEither.Right, 0.0))))(v2 => {
        if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
        if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
        $runtime.fail();
      }))(() => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
        "Loop",
        Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", Data$dArray.replicateImpl(10000, a)), repeatHelper())
      )))
    }
  );
  return repeatHelper();
};
const scanStrom = f => initial => stream => {
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
                const newAcc = f($1)(item);
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
                const currAcc = f($1)(item);
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
  return scanHelper(initial)(stream);
};
const succeed = a => ({pull: Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", [a])))});
const takeUntilStrom = predicate => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          const v = Data$dArray.findIndexImpl(Data$dMaybe.Just, Data$dMaybe.Nothing, predicate, step._1._1);
          if (v.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Done",
              Data$dMaybe.$Maybe(
                "Just",
                (() => {
                  const $0 = v._1 + 1 | 0;
                  if ($0 < 1) { return []; }
                  return Data$dArray.sliceImpl(0, $0, step._1._1);
                })()
              )
            ));
          }
          if (v.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", step._1._1))); }
        }
        $runtime.fail();
      }
      if (step.tag === "Loop") {
        if (step._1._1.tag === "Nothing") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, takeUntilStrom(predicate)(step._1._2))));
        }
        if (step._1._1.tag === "Just") {
          const v = Data$dArray.findIndexImpl(Data$dMaybe.Just, Data$dMaybe.Nothing, predicate, step._1._1._1);
          if (v.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Done",
              Data$dMaybe.$Maybe(
                "Just",
                (() => {
                  const $0 = v._1 + 1 | 0;
                  if ($0 < 1) { return []; }
                  return Data$dArray.sliceImpl(0, $0, step._1._1._1);
                })()
              )
            ));
          }
          if (v.tag === "Nothing") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", step._1._1._1), takeUntilStrom(predicate)(step._1._2))
            ));
          }
        }
      }
      $runtime.fail();
    })
  }
);
const takeWhileStrom = predicate => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          const taken = Data$dArray.span(predicate)(step._1._1).init;
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", taken)));
        }
        $runtime.fail();
      }
      if (step.tag === "Loop") {
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(step._1._1, takeWhileStrom(predicate)(step._1._2))));
      }
      $runtime.fail();
    })
  }
);
const tapMStrom = f => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          const $0 = step._1._1;
          return Yoga$dOm.bindOm.bind(traverse(f)($0))(() => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0))));
        }
        $runtime.fail();
      }
      if (step.tag === "Loop") {
        const $0 = step._1._2;
        return Yoga$dOm.bindOm.bind((() => {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Data$dMaybe.Nothing); }
          if (step._1._1.tag === "Just") {
            const $1 = step._1._1._1;
            return Yoga$dOm.bindOm.bind(traverse(f)($1))(() => Yoga$dOm.applicativeOm.pure(Data$dMaybe.$Maybe("Just", $1)));
          }
          $runtime.fail();
        })())(tappedChunk => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(tappedChunk, tapMStrom(f)($0)))));
      }
      $runtime.fail();
    })
  }
);
const tapStrom = f => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", step._1._1))); }
        $runtime.fail();
      }
      if (step.tag === "Loop") {
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
          "Loop",
          Data$dTuple.$Tuple(
            (() => {
              if (step._1._1.tag === "Nothing") { return Data$dMaybe.Nothing; }
              if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", step._1._1._1); }
              $runtime.fail();
            })(),
            tapStrom(f)(step._1._2)
          )
        ));
      }
      $runtime.fail();
    })
  }
);
const throttle = v => stream => {
  const filterByTime = (lastEmit, chunk) => Yoga$dOm.bindOm.bind(Data$dFoldable.foldlArray(acc => value => Yoga$dOm.bindOm.bind(acc)(v1 => {
    const $0 = v1._1;
    const $1 = v1._2;
    return Yoga$dOm.bindOm.bind(Yoga$dOm.monadEffectOm.liftEffect(Effect$dNow.now))(currentTime => {
      if (currentTime - $0 >= v) { return Yoga$dOm.applicativeOm.pure(Data$dTuple.$Tuple(currentTime, Data$dArray.snoc($1)(value))); }
      return Yoga$dOm.applicativeOm.pure(Data$dTuple.$Tuple($0, $1));
    });
  }))(Yoga$dOm.applicativeOm.pure(Data$dTuple.$Tuple(lastEmit, [])))(chunk))(v1 => Yoga$dOm.applicativeOm.pure(Data$dTuple.$Tuple(v1._1, v1._2)));
  const throttleWithState = lastEmit => s => (
    {
      pull: Yoga$dOm.bindOm.bind(s.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.bindOm.bind(filterByTime(lastEmit, step._1._1))(v1 => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Done",
              v1._2.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", v1._2)
            )));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, throttleWithState(lastEmit)(step._1._2))));
          }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.bindOm.bind(filterByTime(lastEmit, step._1._1._1))(v1 => {
              if (v1._2.length === 0) {
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, throttleWithState(v1._1)(step._1._2))));
              }
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", v1._2), throttleWithState(v1._1)(step._1._2))
              ));
            });
          }
        }
        $runtime.fail();
      })
    }
  );
  return throttleWithState(0.0)(stream);
};
const unfoldOmStrom = f => seed => (
  {
    pull: Yoga$dOm.bindOm.bind(f(seed))(result => {
      if (result.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
      if (result.tag === "Just") {
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", [result._1._1]), unfoldOmStrom(f)(result._1._2))));
      }
      $runtime.fail();
    })
  }
);
const unfoldStrom = f => seed => {
  const unfoldHelper = currentSeed => {
    const chunk = (() => {
      const arr = [];
      let seedRef = currentSeed;
      let stoppedRef = false;
      const $0 = {value: 0};
      Data$dArray$dST$dIterator.iterate(Data$dArray$dST$dIterator.$Iterator(
        i => {
          if (i < 10000) { return Data$dMaybe.$Maybe("Just", i); }
          return Data$dMaybe.Nothing;
        },
        $0
      ))(v => () => {
        const stopped = stoppedRef;
        if (!stopped) {
          const s = seedRef;
          const v1 = f(s);
          if (v1.tag === "Nothing") {
            stoppedRef = true;
            return;
          }
          if (v1.tag === "Just") {
            arr.push(v1._1._1);
            seedRef = v1._1._2;
            return;
          }
          $runtime.fail();
        }
      })();
      const stopped = stoppedRef;
      const finalSeed = seedRef;
      return {values: arr, finalSeed: stopped ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", finalSeed)};
    })();
    return {
      pull: (() => {
        if (chunk.finalSeed.tag === "Nothing") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", chunk.values.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", chunk.values)));
        }
        if (chunk.finalSeed.tag === "Just") {
          if (chunk.values.length === 0) { return unfoldHelper(chunk.finalSeed._1).pull; }
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
            "Loop",
            Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", chunk.values), unfoldHelper(chunk.finalSeed._1))
          ));
        }
        $runtime.fail();
      })()
    };
  };
  return unfoldHelper(seed);
};
const zipWithStrom = f => s1 => s2 => (
  {
    pull: Yoga$dOm.bindOm.bind(s1.pull)(step1 => Yoga$dOm.bindOm.bind(s2.pull)(step2 => {
      if (step1.tag === "Done") {
        if (step1._1.tag === "Just") {
          if (step2.tag === "Done") {
            if (step2._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dArray.zipWithImpl(f, step1._1._1, step2._1._1))));
            }
            if (step2._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            $runtime.fail();
          }
          if (step2.tag === "Loop") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, zipWithStrom(f)(s1)(step2._1._2))));
          }
          $runtime.fail();
        }
        if (step1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step2.tag === "Done") {
          if (step2._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          $runtime.fail();
        }
        if (step2.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, zipWithStrom(f)(s1)(step2._1._2))));
        }
        $runtime.fail();
      }
      if (step2.tag === "Done") {
        if (step2._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step1.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, zipWithStrom(f)(step1._1._2)(s2))));
        }
        $runtime.fail();
      }
      if (step1.tag === "Loop") {
        if (step2.tag === "Loop") {
          if (step1._1._1.tag === "Just" && step2._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", Data$dArray.zipWithImpl(f, step1._1._1._1, step2._1._1._1)), zipWithStrom(f)(step1._1._2)(step2._1._2))
            ));
          }
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, zipWithStrom(f)(step1._1._2)(step2._1._2))));
        }
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, zipWithStrom(f)(step1._1._2)(s2))));
      }
      if (step2.tag === "Loop") {
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, zipWithStrom(f)(s1)(step2._1._2))));
      }
      $runtime.fail();
    }))
  }
);
const zipStrom = /* #__PURE__ */ zipWithStrom(Data$dTuple.Tuple);
const functorStrom = {
  map: f => stream => (
    {
      pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(f)(step._1._1))));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
            "Loop",
            Data$dTuple.$Tuple(
              (() => {
                const $0 = Data$dFunctor.arrayMap(f);
                if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                return Data$dMaybe.Nothing;
              })(),
              functorStrom.map(f)(step._1._2)
            )
          ));
        }
        $runtime.fail();
      })
    }
  )
};
const altStrom = {
  alt: s1 => s2 => (
    {
      pull: Yoga$dOm.bindOm.bind(s1.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return s2.pull; }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", step._1._1), s2)));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(step._1._1, altStrom.alt(step._1._2)(s2)))); }
        $runtime.fail();
      })
    }
  ),
  Functor0: () => functorStrom
};
const applyStrom = {
  apply: fs => as => (
    {
      pull: Yoga$dOm.bindOm.bind(fs.pull)(stepF => Yoga$dOm.bindOm.bind(as.pull)(stepA => {
        if (stepF.tag === "Done") {
          if (stepF._1.tag === "Just") {
            if (stepA.tag === "Done") {
              if (stepA._1.tag === "Just") {
                const $0 = stepA._1._1;
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Done",
                  Data$dMaybe.$Maybe("Just", Control$dBind.arrayBind(stepF._1._1)(f => Control$dBind.arrayBind($0)(a => [f(a)])))
                ));
              }
              if (stepA._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
              $runtime.fail();
            }
            if (stepA.tag === "Loop") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, applyStrom.apply(fs)(stepA._1._2))));
            }
            $runtime.fail();
          }
          if (stepF._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (stepA.tag === "Done") {
            if (stepA._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            $runtime.fail();
          }
          if (stepA.tag === "Loop") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, applyStrom.apply(fs)(stepA._1._2))));
          }
          $runtime.fail();
        }
        if (stepA.tag === "Done") {
          if (stepA._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (stepF.tag === "Loop") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, applyStrom.apply(stepF._1._2)(as))));
          }
          $runtime.fail();
        }
        if (stepF.tag === "Loop") {
          if (stepA.tag === "Loop") {
            if (stepF._1._1.tag === "Just" && stepA._1._1.tag === "Just") {
              const $0 = stepA._1._1._1;
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(
                  Data$dMaybe.$Maybe("Just", Control$dBind.arrayBind(stepF._1._1._1)(f => Control$dBind.arrayBind($0)(a => [f(a)]))),
                  applyStrom.apply(stepF._1._2)(stepA._1._2)
                )
              ));
            }
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, applyStrom.apply(stepF._1._2)(stepA._1._2))));
          }
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, applyStrom.apply(stepF._1._2)(as))));
        }
        if (stepA.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, applyStrom.apply(fs)(stepA._1._2))));
        }
        $runtime.fail();
      }))
    }
  ),
  Functor0: () => functorStrom
};
const applicativeStrom = {pure: succeed, Apply0: () => applyStrom};
const plusStrom = /* #__PURE__ */ (() => ({empty: {pull: Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing))}, Alt0: () => altStrom}))();
const alternativeStrom = {Applicative0: () => applicativeStrom, Plus1: () => plusStrom};
const semigroupStrom = {
  append: s1 => s2 => (
    {
      pull: Yoga$dOm.bindOm.bind(s1.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return s2.pull; }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", step._1._1), s2)));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(step._1._1, semigroupStrom.append(step._1._2)(s2))));
        }
        $runtime.fail();
      })
    }
  )
};
const mergeND = stream1 => stream2 => (
  {
    pull: Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(ctx => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._bind(Effect$dAff$dAVar.empty)(queue => Effect$dAff._bind(Effect$dAff.forkAff((() => {
      const producer = s => Effect$dAff._bind(Yoga$dOm.runReader(ctx)(s.pull))(stepResult => Effect$dAff._bind((() => {
        if (stepResult.tag === "Left") { return Effect$dAff._throwError(Effect$dException.error("Stream error")); }
        if (stepResult.tag === "Right") { return Effect$dAff._pure(stepResult._1); }
        $runtime.fail();
      })())(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Effect$dAff$dAVar.put(Data$dEither.$Either("Left", StreamId1))(queue); }
          if (step._1.tag === "Just") {
            return Effect$dAff._bind(Effect$dAff$dAVar.put(Data$dEither.$Either("Right", step._1._1))(queue))(() => Effect$dAff$dAVar.put(Data$dEither.$Either("Left", StreamId1))(queue));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          const $0 = step._1._2;
          return Effect$dAff._bind((() => {
            if (step._1._1.tag === "Just") { return Effect$dAff$dAVar.put(Data$dEither.$Either("Right", step._1._1._1))(queue); }
            if (step._1._1.tag === "Nothing") { return Effect$dAff._pure(); }
            $runtime.fail();
          })())(() => producer($0));
        }
        $runtime.fail();
      }));
      return producer(stream1);
    })()))(fiber1 => Effect$dAff._bind(Effect$dAff.forkAff((() => {
      const producer = s => Effect$dAff._bind(Yoga$dOm.runReader(ctx)(s.pull))(stepResult => Effect$dAff._bind((() => {
        if (stepResult.tag === "Left") { return Effect$dAff._throwError(Effect$dException.error("Stream error")); }
        if (stepResult.tag === "Right") { return Effect$dAff._pure(stepResult._1); }
        $runtime.fail();
      })())(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Effect$dAff$dAVar.put(Data$dEither.$Either("Left", StreamId2))(queue); }
          if (step._1.tag === "Just") {
            return Effect$dAff._bind(Effect$dAff$dAVar.put(Data$dEither.$Either("Right", step._1._1))(queue))(() => Effect$dAff$dAVar.put(Data$dEither.$Either("Left", StreamId2))(queue));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          const $0 = step._1._2;
          return Effect$dAff._bind((() => {
            if (step._1._1.tag === "Just") { return Effect$dAff$dAVar.put(Data$dEither.$Either("Right", step._1._1._1))(queue); }
            if (step._1._1.tag === "Nothing") { return Effect$dAff._pure(); }
            $runtime.fail();
          })())(() => producer($0));
        }
        $runtime.fail();
      }));
      return producer(stream2);
    })()))(fiber2 => {
      const consumer = doneCount => (
        {
          pull: Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(doneCount >= 2
            ? Effect$dAff._bind(Effect$dAff.killFiber(Effect$dException.error("done"))(fiber1))(() => Effect$dAff._bind(Effect$dAff.killFiber(Effect$dException.error("done"))(fiber2))(() => Effect$dAff._pure(Control$dMonad$dRec$dClass.$Step(
                "Done",
                Data$dMaybe.Nothing
              ))))
            : Effect$dAff._bind(Effect$dAff$dAVar.take(queue))(msg => {
                if (msg.tag === "Left") {
                  return Effect$dAff._bind(Yoga$dOm.runReader(ctx)(consumer(doneCount + 1 | 0).pull))(stepResult => {
                    if (stepResult.tag === "Left") { return Effect$dAff._throwError(Effect$dException.error("Consumer error")); }
                    if (stepResult.tag === "Right") { return Effect$dAff._pure(stepResult._1); }
                    $runtime.fail();
                  });
                }
                if (msg.tag === "Right") {
                  return Effect$dAff._pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", msg._1), consumer(doneCount))));
                }
                $runtime.fail();
              }))))(v2 => {
            if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
            if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
            $runtime.fail();
          })
        }
      );
      return Effect$dAff._bind(Yoga$dOm.runReader(ctx)(consumer(0).pull))(stepResult => {
        if (stepResult.tag === "Left") { return Effect$dAff._throwError(Effect$dException.error("Consumer init error")); }
        if (stepResult.tag === "Right") { return Effect$dAff._pure(stepResult._1); }
        $runtime.fail();
      });
    }))))))(v2 => {
      if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
      if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
      $runtime.fail();
    }))
  }
);
const merge = s1 => s2 => (
  {
    pull: Yoga$dOm.bindOm.bind(s1.pull)(step1 => Yoga$dOm.bindOm.bind(s2.pull)(step2 => {
      if (step1.tag === "Done") {
        if (step2.tag === "Done") {
          if (step1._1.tag === "Nothing") {
            if (step2._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            if (step2._1.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", step2._1._1))); }
            $runtime.fail();
          }
          if (step1._1.tag === "Just") {
            if (step2._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", step1._1._1))); }
            if (step2._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", [...step1._1._1, ...step2._1._1])));
            }
          }
          $runtime.fail();
        }
        if (step2.tag === "Loop") {
          if (step1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(step2._1._1, step2._1._2))); }
          if (step1._1.tag === "Just") {
            if (step2._1._1.tag === "Nothing") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", step1._1._1), step2._1._2)));
            }
            if (step2._1._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", [...step1._1._1, ...step2._1._1._1]), step2._1._2)
              ));
            }
          }
        }
        $runtime.fail();
      }
      if (step1.tag === "Loop") {
        if (step2.tag === "Done") {
          if (step2._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(step1._1._1, step1._1._2))); }
          if (step2._1.tag === "Just") {
            if (step1._1._1.tag === "Nothing") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", step2._1._1), step1._1._2)));
            }
            if (step1._1._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", [...step1._1._1._1, ...step2._1._1]), step1._1._2)
              ));
            }
          }
          $runtime.fail();
        }
        if (step2.tag === "Loop") {
          if (step2._1._1.tag === "Nothing") {
            if (step1._1._1.tag === "Nothing") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, merge(step1._1._2)(step2._1._2))));
            }
            if (step1._1._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", step1._1._1._1), merge(step1._1._2)(step2._1._2))
              ));
            }
            $runtime.fail();
          }
          if (step2._1._1.tag === "Just") {
            if (step1._1._1.tag === "Nothing") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", step2._1._1._1), merge(step1._1._2)(step2._1._2))
              ));
            }
            if (step1._1._1.tag === "Just") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", [...step1._1._1._1, ...step2._1._1._1]), merge(step1._1._2)(step2._1._2))
              ));
            }
          }
        }
      }
      $runtime.fail();
    }))
  }
);
const mapStrom = f => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(f)(step._1._1))));
        }
        $runtime.fail();
      }
      if (step.tag === "Loop") {
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
          "Loop",
          Data$dTuple.$Tuple(
            (() => {
              const $0 = Data$dFunctor.arrayMap(f);
              if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
              return Data$dMaybe.Nothing;
            })(),
            mapStrom(f)(step._1._2)
          )
        ));
      }
      $runtime.fail();
    })
  }
);
const mapMStrom = f => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          return Yoga$dOm.bindOm.bind(traverse(f)(step._1._1))(mapped => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", mapped))));
        }
        $runtime.fail();
      }
      if (step.tag === "Loop") {
        const $0 = step._1._2;
        return Yoga$dOm.bindOm.bind((() => {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Data$dMaybe.Nothing); }
          if (step._1._1.tag === "Just") {
            const $1 = traverse(f)(step._1._1._1);
            return (environment, state0, more, lift$p, error, done) => more(v1 => $1(
              environment,
              state0,
              more,
              lift$p,
              error,
              (state1, a, w) => more(v2 => done(state1, Data$dMaybe.$Maybe("Just", a), w))
            ));
          }
          $runtime.fail();
        })())(mappedChunk => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(mappedChunk, mapMStrom(f)($0)))));
      }
      $runtime.fail();
    })
  }
);
const mapPar = concurrency => f => stream => {
  if (concurrency <= 1) { return mapMStrom(f)(stream); }
  const chunksOf = n => arr => {
    if (n <= 0 || arr.length === 0) { return []; }
    const rest = n < 1 ? arr : Data$dArray.sliceImpl(n, arr.length, arr);
    const group = n < 1 ? [] : Data$dArray.sliceImpl(0, n, arr);
    if (group.length === 0) { return []; }
    return [group, ...chunksOf(n)(rest)];
  };
  return {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          return Yoga$dOm.bindOm.bind(traverse(group => Yoga$dOm.inParallel(Data$dFunctor.arrayMap(f)(group)))(chunksOf(concurrency)(step._1._1)))(results => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
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
            return Yoga$dOm.bindOm.bind(traverse(group => Yoga$dOm.inParallel(Data$dFunctor.arrayMap(f)(group)))(chunksOf(concurrency)(step._1._1._1)))(results => Yoga$dOm.applicativeOm.pure(Data$dMaybe.$Maybe(
              "Just",
              Data$dArray.concat(results)
            )));
          }
          $runtime.fail();
        })())(mappedChunk => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(mappedChunk, mapPar(concurrency)(f)($0)))));
      }
      $runtime.fail();
    })
  };
};
const mapMPar = mapPar;
const mapAccumStrom = f => initial => stream => {
  const mapAccumHelper = state => s => (
    {
      pull: Yoga$dOm.bindOm.bind(s.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            const v = Data$dFoldable.foldlArray(v1 => {
              const $0 = v1._2;
              const $1 = v1._1;
              return a => {
                const v2 = f($1)(a);
                return Data$dTuple.$Tuple(v2._1, Data$dArray.snoc($0)(v2._2));
              };
            })(Data$dTuple.$Tuple(state, []))(step._1._1);
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", v._2.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", v._2)));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, mapAccumHelper(state)(step._1._2))));
          }
          if (step._1._1.tag === "Just") {
            const v = Data$dFoldable.foldlArray(v1 => {
              const $0 = v1._2;
              const $1 = v1._1;
              return a => {
                const v2 = f($1)(a);
                return Data$dTuple.$Tuple(v2._1, Data$dArray.snoc($0)(v2._2));
              };
            })(Data$dTuple.$Tuple(state, []))(step._1._1._1);
            if (v._2.length === 0) {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, mapAccumHelper(v._1)(step._1._2))));
            }
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", v._2), mapAccumHelper(v._1)(step._1._2))));
          }
        }
        $runtime.fail();
      })
    }
  );
  return mapAccumHelper(initial)(stream);
};
const iterateStromInfinite = f => initial => {
  const iterateHelper = current => (
    {
      pull: Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(Data$dEither.Right, 0.0))))(v2 => {
        if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
        if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
        $runtime.fail();
      }))(() => {
        const result = (() => {
          const arr = [];
          let valRef = current;
          const $0 = {value: 0};
          Data$dArray$dST$dIterator.iterate(Data$dArray$dST$dIterator.$Iterator(
            i => {
              if (i < 10000) { return Data$dMaybe.$Maybe("Just", i); }
              return Data$dMaybe.Nothing;
            },
            $0
          ))(v => () => {
            const val = valRef;
            arr.push(val);
            const $1 = valRef;
            valRef = f($1);
          })();
          const finalVal = valRef;
          return {arr, nextVal: finalVal};
        })();
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", result.arr), iterateHelper(result.nextVal))));
      })
    }
  );
  return iterateHelper(initial);
};
const intersperse = separator => stream => {
  const intersperseHelper = isFirst => s => (
    {
      pull: Yoga$dOm.bindOm.bind(s.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Done",
              Data$dMaybe.$Maybe(
                "Just",
                isFirst
                  ? intercalate([separator])(Data$dFunctor.arrayMap(Data$dArray.singleton)(step._1._1))
                  : [separator, ...intercalate([separator])(Data$dFunctor.arrayMap(Data$dArray.singleton)(step._1._1))]
              )
            ));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, intersperseHelper(isFirst)(step._1._2))));
          }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(
                Data$dMaybe.$Maybe(
                  "Just",
                  isFirst
                    ? intercalate([separator])(Data$dFunctor.arrayMap(Data$dArray.singleton)(step._1._1._1))
                    : [separator, ...intercalate([separator])(Data$dFunctor.arrayMap(Data$dArray.singleton)(step._1._1._1))]
                ),
                intersperseHelper(false)(step._1._2)
              )
            ));
          }
        }
        $runtime.fail();
      })
    }
  );
  return intersperseHelper(true)(stream);
};
const interleave = s1 => s2 => {
  const interleaveHelper = preferFirst => first => second => (
    {
      pull: preferFirst
        ? Yoga$dOm.bindOm.bind(first.pull)(step1 => {
            if (step1.tag === "Done") {
              if (step1._1.tag === "Nothing") { return second.pull; }
              if (step1._1.tag === "Just") {
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Loop",
                  Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", step1._1._1), interleaveHelper(false)(second)(first))
                ));
              }
              $runtime.fail();
            }
            if (step1.tag === "Loop") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(step1._1._1, interleaveHelper(false)(second)(step1._1._2))));
            }
            $runtime.fail();
          })
        : Yoga$dOm.bindOm.bind(second.pull)(step2 => {
            if (step2.tag === "Done") {
              if (step2._1.tag === "Nothing") { return first.pull; }
              if (step2._1.tag === "Just") {
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Loop",
                  Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", step2._1._1), interleaveHelper(true)(first)(second))
                ));
              }
              $runtime.fail();
            }
            if (step2.tag === "Loop") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(step2._1._1, interleaveHelper(true)(first)(step2._1._2))));
            }
            $runtime.fail();
          })
    }
  );
  return interleaveHelper(true)(s1)(s2);
};
const groupByStrom = dictEq => keyFn => stream => {
  const groupByHelper = lastKey => buffer => s => (
    {
      pull: Yoga$dOm.bindOm.bind(s.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", buffer.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", [buffer])));
          }
          if (step._1.tag === "Just") {
            const $0 = Data$dFoldable.foldlArray(v1 => {
              const $0 = v1._2;
              const $1 = v1._1;
              return item => {
                const itemKey = keyFn(item);
                if ($1.tag === "Nothing") { return Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", itemKey), {groups: [], buffer: [item]}); }
                if ($1.tag === "Just") {
                  if (dictEq.eq($1._1)(itemKey)) { return Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", itemKey), {groups: $0.groups, buffer: Data$dArray.snoc($0.buffer)(item)}); }
                  return Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", itemKey), {groups: Data$dArray.snoc($0.groups)($0.buffer), buffer: [item]});
                }
                $runtime.fail();
              };
            })(Data$dTuple.$Tuple(lastKey, {groups: [], buffer}))(step._1._1)._2;
            const allGroups = $0.buffer.length === 0 ? $0.groups : Data$dArray.snoc($0.groups)($0.buffer);
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", allGroups.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", allGroups)));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, groupByHelper(lastKey)(buffer)(step._1._2))));
          }
          if (step._1._1.tag === "Just") {
            const v = Data$dFoldable.foldlArray(v1 => {
              const $0 = v1._2;
              const $1 = v1._1;
              return item => {
                const itemKey = keyFn(item);
                if ($1.tag === "Nothing") { return Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", itemKey), {groups: [], buffer: [item]}); }
                if ($1.tag === "Just") {
                  if (dictEq.eq($1._1)(itemKey)) { return Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", itemKey), {groups: $0.groups, buffer: Data$dArray.snoc($0.buffer)(item)}); }
                  return Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", itemKey), {groups: Data$dArray.snoc($0.groups)($0.buffer), buffer: [item]});
                }
                $runtime.fail();
              };
            })(Data$dTuple.$Tuple(lastKey, {groups: [], buffer}))(step._1._1._1);
            if (v._2.groups.length === 0) {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, groupByHelper(v._1)(v._2.buffer)(step._1._2))));
            }
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", v._2.groups), groupByHelper(v._1)(v._2.buffer)(step._1._2))
            ));
          }
        }
        $runtime.fail();
      })
    }
  );
  return groupByHelper(Data$dMaybe.Nothing)([])(stream);
};
const fromOm = om => ({pull: Yoga$dOm.bindOm.bind(om)(value => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", [value]))))});
const fromArray = arr => {
  if (arr.length === 0) { return {pull: Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing))}; }
  return {pull: Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", arr)))};
};
const fromFoldable = dictFoldable => {
  const $0 = dictFoldable.foldr;
  return x => fromArray(Data$dArray.fromFoldableImpl($0, x));
};
const iterateStrom = f => initial => fromArray((() => {
  const arr = [];
  let valRef = initial;
  const $0 = {value: 0};
  Data$dArray$dST$dIterator.iterate(Data$dArray$dST$dIterator.$Iterator(
    i => {
      if (i < 10000) { return Data$dMaybe.$Maybe("Just", i); }
      return Data$dMaybe.Nothing;
    },
    $0
  ))(v => () => {
    const v1 = valRef;
    arr.push(v1);
    const $1 = valRef;
    valRef = f($1);
  })();
  return arr;
})());
const repeatStrom = a => fromArray(Data$dArray.replicateImpl(10000, a));
const fromAff = aff => (
  {
    pull: Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(aff)))(v2 => {
      if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
      if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
      $runtime.fail();
    }))(value => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", [value]))))
  }
);
const foreachPar = concurrency => f => stream => Yoga$dOm.monadRecOm.tailRecM(v => {
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
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dFoldable.foldlArray(v$1 => v1 => {})($0)(step._1._1._1), step._1._2)));
      }
    }
    $runtime.fail();
  });
})(Data$dTuple.$Tuple(
  undefined,
  (() => {
    if (concurrency <= 1) { return mapMStrom(f)(stream); }
    const chunksOf = n => arr => {
      if (n <= 0 || arr.length === 0) { return []; }
      const rest = n < 1 ? arr : Data$dArray.sliceImpl(n, arr.length, arr);
      const group = n < 1 ? [] : Data$dArray.sliceImpl(0, n, arr);
      if (group.length === 0) { return []; }
      return [group, ...chunksOf(n)(rest)];
    };
    return {
      pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.bindOm.bind(traverse(group => Yoga$dOm.inParallel(Data$dFunctor.arrayMap(f)(group)))(chunksOf(concurrency)(step._1._1)))(results => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
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
              return Yoga$dOm.bindOm.bind(traverse(group => Yoga$dOm.inParallel(Data$dFunctor.arrayMap(f)(group)))(chunksOf(concurrency)(step._1._1._1)))(results => Yoga$dOm.applicativeOm.pure(Data$dMaybe.$Maybe(
                "Just",
                Data$dArray.concat(results)
              )));
            }
            $runtime.fail();
          })())(mappedChunk => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(mappedChunk, mapPar(concurrency)(f)($0)))));
        }
        $runtime.fail();
      })
    };
  })()
));
const forStrom_ = b => a => traverseStrom_(a)(b);
const forMStrom_ = forStrom_;
const filterStrom = predicate => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          const filtered = Data$dArray.filterImpl(predicate, step._1._1);
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
                const filtered = Data$dArray.filterImpl(predicate, step._1._1._1);
                if (filtered.length === 0) { return Data$dMaybe.Nothing; }
                return Data$dMaybe.$Maybe("Just", filtered);
              }
              $runtime.fail();
            })(),
            filterStrom(predicate)(step._1._2)
          )
        ));
      }
      $runtime.fail();
    })
  }
);
const partition = predicate => stream => Data$dTuple.$Tuple(
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          const filtered = Data$dArray.filterImpl(predicate, step._1._1);
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
                const filtered = Data$dArray.filterImpl(predicate, step._1._1._1);
                if (filtered.length === 0) { return Data$dMaybe.Nothing; }
                return Data$dMaybe.$Maybe("Just", filtered);
              }
              $runtime.fail();
            })(),
            filterStrom(predicate)(step._1._2)
          )
        ));
      }
      $runtime.fail();
    })
  },
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          const filtered = Data$dArray.filterImpl(x => !predicate(x), step._1._1);
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
                const filtered = Data$dArray.filterImpl(x => !predicate(x), step._1._1._1);
                if (filtered.length === 0) { return Data$dMaybe.Nothing; }
                return Data$dMaybe.$Maybe("Just", filtered);
              }
              $runtime.fail();
            })(),
            filterStrom(x => !predicate(x))(step._1._2)
          )
        ));
      }
      $runtime.fail();
    })
  }
);
const filterMStrom = predicate => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          return Yoga$dOm.bindOm.bind(filterA(predicate)(step._1._1))(filtered => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
            "Done",
            filtered.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", filtered)
          )));
        }
        $runtime.fail();
      }
      if (step.tag === "Loop") {
        const $0 = step._1._2;
        return Yoga$dOm.bindOm.bind((() => {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Data$dMaybe.Nothing); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.bindOm.bind(filterA(predicate)(step._1._1._1))(filtered => Yoga$dOm.applicativeOm.pure(filtered.length === 0
              ? Data$dMaybe.Nothing
              : Data$dMaybe.$Maybe("Just", filtered)));
          }
          $runtime.fail();
        })())(filteredChunk => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(filteredChunk, filterMStrom(predicate)($0)))));
      }
      $runtime.fail();
    })
  }
);
const ensuring = finaliser => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(Yoga$dOm.handleErrors$p(err => Yoga$dOm.bindOm.bind(finaliser)(() => Yoga$dOm.monadThrowVariantExceptio.throwError(err)))(Yoga$dOm.bindOm.bind(stream.pull)(step => Yoga$dOm.bindOm.bind(finaliser)(() => Yoga$dOm.applicativeOm.pure(step)))))(result => Yoga$dOm.applicativeOm.pure(result))
  }
);
const empty = /* #__PURE__ */ (() => ({pull: Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing))}))();
const fail = empty;
const groupedStrom = size => stream => {
  if (size <= 0) { return empty; }
  const groupsOf = n => arr => {
    if (n <= 0 || arr.length === 0) { return []; }
    const rest = n < 1 ? arr : Data$dArray.sliceImpl(n, arr.length, arr);
    const group = n < 1 ? [] : Data$dArray.sliceImpl(0, n, arr);
    if (group.length === 0) { return []; }
    return [group, ...groupsOf(n)(rest)];
  };
  const groupedHelper = buffer => s => (
    {
      pull: Yoga$dOm.bindOm.bind(s.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", buffer.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", [buffer])));
          }
          if (step._1.tag === "Just") {
            const groups = groupsOf(size)([...buffer, ...step._1._1]);
            const $0 = groups.length - 1 | 0;
            const completeGroups = $0 < 1 ? [] : Data$dArray.sliceImpl(0, $0, groups);
            const $1 = groups.length - 1 | 0;
            if ($1 >= 0 && $1 < groups.length) {
              const lastGroup = groups[$1].length === size ? [groups[$1]] : [];
              const $2 = groups.length - 1 | 0;
              if ($2 >= 0 && $2 < groups.length) {
                const remainder = groups[$2].length < size ? groups[$2] : [];
                if (remainder.length === 0) {
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                    "Done",
                    [...completeGroups, ...lastGroup].length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", [...completeGroups, ...lastGroup])
                  ));
                }
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Done",
                  [...completeGroups, remainder].length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", [...completeGroups, remainder])
                ));
              }
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Done",
                [...completeGroups, ...lastGroup].length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", [...completeGroups, ...lastGroup])
              ));
            }
            const $2 = groups.length - 1 | 0;
            if ($2 >= 0 && $2 < groups.length) {
              const remainder = groups[$2].length < size ? groups[$2] : [];
              if (remainder.length === 0) {
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                  "Done",
                  [...completeGroups].length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", [...completeGroups])
                ));
              }
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Done",
                [...completeGroups, remainder].length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", [...completeGroups, remainder])
              ));
            }
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Done",
              [...completeGroups].length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", [...completeGroups])
            ));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, groupedHelper(buffer)(step._1._2))));
          }
          if (step._1._1.tag === "Just") {
            const groups = groupsOf(size)([...buffer, ...step._1._1._1]);
            const completeGroups = (() => {
              if (groups.length === 0) { return []; }
              const $0 = groups.length - 1 | 0;
              if ($0 < 1) { return []; }
              return Data$dArray.sliceImpl(0, $0, groups);
            })();
            const $0 = groups.length - 1 | 0;
            if ($0 >= 0 && $0 < groups.length) {
              const newBuffer = groups[$0].length < size ? groups[$0] : [];
              if (completeGroups.length === 0) {
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, groupedHelper(newBuffer)(step._1._2))));
              }
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
                "Loop",
                Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", completeGroups), groupedHelper(newBuffer)(step._1._2))
              ));
            }
            if (completeGroups.length === 0) {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, groupedHelper([])(step._1._2))));
            }
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", completeGroups), groupedHelper([])(step._1._2))
            ));
          }
        }
        $runtime.fail();
      })
    }
  );
  return groupedHelper([])(stream);
};
const mergeAll = streams => Data$dFoldable.foldlArray(merge)(empty)(streams);
const mergeAllND = streams => Data$dFoldable.foldlArray(mergeND)(empty)(streams);
const rangeStrom = start => end => {
  const rangeHelper = current => limit => {
    if (current >= limit) { return empty; }
    const chunkEnd = min(current + 1000 | 0)(limit);
    const $0 = Data$dArray.rangeImpl(current, chunkEnd - 1 | 0);
    return {
      pull: chunkEnd >= limit
        ? Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0)))
        : Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), rangeHelper(chunkEnd)(limit))))
    };
  };
  return rangeHelper(start)(end);
};
const repeatOmStrom = om => {
  const repeatOmHelper = count => {
    if (count >= 100) { return empty; }
    return {
      pull: Yoga$dOm.bindOm.bind(om)(value => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
        "Loop",
        Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", [value]), repeatOmHelper(count + 1 | 0))
      )))
    };
  };
  return repeatOmHelper(0);
};
const takeStrom = n => stream => {
  const takeHelper = remaining => s => {
    if (remaining <= 0) { return empty; }
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
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", taken), takeHelper(newRemaining)(step._1._2))));
          }
        }
        $runtime.fail();
      })
    };
  };
  return takeHelper(n)(stream);
};
const timeout = duration => stream => (
  {
    pull: Yoga$dOm.race([
      stream.pull,
      Yoga$dOm.applyOm.apply(Yoga$dOm.applyOm.Functor0().map(v => Control$dApply.identity)(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(
        Data$dEither.Right,
        duration
      ))))(v2 => {
        if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
        if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
        $runtime.fail();
      })))(empty.pull)
    ])
  }
);
const monoidStrom = {mempty: empty, Semigroup0: () => semigroupStrom};
const dropWhileStrom = predicate => stream => {
  const dropWhileHelper = stillDropping => s => {
    if (!stillDropping) { return s; }
    return {
      pull: Yoga$dOm.bindOm.bind(s.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            const dropped = Data$dArray.span(predicate)(step._1._1).rest;
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", dropped.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", dropped)));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, dropWhileHelper(stillDropping)(step._1._2))));
          }
          if (step._1._1.tag === "Just") {
            const dropped = Data$dArray.span(predicate)(step._1._1._1).rest;
            if (dropped.length === 0) {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, dropWhileHelper(true)(step._1._2))));
            }
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", dropped), step._1._2)));
          }
        }
        $runtime.fail();
      })
    };
  };
  return dropWhileHelper(true)(stream);
};
const dropStrom = n => stream => {
  if (n <= 0) { return stream; }
  const dropHelper = remaining => s => {
    if (remaining <= 0) { return s; }
    return {
      pull: Yoga$dOm.bindOm.bind(s.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            const dropped = remaining < 1 ? step._1._1 : Data$dArray.sliceImpl(remaining, step._1._1.length, step._1._1);
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", dropped.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", dropped)));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, dropHelper(remaining)(step._1._2))));
          }
          if (step._1._1.tag === "Just") {
            const chunkLen = step._1._1._1.length;
            if (remaining >= chunkLen) {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, dropHelper(remaining - chunkLen | 0)(step._1._2))));
            }
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", remaining < 1 ? step._1._1._1 : Data$dArray.sliceImpl(remaining, step._1._1._1.length, step._1._1._1)), step._1._2)
            ));
          }
        }
        $runtime.fail();
      })
    };
  };
  return dropHelper(n)(stream);
};
const delayStrom = duration => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(Data$dEither.Right, duration))))(v2 => {
      if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
      if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
      $runtime.fail();
    }))(() => stream.pull)
  }
);
const debounce = duration => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          const $0 = step._1._1;
          return Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(Data$dEither.Right, duration))))(v2 => {
            if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
            if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
            $runtime.fail();
          }))(() => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", $0))));
        }
        $runtime.fail();
      }
      if (step.tag === "Loop") {
        if (step._1._1.tag === "Nothing") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, debounce(duration)(step._1._2))));
        }
        if (step._1._1.tag === "Just") {
          const $0 = step._1._1._1;
          return Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(Data$dEither.Right, duration))))(v2 => {
            if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
            if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
            $runtime.fail();
          }))(() => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", $0), debounce(duration)(step._1._2)))));
        }
      }
      $runtime.fail();
    })
  }
);
const collectStrom = f => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          const collected = Data$dArray.mapMaybe(f)(step._1._1);
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", collected.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", collected)));
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
                const c = Data$dArray.mapMaybe(f)(step._1._1._1);
                if (c.length === 0) { return Data$dMaybe.Nothing; }
                return Data$dMaybe.$Maybe("Just", c);
              }
              $runtime.fail();
            })(),
            collectStrom(f)(step._1._2)
          )
        ));
      }
      $runtime.fail();
    })
  }
);
const partitionMap = f => stream => Data$dTuple.$Tuple(
  collectStrom(x => {
    const v = f(x);
    if (v.tag === "Left") { return Data$dMaybe.$Maybe("Just", v._1); }
    if (v.tag === "Right") { return Data$dMaybe.Nothing; }
    $runtime.fail();
  })(stream),
  collectStrom(x => {
    const v = f(x);
    if (v.tag === "Left") { return Data$dMaybe.Nothing; }
    if (v.tag === "Right") { return Data$dMaybe.$Maybe("Just", v._1); }
    $runtime.fail();
  })(stream)
);
const collectMStrom = f => stream => (
  {
    pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          return Yoga$dOm.bindOm.bind(traverse(f)(step._1._1))(maybes => {
            const collected = Data$dArray.mapMaybe(identity)(maybes);
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", collected.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", collected)));
          });
        }
        $runtime.fail();
      }
      if (step.tag === "Loop") {
        const $0 = step._1._2;
        return Yoga$dOm.bindOm.bind((() => {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Data$dMaybe.Nothing); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.bindOm.bind(traverse(f)(step._1._1._1))(maybes => {
              const c = Data$dArray.mapMaybe(identity)(maybes);
              return Yoga$dOm.applicativeOm.pure(c.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", c));
            });
          }
          $runtime.fail();
        })())(collected => Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(collected, collectMStrom(f)($0)))));
      }
      $runtime.fail();
    })
  }
);
const chunkedStrom = groupedStrom;
const changesStrom = dictEq => {
  const $0 = (x, y) => {
    if (x.tag === "Nothing") { return y.tag === "Nothing"; }
    return x.tag === "Just" && y.tag === "Just" && dictEq.eq(x._1)(y._1);
  };
  return stream => {
    const changesHelper = lastSeen => s => (
      {
        pull: Yoga$dOm.bindOm.bind(s.pull)(step => {
          if (step.tag === "Done") {
            if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            if (step._1.tag === "Just") {
              const $1 = Data$dFoldable.foldlArray(v1 => {
                const $1 = v1._2;
                const $2 = v1._1;
                return curr => {
                  if ($0(Data$dMaybe.$Maybe("Just", curr), $2)) { return Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", curr), $1); }
                  return Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", curr), Data$dArray.snoc($1)(curr));
                };
              })(Data$dTuple.$Tuple(lastSeen, []))(step._1._1)._2;
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $1.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", $1)));
            }
            $runtime.fail();
          }
          if (step.tag === "Loop") {
            if (step._1._1.tag === "Nothing") {
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, changesHelper(lastSeen)(step._1._2))));
            }
            if (step._1._1.tag === "Just") {
              const v = Data$dFoldable.foldlArray(v1 => {
                const $1 = v1._2;
                const $2 = v1._1;
                return curr => {
                  if ($0(Data$dMaybe.$Maybe("Just", curr), $2)) { return Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", curr), $1); }
                  return Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", curr), Data$dArray.snoc($1)(curr));
                };
              })(Data$dTuple.$Tuple(lastSeen, []))(step._1._1._1);
              if (v._2.length === 0) {
                return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, changesHelper(v._1)(step._1._2))));
              }
              return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", v._2), changesHelper(v._1)(step._1._2))));
            }
          }
          $runtime.fail();
        })
      }
    );
    return changesHelper(Data$dMaybe.Nothing)(stream);
  };
};
const catchAll = handler => stream => ({pull: Yoga$dOm.handleErrors$p(err => handler(err).pull)(stream.pull)});
const retryN = n => stream => {
  if (n <= 0) { return stream; }
  return {pull: Yoga$dOm.handleErrors$p(err => retryN(n - 1 | 0)(stream).pull)(stream.pull)};
};
const retry = /* #__PURE__ */ retryN(3);
const bracketExit = acquire => release => use => (
  {
    pull: Yoga$dOm.bindOm.bind(acquire)(resource => Yoga$dOm.bindOm.bind(Yoga$dOm.handleErrors$p(err => Yoga$dOm.bindOm.bind(release(resource)(Data$dMaybe.$Maybe("Just", err)))(() => Yoga$dOm.monadThrowVariantExceptio.throwError(err)))(use(resource).pull))(step => Yoga$dOm.bindOm.bind((() => {
      if (step.tag === "Done") { return release(resource)(Data$dMaybe.Nothing); }
      if (step.tag === "Loop") { return Yoga$dOm.applicativeOm.pure(); }
      $runtime.fail();
    })())(() => Yoga$dOm.applicativeOm.pure(step))))
  }
);
const bracket = acquire => release => use => (
  {
    pull: Yoga$dOm.bindOm.bind(acquire)(resource => Yoga$dOm.bindOm.bind(Yoga$dOm.handleErrors$p(err => Yoga$dOm.bindOm.bind(release(resource))(() => Yoga$dOm.monadThrowVariantExceptio.throwError(err)))(use(resource).pull))(step => Yoga$dOm.bindOm.bind((() => {
      if (step.tag === "Done") { return release(resource); }
      if (step.tag === "Loop") { return Yoga$dOm.applicativeOm.pure(); }
      $runtime.fail();
    })())(() => Yoga$dOm.applicativeOm.pure(step))))
  }
);
const appendStrom = toAppend => baseStream => (
  {
    pull: Yoga$dOm.bindOm.bind(baseStream.pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return toAppend.pull; }
        if (step._1.tag === "Just") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", step._1._1), toAppend)));
        }
        $runtime.fail();
      }
      if (step.tag === "Loop") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(step._1._1, appendStrom(toAppend)(step._1._2)))); }
      $runtime.fail();
    })
  }
);
const concatStrom = streams => Data$dFoldable.foldrArray(b => a => appendStrom(a)(b))(empty)(streams);
const bindStrom1 = {
  bind: stream => f => (
    {
      pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") { return Data$dFoldable.foldrArray(b => a => appendStrom(a)(b))(empty)(Data$dFunctor.arrayMap(f)(step._1._1)).pull; }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, bindStrom1.bind(step._1._2)(f))));
          }
          if (step._1._1.tag === "Just") {
            return appendStrom(Data$dFoldable.foldrArray(b => a => appendStrom(a)(b))(empty)(Data$dFunctor.arrayMap(f)(step._1._1._1)))(bindStrom1.bind(step._1._2)(f)).pull;
          }
        }
        $runtime.fail();
      })
    }
  ),
  Apply0: () => applyStrom
};
const bindStrom = f => stream => bindStrom1.bind(stream)(f);
const monadStrom = {Applicative0: () => applicativeStrom, Bind1: () => bindStrom1};
const acquireRelease = bracket;
export {
  $StreamId,
  StreamId1,
  StreamId2,
  acquireRelease,
  altStrom,
  alternativeStrom,
  appendStrom,
  applicativeStrom,
  applyStrom,
  bindStrom,
  bindStrom1,
  bracket,
  bracketExit,
  catchAll,
  changesStrom,
  chunkedStrom,
  collectMStrom,
  collectStrom,
  concatStrom,
  debounce,
  delayStrom,
  dropStrom,
  dropWhileStrom,
  empty,
  ensuring,
  fail,
  filterA,
  filterMStrom,
  filterStrom,
  forMStrom_,
  forStrom_,
  foreachPar,
  fromAff,
  fromArray,
  fromFoldable,
  fromOm,
  functorStrom,
  groupByStrom,
  groupedStrom,
  identity,
  intercalate,
  interleave,
  intersperse,
  iterateStrom,
  iterateStromInfinite,
  mapAccumStrom,
  mapMPar,
  mapMStrom,
  mapPar,
  mapStrom,
  merge,
  mergeAll,
  mergeAllND,
  mergeND,
  min,
  monadStrom,
  monoidStrom,
  partition,
  partitionMap,
  plusStrom,
  race,
  raceAll,
  rangeStrom,
  repeatOmStrom,
  repeatOmStromInfinite,
  repeatStrom,
  repeatStromInfinite,
  retry,
  retryN,
  runCollect,
  runDrain,
  runFold,
  runStrom,
  scanStrom,
  semigroupStrom,
  succeed,
  takeStrom,
  takeUntilStrom,
  takeWhileStrom,
  tapMStrom,
  tapStrom,
  throttle,
  timeout,
  traverse,
  traverseMStrom_,
  traverseStrom_,
  unfoldOmStrom,
  unfoldStrom,
  zipStrom,
  zipWithStrom
};
