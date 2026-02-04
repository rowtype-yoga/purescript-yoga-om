import * as $runtime from "../runtime.js";
import * as Control$dMonad$dRec$dClass from "../Control.Monad.Rec.Class/index.js";
import * as Control$dMonad$dWriter$dTrans from "../Control.Monad.Writer.Trans/index.js";
import * as Data$dArray from "../Data.Array/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dEq from "../Data.Eq/index.js";
import * as Data$dEuclideanRing from "../Data.EuclideanRing/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dFunctor from "../Data.Functor/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dSemigroup from "../Data.Semigroup/index.js";
import * as Data$dSemiring from "../Data.Semiring/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Data$dVariant from "../Data.Variant/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import * as Test$dSpec from "../Test.Spec/index.js";
import * as Test$dSpec$dAssertions from "../Test.Spec.Assertions/index.js";
import * as Test$dSpec$dTree from "../Test.Spec.Tree/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
import * as Yoga$dOm$dStrom from "../Yoga.Om.Strom/index.js";
const discard1 = /* #__PURE__ */ (() => Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind)();
const shouldEqual = /* #__PURE__ */ Test$dSpec$dAssertions.shouldEqual(Effect$dAff.monadThrowAff);
const showArray = {show: /* #__PURE__ */ Data$dShow.showArrayImpl(Data$dShow.showIntImpl)};
const eqArray = {eq: /* #__PURE__ */ Data$dEq.eqArrayImpl(Data$dEq.eqIntImpl)};
const shouldEqual1 = /* #__PURE__ */ shouldEqual(showArray)(eqArray);
const shouldEqual2 = /* #__PURE__ */ shouldEqual(Data$dShow.showUnit)(Data$dEq.eqUnit);
const shouldEqual3 = /* #__PURE__ */ shouldEqual(Data$dShow.showInt)(Data$dEq.eqInt);
const shouldEqual4 = /* #__PURE__ */ shouldEqual({show: /* #__PURE__ */ Data$dShow.showArrayImpl(Data$dShow.showStringImpl)})({
  eq: /* #__PURE__ */ Data$dEq.eqArrayImpl(Data$dEq.eqStringImpl)
});
const changesStrom = /* #__PURE__ */ Yoga$dOm$dStrom.changesStrom(Data$dEq.eqInt);
const shouldEqual5 = /* #__PURE__ */ shouldEqual({
  show: /* #__PURE__ */ Data$dShow.showArrayImpl(v => "(Tuple " + Data$dShow.showIntImpl(v._1) + " " + Data$dShow.showStringImpl(v._2) + ")")
})({eq: /* #__PURE__ */ Data$dEq.eqArrayImpl(x => y => x._1 === y._1 && x._2 === y._2)});
const shouldEqual6 = /* #__PURE__ */ (() => shouldEqual({show: Data$dShow.showArrayImpl(showArray.show)})({eq: Data$dEq.eqArrayImpl(eqArray.eq)}))();
const pure1 = /* #__PURE__ */ (() => Test$dSpec.applicativeWriterT(Data$dIdentity.applicativeIdentity).pure)();
const shouldEqual7 = /* #__PURE__ */ shouldEqual({
  show: /* #__PURE__ */ Data$dShow.showArrayImpl(v => "(Tuple " + Data$dShow.showStringImpl(v._1) + " " + Data$dShow.showIntImpl(v._2) + ")")
})({eq: /* #__PURE__ */ Data$dEq.eqArrayImpl(x => y => x._1 === y._1 && x._2 === y._2)});
const shouldEqual8 = /* #__PURE__ */ shouldEqual({
  show: v => {
    if (v.tag === "Just") { return "(Just " + Data$dShow.showIntImpl(v._1) + ")"; }
    if (v.tag === "Nothing") { return "Nothing"; }
    $runtime.fail();
  }
})({
  eq: x => y => {
    if (x.tag === "Nothing") { return y.tag === "Nothing"; }
    return x.tag === "Just" && y.tag === "Just" && x._1 === y._1;
  }
});
const runOm = om => {
  const $0 = {exception: err => Effect$dAff._liftEffect(Effect$dException.throwException(err))};
  return Effect$dAff._bind(Yoga$dOm.runRWSET({})()(om))(v1 => {
    if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
    if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1._2._1._1); }
    $runtime.fail();
  });
};
const parseNumber = v => {
  if (v === "1") { return Data$dMaybe.$Maybe("Just", 1); }
  if (v === "2") { return Data$dMaybe.$Maybe("Just", 2); }
  if (v === "3") { return Data$dMaybe.$Maybe("Just", 3); }
  if (v === "4") { return Data$dMaybe.$Maybe("Just", 4); }
  if (v === "5") { return Data$dMaybe.$Maybe("Just", 5); }
  return Data$dMaybe.Nothing;
};
const spec = /* #__PURE__ */ (() => {
  const $0 = discard1((() => {
    const $0 = discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("empty produces no elements")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.empty)))(result => shouldEqual1(result)([]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("succeed produces single element")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
      pull: Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", [42])))
    })))(result => shouldEqual1(result)([42]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("fromArray produces all elements")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.fromArray([
      1,
      2,
      3,
      4,
      5
    ]))))(result => shouldEqual1(result)([1, 2, 3, 4, 5]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("fromArray handles empty array")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.fromArray([]))))(result => shouldEqual1(result)([]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("range produces correct sequence")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      return rangeHelper(1)(6);
    })())))(result => shouldEqual1(result)([1, 2, 3, 4, 5]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("range with start >= end produces empty")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      return rangeHelper(5)(5);
    })())))(result => shouldEqual1(result)([]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("iterate produces sequence")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      return takeHelper(5)(Yoga$dOm$dStrom.iterateStrom(v => v + 1 | 0)(0));
    })())))(result => shouldEqual1(result)([0, 1, 2, 3, 4]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("repeat produces repeated values")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      return takeHelper(3)(Yoga$dOm$dStrom.fromArray(Data$dArray.replicateImpl(10000, 42)));
    })())))(result => shouldEqual1(result)([42, 42, 42]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("unfold produces Fibonacci sequence")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.unfoldStrom(v => {
      if (v._1 > 100) { return Data$dMaybe.Nothing; }
      return Data$dMaybe.$Maybe("Just", Data$dTuple.$Tuple(v._1, Data$dTuple.$Tuple(v._2, v._1 + v._2 | 0)));
    })(Data$dTuple.$Tuple(0, 1)))))(result => shouldEqual1(result)([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]))))(() => Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("fromOm produces value from effect")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.fromOm(Yoga$dOm.applicativeOm.pure(42)))))(result => shouldEqual1(result)([
      42
    ]))))))))))));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Construction"), $0._2)]);
  })())(() => discard1((() => {
    const $0 = discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("runCollect collects all elements")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      return rangeHelper(1)(6);
    })())))(result => shouldEqual1(result)([1, 2, 3, 4, 5]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("runDrain executes but returns unit")(Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
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
        return rangeHelper(1)(100);
      })()
    ))))(result => shouldEqual2(result)())))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("runFold reduces stream")(Effect$dAff._bind(runOm(Yoga$dOm.monadRecOm.tailRecM(v => {
      const $0 = v._1;
      return Yoga$dOm.bindOm.bind(v._2.pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $0)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dFoldable.foldlArray(Data$dSemiring.intAdd)($0)(step._1._1)));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          if (step._1._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple($0, step._1._2))); }
          if (step._1._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
              "Loop",
              Data$dTuple.$Tuple(Data$dFoldable.foldlArray(Data$dSemiring.intAdd)($0)(step._1._1._1), step._1._2)
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
        return rangeHelper(1)(6);
      })()
    ))))(result => shouldEqual3(result)(15))))(() => Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("runForEach executes effects")(Effect$dAff._bind(Effect$dAff._liftEffect(() => (
      {value: 0}
    )))(countRef => Effect$dAff._bind(runOm(Yoga$dOm$dStrom.traverseStrom_(v => Yoga$dOm.monadEffectOm.liftEffect(() => {
      const $0 = countRef.value;
      countRef.value = $0 + 1 | 0;
    }))((() => {
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
      return rangeHelper(1)(6);
    })())))(() => Effect$dAff._bind(Effect$dAff._liftEffect(() => countRef.value))(count => shouldEqual3(count)(5))))))));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Running/Consuming"), $0._2)]);
  })())(() => discard1((() => {
    const $0 = discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("map transforms elements")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
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
        return rangeHelper(1)(6).pull;
      })())(step => {
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
    })))(result => shouldEqual1(result)([2, 4, 6, 8, 10]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("mapOm with effects")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.mapMStrom(n => Yoga$dOm.applicativeOm.pure(n * 2 | 0))(Yoga$dOm$dStrom.fromArray([
      1,
      2,
      3
    ])))))(result => shouldEqual1(result)([2, 4, 6]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("bind (>>=) flattens nested streams")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.bindStrom1.bind(Yoga$dOm$dStrom.fromArray([
      1,
      2,
      3
    ]))(n => Yoga$dOm$dStrom.fromArray([n, n * 10 | 0])))))(result => shouldEqual1(result)([1, 10, 2, 20, 3, 30]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("scan produces running totals")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      return scanHelper(0)(Yoga$dOm$dStrom.fromArray([1, 2, 3, 4, 5]));
    })())))(result => shouldEqual1(result)([1, 3, 6, 10, 15]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("mapAccum with state")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.mapAccumStrom(i => x => Data$dTuple.$Tuple(
      i + 1 | 0,
      Data$dShow.showIntImpl(i) + x
    ))(1)(Yoga$dOm$dStrom.fromArray(["a", "b", "c"])))))(result => shouldEqual4(result)(["1a", "2b", "3c"]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("tap observes without modifying")(Effect$dAff._bind(Effect$dAff._liftEffect(() => (
      {value: 0}
    )))(sideEffectRef => Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.tapStrom(n => {})(Yoga$dOm$dStrom.fromArray([1, 2, 3])))))(result => shouldEqual1(result)([
      1,
      2,
      3
    ])))))(() => Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("tapOm with effects")(Effect$dAff._bind(Effect$dAff._liftEffect(() => ({value: 0})))(countRef => Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.tapMStrom(v => Yoga$dOm.monadEffectOm.liftEffect(() => {
      const $0 = countRef.value;
      countRef.value = $0 + 1 | 0;
    }))(Yoga$dOm$dStrom.fromArray([1, 2, 3])))))(result => Effect$dAff._bind(Effect$dAff._liftEffect(() => countRef.value))(count => Effect$dAff._bind(shouldEqual3(count)(3))(() => shouldEqual1(result)([
      1,
      2,
      3
    ]))))))))))));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Transformations"), $0._2)]);
  })())(() => discard1((() => {
    const $0 = discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("take limits elements")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      return takeHelper(5)((() => {
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
        return rangeHelper(1)(100);
      })());
    })())))(result => shouldEqual1(result)([1, 2, 3, 4, 5]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("take with 0 produces empty")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      return takeHelper(0)((() => {
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
        return rangeHelper(1)(100);
      })());
    })())))(result => shouldEqual1(result)([]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("takeWhile stops at condition")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.takeWhileStrom(v => v < 5)((() => {
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
      return rangeHelper(1)(10);
    })()))))(result => shouldEqual1(result)([1, 2, 3, 4]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("takeUntil includes matching element")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.takeUntilStrom(v => v === 5)((() => {
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
      return rangeHelper(1)(10);
    })()))))(result => shouldEqual1(result)([1, 2, 3, 4, 5]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("drop skips elements")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.dropStrom(5)((() => {
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
      return rangeHelper(1)(10);
    })()))))(result => shouldEqual1(result)([6, 7, 8, 9]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("dropWhile skips until condition")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.dropWhileStrom(v => v < 5)((() => {
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
      return rangeHelper(1)(10);
    })()))))(result => shouldEqual1(result)([5, 6, 7, 8, 9]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("filter keeps matching elements")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
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
        return rangeHelper(1)(10).pull;
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
    })))(result => shouldEqual1(result)([2, 4, 6, 8]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("filterOm with effects")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.filterMStrom(n => Yoga$dOm.applicativeOm.pure(Data$dEuclideanRing.intMod(n)(2) === 0))((() => {
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
      return rangeHelper(1)(10);
    })()))))(result => shouldEqual1(result)([2, 4, 6, 8]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("collect filters and maps")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.collectStrom(parseNumber)(Yoga$dOm$dStrom.fromArray([
      "1",
      "x",
      "2",
      "y",
      "3"
    ])))))(result => shouldEqual1(result)([1, 2, 3]))))(() => Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("changes removes consecutive duplicates")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(changesStrom(Yoga$dOm$dStrom.fromArray([
      1,
      1,
      2,
      2,
      2,
      3,
      3,
      1,
      1
    ])))))(result => shouldEqual1(result)([1, 2, 3, 1]))))))))))));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Selection"), $0._2)]);
  })())(() => discard1((() => {
    const $0 = discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("append concatenates streams")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.appendStrom(Yoga$dOm$dStrom.fromArray([
      4,
      5,
      6
    ]))(Yoga$dOm$dStrom.fromArray([1, 2, 3])))))(result => shouldEqual1(result)([1, 2, 3, 4, 5, 6]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("concat multiple streams")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Data$dFoldable.foldrArray(b => a => Yoga$dOm$dStrom.appendStrom(a)(b))(Yoga$dOm$dStrom.empty)([
      Yoga$dOm$dStrom.fromArray([1, 2]),
      Yoga$dOm$dStrom.fromArray([3, 4]),
      Yoga$dOm$dStrom.fromArray([5, 6])
    ]))))(result => shouldEqual1(result)([1, 2, 3, 4, 5, 6]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("zip pairs elements")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      const $0 = rangeHelper(1)(4);
      const $1 = Yoga$dOm$dStrom.fromArray(["a", "b", "c"]);
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
    })())))(result => shouldEqual5(result)([Data$dTuple.$Tuple(1, "a"), Data$dTuple.$Tuple(2, "b"), Data$dTuple.$Tuple(3, "c")]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("zip stops at shortest stream")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      const $0 = rangeHelper(1)(10);
      const $1 = Yoga$dOm$dStrom.fromArray(["a", "b"]);
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
    })())))(result => shouldEqual5(result)([Data$dTuple.$Tuple(1, "a"), Data$dTuple.$Tuple(2, "b")]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("zipWith with custom function")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      const $0 = rangeHelper(1)(4);
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
      const $1 = rangeHelper$1(10)(13);
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
    })())))(result => shouldEqual1(result)([11, 13, 15]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("interleave alternates elements")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.semigroupStrom.append(Yoga$dOm$dStrom.fromArray([
      1,
      3,
      5
    ]))(Yoga$dOm$dStrom.fromArray([2, 4, 6])))))(result => shouldEqual1(result)([1, 3, 5, 2, 4, 6]))))(() => Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("race takes first to emit")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.fromOm(Yoga$dOm.applicativeOm.pure(2)))))(result => shouldEqual1(result)([
      2
    ])))))))));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Combining"), $0._2)]);
  })())(() => discard1((() => {
    const $0 = discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("grouped creates fixed-size chunks")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
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
        return rangeHelper(1)(11).pull;
      })())(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(x => [x])(step._1._1))));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
            "Loop",
            Data$dTuple.$Tuple(
              (() => {
                const $0 = Data$dFunctor.arrayMap(x => [x]);
                if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                return Data$dMaybe.Nothing;
              })(),
              Yoga$dOm$dStrom.mapStrom(x => [x])(step._1._2)
            )
          ));
        }
        $runtime.fail();
      })
    })))(result => shouldEqual6(result)([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("grouped with partial last chunk")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
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
        return rangeHelper(1)(8).pull;
      })())(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(x => [x])(step._1._1))));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
            "Loop",
            Data$dTuple.$Tuple(
              (() => {
                const $0 = Data$dFunctor.arrayMap(x => [x]);
                if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                return Data$dMaybe.Nothing;
              })(),
              Yoga$dOm$dStrom.mapStrom(x => [x])(step._1._2)
            )
          ));
        }
        $runtime.fail();
      })
    })))(result => shouldEqual6(result)([[1, 2, 3], [4, 5, 6], [7]]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("chunked is alias for grouped")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
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
        return rangeHelper(1)(6).pull;
      })())(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(x => [x])(step._1._1))));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
            "Loop",
            Data$dTuple.$Tuple(
              (() => {
                const $0 = Data$dFunctor.arrayMap(x => [x]);
                if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                return Data$dMaybe.Nothing;
              })(),
              Yoga$dOm$dStrom.mapStrom(x => [x])(step._1._2)
            )
          ));
        }
        $runtime.fail();
      })
    })))(result => shouldEqual6(result)([[1, 2], [3, 4], [5]]))))(() => Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("partition splits by predicate")((() => {
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
      const stream = rangeHelper(1)(11);
      return Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
        pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
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
      })))(evensResult => Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
        pull: Yoga$dOm.bindOm.bind(stream.pull)(step => {
          if (step.tag === "Done") {
            if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            if (step._1.tag === "Just") {
              const filtered = Data$dArray.filterImpl(n => Data$dEuclideanRing.intMod(n)(2) !== 0, step._1._1);
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
                    const filtered = Data$dArray.filterImpl(n => Data$dEuclideanRing.intMod(n)(2) !== 0, step._1._1._1);
                    if (filtered.length === 0) { return Data$dMaybe.Nothing; }
                    return Data$dMaybe.$Maybe("Just", filtered);
                  }
                  $runtime.fail();
                })(),
                Yoga$dOm$dStrom.filterStrom(n => Data$dEuclideanRing.intMod(n)(2) !== 0)(step._1._2)
              )
            ));
          }
          $runtime.fail();
        })
      })))(oddsResult => Effect$dAff._bind(shouldEqual1(evensResult)([2, 4, 6, 8, 10]))(() => shouldEqual1(oddsResult)([1, 3, 5, 7, 9]))));
    })()))));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Grouping"), $0._2)]);
  })())(() => discard1((() => {
    const $0 = discard1(pure1())(() => Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("orElse provides alternative")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.altStrom.alt(Yoga$dOm$dStrom.empty)(Yoga$dOm$dStrom.fromArray([
      1,
      2,
      3
    ])))))(result => shouldEqual1(result)([1, 2, 3]))));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Error Handling"), $0._2)]);
  })())(() => discard1((() => {
    const $0 = discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("pipeline: filter, map, group")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
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
        return rangeHelper(1)(21).pull;
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
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(x => [x])(step._1._1))));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
            "Loop",
            Data$dTuple.$Tuple(
              (() => {
                const $0 = Data$dFunctor.arrayMap(x => [x]);
                if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                return Data$dMaybe.Nothing;
              })(),
              Yoga$dOm$dStrom.mapStrom(x => [x])(step._1._2)
            )
          ));
        }
        $runtime.fail();
      })
    })))(result => shouldEqual6(result)([[4, 8, 12], [16, 20, 24], [28, 32, 36], [40]]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("nested bind (>>=) with filtering")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.bindStrom1.bind(Yoga$dOm$dStrom.fromArray([
      1,
      2,
      3
    ]))(n => (
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
          return rangeHelper(n * 10 | 0)((n * 10 | 0) + 3 | 0).pull;
        })())(step => {
          if (step.tag === "Done") {
            if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
            if (step._1.tag === "Just") {
              const filtered = Data$dArray.filterImpl(x => Data$dEuclideanRing.intMod(x)(2) === 0, step._1._1);
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
                    const filtered = Data$dArray.filterImpl(x => Data$dEuclideanRing.intMod(x)(2) === 0, step._1._1._1);
                    if (filtered.length === 0) { return Data$dMaybe.Nothing; }
                    return Data$dMaybe.$Maybe("Just", filtered);
                  }
                  $runtime.fail();
                })(),
                Yoga$dOm$dStrom.filterStrom(x => Data$dEuclideanRing.intMod(x)(2) === 0)(step._1._2)
              )
            ));
          }
          $runtime.fail();
        })
      }
    )))))(result => shouldEqual1(result)([10, 12, 20, 22, 30, 32]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("scan with filtering and mapping")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
      pull: Yoga$dOm.bindOm.bind((() => {
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
        return scanHelper(0)({
          pull: Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.fromArray([1, -2, 3, -4, 5]).pull)(step => {
            if (step.tag === "Done") {
              if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
              if (step._1.tag === "Just") {
                const filtered = Data$dArray.filterImpl(v => v > 0, step._1._1);
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
                      const filtered = Data$dArray.filterImpl(v => v > 0, step._1._1._1);
                      if (filtered.length === 0) { return Data$dMaybe.Nothing; }
                      return Data$dMaybe.$Maybe("Just", filtered);
                    }
                    $runtime.fail();
                  })(),
                  Yoga$dOm$dStrom.filterStrom(v => v > 0)(step._1._2)
                )
              ));
            }
            $runtime.fail();
          })
        }).pull;
      })())(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(v => v * 10 | 0)(step._1._1))));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
            "Loop",
            Data$dTuple.$Tuple(
              (() => {
                const $0 = Data$dFunctor.arrayMap(v => v * 10 | 0);
                if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                return Data$dMaybe.Nothing;
              })(),
              Yoga$dOm$dStrom.mapStrom(v => v * 10 | 0)(step._1._2)
            )
          ));
        }
        $runtime.fail();
      })
    })))(result => shouldEqual1(result)([10, 40, 90]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("zip with scan")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
      const $0 = Yoga$dOm$dStrom.fromArray(["a", "b", "c", "d"]);
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
      const $1 = takeHelper(4)((() => {
        const scanHelper = acc => s => (
          {
            pull: Yoga$dOm.bindOm.bind(s.pull)(step => {
              if (step.tag === "Done") {
                if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
                if (step._1.tag === "Just") {
                  const $1 = Data$dFoldable.foldlArray(v1 => {
                    const $1 = v1._2;
                    const $2 = v1._1;
                    return item => {
                      const newAcc = $2 + item | 0;
                      return Data$dTuple.$Tuple(newAcc, Data$dArray.snoc($1)(newAcc));
                    };
                  })(Data$dTuple.$Tuple(acc, []))(step._1._1)._2;
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", $1.length === 0 ? Data$dMaybe.Nothing : Data$dMaybe.$Maybe("Just", $1)));
                }
                $runtime.fail();
              }
              if (step.tag === "Loop") {
                if (step._1._1.tag === "Nothing") {
                  return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.Nothing, scanHelper(acc)(step._1._2))));
                }
                if (step._1._1.tag === "Just") {
                  const v = Data$dFoldable.foldlArray(v1 => {
                    const $1 = v1._2;
                    const $2 = v1._1;
                    return item => {
                      const currAcc = $2 + item | 0;
                      return Data$dTuple.$Tuple(currAcc, Data$dArray.snoc($1)(currAcc));
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
        return scanHelper(0)(Yoga$dOm$dStrom.iterateStrom(v => v + 1 | 0)(1));
      })());
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
    })())))(result => shouldEqual7(result)([Data$dTuple.$Tuple("a", 1), Data$dTuple.$Tuple("b", 3), Data$dTuple.$Tuple("c", 6), Data$dTuple.$Tuple("d", 10)]))))(() => Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("large stream with take")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
      pull: Yoga$dOm.bindOm.bind((() => {
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
        return takeHelper(100)({
          pull: Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.iterateStrom(v => v + 1 | 0)(0).pull)(step => {
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
          })
        }).pull;
      })())(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(x => [x])(step._1._1))));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
            "Loop",
            Data$dTuple.$Tuple(
              (() => {
                const $0 = Data$dFunctor.arrayMap(x => [x]);
                if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                return Data$dMaybe.Nothing;
              })(),
              Yoga$dOm$dStrom.mapStrom(x => [x])(step._1._2)
            )
          ));
        }
        $runtime.fail();
      })
    })))(result => Effect$dAff._bind(shouldEqual3(result.length)(10))(() => shouldEqual8(0 < result.length && 0 < result[0].length
      ? Data$dMaybe.$Maybe("Just", result[0][0])
      : Data$dMaybe.Nothing)(Data$dMaybe.$Maybe("Just", 0)))))))));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Complex Scenarios"), $0._2)]);
  })())(() => {
    const $0 = discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("empty stream through pipeline")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
      pull: Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.empty.pull)(step => {
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
            const filtered = Data$dArray.filterImpl(v => v > 0, step._1._1);
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
                  const filtered = Data$dArray.filterImpl(v => v > 0, step._1._1._1);
                  if (filtered.length === 0) { return Data$dMaybe.Nothing; }
                  return Data$dMaybe.$Maybe("Just", filtered);
                }
                $runtime.fail();
              })(),
              Yoga$dOm$dStrom.filterStrom(v => v > 0)(step._1._2)
            )
          ));
        }
        $runtime.fail();
      }))(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(x => [x])(step._1._1))));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
            "Loop",
            Data$dTuple.$Tuple(
              (() => {
                const $0 = Data$dFunctor.arrayMap(x => [x]);
                if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                return Data$dMaybe.Nothing;
              })(),
              Yoga$dOm$dStrom.mapStrom(x => [x])(step._1._2)
            )
          ));
        }
        $runtime.fail();
      })
    })))(result => shouldEqual6(result)([]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("single element through complex pipeline")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      return takeHelper(10)({
        pull: Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", [42]))))(step => {
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
              const filtered = Data$dArray.filterImpl(v => v > 50, step._1._1);
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
                    const filtered = Data$dArray.filterImpl(v => v > 50, step._1._1._1);
                    if (filtered.length === 0) { return Data$dMaybe.Nothing; }
                    return Data$dMaybe.$Maybe("Just", filtered);
                  }
                  $runtime.fail();
                })(),
                Yoga$dOm$dStrom.filterStrom(v => v > 50)(step._1._2)
              )
            ));
          }
          $runtime.fail();
        })
      });
    })())))(result => shouldEqual1(result)([84]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("take more than available")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect((() => {
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
      return takeHelper(100)(Yoga$dOm$dStrom.fromArray([1, 2, 3]));
    })())))(result => shouldEqual1(result)([1, 2, 3]))))(() => discard1(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("drop more than available")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.dropStrom(100)(Yoga$dOm$dStrom.fromArray([
      1,
      2,
      3
    ])))))(result => shouldEqual1(result)([]))))(() => Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("grouped with size larger than stream")(Effect$dAff._bind(runOm(Yoga$dOm$dStrom.runCollect({
      pull: Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.fromArray([1, 2, 3]).pull)(step => {
        if (step.tag === "Done") {
          if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
          if (step._1.tag === "Just") {
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(x => [x])(step._1._1))));
          }
          $runtime.fail();
        }
        if (step.tag === "Loop") {
          return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
            "Loop",
            Data$dTuple.$Tuple(
              (() => {
                const $0 = Data$dFunctor.arrayMap(x => [x]);
                if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
                return Data$dMaybe.Nothing;
              })(),
              Yoga$dOm$dStrom.mapStrom(x => [x])(step._1._2)
            )
          ));
        }
        $runtime.fail();
      })
    })))(result => shouldEqual6(result)([[1, 2, 3]])))))));
    return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Edge Cases"), $0._2)]);
  }))))))));
  return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "Strom"), $0._2)]);
})();
export {
  changesStrom,
  discard1,
  eqArray,
  parseNumber,
  pure1,
  runOm,
  shouldEqual,
  shouldEqual1,
  shouldEqual2,
  shouldEqual3,
  shouldEqual4,
  shouldEqual5,
  shouldEqual6,
  shouldEqual7,
  shouldEqual8,
  showArray,
  spec
};
