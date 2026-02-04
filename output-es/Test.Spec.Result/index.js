import * as $runtime from "../runtime.js";
import * as Data$dShow from "../Data.Show/index.js";
import * as Effect$dException from "../Effect.Exception/index.js";
import * as Test$dSpec$dSpeed from "../Test.Spec.Speed/index.js";
const $Result = (tag, _1, _2) => ({tag, _1, _2});
const Success = value0 => value1 => $Result("Success", value0, value1);
const Failure = value0 => $Result("Failure", value0);
const showResult = {
  show: v => {
    if (v.tag === "Success") { return "Success (" + Test$dSpec$dSpeed.showSpeed.show(v._1) + " (Milliseconds " + Data$dShow.showNumberImpl(v._2) + "))"; }
    if (v.tag === "Failure") { return "Failure (Error " + Effect$dException.message(v._1) + ")"; }
    $runtime.fail();
  }
};
const eqResult = {
  eq: v => v1 => {
    if (v.tag === "Success") {
      return v1.tag === "Success" && (() => {
        if (v._1 === "Fast") {
          if (v1._1 === "Fast") { return true; }
          if (v1._1 === "Medium") { return false; }
          if (v1._1 === "Slow") { return false; }
          $runtime.fail();
        }
        if (v._1 === "Medium") {
          if (v1._1 === "Fast") { return false; }
          if (v1._1 === "Medium") { return true; }
          if (v1._1 === "Slow") { return false; }
          $runtime.fail();
        }
        if (v._1 === "Slow") {
          if (v1._1 === "Fast") { return false; }
          if (v1._1 === "Medium") { return false; }
          if (v1._1 === "Slow") { return true; }
          $runtime.fail();
        }
        if (v1._1 === "Fast") { $runtime.fail(); }
        if (v1._1 === "Medium") { $runtime.fail(); }
        $runtime.fail();
      })() && v._2 === v1._2;
    }
    return v.tag === "Failure" && v1.tag === "Failure" && (() => {
      const $0 = Effect$dException.stack(v._1);
      return Effect$dException.message(v._1) === Effect$dException.message(v1._1) && (() => {
        const $1 = Effect$dException.stack(v1._1);
        if ($0.tag === "Nothing") { return $1.tag === "Nothing"; }
        return $0.tag === "Just" && $1.tag === "Just" && $0._1 === $1._1;
      })();
    })();
  }
};
export {$Result, Failure, Success, eqResult, showResult};
