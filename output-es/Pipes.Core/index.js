import * as $runtime from "../runtime.js";
import * as Control$dMonad$dRec$dClass from "../Control.Monad.Rec.Class/index.js";
import * as Pipes$dInternal from "../Pipes.Internal/index.js";
const runEffectRec = dictMonadRec => {
  const Monad0 = dictMonadRec.Monad0();
  const $0 = Monad0.Bind1().Apply0().Functor0();
  return dictMonadRec.tailRecM(v => {
    if (v.tag === "Request") { return $0.map(Control$dMonad$dRec$dClass.Done)(Pipes$dInternal.closed(v._1)); }
    if (v.tag === "Respond") { return $0.map(Control$dMonad$dRec$dClass.Done)(Pipes$dInternal.closed(v._1)); }
    if (v.tag === "Pure") { return Monad0.Applicative0().pure(Control$dMonad$dRec$dClass.$Step("Done", v._1)); }
    if (v.tag === "M") { return $0.map(Control$dMonad$dRec$dClass.Loop)(v._1); }
    $runtime.fail();
  });
};
const runEffect = dictMonad => {
  const go = p => {
    if (p.tag === "Request") { return Pipes$dInternal.closed(p._1); }
    if (p.tag === "Respond") { return Pipes$dInternal.closed(p._1); }
    if (p.tag === "M") { return dictMonad.Bind1().bind(p._1)(go); }
    if (p.tag === "Pure") { return dictMonad.Applicative0().pure(p._1); }
    $runtime.fail();
  };
  return go;
};
const respond = dictMonad => a => Pipes$dInternal.$$$Proxy("Respond", a, Pipes$dInternal.Pure);
const request = dictMonad => a$p => Pipes$dInternal.$$$Proxy("Request", a$p, Pipes$dInternal.Pure);
const reflect = dictMonad => {
  const go = p => {
    if (p.tag === "Request") { return Pipes$dInternal.$$$Proxy("Respond", p._1, x => go(p._2(x))); }
    if (p.tag === "Respond") { return Pipes$dInternal.$$$Proxy("Request", p._1, x => go(p._2(x))); }
    if (p.tag === "M") { return Pipes$dInternal.$$$Proxy("M", dictMonad.Bind1().Apply0().Functor0().map(go)(p._1)); }
    if (p.tag === "Pure") { return Pipes$dInternal.$$$Proxy("Pure", p._1); }
    $runtime.fail();
  };
  return go;
};
const push = dictMonad => {
  const go = a => Pipes$dInternal.$$$Proxy("Respond", a, a$p => Pipes$dInternal.$$$Proxy("Request", a$p, go));
  return go;
};
const pull = dictMonad => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  return go;
};
const composeResponse = dictMonad => p0 => fb => {
  const go = p => {
    if (p.tag === "Request") { return Pipes$dInternal.$$$Proxy("Request", p._1, x => go(p._2(x))); }
    if (p.tag === "Respond") { return Pipes$dInternal.bindProxy(dictMonad).bind(fb(p._1))(x => go(p._2(x))); }
    if (p.tag === "M") { return Pipes$dInternal.$$$Proxy("M", dictMonad.Bind1().Apply0().Functor0().map(go)(p._1)); }
    if (p.tag === "Pure") { return Pipes$dInternal.$$$Proxy("Pure", p._1); }
    $runtime.fail();
  };
  return go(p0);
};
const composeResponse$p = dictMonad => fa => fb => a => composeResponse(dictMonad)(fa(a))(fb);
const flippedComposeResponse$p = dictMonad => p1 => p2 => composeResponse$p(dictMonad)(p2)(p1);
const flippedComposeResponse = dictMonad => f => p => composeResponse(dictMonad)(p)(f);
const composeRequest = dictMonad => fb$p => p0 => {
  const go = p => {
    if (p.tag === "Request") { return Pipes$dInternal.bindProxy(dictMonad).bind(fb$p(p._1))(x => go(p._2(x))); }
    if (p.tag === "Respond") { return Pipes$dInternal.$$$Proxy("Respond", p._1, x => go(p._2(x))); }
    if (p.tag === "M") { return Pipes$dInternal.$$$Proxy("M", dictMonad.Bind1().Apply0().Functor0().map(go)(p._1)); }
    if (p.tag === "Pure") { return Pipes$dInternal.$$$Proxy("Pure", p._1); }
    $runtime.fail();
  };
  return go(p0);
};
const composeRequest$p = dictMonad => fb$p => fc$p => c$p => composeRequest(dictMonad)(fb$p)(fc$p(c$p));
const flippedComposeRequest$p = dictMonad => p1 => p2 => composeRequest$p(dictMonad)(p2)(p1);
const flippedComposeRequest = dictMonad => p => f => composeRequest(dictMonad)(f)(p);
const $compocompo = ($compocompo$b$copy, $compocompo$a0$copy, $compocompo$a1$copy, $compocompo$a2$copy) => {
  let $compocompo$b = $compocompo$b$copy;
  let $compocompo$a0 = $compocompo$a0$copy;
  let $compocompo$a1 = $compocompo$a1$copy;
  let $compocompo$a2 = $compocompo$a2$copy;
  let $compocompo$c = true;
  let $compocompo$r;
  while ($compocompo$c) {
    if ($compocompo$b === 0) {
      const dictMonad = $compocompo$a0, p = $compocompo$a1, fb = $compocompo$a2;
      if (p.tag === "Request") {
        $compocompo$c = false;
        $compocompo$r = Pipes$dInternal.$$$Proxy("Request", p._1, a => composePush$p(dictMonad)(p._2(a))(fb));
        continue;
      }
      if (p.tag === "Respond") {
        $compocompo$b = 1;
        $compocompo$a0 = dictMonad;
        $compocompo$a1 = p._2;
        $compocompo$a2 = fb(p._1);
        continue;
      }
      if (p.tag === "M") {
        $compocompo$c = false;
        $compocompo$r = Pipes$dInternal.$$$Proxy("M", dictMonad.Bind1().bind(p._1)(p$p => dictMonad.Applicative0().pure(composePush$p(dictMonad)(p$p)(fb))));
        continue;
      }
      if (p.tag === "Pure") {
        $compocompo$c = false;
        $compocompo$r = Pipes$dInternal.$$$Proxy("Pure", p._1);
        continue;
      }
      $runtime.fail();
    }
    if ($compocompo$b === 1) {
      const dictMonad = $compocompo$a0, fb$p = $compocompo$a1, p = $compocompo$a2;
      if (p.tag === "Request") {
        $compocompo$b = 0;
        $compocompo$a0 = dictMonad;
        $compocompo$a1 = fb$p(p._1);
        $compocompo$a2 = p._2;
        continue;
      }
      if (p.tag === "Respond") {
        $compocompo$c = false;
        $compocompo$r = Pipes$dInternal.$$$Proxy("Respond", p._1, x => composePull$p(dictMonad)(fb$p)(p._2(x)));
        continue;
      }
      if (p.tag === "M") {
        $compocompo$c = false;
        $compocompo$r = Pipes$dInternal.$$$Proxy("M", dictMonad.Bind1().Apply0().Functor0().map(v => composePull$p(dictMonad)(fb$p)(v))(p._1));
        continue;
      }
      if (p.tag === "Pure") {
        $compocompo$c = false;
        $compocompo$r = Pipes$dInternal.$$$Proxy("Pure", p._1);
        continue;
      }
      $runtime.fail();
    }
  }
  return $compocompo$r;
};
const composePush$p = dictMonad => p => fb => $compocompo(0, dictMonad, p, fb);
const composePull$p = dictMonad => fb$p => p => $compocompo(1, dictMonad, fb$p, p);
const composePush = dictMonad => fa => fb => a => composePush$p(dictMonad)(fa(a))(fb);
const flippedComposePush = dictMonad => p1 => p2 => composePush(dictMonad)(p2)(p1);
const flippedComposePush$p = dictMonad => k => p => composePush$p(dictMonad)(p)(k);
const flippedComposePull$p = dictMonad => k => p => composePull$p(dictMonad)(p)(k);
const composePull = dictMonad => fb$p => fc$p => c$p => composePull$p(dictMonad)(fb$p)(fc$p(c$p));
const flippedComposePull = dictMonad => p1 => p2 => composePull(dictMonad)(p2)(p1);
export {
  composePull,
  composePull$p,
  composePush,
  composePush$p,
  composeRequest,
  composeRequest$p,
  composeResponse,
  composeResponse$p,
  flippedComposePull,
  flippedComposePull$p,
  flippedComposePush,
  flippedComposePush$p,
  flippedComposeRequest,
  flippedComposeRequest$p,
  flippedComposeResponse,
  flippedComposeResponse$p,
  pull,
  push,
  reflect,
  request,
  respond,
  runEffect,
  runEffectRec
};
