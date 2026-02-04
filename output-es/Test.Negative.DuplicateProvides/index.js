import * as Data$dList$dTypes from "../Data.List.Types/index.js";
import * as Record$dStudio$dKeys from "../Record.Studio.Keys/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
import * as Yoga$dOm$dLayer from "../Yoga.Om.Layer/index.js";
const keys1 = {keys: v => Record$dStudio$dKeys.toUnfoldable(Data$dList$dTypes.$List("Cons", "config", Data$dList$dTypes.Nil))};
const layer2 = /* #__PURE__ */ (() => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.applicativeOm.pure({logger: {log: msg => () => {}}})))();
const layer1 = /* #__PURE__ */ (() => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.applicativeOm.pure({logger: {log: msg => () => {}}})))();
const combined = /* #__PURE__ */ Yoga$dOm$dLayer.combineRequirements()()()()()()()()(keys1)(keys1)(layer1)(layer2);
export {combined, keys1, layer1, layer2};
