import * as $runtime from "../runtime.js";
import * as Control$dApply from "../Control.Apply/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Pipes from "../Pipes/index.js";
import * as Pipes$dCore from "../Pipes.Core/index.js";
import * as Pipes$dInternal from "../Pipes.Internal/index.js";
const identity = x => x;
const Select = x => x;
const toListT = dict => dict.toListT;
const maybeTEnumerable = {
  toListT: dictMonad => m => Pipes$dInternal.bindProxy(dictMonad).bind(Pipes$dInternal.monadTransProxy.lift(dictMonad)(m))(x => {
    if (x.tag === "Nothing") { return Pipes$dInternal.$$$Proxy("Pure", undefined); }
    if (x.tag === "Just") { return Pipes$dInternal.$$$Proxy("Respond", x._1, Pipes$dInternal.Pure); }
    $runtime.fail();
  })
};
const listTMonadTrans = {lift: dictMonad => m => Pipes$dInternal.bindProxy(dictMonad).bind(Pipes$dInternal.monadTransProxy.lift(dictMonad)(m))(Pipes.yield(dictMonad))};
const listTFunctor = dictMonad => ({map: f => v => Pipes$dCore.composeResponse(dictMonad)(v)(x => Pipes$dInternal.$$$Proxy("Respond", f(x), Pipes$dInternal.Pure))});
const listTEnumerable = {toListT: dictMonad => identity};
const listTApply = dictMonad => {
  const listTFunctor1 = {map: f => v => Pipes$dCore.composeResponse(dictMonad)(v)(x => Pipes$dInternal.$$$Proxy("Respond", f(x), Pipes$dInternal.Pure))};
  return {
    apply: v => v1 => Pipes$dCore.composeResponse(dictMonad)(v)(f => Pipes$dCore.composeResponse(dictMonad)(v1)(x => Pipes$dInternal.$$$Proxy("Respond", f(x), Pipes$dInternal.Pure))),
    Functor0: () => listTFunctor1
  };
};
const listTApplicative = dictMonad => {
  const listTApply1 = listTApply(dictMonad);
  return {pure: x => Pipes$dInternal.$$$Proxy("Respond", x, Pipes$dInternal.Pure), Apply0: () => listTApply1};
};
const listTAlt = dictMonad => {
  const $0 = Pipes$dInternal.applyProxy(dictMonad);
  const listTFunctor1 = {map: f => v => Pipes$dCore.composeResponse(dictMonad)(v)(x => Pipes$dInternal.$$$Proxy("Respond", f(x), Pipes$dInternal.Pure))};
  return {alt: v => v1 => $0.apply($0.Functor0().map(v$1 => Control$dApply.identity)(v))(v1), Functor0: () => listTFunctor1};
};
const listTPlus = dictMonad => {
  const listTAlt1 = listTAlt(dictMonad);
  return {empty: Pipes$dInternal.$$$Proxy("Pure", undefined), Alt0: () => listTAlt1};
};
const listTAlternative = dictMonad => {
  const listTApply1 = listTApply(dictMonad);
  const listTAlt1 = listTAlt(dictMonad);
  return {
    Applicative0: () => ({pure: x => Pipes$dInternal.$$$Proxy("Respond", x, Pipes$dInternal.Pure), Apply0: () => listTApply1}),
    Plus1: () => ({empty: Pipes$dInternal.$$$Proxy("Pure", undefined), Alt0: () => listTAlt1})
  };
};
const listTSemigroup = dictMonad => ({append: listTAlt(dictMonad).alt});
const listTMonoid = dictMonad => {
  const listTSemigroup1 = {append: listTAlt(dictMonad).alt};
  return {mempty: Pipes$dInternal.$$$Proxy("Pure", undefined), Semigroup0: () => listTSemigroup1};
};
const errorTEnumerable = {
  toListT: dictMonad => m => Pipes$dInternal.bindProxy(dictMonad).bind(Pipes$dInternal.monadTransProxy.lift(dictMonad)(m))(x => {
    if (x.tag === "Left") { return Pipes$dInternal.$$$Proxy("Pure", undefined); }
    if (x.tag === "Right") { return Pipes$dInternal.$$$Proxy("Respond", x._1, Pipes$dInternal.Pure); }
    $runtime.fail();
  })
};
const enumerate = v => v;
const every = dictMonad => {
  const $0 = Pipes$dInternal.monadProxy(dictMonad);
  return dictEnumerable => {
    const toListT1 = dictEnumerable.toListT(dictMonad);
    return it => Pipes$dCore.composeRequest(dictMonad)(v => $0.Applicative0().pure())(toListT1(it));
  };
};
const listTBind = dictMonad => {
  const listTApply1 = listTApply(dictMonad);
  return {bind: v => f => Pipes$dCore.composeResponse(dictMonad)(v)(x => f(x)), Apply0: () => listTApply1};
};
const listTMonad = dictMonad => {
  const listTApply1 = listTApply(dictMonad);
  const listTBind1 = listTBind(dictMonad);
  return {Applicative0: () => ({pure: x => Pipes$dInternal.$$$Proxy("Respond", x, Pipes$dInternal.Pure), Apply0: () => listTApply1}), Bind1: () => listTBind1};
};
const listTMonadAsk = dictMonadAsk => {
  const Monad0 = dictMonadAsk.Monad0();
  const listTMonad1 = listTMonad(Monad0);
  return {ask: listTMonadTrans.lift(Monad0)(dictMonadAsk.ask), Monad0: () => listTMonad1};
};
const listTMonadReader = dictMonadReader => {
  const listTMonadAsk1 = listTMonadAsk(dictMonadReader.MonadAsk0());
  return {local: f => v => Pipes$dInternal.proxyMonadReader(dictMonadReader).local(f)(v), MonadAsk0: () => listTMonadAsk1};
};
const listTMonadEffect = dictMonadEffect => {
  const Monad0 = dictMonadEffect.Monad0();
  const listTMonad1 = listTMonad(Monad0);
  return {liftEffect: x => listTMonadTrans.lift(Monad0)(dictMonadEffect.liftEffect(x)), Monad0: () => listTMonad1};
};
const listTMonadState = dictMonadState => {
  const Monad0 = dictMonadState.Monad0();
  const listTMonad1 = listTMonad(Monad0);
  return {state: x => listTMonadTrans.lift(Monad0)(dictMonadState.state(x)), Monad0: () => listTMonad1};
};
const listTMonadTell = dictMonoid => dictMonadTell => {
  const Monad1 = dictMonadTell.Monad1();
  const Semigroup0 = dictMonadTell.Semigroup0();
  const listTMonad1 = listTMonad(Monad1);
  return {tell: x => listTMonadTrans.lift(Monad1)(dictMonadTell.tell(x)), Semigroup0: () => Semigroup0, Monad1: () => listTMonad1};
};
const listTMonadWriter = dictMonoid => dictMonadWriter => {
  const MonadTell1 = dictMonadWriter.MonadTell1();
  const Monad1 = MonadTell1.Monad1();
  const $0 = Monad1.Bind1();
  const $1 = Monad1.Applicative0();
  const $2 = MonadTell1.Semigroup0();
  const Monoid0 = dictMonadWriter.Monoid0();
  const mempty = Monoid0.mempty;
  const listTMonadTell1 = listTMonadTell(Monoid0)(MonadTell1);
  return {
    listen: v => {
      const go = v1 => v2 => {
        if (v1.tag === "Request") { return Pipes$dInternal.$$$Proxy("Request", v1._1, a => go(v1._2(a))(v2)); }
        if (v1.tag === "Respond") { return Pipes$dInternal.$$$Proxy("Respond", Data$dTuple.$Tuple(v1._1, v2), b$p => go(v1._2(b$p))(v2)); }
        if (v1.tag === "M") { return Pipes$dInternal.$$$Proxy("M", $0.bind(dictMonadWriter.listen(v1._1))(v3 => $1.pure(go(v3._1)($2.append(v2)(v3._2))))); }
        if (v1.tag === "Pure") { return Pipes$dInternal.$$$Proxy("Pure", v1._1); }
        $runtime.fail();
      };
      return go(v)(mempty);
    },
    pass: v => {
      const go = v1 => v2 => {
        if (v1.tag === "Request") { return Pipes$dInternal.$$$Proxy("Request", v1._1, a => go(v1._2(a))(v2)); }
        if (v1.tag === "Respond") {
          return Pipes$dInternal.$$$Proxy(
            "M",
            dictMonadWriter.pass($1.pure(Data$dTuple.$Tuple(Pipes$dInternal.$$$Proxy("Respond", v1._1._1, b$p => go(v1._2(b$p))(v1._1._2(v2))), v3 => v1._1._2(v2))))
          );
        }
        if (v1.tag === "M") { return Pipes$dInternal.$$$Proxy("M", $0.bind(dictMonadWriter.listen(v1._1))(v3 => $1.pure(go(v3._1)($2.append(v2)(v3._2))))); }
        if (v1.tag === "Pure") { return Pipes$dInternal.$$$Proxy("Pure", v1._1); }
        $runtime.fail();
      };
      return go(v)(mempty);
    },
    Monoid0: () => Monoid0,
    MonadTell1: () => listTMonadTell1
  };
};
const listTMonadThrow = dictMonadThrow => {
  const Monad0 = dictMonadThrow.Monad0();
  const listTMonad1 = listTMonad(Monad0);
  return {throwError: x => listTMonadTrans.lift(Monad0)(dictMonadThrow.throwError(x)), Monad0: () => listTMonad1};
};
const listTMonadError = dictMonadError => {
  const listTMonadThrow1 = listTMonadThrow(dictMonadError.MonadThrow0());
  return {catchError: v => f => Pipes$dInternal.proxyMonadError(dictMonadError).catchError(v)(x => f(x)), MonadThrow0: () => listTMonadThrow1};
};
const runListT = dictMonad => {
  const runEffect = Pipes$dCore.runEffect(dictMonad);
  const $0 = listTApply(dictMonad);
  return l => runEffect($0.apply($0.Functor0().map(v => Control$dApply.identity)(l))(Pipes$dInternal.$$$Proxy("Pure", undefined)));
};
const runListTRec = dictMonadRec => {
  const runEffectRec = Pipes$dCore.runEffectRec(dictMonadRec);
  const $0 = listTApply(dictMonadRec.Monad0());
  return l => runEffectRec($0.apply($0.Functor0().map(v => Control$dApply.identity)(l))(Pipes$dInternal.$$$Proxy("Pure", undefined)));
};
export {
  Select,
  enumerate,
  errorTEnumerable,
  every,
  identity,
  listTAlt,
  listTAlternative,
  listTApplicative,
  listTApply,
  listTBind,
  listTEnumerable,
  listTFunctor,
  listTMonad,
  listTMonadAsk,
  listTMonadEffect,
  listTMonadError,
  listTMonadReader,
  listTMonadState,
  listTMonadTell,
  listTMonadThrow,
  listTMonadTrans,
  listTMonadWriter,
  listTMonoid,
  listTPlus,
  listTSemigroup,
  maybeTEnumerable,
  runListT,
  runListTRec,
  toListT
};
