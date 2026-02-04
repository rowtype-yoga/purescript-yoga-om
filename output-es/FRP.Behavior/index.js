import * as $runtime from "../runtime.js";
import * as Control$dSemigroupoid from "../Control.Semigroupoid/index.js";
import * as Data$dFunction from "../Data.Function/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as FRP$dEvent from "../FRP.Event/index.js";
import * as FRP$dEvent$dAnimationFrame from "../FRP.Event.AnimationFrame/index.js";
import * as FRP$dEvent$dClass from "../FRP.Event.Class/index.js";
const identity = x => x;
const ABehavior = x => x;
const step = dictIsEvent => {
  const Alternative0 = dictIsEvent.Alternative0();
  return a => e => dictIsEvent.sampleOnRight(Alternative0.Plus1().Alt0().alt(Alternative0.Applicative0().pure(a))(e));
};
const unfold = dictIsEvent => {
  const Alternative0 = dictIsEvent.Alternative0();
  const Alternative0$1 = dictIsEvent.Alternative0();
  return f => a => e => dictIsEvent.sampleOnRight(Alternative0.Plus1().Alt0().alt(Alternative0.Applicative0().pure(a))(dictIsEvent.fix(i => dictIsEvent.sampleOnRight(Alternative0$1.Plus1().Alt0().alt(i)(Alternative0$1.Applicative0().pure(a)))(dictIsEvent.Filterable1().Functor1().map(b => a$1 => f(a$1)(b))(e)))));
};
const sample = v => e => v(e);
const functorABehavior = dictFunctor => ({map: f => v => e => v(dictFunctor.map(v1 => x => v1(f(x)))(e))});
const sampleBy = dictFunctor => f => b => e => b(dictFunctor.map(v1 => x => v1(f(x)))(dictFunctor.map(Data$dFunction.applyFlipped)(e)));
const gateBy = dictFilterable => {
  const sampleBy1 = sampleBy(dictFilterable.Functor1());
  return f => ps => xs => dictFilterable.Compactable0().compact(sampleBy1(p => x => {
    if (f(p)(x)) { return Data$dMaybe.$Maybe("Just", x); }
    return Data$dMaybe.Nothing;
  })(ps)(xs));
};
const gate = dictFilterable => gateBy(dictFilterable)(Data$dFunction.const);
const integral = dictIsEvent => {
  const Functor1 = dictIsEvent.Filterable1().Functor1();
  const withLast = FRP$dEvent$dClass.withLast(dictIsEvent);
  const Alternative0 = dictIsEvent.Alternative0();
  return dictField => {
    const Ring0 = dictField.DivisionRing1().Ring0();
    const Semiring0 = Ring0.Semiring0();
    const one = Semiring0.one;
    return dictSemiring => g => initial => t => b => {
      const two = Semiring0.add(one)(one);
      return e => dictIsEvent.sampleOnRight((() => {
        const $0 = withLast(sampleBy(Functor1)(Data$dTuple.Tuple)(t)(b(Functor1.map(v => identity)(e))));
        return dictIsEvent.fix(i => dictIsEvent.sampleOnRight(Alternative0.Plus1().Alt0().alt(i)(Alternative0.Applicative0().pure(initial)))(dictIsEvent.Filterable1().Functor1().map(b$1 => a => {
          if (b$1.last.tag === "Nothing") { return a; }
          if (b$1.last.tag === "Just") {
            const $1 = b$1.last._1._2;
            const $2 = b$1.now._2;
            const $3 = b$1.last._1._1;
            const $4 = b$1.now._1;
            return dictSemiring.add(a)(g(f => dictField.EuclideanRing0().div(Semiring0.mul(f(dictSemiring.add($1)($2)))(Ring0.sub($4)($3)))(two)));
          }
          $runtime.fail();
        })($0)));
      })())(e);
    };
  };
};
const integral1 = /* #__PURE__ */ integral(FRP$dEvent.eventIsEvent);
const integral$p = dictIsEvent => {
  const integral2 = integral(dictIsEvent);
  return dictField => integral2(dictField)(dictField.DivisionRing1().Ring0().Semiring0())(v => v(identity));
};
const sample_ = dictFunctor => sampleBy(dictFunctor)(Data$dFunction.const);
const derivative = dictIsEvent => {
  const Functor1 = dictIsEvent.Filterable1().Functor1();
  const withLast = FRP$dEvent$dClass.withLast(dictIsEvent);
  return dictField => dictRing => {
    const zero = dictRing.Semiring0().zero;
    return g => t => b => e => dictIsEvent.sampleOnRight(Functor1.map(v => {
      if (v.last.tag === "Nothing") { return zero; }
      if (v.last.tag === "Just") {
        const $0 = v.last._1._2;
        const $1 = v.now._2;
        const $2 = v.last._1._1;
        const $3 = v.now._1;
        return g(f => dictField.EuclideanRing0().div(f(dictRing.sub($1)($0)))(dictField.DivisionRing1().Ring0().sub($3)($2)));
      }
      $runtime.fail();
    })(withLast(sampleBy(Functor1)(Data$dTuple.Tuple)(t)(b(Functor1.map(v => identity)(e))))))(e);
  };
};
const derivative$p = dictIsEvent => {
  const derivative1 = derivative(dictIsEvent);
  return dictField => derivative1(dictField)(dictField.DivisionRing1().Ring0())(v => v(identity));
};
const behavior = ABehavior;
const fixB = dictIsEvent => {
  const Alternative0 = dictIsEvent.Alternative0();
  const sample_2 = sample_(dictIsEvent.Filterable1().Functor1());
  return a => f => s => dictIsEvent.sampleOnRight(dictIsEvent.fix(event => sample_2(f(dictIsEvent.sampleOnRight(Alternative0.Plus1().Alt0().alt(Alternative0.Applicative0().pure(a))(event))))(s)))(s);
};
const fixB1 = /* #__PURE__ */ fixB(FRP$dEvent.eventIsEvent);
const solve = dictField => {
  const integral2 = integral1(dictField);
  return dictSemiring => {
    const integral3 = integral2(dictSemiring);
    return g => a0 => t => f => fixB1(a0)(b => integral3(g)(a0)(t)(f(b)));
  };
};
const solve$p = dictField => solve(dictField)(dictField.DivisionRing1().Ring0().Semiring0())(v => v(identity));
const solve2 = dictField => {
  const integral2 = integral1(dictField);
  return dictSemiring => {
    const integral3 = integral2(dictSemiring);
    return g => a0 => da0 => t => f => fixB1(a0)(b => integral3(g)(a0)(t)(fixB1(da0)(db => integral3(g)(da0)(t)(f(b)(db)))));
  };
};
const solve2$p = dictField => solve2(dictField)(dictField.DivisionRing1().Ring0().Semiring0())(v => v(identity));
const switcher = dictIsEvent => {
  const Alternative0 = dictIsEvent.Alternative0();
  return b0 => e => s => dictIsEvent.keepLatest(Alternative0.Plus1().Alt0().alt(Alternative0.Applicative0().pure(b0(s)))(dictIsEvent.Filterable1().Functor1().map(b => b(s))(e)));
};
const applyABehavior = dictFunctor => {
  const functorABehavior1 = {map: f => v => e => v(dictFunctor.map(v1 => x => v1(f(x)))(e))};
  return {apply: v => v1 => e => v1(v(dictFunctor.map(Control$dSemigroupoid.semigroupoidFn.compose)(e))), Functor0: () => functorABehavior1};
};
const semigroupABehavior = dictFunctor => {
  const $0 = applyABehavior(dictFunctor);
  return dictSemigroup => (
    {
      append: (() => {
        const $1 = dictSemigroup.append;
        return a => b => $0.apply($0.Functor0().map($1)(a))(b);
      })()
    }
  );
};
const applicativeABehavior = dictFunctor => {
  const applyABehavior1 = applyABehavior(dictFunctor);
  return {pure: a => e => dictFunctor.map(Data$dFunction.applyFlipped(a))(e), Apply0: () => applyABehavior1};
};
const heytingAlgebraABehavior = dictFunctor => {
  const $0 = applicativeABehavior(dictFunctor);
  const $1 = applyABehavior(dictFunctor);
  const lift2 = f => a => b => $1.apply($1.Functor0().map(f)(a))(b);
  return dictHeytingAlgebra => (
    {
      tt: $0.pure(dictHeytingAlgebra.tt),
      ff: $0.pure(dictHeytingAlgebra.ff),
      not: v => e => v(dictFunctor.map(v1 => x => v1(dictHeytingAlgebra.not(x)))(e)),
      implies: lift2(dictHeytingAlgebra.implies),
      conj: lift2(dictHeytingAlgebra.conj),
      disj: lift2(dictHeytingAlgebra.disj)
    }
  );
};
const monoidABehavior = dictFunctor => {
  const semigroupABehavior1 = semigroupABehavior(dictFunctor);
  return dictMonoid => {
    const semigroupABehavior2 = semigroupABehavior1(dictMonoid.Semigroup0());
    return {mempty: applicativeABehavior(dictFunctor).pure(dictMonoid.mempty), Semigroup0: () => semigroupABehavior2};
  };
};
const semiringABehavior = dictFunctor => {
  const $0 = applicativeABehavior(dictFunctor);
  const $1 = applyABehavior(dictFunctor);
  const lift2 = f => a => b => $1.apply($1.Functor0().map(f)(a))(b);
  return dictSemiring => ({zero: $0.pure(dictSemiring.zero), one: $0.pure(dictSemiring.one), add: lift2(dictSemiring.add), mul: lift2(dictSemiring.mul)});
};
const ringABehavior = dictFunctor => {
  const $0 = applyABehavior(dictFunctor);
  const semiringABehavior1 = semiringABehavior(dictFunctor);
  return dictRing => {
    const semiringABehavior2 = semiringABehavior1(dictRing.Semiring0());
    return {
      sub: (() => {
        const $1 = dictRing.sub;
        return a => b => $0.apply($0.Functor0().map($1)(a))(b);
      })(),
      Semiring0: () => semiringABehavior2
    };
  };
};
const animate = scene => render => FRP$dEvent.backdoor.subscribe(sampleBy(FRP$dEvent.functorEvent)(Data$dFunction.const)(scene)(FRP$dEvent$dAnimationFrame.animationFrame))(render);
export {
  ABehavior,
  animate,
  applicativeABehavior,
  applyABehavior,
  behavior,
  derivative,
  derivative$p,
  fixB,
  fixB1,
  functorABehavior,
  gate,
  gateBy,
  heytingAlgebraABehavior,
  identity,
  integral,
  integral$p,
  integral1,
  monoidABehavior,
  ringABehavior,
  sample,
  sampleBy,
  sample_,
  semigroupABehavior,
  semiringABehavior,
  solve,
  solve$p,
  solve2,
  solve2$p,
  step,
  switcher,
  unfold
};
