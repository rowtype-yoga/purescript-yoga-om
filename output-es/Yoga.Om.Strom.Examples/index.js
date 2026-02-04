import * as $runtime from "../runtime.js";
import * as Control$dMonad$dRec$dClass from "../Control.Monad.Rec.Class/index.js";
import * as Data$dArray from "../Data.Array/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dEq from "../Data.Eq/index.js";
import * as Data$dEuclideanRing from "../Data.EuclideanRing/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import * as Data$dFunctor from "../Data.Functor/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Data$dVariant from "../Data.Variant/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Effect$dConsole from "../Effect.Console/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
import * as Yoga$dOm$dError from "../Yoga.Om.Error/index.js";
import * as Yoga$dOm$dStrom from "../Yoga.Om.Strom/index.js";
const $AppError = tag => tag;
const show2 = /* #__PURE__ */ Data$dShow.showArrayImpl(Data$dShow.showStringImpl);
const $$throw = /* #__PURE__ */ (() => {
  const $0 = Yoga$dOm$dError.singletonVariantRecord()()()({reflectSymbol: () => "networkError"});
  return x => Yoga$dOm.monadThrowVariantExceptio.throwError($0.singletonRecordToVariant(x));
})();
const NetworkError = /* #__PURE__ */ $AppError("NetworkError");
const ValidationError = /* #__PURE__ */ $AppError("ValidationError");
const TimeoutError = /* #__PURE__ */ $AppError("TimeoutError");
const runExampleWithLogger = dictShow => om => Effect$dAff._bind((() => {
  const $0 = {exception: err => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("Error: " + Effect$dException.showErrorImpl(err))))(() => Effect$dAff._pure())};
  return Effect$dAff._bind(Yoga$dOm.runRWSET({logger: msg => Effect$dAff._liftEffect(Effect$dConsole.log(msg))})()(Yoga$dOm.bindOm.bind(om)(a => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._liftEffect(Effect$dConsole.log(dictShow.show(a))))))(v2 => {
    if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
    if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
    $runtime.fail();
  }))))(v1 => {
    if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
    if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1._2._1._1); }
    $runtime.fail();
  });
})())(result => Effect$dAff._pure(result));
const runExample = dictShow => om => Effect$dAff._bind((() => {
  const $0 = {exception: err => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("Error: " + Effect$dException.showErrorImpl(err))))(() => Effect$dAff._pure())};
  return Effect$dAff._bind(Yoga$dOm.runRWSET({})()(Yoga$dOm.bindOm.bind(om)(a => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._liftEffect(Effect$dConsole.log(dictShow.show(a))))))(v2 => {
    if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
    if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
    $runtime.fail();
  }))))(v1 => {
    if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
    if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1._2._1._1); }
    $runtime.fail();
  });
})())(result => Effect$dAff._pure(result));
const parseNumbers = v => {
  if (v === "one") { return Data$dMaybe.$Maybe("Just", 1); }
  if (v === "two") { return Data$dMaybe.$Maybe("Just", 2); }
  if (v === "three") { return Data$dMaybe.$Maybe("Just", 3); }
  return Data$dMaybe.Nothing;
};
const fibonacciStream = /* #__PURE__ */ Yoga$dOm$dStrom.unfoldStrom(v => Data$dMaybe.$Maybe("Just", Data$dTuple.$Tuple(v._1, Data$dTuple.$Tuple(v._2, v._1 + v._2 | 0))))(/* #__PURE__ */ Data$dTuple.$Tuple(
  0,
  1
));
const fetchUser = id => Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(Data$dEither.Right, 100.0))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
}))(() => Yoga$dOm.applicativeOm.pure("User #" + Data$dShow.showIntImpl(id)));
const fetchPage = token => Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(Data$dEither.Right, 100.0))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
}))(() => {
  if (token === "start") { return Yoga$dOm.applicativeOm.pure({items: ["item1", "item2"], nextToken: Data$dMaybe.$Maybe("Just", "page2")}); }
  if (token === "page2") { return Yoga$dOm.applicativeOm.pure({items: ["item3", "item4"], nextToken: Data$dMaybe.$Maybe("Just", "page3")}); }
  if (token === "page3") { return Yoga$dOm.applicativeOm.pure({items: ["item5"], nextToken: Data$dMaybe.Nothing}); }
  return Yoga$dOm.applicativeOm.pure({items: [], nextToken: Data$dMaybe.Nothing});
});
const example9 = /* #__PURE__ */ (() => Yoga$dOm$dStrom.traverseStrom_(batch => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(v.logger("Saving batch: " + show2(batch)))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
})))({
  pull: Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.mapMStrom(user => Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(Data$dEither.Right, 50.0))))(v2 => {
    if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
    if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
    $runtime.fail();
  }))(() => Yoga$dOm.applicativeOm.pure(user.name + " (ID: " + Data$dShow.showIntImpl(user.id) + ")")))(Yoga$dOm$dStrom.tapMStrom(user => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(v.logger("Processing active user: " + user.name))))(v2 => {
    if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
    if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
    $runtime.fail();
  })))({
    pull: Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.fromArray([
      {id: 1, name: "Alice", active: true},
      {id: 2, name: "Bob", active: false},
      {id: 3, name: "Charlie", active: true},
      {id: 4, name: "Dave", active: true},
      {id: 5, name: "Eve", active: false}
    ]).pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          const filtered = Data$dArray.filterImpl(v => v.active, step._1._1);
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
                const filtered = Data$dArray.filterImpl(v => v.active, step._1._1._1);
                if (filtered.length === 0) { return Data$dMaybe.Nothing; }
                return Data$dMaybe.$Maybe("Just", filtered);
              }
              $runtime.fail();
            })(),
            Yoga$dOm$dStrom.filterStrom(v => v.active)(step._1._2)
          )
        ));
      }
      $runtime.fail();
    })
  })).pull)(step => {
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
}))();
const example8 = /* #__PURE__ */ Yoga$dOm$dStrom.runCollect(/* #__PURE__ */ Yoga$dOm$dStrom.changesStrom(Data$dEq.eqInt)(/* #__PURE__ */ Yoga$dOm$dStrom.fromArray([
  1,
  1,
  2,
  2,
  2,
  3,
  1,
  1,
  4
])));
const example7b = /* #__PURE__ */ (() => Yoga$dOm$dStrom.traverseStrom_(batch => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(v.logger("Processing batch of " + Data$dShow.showIntImpl(batch.length) + " items"))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
})))({
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
    return rangeHelper(1)(100).pull;
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
}))();
const example7 = /* #__PURE__ */ (() => Yoga$dOm$dStrom.runCollect({
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
}))();
const example6b = /* #__PURE__ */ Yoga$dOm$dStrom.runCollect(/* #__PURE__ */ (() => {
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
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", taken), takeHelper(newRemaining)(step._1._2))));
          }
        }
        $runtime.fail();
      })
    };
  };
  return takeHelper(5)(Yoga$dOm$dStrom.takeWhileStrom(v => v === 42)(Yoga$dOm$dStrom.fromArray(Data$dArray.replicateImpl(10000, 42))));
})());
const example6 = /* #__PURE__ */ Yoga$dOm$dStrom.runCollect(/* #__PURE__ */ (() => {
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
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", taken), takeHelper(newRemaining)(step._1._2))));
          }
        }
        $runtime.fail();
      })
    };
  };
  return takeHelper(10)(Yoga$dOm$dStrom.iterateStrom(v => v + 1 | 0)(0));
})());
const example5c = /* #__PURE__ */ (() => Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.altStrom.alt(Yoga$dOm$dStrom.fromArray([1, 2, 3]))(Yoga$dOm$dStrom.fromArray([4, 5, 6]))))();
const example5b = /* #__PURE__ */ (() => Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.semigroupStrom.append(Yoga$dOm$dStrom.fromArray([1, 3, 5, 7]))(Yoga$dOm$dStrom.fromArray([
  2,
  4,
  6,
  8
]))))();
const example5 = /* #__PURE__ */ (() => Yoga$dOm$dStrom.runCollect({
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
    return rangeHelper(1)(5).pull;
  })())(step => {
    if (step.tag === "Done") {
      if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
      if (step._1.tag === "Just") {
        return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
          "Done",
          Data$dMaybe.$Maybe("Just", Data$dFunctor.arrayMap(n => Data$dTuple.$Tuple(n, "stub"))(step._1._1))
        ));
      }
      $runtime.fail();
    }
    if (step.tag === "Loop") {
      return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step(
        "Loop",
        Data$dTuple.$Tuple(
          (() => {
            const $0 = Data$dFunctor.arrayMap(n => Data$dTuple.$Tuple(n, "stub"));
            if (step._1._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", $0(step._1._1._1)); }
            return Data$dMaybe.Nothing;
          })(),
          Yoga$dOm$dStrom.mapStrom(n => Data$dTuple.$Tuple(n, "stub"))(step._1._2)
        )
      ));
    }
    $runtime.fail();
  })
}))();
const example4b = /* #__PURE__ */ Yoga$dOm$dStrom.runCollect(/* #__PURE__ */ Yoga$dOm$dStrom.mapAccumStrom(count => item => Data$dTuple.$Tuple(
  count + 1 | 0,
  Data$dShow.showIntImpl(count) + ": " + item
))(1)(/* #__PURE__ */ Yoga$dOm$dStrom.fromArray(["a", "b", "c", "d"])));
const example4 = /* #__PURE__ */ Yoga$dOm$dStrom.runCollect(/* #__PURE__ */ (() => {
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
})());
const example3 = /* #__PURE__ */ Yoga$dOm$dStrom.runCollect(/* #__PURE__ */ Yoga$dOm$dStrom.mapMStrom(fetchUser)(/* #__PURE__ */ (() => {
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
  return rangeHelper(1)(20);
})()));
const example2 = /* #__PURE__ */ Yoga$dOm$dStrom.traverseStrom_(n => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(v.logger("Result: " + Data$dShow.showIntImpl(n)))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
})))(/* #__PURE__ */ Yoga$dOm$dStrom.mapMStrom(n => Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(Data$dEither.Right, 100.0))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
}))(() => Yoga$dOm.applicativeOm.pure(n * n | 0)))(/* #__PURE__ */ Yoga$dOm$dStrom.tapMStrom(n => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(v.logger("Processing: " + Data$dShow.showIntImpl(n)))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
})))(/* #__PURE__ */ (() => {
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
  return rangeHelper(1)(5);
})())));
const example17b = /* #__PURE__ */ (() => Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.altStrom.alt(Yoga$dOm$dStrom.fromOm($$throw({networkError: "Primary failed"})))(Yoga$dOm$dStrom.fromArray([
  1,
  2,
  3
]))))();
const example17 = /* #__PURE__ */ Yoga$dOm$dStrom.runCollect(/* #__PURE__ */ Yoga$dOm$dStrom.mapMStrom(n => {
  if (n === 3) { return $$throw({networkError: "Connection failed!"}); }
  return Yoga$dOm.applicativeOm.pure(n * 2 | 0);
})(/* #__PURE__ */ (() => {
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
  return rangeHelper(1)(5);
})()));
const example16 = /* #__PURE__ */ (() => Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.bindStrom1.bind(Yoga$dOm$dStrom.fromArray([
  {name: "Engineering", employees: ["Alice", "Bob"]},
  {name: "Sales", employees: ["Charlie"]},
  {name: "Marketing", employees: ["Dave", "Eve", "Frank"]}
]))(dept => Yoga$dOm$dStrom.fromArray(dept.employees))))();
const example15 = /* #__PURE__ */ Yoga$dOm$dStrom.traverseStrom_(n => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(v.logger("Received: " + Data$dShow.showIntImpl(n)))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
})))(/* #__PURE__ */ (() => {
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
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", taken), takeHelper(newRemaining)(step._1._2))));
          }
        }
        $runtime.fail();
      })
    };
  };
  return takeHelper(5)(Yoga$dOm$dStrom.mapMStrom(n => Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(Data$dEither.Right, 500.0))))(v2 => {
    if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
    if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
    $runtime.fail();
  }))(() => Yoga$dOm.applicativeOm.pure(n)))(Yoga$dOm$dStrom.iterateStrom(v => v + 1 | 0)(0)));
})());
const example14b = /* #__PURE__ */ Yoga$dOm$dStrom.runCollect(/* #__PURE__ */ Yoga$dOm$dStrom.dropWhileStrom(v => v < 5)(/* #__PURE__ */ (() => {
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
  return rangeHelper(1)(11);
})()));
const example14 = /* #__PURE__ */ Yoga$dOm$dStrom.runCollect(/* #__PURE__ */ Yoga$dOm$dStrom.dropStrom(5)(/* #__PURE__ */ (() => {
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
  return rangeHelper(1)(11);
})()));
const example13b = /* #__PURE__ */ Yoga$dOm$dStrom.runCollect(/* #__PURE__ */ Yoga$dOm$dStrom.collectMStrom(str => Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(
  Data$dEither.Right,
  10.0
))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
}))(() => Yoga$dOm.applicativeOm.pure((() => {
  if (str === "1") { return Data$dMaybe.$Maybe("Just", 1); }
  if (str === "2") { return Data$dMaybe.$Maybe("Just", 2); }
  if (str === "3") { return Data$dMaybe.$Maybe("Just", 3); }
  return Data$dMaybe.Nothing;
})())))(/* #__PURE__ */ Yoga$dOm$dStrom.fromArray(["1", "not a number", "2", "3", "invalid"])));
const example13 = /* #__PURE__ */ Yoga$dOm$dStrom.runCollect(/* #__PURE__ */ Yoga$dOm$dStrom.collectStrom(parseNumbers)(/* #__PURE__ */ Yoga$dOm$dStrom.fromArray([
  "one",
  "invalid",
  "two",
  "nope",
  "three"
])));
const example12 = /* #__PURE__ */ (() => {
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
  const odds = {
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
  };
  return Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.runCollect({
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
  }))(evensResult => Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.runCollect(odds))(oddsResult => Yoga$dOm.applicativeOm.pure({evens: evensResult, odds: oddsResult})));
})();
const example11 = /* #__PURE__ */ (() => Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.fromOm(Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(Effect$dAff._delay(
  Data$dEither.Right,
  100.0
))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
}))(() => Yoga$dOm.applicativeOm.pure(1)))))();
const example10b = /* #__PURE__ */ (() => Yoga$dOm$dStrom.runCollect(Yoga$dOm$dStrom.bindStrom1.bind(Yoga$dOm$dStrom.unfoldOmStrom(token => Yoga$dOm.bindOm.bind(fetchPage(token))(page => {
  if (page.nextToken.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Data$dMaybe.Nothing); }
  if (page.nextToken.tag === "Just") { return Yoga$dOm.applicativeOm.pure(Data$dMaybe.$Maybe("Just", Data$dTuple.$Tuple(page.items, page.nextToken._1))); }
  $runtime.fail();
}))("start"))(Yoga$dOm$dStrom.fromArray)))();
const example10 = /* #__PURE__ */ Yoga$dOm$dStrom.runCollect(/* #__PURE__ */ (() => {
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
            return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Loop", Data$dTuple.$Tuple(Data$dMaybe.$Maybe("Just", taken), takeHelper(newRemaining)(step._1._2))));
          }
        }
        $runtime.fail();
      })
    };
  };
  return takeHelper(10)(fibonacciStream);
})());
const example1 = /* #__PURE__ */ (() => Yoga$dOm$dStrom.runCollect({
  pull: Yoga$dOm.bindOm.bind(Yoga$dOm.bindOm.bind((() => {
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
        const filtered = Data$dArray.filterImpl(v => v > 5, step._1._1);
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
              const filtered = Data$dArray.filterImpl(v => v > 5, step._1._1._1);
              if (filtered.length === 0) { return Data$dMaybe.Nothing; }
              return Data$dMaybe.$Maybe("Just", filtered);
            }
            $runtime.fail();
          })(),
          Yoga$dOm$dStrom.filterStrom(v => v > 5)(step._1._2)
        )
      ));
    }
    $runtime.fail();
  })
}))();
const eventProcessingPipeline = /* #__PURE__ */ (() => Yoga$dOm$dStrom.traverseStrom_(batch => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(v.logger("Processed batch of " + Data$dShow.showIntImpl(batch.length)))))(v2 => {
  if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
  if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
  $runtime.fail();
})))({
  pull: Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.tapMStrom(v => {
    const $0 = v.event;
    const $1 = v.seq;
    return Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v1 => Yoga$dOm.bindOm.bind(Yoga$dOm.lift(Yoga$dOm.try(v1.logger("Event #" + Data$dShow.showIntImpl($1) + ": " + $0.userId + " - " + $0.action))))(v2 => {
      if (v2.tag === "Left") { return Yoga$dOm.monadThrowVariantExceptio.throwError(Yoga$dOm.singletonVariantRecord.singletonRecordToVariant({exception: v2._1})); }
      if (v2.tag === "Right") { return Yoga$dOm.applicativeOm.pure(v2._1); }
      $runtime.fail();
    }));
  })(Yoga$dOm$dStrom.mapAccumStrom(seq => event => Data$dTuple.$Tuple(seq + 1 | 0, {seq, event}))(0)(Yoga$dOm$dStrom.changesStrom({
    eq: ra => rb => ra.action === rb.action && ra.timestamp === rb.timestamp && ra.userId === rb.userId
  })({
    pull: Yoga$dOm.bindOm.bind(Yoga$dOm$dStrom.fromArray([
      {timestamp: 1000, userId: "u1", action: "login"},
      {timestamp: 1001, userId: "u1", action: "view"},
      {timestamp: 1002, userId: "u2", action: "login"},
      {timestamp: 1003, userId: "u1", action: "view"},
      {timestamp: 1004, userId: "u1", action: "view"},
      {timestamp: 1005, userId: "u2", action: "purchase"}
    ]).pull)(step => {
      if (step.tag === "Done") {
        if (step._1.tag === "Nothing") { return Yoga$dOm.applicativeOm.pure(Control$dMonad$dRec$dClass.$Step("Done", Data$dMaybe.Nothing)); }
        if (step._1.tag === "Just") {
          const filtered = Data$dArray.filterImpl(e => e.action !== "login", step._1._1);
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
                const filtered = Data$dArray.filterImpl(e => e.action !== "login", step._1._1._1);
                if (filtered.length === 0) { return Data$dMaybe.Nothing; }
                return Data$dMaybe.$Maybe("Just", filtered);
              }
              $runtime.fail();
            })(),
            Yoga$dOm$dStrom.filterStrom(e => e.action !== "login")(step._1._2)
          )
        ));
      }
      $runtime.fail();
    })
  }))).pull)(step => {
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
}))();
export {
  $AppError,
  NetworkError,
  TimeoutError,
  ValidationError,
  eventProcessingPipeline,
  example1,
  example10,
  example10b,
  example11,
  example12,
  example13,
  example13b,
  example14,
  example14b,
  example15,
  example16,
  example17,
  example17b,
  example2,
  example3,
  example4,
  example4b,
  example5,
  example5b,
  example5c,
  example6,
  example6b,
  example7,
  example7b,
  example8,
  example9,
  fetchPage,
  fetchUser,
  fibonacciStream,
  parseNumbers,
  runExample,
  runExampleWithLogger,
  show2,
  $$throw as throw
};
