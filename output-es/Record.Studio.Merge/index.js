import * as Record$dUnsafe$dUnion from "../Record.Unsafe.Union/index.js";
const mergeFlipped = () => () => b => a => Record$dUnsafe$dUnion.unsafeUnionFn(a, b);
export {mergeFlipped};
