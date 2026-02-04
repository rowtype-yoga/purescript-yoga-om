import * as $runtime from "../runtime.js";
import * as Control$dApply from "../Control.Apply/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Pipes$dCore from "../Pipes.Core/index.js";
import * as Pipes$dInternal from "../Pipes.Internal/index.js";
const $$yield = dictMonad => Pipes$dCore.respond(dictMonad);
const replaceAwait = dictMonad => p1 => p2 => Pipes$dCore.composeRequest(dictMonad)(v => p1)(p2);
const replaceAwait$p = dictMonad => b => a => Pipes$dCore.composeRequest(dictMonad)(v => a)(b);
const next = dictMonad => {
  const $0 = dictMonad.Applicative0();
  const go = p => {
    if (p.tag === "Request") { return Pipes$dInternal.closed(p._1); }
    if (p.tag === "Respond") { return $0.pure(Data$dEither.$Either("Right", Data$dTuple.$Tuple(p._1, p._2()))); }
    if (p.tag === "M") { return dictMonad.Bind1().bind(p._1)(go); }
    if (p.tag === "Pure") { return $0.pure(Data$dEither.$Either("Left", p._1)); }
    $runtime.fail();
  };
  return go;
};
const $$for = dictMonad => Pipes$dCore.composeResponse(dictMonad);
const each = dictMonad => {
  const $0 = Pipes$dInternal.applyProxy(dictMonad);
  return dictFoldable => xs => dictFoldable.foldr(a => p => $0.apply($0.Functor0().map(v => Control$dApply.identity)(Pipes$dInternal.$$$Proxy("Respond", a, Pipes$dInternal.Pure)))(p))(Pipes$dInternal.$$$Proxy(
    "Pure",
    undefined
  ))(xs);
};
const discard = dictMonad => v => dictMonad.Applicative0().pure();
const composePipes = dictMonad => p1 => p2 => Pipes$dCore.composePull$p(dictMonad)(v => p1)(p2);
const composePipes$p = dictMonad => b => a => Pipes$dCore.composePull$p(dictMonad)(v => a)(b);
const composeLoopBodies = dictMonad => Pipes$dCore.composeResponse$p(dictMonad);
const composeLoopBodies$p = dictMonad => b => a => composeLoopBodies(dictMonad)(a)(b);
const cat = dictMonad => {
  const go = a$p => Pipes$dInternal.$$$Proxy("Request", a$p, a => Pipes$dInternal.$$$Proxy("Respond", a, go));
  return go();
};
const $$await = dictMonad => Pipes$dInternal.$$$Proxy("Request", undefined, Pipes$dInternal.Pure);
export {
  $$await as await,
  cat,
  composeLoopBodies,
  composeLoopBodies$p,
  composePipes,
  composePipes$p,
  discard,
  each,
  $$for as for,
  next,
  replaceAwait,
  replaceAwait$p,
  $$yield as yield
};
