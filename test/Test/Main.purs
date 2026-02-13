module Test.Main where

import Prelude

import Effect (Effect)
import Effect.Aff (launchAff_)
import Effect.Aff.Class (liftAff)
import Effect.Class (liftEffect)
import Effect.Ref as Ref
import Effect.Aff.Retry (RetryStatus(..), limitRetries, constantDelay)
import Data.Time.Duration (Milliseconds(..))
import Test.Spec (describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (runSpec)
import Yoga.Om as Om
import Yoga.Om.Retry (recovering, repeating)

main :: Effect Unit
main = launchAff_ $ runSpec [ consoleReporter ] do
  describe "Yoga.Om.Retry - recovering" do

    it "retries on matching errors up to the limit" do
      attemptsRef <- Ref.new 0 # liftEffect
      recovering (constantDelay (Milliseconds 0.0) <> limitRetries 3)
        (\_ -> { networkError: \(_ :: String) -> pure true })
        (\_ -> do
          attempts <- Ref.modify (_ + 1) attemptsRef # liftEffect
          Om.throw { networkError: "fail " <> show attempts }
        )
        # Om.runOm {}
            { exception: \_ -> pure unit
            , networkError: \_ -> pure unit
            }
        # liftAff
      attempts <- Ref.read attemptsRef # liftEffect
      attempts `shouldEqual` 4

    it "does not retry on non-matching errors" do
      attemptsRef <- Ref.new 0 # liftEffect
      recovering (constantDelay (Milliseconds 0.0) <> limitRetries 3)
        (\_ -> { networkError: \(_ :: String) -> pure true })
        (\_ -> do
          Ref.modify_ (_ + 1) attemptsRef # liftEffect
          Om.throw { authError: "unauthorized" }
        )
        # Om.runOm {}
            { exception: \_ -> pure unit
            , networkError: \_ -> pure unit
            , authError: \_ -> pure unit
            }
        # liftAff
      attempts <- Ref.read attemptsRef # liftEffect
      attempts `shouldEqual` 1

    it "succeeds after transient failures" do
      attemptsRef <- Ref.new 0 # liftEffect
      result <-
        recovering (constantDelay (Milliseconds 0.0) <> limitRetries 5)
          (\_ -> { networkError: \(_ :: String) -> pure true })
          (\_ -> do
            attempts <- Ref.modify (_ + 1) attemptsRef # liftEffect
            when (attempts < 3) do
              Om.throw { networkError: "transient" }
            pure "success"
          )
          # Om.runOm {}
              { exception: \_ -> pure "failed"
              , networkError: \_ -> pure "failed"
              }
          # liftAff
      result `shouldEqual` "success"
      attempts <- Ref.read attemptsRef # liftEffect
      attempts `shouldEqual` 3

    it "uses RetryStatus to decide whether to retry" do
      statusesRef <- Ref.new [] # liftEffect
      recovering (constantDelay (Milliseconds 0.0) <> limitRetries 3)
        (\(RetryStatus s) ->
          { networkError: \(_ :: Unit) -> do
              Ref.modify_ (_ <> [s.iterNumber]) statusesRef # liftEffect
              pure true
          })
        (\_ -> Om.throw { networkError: unit })
        # Om.runOm {}
            { exception: \_ -> pure unit
            , networkError: \_ -> pure unit
            }
        # liftAff
      statuses <- Ref.read statusesRef # liftEffect
      statuses `shouldEqual` [0, 1, 2, 3]

    it "stops retrying when check returns false" do
      attemptsRef <- Ref.new 0 # liftEffect
      recovering (constantDelay (Milliseconds 0.0) <> limitRetries 10)
        (\(RetryStatus s) ->
          { networkError: \(_ :: Unit) -> pure (s.iterNumber < 2) })
        (\_ -> do
          Ref.modify_ (_ + 1) attemptsRef # liftEffect
          Om.throw { networkError: unit }
        )
        # Om.runOm {}
            { exception: \_ -> pure unit
            , networkError: \_ -> pure unit
            }
        # liftAff
      attempts <- Ref.read attemptsRef # liftEffect
      attempts `shouldEqual` 3

  describe "Yoga.Om.Retry - repeating" do

    it "repeatings while condition holds" do
      counterRef <- Ref.new 0 # liftEffect
      result <-
        repeating (constantDelay (Milliseconds 0.0) <> limitRetries 10)
          (\_ n -> pure (n < 5))
          (\_ -> Ref.modify (_ + 1) counterRef # liftEffect)
        # Om.runOm {} { exception: \_ -> pure 0 }
        # liftAff
      result `shouldEqual` 5

    it "stops when condition returns false" do
      counterRef <- Ref.new 0 # liftEffect
      result <-
        repeating (constantDelay (Milliseconds 0.0) <> limitRetries 100)
          (\_ n -> pure (n < 3))
          (\_ -> Ref.modify (_ + 1) counterRef # liftEffect)
        # Om.runOm {} { exception: \_ -> pure 0 }
        # liftAff
      result `shouldEqual` 3

    it "stops when policy exhausted" do
      counterRef <- Ref.new 0 # liftEffect
      result <-
        repeating (constantDelay (Milliseconds 0.0) <> limitRetries 3)
          (\_ _ -> pure true)
          (\_ -> Ref.modify (_ + 1) counterRef # liftEffect)
        # Om.runOm {} { exception: \_ -> pure 0 }
        # liftAff
      result `shouldEqual` 4

    it "returns last result" do
      result <-
        repeating (constantDelay (Milliseconds 0.0) <> limitRetries 2)
          (\_ _ -> pure true)
          (\(RetryStatus s) -> pure ("attempt-" <> show s.iterNumber))
        # Om.runOm {} { exception: \_ -> pure "" }
        # liftAff
      result `shouldEqual` "attempt-2"
