import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Test$dSpec$dConfig from "../Test.Spec.Config/index.js";
import * as Test$dSpec$dReporter$dConsole from "../Test.Spec.Reporter.Console/index.js";
import * as Test$dSpec$dRunner from "../Test.Spec.Runner/index.js";
import * as Yoga$dOm$dRom$dTest from "../Yoga.Om.Rom.Test/index.js";
const main = /* #__PURE__ */ (() => {
  const $0 = Effect$dAff._makeFiber(
    Effect$dAff.ffiUtil,
    Effect$dAff._map(v => {})(Test$dSpec$dRunner.runSpecT1(Test$dSpec$dConfig.defaultConfig)([Test$dSpec$dReporter$dConsole.consoleReporter])(Yoga$dOm$dRom$dTest.spec))
  );
  return () => {
    const fiber = $0();
    fiber.run();
  };
})();
export {main};
