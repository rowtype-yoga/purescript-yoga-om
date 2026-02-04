import * as Data$dMaybe from "../Data.Maybe/index.js";
const TreeFilter = x => x;
const defaultConfig = {slow: 75.0, timeout: /* #__PURE__ */ Data$dMaybe.$Maybe("Just", 2000.0), exit: true, failFast: false, filterTree: x => x};
export {TreeFilter, defaultConfig};
