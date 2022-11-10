module Test.Main where

import Prelude

import Control.Monad.Error.Class (throwError)
import Control.Monad.Error.Class as MonadThrow
import Control.Monad.Reader.Class (asks)
import Data.Array (intercalate)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Monoid (power)
import Data.Time.Duration (Seconds(..), Milliseconds(..))
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Aff.Class (liftAff)
import Effect.Class (liftEffect)
import Effect.Class.Console as Console
import Effect.Exception as JS
import Test.Spec (Spec, describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (runSpec)
import Yoga.Om (Om, launchOm_, runOm)
import Yoga.Om as Om

main :: Effect Unit
main = launchAff_ $ runSpec [ consoleReporter ] spec

spec :: Spec Unit
spec = do
  describe "Yoga Om" do

    describe "Basics" do

      it "Runs safely" do
        let ctx = {}
        let errorHandlers = { exception: \_ -> pure false }
        let om = pure true
        result <- om # runOm ctx errorHandlers
        result `shouldEqual` true

      it "Launches safely" do
        let om = Console.log "Hello from Om"
        let launch = om # launchOm_ {} { exception: \_ -> pure unit }
        liftEffect launch

    -- 
    describe "Exception safety" do

      it "Catches exceptions as `exception`" do
        let ctx = {}
        let errorHandlers = { exception: \_ -> pure "Caught" }

        resultAff <- Om.runOm ctx errorHandlers do
          (liftAff (throwError $ JS.error "Error"))
        resultAff `shouldEqual` "Caught"

        resultEffect <- Om.runOm ctx errorHandlers do
          (liftEffect throwingEffect $> "Never reached")
        resultEffect `shouldEqual` "Caught"

    --
    describe "Context (Reader) composition" do

      it "Allows combining `Om`s with different contexts" do
        let ctx = { text: "!", howOften: 3 }
        let errorHandlers = { exception: \_ -> pure "Improbable" }
        let askText = Om.ask <#> _.text
        let askHowOften = Om.asks _.howOften

        result <- Om.runOm ctx errorHandlers do
          text <- askText
          times <- askHowOften
          pure (power text times)
        result `shouldEqual` "!!!"

    --
    describe "Helpers" do

      describe "For throwing errors" do

        it "supports `throw` with a singleton record" do
          result <- runExampleOm do
            Om.throw { badError: "bad error" }
          result `shouldEqual` "bad error"

        it "supports creating errors with `error` as a singleton record" do
          result <- runExampleOm do
            MonadThrow.throwError $ Om.error { badError: "bad error" }
          result `shouldEqual` "bad error"

        it "supports widening the errors of non-extensible Oms" do
          let om1 = pure "good" :: Om {} (goodError :: Int) String
          let om2 = Om.throw { badError: "bad error" } :: Om {} (badError :: String) String
          result <- Om.runOm {} { exception: \_ -> pure "exception", goodError: pure <<< show, badError: pure } do
            result1 <- Om.expandErr om1
            result2 <- Om.expandErr om2
            pure (result1 <> result2)
          result `shouldEqual` "bad error"

        it "supports widening the contexts of non-extensible Oms" do
          let om1 = (asks _.x) :: Om { x :: String } () String
          let om2 = (asks _.y) :: Om { y :: String } () String
          result <- Om.runOm { x: "good", y: "food" } { exception: \_ -> pure "exception" } do
            result1 <- Om.expandCtx om1
            result2 <- Om.expandCtx om2
            pure (result1 <> " " <> result2)
          result `shouldEqual` "good food"

        it "supports widening the contexts and errors and of non-extensible Oms" do
          let om1 = (asks _.x) :: Om { x :: String } (bad :: String) String
          let om2 = (asks _.y) :: Om { y :: String } (realBad :: String) String
          result <- Om.runOm { x: "good", y: "food" } { exception: \_ -> pure "exception", bad: pure, realBad: pure } do
            result1 <- Om.expand om1
            result2 <- Om.expand om2
            pure (result1 <> " " <> result2)
          result `shouldEqual` "good food"

    -- 
    describe "Error composition" do

      it "Allows combining `Om`s with different errors" do
        let
          ctx = { text: "!", int: 3 }
          readFromDisk = Om.throw { ioError: { reason: "Disk Exploded", code: -3 } }
          readFromDB = Om.throw { dbError: "DB Dead" }
          errorHandlers =
            { exception: \_ -> pure "exception"
            , dbError: pure
            , ioError: \err -> pure (err.reason <> " " <> show err.code)
            }

        result <- Om.runOm ctx errorHandlers do
          _ <- readFromDisk
          _ <- readFromDB
          pure "Good luck getting here"
        result `shouldEqual` "Disk Exploded -3"

      it "Allows handling a subset of errors" do
        let
          getFromCache = do
            -- imagine more optimistic code here
            _ <- Om.throw { cacheError: "Not found" }
            _ <- Om.throw { benignError: "Harmless" }
            -- and here
            Om.throw { badError: "bad error" }
        let
          -- This Om can only has the `badError` error
          -- Because we eliminate the `cacheError` from above
          om :: Om {} (badError :: String) String
          om = do
            _ <- getFromCache # Om.handleErrors
              { cacheError: \_ -> pure "Found in cache"
              , benignError: \_ -> pure "Found in cache"
              }
            pure "Nothing to see here"
        result <- runExampleOm om
        result `shouldEqual` "Nothing to see here"

      it "Allows transforming a subset of errors" do
        let
          getFromCache = do
            -- imagine more optimistic code here
            _ <- Om.throw { cacheError: "Not found" }
            -- and here
            Om.throw { fatal: "horrible error" }
        let
          -- This Om can only has the `badError` error
          -- Because we eliminate the `cacheError` from above
          om :: Om {} (badError :: String) String
          om = do
            _ <- getFromCache # Om.handleErrors
              { cacheError: \_ -> Om.throw { badError: "bad error" }
              , fatal: \_ -> pure "This is fine"
              }
            pure "Nothing to see here"
        result <- runExampleOm om
        result `shouldEqual` "bad error"

    -- 
    describe "Helper functions" do

      it "Allows lifting `Maybe` values" do
        result <- runExampleOm do
          Nothing # Om.note { badError: "bad error" }
        "bad error" `shouldEqual` result

      it "Allows lifting `Left` values" do
        result <- runExampleOm do
          Left "bad error" # Om.throwLeftAs (\badError -> Om.error { badError })
        result `shouldEqual` "bad error"

      it "Allows providing alternatives to `Maybe` values that can throw themselves" do
        result <- runExampleOm do
          Nothing # Om.noteM do
            _ <- Om.throw { badError: "bad error" }
            pure $ Om.error { badError: "I won't be reached" }
        result `shouldEqual` "bad error"

      it "Allows providing alternatives to `Left` values that can throw themselves" do
        result <- runExampleOm do
          Left "bad error" # Om.throwLeftAsM \badError -> do
            _ <- Om.throw { badError }
            pure $ Om.error { badError: "I won't be reached" }
        result `shouldEqual` "bad error"

    -- 
    describe "Parallel computations" do

      it "Allows racing multiple computations in parallel" do
        result <- runExampleOm do
          Om.race
            [ Om.delay (1.0 # Seconds) *> pure "slow"
            , pure "fast"
            ]
        result `shouldEqual` "fast"

      it "Prioritises successful computations in parallel" do
        result <- runExampleOm do
          Om.race
            [ Om.throw { badError: "fast but broken" }
            , Om.delay (8.0 # Milliseconds) *> pure "slow but works"
            ]
        result `shouldEqual` "slow but works"

      it "Allows computing multiple results in parallel" do
        result <- runExampleOm do
          strings <- Om.inParallel
            [ Om.delay (9.0 # Milliseconds) *> pure "1"
            , Om.delay (1.0 # Milliseconds) *> pure "2"
            ]
          pure $ intercalate "|" strings
        result `shouldEqual` "1|2"

      it "Fails fast when all results are required" do
        result <- runExampleOm do
          strings <- Om.inParallel
            [ Om.throw { badError: "fast but broken" }
            , Om.delay (8.0 # Milliseconds) *> pure "slow but works"
            ]
          pure $ intercalate "|" strings
        result `shouldEqual` "fast but broken"

foreign import throwingEffect :: Effect Unit

runExampleOm :: Om {} (badError :: String) String -> Aff String
runExampleOm =
  Om.runOm {} exampleErrorHandlers
  where
  exampleErrorHandlers =
    { exception: \_ -> pure "Improbable"
    , badError: \err -> pure err
    }
