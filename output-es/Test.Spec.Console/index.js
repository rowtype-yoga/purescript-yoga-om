import * as Control$dMonad$dWriter$dTrans from "../Control.Monad.Writer.Trans/index.js";
import * as Data$dFoldable from "../Data.Foldable/index.js";
import {write} from "./foreign.js";
const tellLns = dictMonadWriter => {
  const MonadTell1 = dictMonadWriter.MonadTell1();
  const for_ = Data$dFoldable.for_(MonadTell1.Monad1().Applicative0())(Data$dFoldable.foldableArray);
  return l => for_(l)(x => MonadTell1.tell(x + "\n"));
};
const tellLn = dictMonadWriter => l => dictMonadWriter.MonadTell1().tell(l + "\n");
const logWriter = dictMonadEffect => {
  const Bind1 = dictMonadEffect.Monad0().Bind1();
  const $0 = Control$dMonad$dWriter$dTrans.execWriterT(Bind1.Apply0().Functor0());
  return a => Bind1.bind($0(a))(x => dictMonadEffect.liftEffect(write(x)));
};
export {logWriter, tellLn, tellLns};
export * from "./foreign.js";
