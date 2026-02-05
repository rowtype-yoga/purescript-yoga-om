module Test.Main.Core where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_)
import Yoga.Om.Test as OmTest
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (runSpec)

main :: Effect Unit
main = launchAff_ $ runSpec [ consoleReporter ] OmTest.spec
