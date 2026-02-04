// | A port of Haskell's [mmorph library](http://hackage.haskell.org/package/mmorph-1.0.0/docs/Control-Monad-Morph.html)
import * as $runtime from "../runtime.js";
import * as Control$dComonad$dCofree from "../Control.Comonad.Cofree/index.js";
import * as Control$dMonad$dExcept$dTrans from "../Control.Monad.Except.Trans/index.js";
import * as Control$dMonad$dFree from "../Control.Monad.Free/index.js";
import * as Control$dMonad$dMaybe$dTrans from "../Control.Monad.Maybe.Trans/index.js";
import * as Control$dMonad$dReader$dTrans from "../Control.Monad.Reader.Trans/index.js";
import * as Data$dCoyoneda from "../Data.Coyoneda/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Data$dYoneda from "../Data.Yoneda/index.js";
const foldFree = /* #__PURE__ */ Control$dMonad$dFree.foldFree(Control$dMonad$dFree.freeMonadRec);
const identity = x => x;
const mfunctorYoneda = {hoist: dictMonad => Data$dYoneda.hoistYoneda};
const mmonadYoneda = {embed: dictMonad => f => x => f(x(Data$dYoneda.identity)), MFunctor0: () => mfunctorYoneda, MonadTrans1: () => Data$dYoneda.monadTransYoneda};
const mfunctorWriterT = {hoist: dictMonad => nat => m => nat(m)};
const mmonadWriterT = dictMonoid => {
  const mempty = dictMonoid.mempty;
  const monadTransWriterT = {lift: dictMonad => m => dictMonad.Bind1().bind(m)(a => dictMonad.Applicative0().pure(Data$dTuple.$Tuple(a, mempty)))};
  return {
    embed: dictMonad => f => m => dictMonad.Bind1().bind(f(m))(v => dictMonad.Applicative0().pure(Data$dTuple.$Tuple(v._1._1, dictMonoid.Semigroup0().append(v._1._2)(v._2)))),
    MFunctor0: () => mfunctorWriterT,
    MonadTrans1: () => monadTransWriterT
  };
};
const mfunctorTracedT = {hoist: dictMonad => nat => nat};
const mfunctorStoreT = {hoist: dictMonad => nat => v => Data$dTuple.$Tuple(nat(v._1), v._2)};
const mfunctorStateT = {hoist: dictMonad => nat => m => s => nat(m(s))};
const mfunctorReaderT = {hoist: dictMonad => nat => m => i => nat(m(i))};
const mmonadReaderT = {embed: dictMonad => f => m => i => f(m(i))(i), MFunctor0: () => mfunctorReaderT, MonadTrans1: () => Control$dMonad$dReader$dTrans.monadTransReaderT};
const mfunctorRWS = {hoist: dictMonad => nat => m => r => s => nat(m(r)(s))};
const mfunctorProduct = {hoist: dictMonad => nat => v => Data$dTuple.$Tuple(v._1, nat(v._2))};
const mfunctorMaybe = {hoist: dictMonad => nat => m => nat(m)};
const mmonadMaybeT = {
  embed: dictMonad => f => m => dictMonad.Bind1().bind(f(m))(x => dictMonad.Applicative0().pure((() => {
    if (x.tag === "Nothing") { return Data$dMaybe.Nothing; }
    if (x.tag === "Just") {
      if (x._1.tag === "Nothing") { return Data$dMaybe.Nothing; }
      if (x._1.tag === "Just") { return Data$dMaybe.$Maybe("Just", x._1._1); }
    }
    $runtime.fail();
  })())),
  MFunctor0: () => mfunctorMaybe,
  MonadTrans1: () => Control$dMonad$dMaybe$dTrans.monadTransMaybeT
};
const mfunctorFree = {hoist: dictMonad => Control$dMonad$dFree.hoistFree};
const mmonadFree = {embed: dictMonad => foldFree, MFunctor0: () => mfunctorFree, MonadTrans1: () => Control$dMonad$dFree.freeMonadTrans};
const mfunctorExceptT = {hoist: dictMonad => nat => m => nat(m)};
const mmonadExceptT = {
  embed: dictMonad => f => m => dictMonad.Bind1().bind(f(m))(x => dictMonad.Applicative0().pure((() => {
    if (x.tag === "Left") { return Data$dEither.$Either("Left", x._1); }
    if (x.tag === "Right") {
      if (x._1.tag === "Left") { return Data$dEither.$Either("Left", x._1._1); }
      if (x._1.tag === "Right") { return Data$dEither.$Either("Right", x._1._1); }
    }
    $runtime.fail();
  })())),
  MFunctor0: () => mfunctorExceptT,
  MonadTrans1: () => Control$dMonad$dExcept$dTrans.monadTransExceptT
};
const mfunctorEnvT = {hoist: dictMonad => nat => m => Data$dTuple.$Tuple(m._1, nat(m._2))};
const mfunctorCoyoneda = {hoist: dictMonad => Data$dCoyoneda.hoistCoyoneda};
const mfunctorCompose = dictFunctor => ({hoist: dictMonad => nat => v => dictFunctor.map(nat)(v)});
const mfunctorCofree = {hoist: dictMonad => Control$dComonad$dCofree.hoistCofree(dictMonad.Bind1().Apply0().Functor0())};
const hoist = dict => dict.hoist;
const generalize = dictMonad => x => dictMonad.Applicative0().pure(x);
const embed = dict => dict.embed;
const flipEmbed = dictMMonad => dictMonad => {
  const embed2 = dictMMonad.embed(dictMonad);
  return t => f => embed2(f)(t);
};
const squash = dictMonad => dictMMonad => dictMMonad.embed(dictMonad)(identity);
const composeKleisliRight = dictMMonad => dictMonad => {
  const embed2 = dictMMonad.embed(dictMonad);
  return f => g => m => embed2(g)(f(m));
};
const composeKleisliLeft = dictMMonad => dictMonad => {
  const embed2 = dictMMonad.embed(dictMonad);
  return g => f => m => embed2(g)(f(m));
};
export {
  composeKleisliLeft,
  composeKleisliRight,
  embed,
  flipEmbed,
  foldFree,
  generalize,
  hoist,
  identity,
  mfunctorCofree,
  mfunctorCompose,
  mfunctorCoyoneda,
  mfunctorEnvT,
  mfunctorExceptT,
  mfunctorFree,
  mfunctorMaybe,
  mfunctorProduct,
  mfunctorRWS,
  mfunctorReaderT,
  mfunctorStateT,
  mfunctorStoreT,
  mfunctorTracedT,
  mfunctorWriterT,
  mfunctorYoneda,
  mmonadExceptT,
  mmonadFree,
  mmonadMaybeT,
  mmonadReaderT,
  mmonadWriterT,
  mmonadYoneda,
  squash
};
