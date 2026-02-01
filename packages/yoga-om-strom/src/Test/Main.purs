module Test.Main.Strom where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (runSpec)
import Yoga.Om.Strom.Test as StromSpec
import Yoga.Om.Strom.Do.Test as DoNotationSpec

main :: Effect Unit
main = launchAff_ $ runSpec [consoleReporter] do
  StromSpec.spec
  DoNotationSpec.spec
