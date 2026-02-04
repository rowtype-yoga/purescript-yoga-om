import * as $runtime from "../runtime.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
const $$$Proxy = (tag, _1, _2) => ({tag, _1, _2});
const X = x => x;
const Request = value0 => value1 => $$$Proxy("Request", value0, value1);
const Respond = value0 => value1 => $$$Proxy("Respond", value0, value1);
const M = value0 => $$$Proxy("M", value0);
const Pure = value0 => $$$Proxy("Pure", value0);
const observe = dictMonad => {
  const $0 = dictMonad.Applicative0();
  return p0 => {
    const go = p => {
      if (p.tag === "Request") {
        return $0.pure($$$Proxy(
          "Request",
          p._1,
          (() => {
            const $1 = observe(dictMonad);
            return x => $1(p._2(x));
          })()
        ));
      }
      if (p.tag === "Respond") {
        return $0.pure($$$Proxy(
          "Respond",
          p._1,
          (() => {
            const $1 = observe(dictMonad);
            return x => $1(p._2(x));
          })()
        ));
      }
      if (p.tag === "M") { return dictMonad.Bind1().bind(p._1)(go); }
      if (p.tag === "Pure") { return $0.pure($$$Proxy("Pure", p._1)); }
      $runtime.fail();
    };
    return $$$Proxy("M", go(p0));
  };
};
const proxyMFunctor = {
  hoist: dictMonad => {
    const observe1 = observe(dictMonad);
    return nat => p0 => {
      const go = p => {
        if (p.tag === "Request") { return $$$Proxy("Request", p._1, x => go(p._2(x))); }
        if (p.tag === "Respond") { return $$$Proxy("Respond", p._1, x => go(p._2(x))); }
        if (p.tag === "M") { return $$$Proxy("M", nat(dictMonad.Bind1().bind(p._1)(p$p => dictMonad.Applicative0().pure(go(p$p))))); }
        if (p.tag === "Pure") { return $$$Proxy("Pure", p._1); }
        $runtime.fail();
      };
      return go(observe1(p0));
    };
  }
};
const monadTransProxy = {lift: dictMonad => m => $$$Proxy("M", dictMonad.Bind1().Apply0().Functor0().map(Pure)(m))};
const functorProxy = dictMonad => (
  {
    map: f => p0 => {
      const go = p => {
        if (p.tag === "Request") { return $$$Proxy("Request", p._1, x => go(p._2(x))); }
        if (p.tag === "Respond") { return $$$Proxy("Respond", p._1, x => go(p._2(x))); }
        if (p.tag === "M") { return $$$Proxy("M", dictMonad.Bind1().bind(p._1)(v => dictMonad.Applicative0().pure(go(v)))); }
        if (p.tag === "Pure") { return $$$Proxy("Pure", f(p._1)); }
        $runtime.fail();
      };
      return go(p0);
    }
  }
);
const proxyAlt = dictMonadPlus => {
  const Alternative1 = dictMonadPlus.Alternative1();
  const Monad0 = dictMonadPlus.Monad0();
  const $0 = Alternative1.Applicative0();
  const functorProxy1 = functorProxy(Monad0);
  return {
    alt: v => v1 => {
      if (v.tag === "Request") { return $$$Proxy("Request", v._1, a => proxyAlt(dictMonadPlus).alt(v._2(a))(v1)); }
      if (v.tag === "Respond") { return $$$Proxy("Respond", v._1, b$p => proxyAlt(dictMonadPlus).alt(v._2(b$p))(v1)); }
      if (v.tag === "Pure") { return $$$Proxy("Pure", v._1); }
      if (v.tag === "M") { return $$$Proxy("M", Alternative1.Plus1().Alt0().alt(Monad0.Bind1().bind(v._1)(p$p => $0.pure(proxyAlt(dictMonadPlus).alt(p$p)(v1))))($0.pure(v1))); }
      $runtime.fail();
    },
    Functor0: () => functorProxy1
  };
};
const proxyPlus = dictMonadPlus => {
  const proxyAlt1 = proxyAlt(dictMonadPlus);
  return {empty: monadTransProxy.lift(dictMonadPlus.Monad0())(dictMonadPlus.Alternative1().Plus1().empty), Alt0: () => proxyAlt1};
};
const semigroupProxy = dictMonad => dictSemigroup => (
  {
    append: p1 => p2 => {
      const go = p => {
        if (p.tag === "Request") { return $$$Proxy("Request", p._1, x => go(p._2(x))); }
        if (p.tag === "Respond") { return $$$Proxy("Respond", p._1, x => go(p._2(x))); }
        if (p.tag === "M") { return $$$Proxy("M", dictMonad.Bind1().bind(p._1)(v => dictMonad.Applicative0().pure(go(v)))); }
        if (p.tag === "Pure") {
          const $0 = p._1;
          return functorProxy(dictMonad).map(v => dictSemigroup.append($0)(v))(p2);
        }
        $runtime.fail();
      };
      return go(p1);
    }
  }
);
const monoidProxy = dictMonad => dictMonoid => {
  const semigroupProxy2 = semigroupProxy(dictMonad)(dictMonoid.Semigroup0());
  return {mempty: $$$Proxy("Pure", dictMonoid.mempty), Semigroup0: () => semigroupProxy2};
};
const closed = closed$a0$copy => {
  let closed$a0 = closed$a0$copy, closed$c = true, closed$r;
  while (closed$c) {
    const v = closed$a0;
    closed$a0 = v;
  }
  return closed$r;
};
const applyProxy = dictMonad => {
  const functorProxy1 = functorProxy(dictMonad);
  return {
    apply: pf0 => px => {
      const go = pf => {
        if (pf.tag === "Request") { return $$$Proxy("Request", pf._1, x => go(pf._2(x))); }
        if (pf.tag === "Respond") { return $$$Proxy("Respond", pf._1, x => go(pf._2(x))); }
        if (pf.tag === "M") { return $$$Proxy("M", dictMonad.Bind1().bind(pf._1)(v => dictMonad.Applicative0().pure(go(v)))); }
        if (pf.tag === "Pure") { return functorProxy1.map(pf._1)(px); }
        $runtime.fail();
      };
      return go(pf0);
    },
    Functor0: () => functorProxy1
  };
};
const bindProxy = dictMonad => {
  const applyProxy1 = applyProxy(dictMonad);
  return {
    bind: p0 => f => {
      const go = p => {
        if (p.tag === "Request") { return $$$Proxy("Request", p._1, x => go(p._2(x))); }
        if (p.tag === "Respond") { return $$$Proxy("Respond", p._1, x => go(p._2(x))); }
        if (p.tag === "M") { return $$$Proxy("M", dictMonad.Bind1().bind(p._1)(v => dictMonad.Applicative0().pure(go(v)))); }
        if (p.tag === "Pure") { return f(p._1); }
        $runtime.fail();
      };
      return go(p0);
    },
    Apply0: () => applyProxy1
  };
};
const proxyMMonad = {
  embed: dictMonad => f => {
    const go = p => {
      if (p.tag === "Request") { return $$$Proxy("Request", p._1, x => go(p._2(x))); }
      if (p.tag === "Respond") { return $$$Proxy("Respond", p._1, x => go(p._2(x))); }
      if (p.tag === "M") { return bindProxy(dictMonad).bind(f(p._1))(go); }
      if (p.tag === "Pure") { return $$$Proxy("Pure", p._1); }
      $runtime.fail();
    };
    return go;
  },
  MFunctor0: () => proxyMFunctor,
  MonadTrans1: () => monadTransProxy
};
const applicativeProxy = dictMonad => {
  const applyProxy1 = applyProxy(dictMonad);
  return {pure: Pure, Apply0: () => applyProxy1};
};
const monadProxy = dictMonad => {
  const applyProxy1 = applyProxy(dictMonad);
  const bindProxy1 = bindProxy(dictMonad);
  return {Applicative0: () => ({pure: Pure, Apply0: () => applyProxy1}), Bind1: () => bindProxy1};
};
const monadRecProxy = dictMonad => {
  const monadProxy1 = monadProxy(dictMonad);
  return {
    tailRecM: f => a0 => {
      const go = v => {
        if (v.tag === "Pure") {
          if (v._1.tag === "Loop") { return go(f(v._1._1)); }
          if (v._1.tag === "Done") { return $$$Proxy("Pure", v._1._1); }
          $runtime.fail();
        }
        if (v.tag === "M") { return $$$Proxy("M", dictMonad.Bind1().bind(v._1)(v1 => dictMonad.Applicative0().pure(go(v1)))); }
        if (v.tag === "Request") { return $$$Proxy("Request", v._1, x => go(v._2(x))); }
        if (v.tag === "Respond") { return $$$Proxy("Respond", v._1, x => go(v._2(x))); }
        $runtime.fail();
      };
      return go(f(a0));
    },
    Monad0: () => monadProxy1
  };
};
const proxyMonadAsk = dictMonadAsk => {
  const Monad0 = dictMonadAsk.Monad0();
  const monadProxy1 = monadProxy(Monad0);
  return {ask: monadTransProxy.lift(Monad0)(dictMonadAsk.ask), Monad0: () => monadProxy1};
};
const proxyMonadReader = dictMonadReader => {
  const MonadAsk0 = dictMonadReader.MonadAsk0();
  const Monad0 = MonadAsk0.Monad0();
  const proxyMonadAsk1 = proxyMonadAsk(MonadAsk0);
  return {
    local: f => {
      const go = p => {
        if (p.tag === "Request") { return $$$Proxy("Request", p._1, a => go(p._2(a))); }
        if (p.tag === "Respond") { return $$$Proxy("Respond", p._1, b$p => go(p._2(b$p))); }
        if (p.tag === "Pure") { return $$$Proxy("Pure", p._1); }
        if (p.tag === "M") { return $$$Proxy("M", Monad0.Bind1().bind(dictMonadReader.local(f)(p._1))(r => Monad0.Applicative0().pure(go(r)))); }
        $runtime.fail();
      };
      return go;
    },
    MonadAsk0: () => proxyMonadAsk1
  };
};
const proxyMonadEffect = dictMonadEffect => {
  const monadProxy1 = monadProxy(dictMonadEffect.Monad0());
  return {
    liftEffect: m => $$$Proxy(
      "M",
      dictMonadEffect.liftEffect(() => {
        const r = m();
        return $$$Proxy("Pure", r);
      })
    ),
    Monad0: () => monadProxy1
  };
};
const proxyMonadAff = dictMonadAff => {
  const proxyMonadEffect1 = proxyMonadEffect(dictMonadAff.MonadEffect0());
  return {liftAff: m => $$$Proxy("M", dictMonadAff.liftAff(Effect$dAff._bind(m)(r => Effect$dAff._pure($$$Proxy("Pure", r))))), MonadEffect0: () => proxyMonadEffect1};
};
const proxyMonadState = dictMonadState => {
  const Monad0 = dictMonadState.Monad0();
  const monadProxy1 = monadProxy(Monad0);
  return {state: x => monadTransProxy.lift(Monad0)(dictMonadState.state(x)), Monad0: () => monadProxy1};
};
const proxyMonadTell = dictMonoid => dictMonadTell => {
  const Monad1 = dictMonadTell.Monad1();
  const Semigroup0 = dictMonadTell.Semigroup0();
  const monadProxy1 = monadProxy(Monad1);
  return {tell: x => monadTransProxy.lift(Monad1)(dictMonadTell.tell(x)), Semigroup0: () => Semigroup0, Monad1: () => monadProxy1};
};
const proxyMonadWriter = dictMonoid => dictMonadWriter => {
  const MonadTell1 = dictMonadWriter.MonadTell1();
  const Monad1 = MonadTell1.Monad1();
  const $0 = Monad1.Bind1();
  const $1 = Monad1.Applicative0();
  const $2 = MonadTell1.Semigroup0();
  const Monoid0 = dictMonadWriter.Monoid0();
  const mempty = Monoid0.mempty;
  const proxyMonadTell1 = proxyMonadTell(Monoid0)(MonadTell1);
  return {
    listen: p0 => {
      const go = p => w => {
        if (p.tag === "Request") { return $$$Proxy("Request", p._1, a => go(p._2(a))(w)); }
        if (p.tag === "Respond") { return $$$Proxy("Respond", p._1, b$p => go(p._2(b$p))(w)); }
        if (p.tag === "Pure") { return $$$Proxy("Pure", Data$dTuple.$Tuple(p._1, w)); }
        if (p.tag === "M") { return $$$Proxy("M", $0.bind(dictMonadWriter.listen(p._1))(v => $1.pure(go(v._1)($2.append(w)(v._2))))); }
        $runtime.fail();
      };
      return go(p0)(mempty);
    },
    pass: p0 => {
      const go = p => w => {
        if (p.tag === "Request") { return $$$Proxy("Request", p._1, a => go(p._2(a))(w)); }
        if (p.tag === "Respond") { return $$$Proxy("Respond", p._1, b$p => go(p._2(b$p))(w)); }
        if (p.tag === "Pure") { return $$$Proxy("M", dictMonadWriter.pass($1.pure(Data$dTuple.$Tuple($$$Proxy("Pure", p._1._1), v => p._1._2(w))))); }
        if (p.tag === "M") { return $$$Proxy("M", $0.bind(dictMonadWriter.listen(p._1))(v => $1.pure(go(v._1)($2.append(w)(v._2))))); }
        $runtime.fail();
      };
      return go(p0)(mempty);
    },
    Monoid0: () => Monoid0,
    MonadTell1: () => proxyMonadTell1
  };
};
const proxyMonadThrow = dictMonadThrow => {
  const Monad0 = dictMonadThrow.Monad0();
  const monadProxy1 = monadProxy(Monad0);
  return {throwError: x => monadTransProxy.lift(Monad0)(dictMonadThrow.throwError(x)), Monad0: () => monadProxy1};
};
const proxyMonadError = dictMonadError => {
  const MonadThrow0 = dictMonadError.MonadThrow0();
  const Monad0 = MonadThrow0.Monad0();
  const $0 = Monad0.Applicative0();
  const proxyMonadThrow1 = proxyMonadThrow(MonadThrow0);
  return {
    catchError: v => v1 => {
      if (v.tag === "Request") { return $$$Proxy("Request", v._1, a => proxyMonadError(dictMonadError).catchError(v._2(a))(v1)); }
      if (v.tag === "Respond") { return $$$Proxy("Respond", v._1, b$p => proxyMonadError(dictMonadError).catchError(v._2(b$p))(v1)); }
      if (v.tag === "Pure") { return $$$Proxy("Pure", v._1); }
      if (v.tag === "M") {
        return $$$Proxy("M", dictMonadError.catchError(Monad0.Bind1().bind(v._1)(p$p => $0.pure(proxyMonadError(dictMonadError).catchError(p$p)(v1))))(x => $0.pure(v1(x))));
      }
      $runtime.fail();
    },
    MonadThrow0: () => proxyMonadThrow1
  };
};
const proxyAlternative = dictMonadPlus => {
  const applyProxy1 = applyProxy(dictMonadPlus.Monad0());
  const proxyPlus1 = proxyPlus(dictMonadPlus);
  return {Applicative0: () => ({pure: Pure, Apply0: () => applyProxy1}), Plus1: () => proxyPlus1};
};
export {
  $$$Proxy,
  M,
  Pure,
  Request,
  Respond,
  X,
  applicativeProxy,
  applyProxy,
  bindProxy,
  closed,
  functorProxy,
  monadProxy,
  monadRecProxy,
  monadTransProxy,
  monoidProxy,
  observe,
  proxyAlt,
  proxyAlternative,
  proxyMFunctor,
  proxyMMonad,
  proxyMonadAff,
  proxyMonadAsk,
  proxyMonadEffect,
  proxyMonadError,
  proxyMonadReader,
  proxyMonadState,
  proxyMonadTell,
  proxyMonadThrow,
  proxyMonadWriter,
  proxyPlus,
  semigroupProxy
};
