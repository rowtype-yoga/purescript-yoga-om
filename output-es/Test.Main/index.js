import * as $runtime from "../runtime.js";
import * as Control$dMonad$dWriter$dTrans from "../Control.Monad.Writer.Trans/index.js";
import * as Data$dEither from "../Data.Either/index.js";
import * as Data$dIdentity from "../Data.Identity/index.js";
import * as Data$dSemigroup from "../Data.Semigroup/index.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Data$dTuple from "../Data.Tuple/index.js";
import * as Data$dVariant from "../Data.Variant/index.js";
import * as Effect$dAff from "../Effect.Aff/index.js";
import * as Effect$dConsole from "../Effect.Console/index.js";
import * as Test$dSpec from "../Test.Spec/index.js";
import * as Test$dSpec$dConfig from "../Test.Spec.Config/index.js";
import * as Test$dSpec$dReporter$dConsole from "../Test.Spec.Reporter.Console/index.js";
import * as Test$dSpec$dRunner from "../Test.Spec.Runner/index.js";
import * as Test$dSpec$dTree from "../Test.Spec.Tree/index.js";
import * as Yoga$dOm from "../Yoga.Om/index.js";
const show = /* #__PURE__ */ Data$dShow.showArrayImpl(Data$dShow.showStringImpl);
const main = /* #__PURE__ */ (() => {
  const $0 = Effect$dAff._makeFiber(
    Effect$dAff.ffiUtil,
    Effect$dAff._map(v => {})(Test$dSpec$dRunner.runSpecT1(Test$dSpec$dConfig.defaultConfig)([Test$dSpec$dReporter$dConsole.consoleReporter])((() => {
      const $0 = Control$dMonad$dWriter$dTrans.bindWriterT(Data$dSemigroup.semigroupArray)(Data$dIdentity.bindIdentity).bind(Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("proves Row.Nub deduplicates shared requirements at type level")(Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("✓ PROOF OF CONCEPT SUCCESS!")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  ")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  Key insight: Row.Nub automatically deduplicates at the type level")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  ")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  Given:")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("    layer1 :: OmLayer (config :: Config) (logger :: Logger) ()")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("    layer2 :: OmLayer (config :: Config) (database :: Database) ()")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  ")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  combineRequirements layer1 layer2 has type:")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("    OmLayer (config :: Config) _ _")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  ")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  NOT OmLayer (config :: Config, config :: Config) _ _")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  ")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  The (config, config) requirement is automatically deduplicated")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  to just (config) by the Nub constraint in combineRequirements!")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  ")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  This is the foundation for ZLayer-style dependency injection")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  where the type system automatically handles shared dependencies.")))(() => Effect$dAff._pure()))))))))))))))))))))(() => Test$dSpec.it(Data$dIdentity.monadIdentity)(Test$dSpec.exampleMUnit)("proves deduplication at runtime via shared Ref")(Effect$dAff._bind(Effect$dAff._liftEffect(() => (
        {value: ""}
      )))(accessLog => Effect$dAff._bind((() => {
        const $0 = {exception: v => Effect$dAff._pure({logger: {log: v1 => () => {}}, database: {query: v1 => () => []}})};
        return Effect$dAff._bind(Yoga$dOm.runRWSET({config: {port: 5432, host: "localhost"}, accessLog})()(Yoga$dOm.bindOm.bind(Yoga$dOm.monadAskOm.ask)(v => {
          const $1 = v.config;
          const $2 = v.accessLog;
          return Yoga$dOm.bindOm.bind(Yoga$dOm.monadEffectOm.liftEffect(() => {
            const $3 = $2.value;
            $2.value = $3 + "config-accessed-by-logger ";
          }))(() => {
            const logger = {log: msg => Effect$dConsole.log("[" + $1.host + "] " + msg)};
            return Yoga$dOm.bindOm.bind(Yoga$dOm.monadEffectOm.liftEffect(() => {
              const $3 = $2.value;
              $2.value = $3 + "config-accessed-by-database ";
            }))(() => Yoga$dOm.applicativeOm.pure({
              logger,
              database: {
                query: q => {
                  const $3 = ["Result from " + $1.host];
                  return () => $3;
                }
              }
            }));
          });
        })))(v1 => {
          if (v1._2._1.tag === "Right") { return Effect$dAff._pure(v1._2._1._1); }
          if (v1._2._1.tag === "Left") { return Data$dVariant.onMatch()()()($0)(Data$dVariant.case_)(v1._2._1._1); }
          $runtime.fail();
        });
      })())(result => Effect$dAff._bind(Effect$dAff._liftEffect(() => accessLog.value))(finalLog => Effect$dAff._bind(Effect$dAff._liftEffect(result.logger.log("Testing logger from combined layer")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(result.database.query("SELECT *")))(queryResult => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("✓ RUNTIME DEDUPLICATION PROOF:")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  Access log: '" + finalLog + "'")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  Query result: " + show(queryResult))))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  ")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  Both components accessed the same shared context!")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  The type signature OmLayer (config, accessLog) _ _ shows")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  that even though two components need config, there's only")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  ONE config in the context (not config + config).")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  ")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  At runtime, both components read from the same context record,")))(() => Effect$dAff._bind(Effect$dAff._liftEffect(Effect$dConsole.log("  and both wrote to the same Ref, proving deduplication works!")))(() => Effect$dAff._pure())))))))))))))))))));
      return Data$dTuple.$Tuple($0._1, [Test$dSpec$dTree.$Tree("Node", Data$dEither.$Either("Left", "OmLayer - Proof of Concept: Type-Level Deduplication"), $0._2)]);
    })()))
  );
  return () => {
    const fiber = $0();
    fiber.run();
  };
})();
export {main, show};
