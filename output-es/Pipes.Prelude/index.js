import * as $runtime from "../runtime.js";
import * as Data$dList$dTypes from "../Data.List.Types/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Pipes from "../Pipes/index.js";
import * as Pipes$dCore from "../Pipes.Core/index.js";
import * as Pipes$dInternal from "../Pipes.Internal/index.js";
const identity = x => x;
const toList = prod0 => {
  const go = prod => v => nil => {
    if (prod.tag === "Request") { return Pipes$dInternal.closed(prod._1); }
    if (prod.tag === "Respond") { return Data$dList$dTypes.$List("Cons", prod._1, go(prod._2())(Data$dList$dTypes.Cons)(nil)); }
    if (prod.tag === "M") { return go(prod._1)(Data$dList$dTypes.Cons)(nil); }
    if (prod.tag === "Pure") { return nil; }
    $runtime.fail();
  };
  return go(prod0)(Data$dList$dTypes.Cons)(Data$dList$dTypes.Nil);
};
const takeWhile$p = dictMonad => {
  const bindProxy = Pipes$dInternal.bindProxy(dictMonad);
  return predicate => {
    const go$lazy = $runtime.binding(() => bindProxy.bind(Pipes$dInternal.$$$Proxy("Request", undefined, Pipes$dInternal.Pure))(a => {
      if (predicate(a)) { return bindProxy.bind(Pipes$dInternal.$$$Proxy("Respond", a, Pipes$dInternal.Pure))(() => go$lazy()); }
      return Pipes$dInternal.$$$Proxy("Pure", a);
    }));
    const go = go$lazy();
    return go;
  };
};
const takeWhile = dictMonad => {
  const bindProxy = Pipes$dInternal.bindProxy(dictMonad);
  return predicate => {
    const go$lazy = $runtime.binding(() => bindProxy.bind(Pipes$dInternal.$$$Proxy("Request", undefined, Pipes$dInternal.Pure))(a => {
      if (predicate(a)) { return bindProxy.bind(Pipes$dInternal.$$$Proxy("Respond", a, Pipes$dInternal.Pure))(() => go$lazy()); }
      return Pipes$dInternal.$$$Proxy("Pure", undefined);
    }));
    const go = go$lazy();
    return go;
  };
};
const take = dictMonad => {
  const bindProxy = Pipes$dInternal.bindProxy(dictMonad);
  const loop = v => {
    if (v === 0) { return Pipes$dInternal.$$$Proxy("Pure", undefined); }
    return bindProxy.bind(Pipes$dInternal.$$$Proxy("Request", undefined, Pipes$dInternal.Pure))(a => bindProxy.bind(Pipes$dInternal.$$$Proxy("Respond", a, Pipes$dInternal.Pure))(() => loop(v - 1 | 0)));
  };
  return loop;
};
const seq = dictMonad => Pipes$dCore.composeResponse(dictMonad)((() => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  return go();
})())(a => Pipes$dInternal.$$$Proxy("Respond", a, Pipes$dInternal.Pure));
const scanM = dictMonad => {
  const bindProxy = Pipes$dInternal.bindProxy(dictMonad);
  return step => begin => done => {
    const go = x => bindProxy.bind(Pipes$dInternal.monadTransProxy.lift(dictMonad)(done(x)))(b => bindProxy.bind(Pipes$dInternal.$$$Proxy("Respond", b, Pipes$dInternal.Pure))(() => bindProxy.bind(Pipes$dInternal.$$$Proxy(
      "Request",
      undefined,
      Pipes$dInternal.Pure
    ))(a => bindProxy.bind(Pipes$dInternal.monadTransProxy.lift(dictMonad)(step(x)(a)))(x$p => go(x$p)))));
    return bindProxy.bind(Pipes$dInternal.monadTransProxy.lift(dictMonad)(begin))(x => go(x));
  };
};
const scan = dictMonad => {
  const bindProxy = Pipes$dInternal.bindProxy(dictMonad);
  return step => begin => done => {
    const go = x => bindProxy.bind(Pipes$dInternal.$$$Proxy("Respond", done(x), Pipes$dInternal.Pure))(() => bindProxy.bind(Pipes$dInternal.$$$Proxy(
      "Request",
      undefined,
      Pipes$dInternal.Pure
    ))(a => go(step(x)(a))));
    return go(begin);
  };
};
const replicateM = dictMonad => {
  const take1 = take(dictMonad);
  return n => m => {
    const $0 = Pipes$dInternal.monadTransProxy.lift(dictMonad)(m);
    return Pipes$dCore.composeRequest(dictMonad)(v => $0)(take1(n));
  };
};
const repeatM = dictMonad => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  const $0 = go();
  return m => {
    const $1 = Pipes$dInternal.monadTransProxy.lift(dictMonad)(m);
    return Pipes$dCore.composeRequest(dictMonad)(v => $1)($0);
  };
};
const $$null = dictMonad => {
  const next = Pipes.next(dictMonad);
  return p => dictMonad.Bind1().bind(next(p))(x => dictMonad.Applicative0().pure((() => {
    if (x.tag === "Left") { return true; }
    if (x.tag === "Right") { return false; }
    $runtime.fail();
  })()));
};
const mapM_ = dictMonad => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  const $0 = go();
  return f => Pipes$dCore.composeResponse(dictMonad)($0)(a => Pipes$dInternal.monadTransProxy.lift(dictMonad)(f(a)));
};
const mapM = dictMonad => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  const $0 = go();
  return f => Pipes$dCore.composeResponse(dictMonad)($0)(a => Pipes$dInternal.bindProxy(dictMonad).bind(Pipes$dInternal.monadTransProxy.lift(dictMonad)(f(a)))(b => Pipes$dInternal.$$$Proxy(
    "Respond",
    b,
    Pipes$dInternal.Pure
  )));
};
const sequence = dictMonad => mapM(dictMonad)(identity);
const mapFoldable = dictMonad => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  const $0 = go();
  const each = Pipes.each(dictMonad);
  return dictFoldable => {
    const each1 = each(dictFoldable);
    return f => Pipes$dCore.composeResponse(dictMonad)($0)(a => each1(f(a)));
  };
};
const map = dictMonad => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  const $0 = go();
  return f => Pipes$dCore.composeResponse(dictMonad)($0)(a => Pipes$dInternal.$$$Proxy("Respond", f(a), Pipes$dInternal.Pure));
};
const show = dictMonad => {
  const map1 = map(dictMonad);
  return dictShow => map1(dictShow.show);
};
const last = dictMonad => {
  const $0 = dictMonad.Bind1();
  const next = Pipes.next(dictMonad);
  const $1 = dictMonad.Applicative0();
  return p0 => {
    const go = a => p => $0.bind(next(p))(x => {
      if (x.tag === "Left") { return $1.pure(Data$dMaybe.$Maybe("Just", a)); }
      if (x.tag === "Right") { return go(x._1._1)(x._1._2); }
      $runtime.fail();
    });
    return $0.bind(next(p0))(x => {
      if (x.tag === "Left") { return $1.pure(Data$dMaybe.Nothing); }
      if (x.tag === "Right") { return go(x._1._1)(x._1._2); }
      $runtime.fail();
    });
  };
};
const head = dictMonad => {
  const next = Pipes.next(dictMonad);
  return p => dictMonad.Bind1().bind(next(p))(x => dictMonad.Applicative0().pure((() => {
    if (x.tag === "Left") { return Data$dMaybe.Nothing; }
    if (x.tag === "Right") { return Data$dMaybe.$Maybe("Just", x._1._1); }
    $runtime.fail();
  })()));
};
const foldM$p = dictMonad => {
  const $0 = dictMonad.Bind1();
  return step => begin => done => p0 => {
    const go = p => x => {
      if (p.tag === "Request") { return Pipes$dInternal.closed(p._1); }
      if (p.tag === "Respond") { return $0.bind(step(x)(p._1))(x$p => go(p._2())(x$p)); }
      if (p.tag === "M") { return $0.bind(p._1)(p$p => go(p$p)(x)); }
      if (p.tag === "Pure") {
        const $1 = p._1;
        return $0.bind(done(x))(b => dictMonad.Applicative0().pure(Data$dTuple.$Tuple(b, $1)));
      }
      $runtime.fail();
    };
    return $0.bind(begin)(x0 => go(p0)(x0));
  };
};
const foldM = dictMonad => {
  const $0 = dictMonad.Bind1();
  return step => begin => done => p0 => {
    const go = p => x => {
      if (p.tag === "Request") { return Pipes$dInternal.closed(p._1); }
      if (p.tag === "Respond") { return $0.bind(step(x)(p._1))(x$p => go(p._2())(x$p)); }
      if (p.tag === "M") { return $0.bind(p._1)(p$p => go(p$p)(x)); }
      if (p.tag === "Pure") { return done(x); }
      $runtime.fail();
    };
    return $0.bind(begin)(x0 => go(p0)(x0));
  };
};
const fold$p = dictMonad => step => begin => done => p0 => {
  const go = p => x => {
    if (p.tag === "Request") { return Pipes$dInternal.closed(p._1); }
    if (p.tag === "Respond") { return go(p._2())(step(x)(p._1)); }
    if (p.tag === "M") { return dictMonad.Bind1().bind(p._1)(p$p => go(p$p)(x)); }
    if (p.tag === "Pure") { return dictMonad.Applicative0().pure(Data$dTuple.$Tuple(done(x), p._1)); }
    $runtime.fail();
  };
  return go(p0)(begin);
};
const fold = dictMonad => step => begin => done => p0 => {
  const go = p => x => {
    if (p.tag === "Request") { return Pipes$dInternal.closed(p._1); }
    if (p.tag === "Respond") { return go(p._2())(step(x)(p._1)); }
    if (p.tag === "M") { return dictMonad.Bind1().bind(p._1)(p$p => go(p$p)(x)); }
    if (p.tag === "Pure") { return dictMonad.Applicative0().pure(done(x)); }
    $runtime.fail();
  };
  return go(p0)(begin);
};
const length = dictMonad => fold(dictMonad)(n => v => n + 1 | 0)(0)(identity);
const maximum = dictMonad => dictOrd => fold(dictMonad)(x => a => Data$dMaybe.$Maybe(
  "Just",
  (() => {
    if (x.tag === "Nothing") { return a; }
    if (x.tag === "Just") {
      if (dictOrd.compare(a)(x._1) !== "LT") { return a; }
      return x._1;
    }
    $runtime.fail();
  })()
))(Data$dMaybe.Nothing)(identity);
const minimum = dictMonad => dictOrd => fold(dictMonad)(x => a => Data$dMaybe.$Maybe(
  "Just",
  (() => {
    if (x.tag === "Nothing") { return a; }
    if (x.tag === "Just") {
      if (dictOrd.compare(a)(x._1) === "LT") { return a; }
      return x._1;
    }
    $runtime.fail();
  })()
))(Data$dMaybe.Nothing)(identity);
const toListM = dictMonad => fold(dictMonad)(x => a => x$1 => x(Data$dList$dTypes.$List("Cons", a, x$1)))(x => x)(x => x(Data$dList$dTypes.Nil));
const findIndices = dictMonad => {
  const bindProxy = Pipes$dInternal.bindProxy(dictMonad);
  return predicate => {
    const go = n => bindProxy.bind(Pipes$dInternal.$$$Proxy("Request", undefined, Pipes$dInternal.Pure))(a => bindProxy.bind(predicate(a)
      ? Pipes$dInternal.$$$Proxy("Respond", n, Pipes$dInternal.Pure)
      : Pipes$dInternal.$$$Proxy("Pure", undefined))(() => go(n + 1 | 0)));
    return go(0);
  };
};
const findIndex = dictMonad => {
  const head1 = head(dictMonad);
  const findIndices1 = findIndices(dictMonad);
  return predicate => p => head1(Pipes$dCore.composePull$p(dictMonad)(v => p)(findIndices1(predicate)));
};
const filterM = dictMonad => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  const $0 = go();
  return predicate => Pipes$dCore.composeResponse(dictMonad)($0)(a => Pipes$dInternal.bindProxy(dictMonad).bind(Pipes$dInternal.monadTransProxy.lift(dictMonad)(predicate(a)))(b => {
    if (b) { return Pipes$dInternal.$$$Proxy("Respond", a, Pipes$dInternal.Pure); }
    return Pipes$dInternal.$$$Proxy("Pure", undefined);
  }));
};
const filter = dictMonad => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  const $0 = go();
  return predicate => Pipes$dCore.composeResponse(dictMonad)($0)(a => {
    if (predicate(a)) { return Pipes$dInternal.$$$Proxy("Respond", a, Pipes$dInternal.Pure); }
    return Pipes$dInternal.$$$Proxy("Pure", undefined);
  });
};
const find = dictMonad => {
  const head1 = head(dictMonad);
  const filter1 = filter(dictMonad);
  return predicate => p => head1(Pipes$dCore.composePull$p(dictMonad)(v => p)(filter1(predicate)));
};
const dropWhile = dictMonad => {
  const bindProxy = Pipes$dInternal.bindProxy(dictMonad);
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  const $0 = go();
  return predicate => {
    const go$1$lazy = $runtime.binding(() => bindProxy.bind(Pipes$dInternal.$$$Proxy("Request", undefined, Pipes$dInternal.Pure))(a => {
      if (predicate(a)) { return go$1$lazy(); }
      return bindProxy.bind(Pipes$dInternal.$$$Proxy("Respond", a, Pipes$dInternal.Pure))(() => $0);
    }));
    const go$1 = go$1$lazy();
    return go$1;
  };
};
const drop = dictMonad => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  const $0 = go();
  const loop = v => {
    if (v === 0) { return $0; }
    return Pipes$dInternal.bindProxy(dictMonad).bind(Pipes$dInternal.$$$Proxy("Request", undefined, Pipes$dInternal.Pure))(() => loop(v - 1 | 0));
  };
  return loop;
};
const index = dictMonad => {
  const head1 = head(dictMonad);
  const drop1 = drop(dictMonad);
  return n => p => head1(Pipes$dCore.composePull$p(dictMonad)(v => p)(drop1(n)));
};
const drain = dictMonad => Pipes$dCore.composeResponse(dictMonad)((() => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  return go();
})())((() => {
  const $0 = Pipes$dInternal.monadProxy(dictMonad);
  return v => $0.Applicative0().pure();
})());
const concat = dictMonad => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  const $0 = go();
  const each = Pipes.each(dictMonad);
  return dictFoldable => Pipes$dCore.composeResponse(dictMonad)($0)(each(dictFoldable));
};
const chain = dictMonad => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  const $0 = go();
  return f => Pipes$dCore.composeResponse(dictMonad)($0)(a => Pipes$dInternal.bindProxy(dictMonad).bind(Pipes$dInternal.monadTransProxy.lift(dictMonad)(f(a)))(() => Pipes$dInternal.$$$Proxy(
    "Respond",
    a,
    Pipes$dInternal.Pure
  )));
};
const any = dictMonad => {
  const null1 = $$null(dictMonad);
  const filter1 = filter(dictMonad);
  return predicate => p => dictMonad.Bind1().bind(null1(Pipes$dCore.composePull$p(dictMonad)(v => p)(filter1(predicate))))(a$p => dictMonad.Applicative0().pure(!a$p));
};
const elem = dictMonad => {
  const any1 = any(dictMonad);
  return dictEq => a => any1(v => dictEq.eq(a)(v));
};
const or = dictMonad => any(dictMonad)(identity);
const all = dictMonad => {
  const null1 = $$null(dictMonad);
  const filter1 = filter(dictMonad);
  return predicate => p => null1(Pipes$dCore.composePull$p(dictMonad)(v => p)(filter1(a => !predicate(a))));
};
const and = dictMonad => all(dictMonad)(identity);
const notElem = dictMonad => {
  const all1 = all(dictMonad);
  return dictEq => a => all1(v => !dictEq.eq(a)(v));
};
export {
  all,
  and,
  any,
  chain,
  concat,
  drain,
  drop,
  dropWhile,
  elem,
  filter,
  filterM,
  find,
  findIndex,
  findIndices,
  fold,
  fold$p,
  foldM,
  foldM$p,
  head,
  identity,
  index,
  last,
  length,
  map,
  mapFoldable,
  mapM,
  mapM_,
  maximum,
  minimum,
  notElem,
  $$null as null,
  or,
  repeatM,
  replicateM,
  scan,
  scanM,
  seq,
  sequence,
  show,
  take,
  takeWhile,
  takeWhile$p,
  toList,
  toListM
};
