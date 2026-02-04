import * as Type$dProxy from "../Type.Proxy/index.js";
import {shrinkImpl} from "./foreign.js";
const shrink = () => dictKeys => shrinkImpl(dictKeys.keys(Type$dProxy.Proxy));
export {shrink};
export * from "./foreign.js";
