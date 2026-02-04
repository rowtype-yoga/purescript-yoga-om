import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Effect$dConsole from "../Effect.Console/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import * as Record$dUnsafe from "../Record.Unsafe/index.js";
import * as Type$dProxy from "../Type.Proxy/index.js";
import * as Unsafe$dCoerce from "../Unsafe.Coerce/index.js";
import {getParallelError, newParallelError, toParallelErrorImpl} from "./foreign.js";
const singletonVariantRecord = () => () => () => dictIsSymbol => (
  {singletonRecordToVariant: x => ({type: dictIsSymbol.reflectSymbol(Type$dProxy.Proxy), value: Record$dUnsafe.unsafeGet(dictIsSymbol.reflectSymbol(Type$dProxy.Proxy))(x)})}
);
const toParallelError = $0 => toParallelErrorImpl(Data$dMaybe.Just, Data$dMaybe.Nothing, $0);
const singletonRecordToVariant = dict => dict.singletonRecordToVariant;
const parallelErrorToError = Unsafe$dCoerce.unsafeCoerce;
const mkError = () => dictIsSymbol => p => value => ({type: dictIsSymbol.reflectSymbol(p), value});
const logUnhandledError = v => Effect$dConsole.error("Unhandled Error!" + Effect$dException.showErrorImpl(v));
const errorKey = Type$dProxy.Proxy;
const exception = Type$dProxy.Proxy;
export {errorKey, exception, logUnhandledError, mkError, parallelErrorToError, singletonRecordToVariant, singletonVariantRecord, toParallelError};
export * from "./foreign.js";
