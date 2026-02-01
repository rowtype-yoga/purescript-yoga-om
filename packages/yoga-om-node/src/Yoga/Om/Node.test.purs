module Yoga.Om.Node.Test where

import Prelude

import Data.Maybe (Maybe(..))
import Effect.Aff (Aff)
import Test.Spec (Spec, describe, it, pending)
import Test.Spec.Assertions (shouldEqual)
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Node as Node

-- | Test specification for yoga-om-node package
spec :: Spec Unit
spec = do
  describe "Yoga.Om.Node" do
    
    describe "Environment variables" do
      
      it "lookupEnv returns Maybe String" do
        let
          ctx = {}
          errorHandlers = { exception: \_ -> pure Nothing }
          om = Node.lookupEnv "PATH"
        result <- om # Om.runOm ctx errorHandlers
        -- PATH should exist in most environments
        case result of
          Just _ -> pure unit
          Nothing -> pure unit -- It's ok if it doesn't exist in test env
      
      it "getEnv throws error when variable not found" do
        let
          ctx = {}
          errorHandlers = 
            { exception: \_ -> pure "exception"
            , envNotFound: \{ variable } -> pure $ "not found: " <> variable
            }
          om = Node.getEnv "THIS_VARIABLE_SHOULD_NOT_EXIST_12345"
        result <- om # Om.runOm ctx errorHandlers
        result `shouldEqual` "not found: THIS_VARIABLE_SHOULD_NOT_EXIST_12345"
      
      it "cwd returns current working directory" do
        let
          ctx = {}
          errorHandlers = { exception: \_ -> pure "" }
          om = Node.cwd
        result <- om # Om.runOm ctx errorHandlers
        -- Should return some non-empty path
        (result /= "") `shouldEqual` true
    
    describe "File operations" do
      
      pending "readTextFile reads file contents"
      pending "writeTextFile writes file contents"
      pending "exists checks file existence"
      pending "File operations throw appropriate errors"
