module Test.Main.Rom where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_)
import Yoga.Om.Rom.Test as RomTest
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (runSpec)

main :: Effect Unit
main = launchAff_ $ runSpec [ consoleReporter ] RomTest.spec
