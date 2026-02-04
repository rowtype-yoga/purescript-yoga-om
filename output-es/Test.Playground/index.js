import * as Data$dMaybe from "../Data.Maybe/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
const programLayer = /* #__PURE__ */ (() => Yoga$dOm.applicativeOm.pure({}))();
const loggerLayer = /* #__PURE__ */ (() => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.applicativeOm.pure({logger: {log: msg => () => {}}})))();
const databaseLayer = /* #__PURE__ */ (() => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.applicativeOm.pure({database: {query: q => () => []}})))();
const cacheLayer = /* #__PURE__ */ (() => Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => Yoga$dOm.applicativeOm.pure({cache: {get: key => () => Data$dMaybe.Nothing}})))();
const aProgram = dictRowToList => dictVariantMatchCases => dictUnion => Yoga$dOm.launchOm_(dictRowToList)(dictVariantMatchCases)(dictUnion)(programLayer);
export {aProgram, cacheLayer, databaseLayer, loggerLayer, programLayer};
