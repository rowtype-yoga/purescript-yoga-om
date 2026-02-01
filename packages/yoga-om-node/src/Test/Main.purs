module Test.Main.Node where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_)
import Yoga.Om.Node.Test as NodeTest
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (runSpec)

main :: Effect Unit
main = launchAff_ $ runSpec [ consoleReporter ] NodeTest.spec
