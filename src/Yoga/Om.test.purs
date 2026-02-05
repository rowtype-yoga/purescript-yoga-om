module Yoga.Om.Test where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Class (liftEffect)
import Effect.Exception as JS
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Yoga.Om (Om, runOm)
import Yoga.Om as Om

spec :: Spec Unit
spec = do
  describe "Yoga.Om (Core)" do
    
    describe "Basics" do
      
      it "Runs safely" do
        let ctx = {}
        let errorHandlers = { exception: \_ -> pure false }
        let om = pure true
        result <- om # runOm ctx errorHandlers
        result `shouldEqual` true
      
      it "Catches exceptions as `exception`" do
        let ctx = {}
        let errorHandlers = { exception: \_ -> pure "exception" }
        let om = Om.fromAff $ liftEffect $ JS.throw "Some random exception"
        result <- om # runOm ctx errorHandlers
        result `shouldEqual` "exception"
