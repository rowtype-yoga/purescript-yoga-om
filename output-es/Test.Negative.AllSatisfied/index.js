import * as Yoga$dOm from "../Yoga.Om/index.js";
const needsConfig = /* #__PURE__ */ (() => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.applicativeOm.pure({logger: {log: v1 => () => {}}})))();
const testAllSatisfied = needsConfig;
export {needsConfig, testAllSatisfied};
