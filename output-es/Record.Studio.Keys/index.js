import * as $runtime from "../runtime.js";
import * as Data$dList$dTypes from "../Data.List.Types/index.js";
import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Data$dUnfoldable from "../Data.Unfoldable/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
const toUnfoldable = /* #__PURE__ */ (() => Data$dUnfoldable.unfoldableArray.unfoldr(xs => {
  if (xs.tag === "Nil") { return Data$dMaybe.Nothing; }
  if (xs.tag === "Cons") { return Data$dMaybe.$Maybe("Just", Data$dTuple.$Tuple(xs._1, xs._2)); }
  $runtime.fail();
}))();
const keysRLNil = {keysImpl: v => Data$dList$dTypes.Nil};
const keysImpl = dict => dict.keysImpl;
const keys1 = () => dictKeysRL => ({keys: v => toUnfoldable(dictKeysRL.keysImpl(Type$dProxy.Proxy))});
const keysRLCons = dictIsSymbol => dictKeysRL => (
  {keysImpl: v => Data$dList$dTypes.$List("Cons", dictIsSymbol.reflectSymbol(Type$dProxy.Proxy), dictKeysRL.keysImpl(Type$dProxy.Proxy))}
);
const keys = dict => dict.keys;
const recordKeys = dictKeys => v => dictKeys.keys(Type$dProxy.Proxy);
export {keys, keys1, keysImpl, keysRLCons, keysRLNil, recordKeys, toUnfoldable};
