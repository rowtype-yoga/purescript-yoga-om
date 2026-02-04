import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dString$dCodeUnits from "../Data.String.CodeUnits/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import {_endsWith, _startsWith} from "./foreign.js";
const shouldStartWith = dictMonadThrow => {
  const $0 = dictMonadThrow.Monad0().Applicative0();
  return s => prefix => {
    const $1 = dictMonadThrow.throwError(Effect$dException.error(Data$dShow.showStringImpl(s) + " does not start with " + Data$dShow.showStringImpl(prefix)));
    if (!_startsWith(prefix)(s)) { return $1; }
    return $0.pure();
  };
};
const shouldNotContain = dictMonadThrow => {
  const $0 = dictMonadThrow.Monad0().Applicative0();
  return s => subs => {
    const $1 = dictMonadThrow.throwError(Effect$dException.error(Data$dShow.showStringImpl(subs) + " ∈ " + Data$dShow.showStringImpl(s)));
    if (Data$dString$dCodeUnits.contains(subs)(s)) { return $1; }
    return $0.pure();
  };
};
const shouldEndWith = dictMonadThrow => {
  const $0 = dictMonadThrow.Monad0().Applicative0();
  return s => suffix => {
    const $1 = dictMonadThrow.throwError(Effect$dException.error(Data$dShow.showStringImpl(s) + " does not end with " + Data$dShow.showStringImpl(suffix)));
    if (!_endsWith(suffix)(s)) { return $1; }
    return $0.pure();
  };
};
const shouldContain = dictMonadThrow => {
  const $0 = dictMonadThrow.Monad0().Applicative0();
  return s => subs => {
    const $1 = dictMonadThrow.throwError(Effect$dException.error(Data$dShow.showStringImpl(subs) + " ∉ " + Data$dShow.showStringImpl(s)));
    if (!Data$dString$dCodeUnits.contains(subs)(s)) { return $1; }
    return $0.pure();
  };
};
export {shouldContain, shouldEndWith, shouldNotContain, shouldStartWith};
export * from "./foreign.js";
