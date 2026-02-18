module Test.Main where

import Prelude

import Control.Monad.Error.Class as MonadThrow
import Control.Monad.Reader.Class (asks)
import Data.Array (intercalate)
import Data.Either (Either(..))
import Data.Maybe (Maybe(..))
import Data.Monoid (power)
import Data.Time.Duration (Milliseconds(..), Seconds(..))
import Data.Variant (match)
import Effect (Effect)
import Effect.Aff (Aff, launchAff_)
import Effect.Aff as Aff
import Effect.Aff.Class (liftAff)
import Effect.Aff.Retry (RetryStatus(..), limitRetries, constantDelay)
import Effect.Class (liftEffect)
import Effect.Class.Console as Console
import Effect.Exception as Exn
import Effect.Ref as Ref
import Test.Spec (describe, it)
import Test.Spec.Assertions (shouldEqual)
import Test.Spec.Reporter (consoleReporter)
import Test.Spec.Runner (runSpec)
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Retry (recovering, repeating)

main :: Effect Unit
main = launchAff_ $ runSpec [ consoleReporter ] do

  describe "Yoga.Om - basics" do

    it "pure values pass through" do
      result <- pure true
        # Om.runOm {} { exception: \_ -> pure false }
        # liftAff
      result `shouldEqual` true

    it "launches safely" do
      let launch = Console.log "Hello from Om" # Om.launchOm_ {} { exception: \_ -> pure unit }
      liftEffect launch

    it "reads context with ask" do
      result <- do
          ctx <- Om.ask
          pure ctx.name
        # Om.runOm { name: "Alice" } { exception: \_ -> pure "" }
        # liftAff
      result `shouldEqual` "Alice"

    it "lifts Aff with fromAff" do
      ref <- Ref.new 0 # liftEffect
      result <- Om.fromAff (Ref.modify (_ + 1) ref # liftEffect)
        # Om.runOm {} { exception: \_ -> pure 0 }
        # liftAff
      result `shouldEqual` 1

  describe "Yoga.Om - exception safety" do

    it "fatal throws a string into the exception channel" do
      result <- do
          _ <- Om.fatal "something went wrong"
          pure "unreachable"
        # Om.runOm {} { exception: \e -> pure (Exn.message e) }
        # liftAff
      result `shouldEqual` "something went wrong"

    it "catches Aff exceptions" do
      result <- do
          _ <- Om.fromAff (Aff.throwError (Exn.error "boom"))
          pure "ok"
        # Om.runOm {} { exception: \_ -> pure "caught" }
        # liftAff
      result `shouldEqual` "caught"

    it "catches Effect exceptions" do
      result <- do
          liftEffect throwingEffect $> "never reached"
        # Om.runOm {} { exception: \_ -> pure "caught" }
        # liftAff
      result `shouldEqual` "caught"

  describe "Yoga.Om - context composition" do

    it "combines Oms with different contexts" do
      let askText = Om.ask <#> _.text
      let askHowOften = Om.asks _.howOften
      result <- do
          text <- askText
          times <- askHowOften
          pure (power text times)
        # Om.runOm { text: "!", howOften: 3 } { exception: \_ -> pure "" }
        # liftAff
      result `shouldEqual` "!!!"

    it "expandCtx widens a closed context" do
      let appM1 = (asks _.x) :: Om { x :: String } () String
      let appM2 = (asks _.y) :: Om { y :: String } () String
      result <- do
          r1 <- Om.expandCtx appM1
          r2 <- Om.expandCtx appM2
          pure (r1 <> " " <> r2)
        # Om.runOm { x: "good", y: "food" } { exception: \_ -> pure "" }
        # liftAff
      result `shouldEqual` "good food"

    it "expand widens both context and errors" do
      let appM1 = (asks _.x) :: Om { x :: String } (bad :: String) String
      let appM2 = (asks _.y) :: Om { y :: String } (realBad :: String) String
      result <- do
          r1 <- Om.expand appM1
          r2 <- Om.expand appM2
          pure (r1 <> " " <> r2)
        # Om.runOm { x: "good", y: "food" } { exception: \_ -> pure "", bad: pure, realBad: pure }
        # liftAff
      result `shouldEqual` "good food"

  describe "Yoga.Om - errors" do

    it "throw delivers error to handler" do
      result <- Om.throw { notFound: "missing" }
        # Om.runOm {} { exception: \_ -> pure "", notFound: \msg -> pure msg }
        # liftAff
      result `shouldEqual` "missing"

    it "throw with error helper" do
      result <- (MonadThrow.throwError $ Om.error { badError: "bad" })
        # runExampleOm
        # liftAff
      result `shouldEqual` "bad"

    it "expandErr widens closed error rows" do
      let appM1 = pure "good" :: Om {} (goodError :: Int) String
      let appM2 = Om.throw { badError: "bad" } :: Om {} (badError :: String) String
      result <- do
          _ <- Om.expandErr appM1
          Om.expandErr appM2
        # Om.runOm {} { exception: \_ -> pure "", goodError: pure <<< show, badError: pure }
        # liftAff
      result `shouldEqual` "bad"

    it "handleErrors catches and recovers" do
      result <- Om.handleErrors { notFound: \_ -> pure "recovered" } do
          Om.throw { notFound: "oops" }
        # Om.runOm {} { exception: \_ -> pure "" }
        # liftAff
      result `shouldEqual` "recovered"

    it "handleErrors eliminates handled error from row" do
      let
        getFromCache = do
          _ <- Om.throw { cacheError: "not found" }
          _ <- Om.throw { benignError: "harmless" }
          Om.throw { badError: "bad" }
      let
        appM :: Om {} (badError :: String) String
        appM = do
          _ <- getFromCache # Om.handleErrors
            { cacheError: \_ -> pure "cached"
            , benignError: \_ -> pure "ok"
            }
          pure "done"
      result <- appM # runExampleOm # liftAff
      result `shouldEqual` "done"

    it "handleErrors can transform errors" do
      let
        getFromCache = do
          _ <- Om.throw { cacheError: "not found" }
          Om.throw { fatal: "horrible" }
      let
        appM :: Om {} (badError :: String) String
        appM = do
          _ <- getFromCache # Om.handleErrors
            { cacheError: \_ -> Om.throw { badError: "bad" }
            , fatal: \_ -> pure "fine"
            }
          pure "done"
      result <- appM # runExampleOm # liftAff
      result `shouldEqual` "bad"

    it "mapError transforms error type" do
      result <- Om.mapError @"notFound" @"apiError" (\msg -> "mapped: " <> msg)
          (Om.throw { notFound: "gone" })
        # Om.runOm {} { exception: \_ -> pure "", apiError: \msg -> pure msg }
        # liftAff
      result `shouldEqual` "mapped: gone"

    it "onError runs side effect then re-throws" do
      ref <- Ref.new "" # liftEffect
      result <- Om.onError @"notFound"
          (\msg -> do
            Ref.write ("saw: " <> msg) ref # liftEffect
            Om.throw { notFound: msg }
          )
          (Om.throw { notFound: "404" })
        # Om.runOm {} { exception: \_ -> pure "", notFound: \msg -> pure msg }
        # liftAff
      result `shouldEqual` "404"
      logged <- Ref.read ref # liftEffect
      logged `shouldEqual` "saw: 404"

    it "combines Oms with different errors" do
      let readFromDisk = Om.throw { ioError: { reason: "Disk Exploded", code: -3 } }
      let readFromDB = Om.throw { dbError: "DB Dead" }
      result <- do
          _ <- readFromDisk
          _ <- readFromDB
          pure "unreachable"
        # Om.runOm {}
            { exception: \_ -> pure ""
            , dbError: pure
            , ioError: \err -> pure (err.reason <> " " <> show err.code)
            }
        # liftAff
      result `shouldEqual` "Disk Exploded -3"

  describe "Yoga.Om - helpers" do

    it "note converts Just to pure" do
      result <- Om.note { missing: unit } (Just 42)
        # Om.runOm {} { exception: \_ -> pure 0, missing: \(_ :: Unit) -> pure 0 }
        # liftAff
      result `shouldEqual` 42

    it "note converts Nothing to throw" do
      result <- Om.note { missing: unit } (Nothing :: Maybe Int)
        # Om.runOm {} { exception: \_ -> pure 0, missing: \(_ :: Unit) -> pure 99 }
        # liftAff
      result `shouldEqual` 99

    it "throwLeftAs converts Left to error" do
      result <- Left "bad" # Om.throwLeftAs (\badError -> Om.error { badError })
        # runExampleOm
        # liftAff
      result `shouldEqual` "bad"

    it "noteM throws when Nothing with monadic error" do
      result <- (Nothing # Om.noteM do
          _ <- Om.throw { badError: "bad" }
          pure $ Om.error { badError: "unreachable" })
        # runExampleOm
        # liftAff
      result `shouldEqual` "bad"

    it "throwLeftAsM converts Left with monadic transform" do
      result <- (Left "bad" # Om.throwLeftAsM \badError -> do
          _ <- Om.throw { badError }
          pure $ Om.error { badError: "unreachable" })
        # runExampleOm
        # liftAff
      result `shouldEqual` "bad"

    it "tap runs side effect and returns value" do
      ref <- Ref.new "" # liftEffect
      result <- Om.tap (\s -> Ref.write s ref # liftEffect) "hello"
        # Om.runOm {} { exception: \_ -> pure "" }
        # liftAff
      result `shouldEqual` "hello"
      written <- Ref.read ref # liftEffect
      written `shouldEqual` "hello"

    it "tapM runs side effect on monadic result" do
      ref <- Ref.new 0 # liftEffect
      result <- Om.tapM (\n -> Ref.write n ref # liftEffect) (pure 42)
        # Om.runOm {} { exception: \_ -> pure 0 }
        # liftAff
      result `shouldEqual` 42
      written <- Ref.read ref # liftEffect
      written `shouldEqual` 42

  describe "Yoga.Om - parallel" do

    it "race returns fastest result" do
      result <- Om.race
          [ Om.delay (1.0 # Seconds) *> pure "slow"
          , pure "fast"
          ]
        # runExampleOm
        # liftAff
      result `shouldEqual` "fast"

    it "race prefers success over fast failure" do
      result <- Om.race
          [ Om.throw { badError: "fast but broken" }
          , Om.delay (8.0 # Milliseconds) *> pure "slow but works"
          ]
        # runExampleOm
        # liftAff
      result `shouldEqual` "slow but works"

    it "inParallel collects all results" do
      result <- do
          strings <- Om.inParallel
            [ Om.delay (9.0 # Milliseconds) *> pure "1"
            , Om.delay (1.0 # Milliseconds) *> pure "2"
            ]
          pure $ intercalate "|" strings
        # runExampleOm
        # liftAff
      result `shouldEqual` "1|2"

    it "inParallel fails fast" do
      result <- do
          strings <- Om.inParallel
            [ Om.throw { badError: "fast but broken" }
            , Om.delay (8.0 # Milliseconds) *> pure "slow but works"
            ]
          pure $ intercalate "|" strings
        # runExampleOm
        # liftAff
      result `shouldEqual` "fast but broken"

  describe "Yoga.Om - runOmRecord" do

    it "sequences a record of Oms and runs to Aff" do
      result <- Om.runOmRecord { greeting: "hi" }
        { exception: \_ -> pure { a: "", b: 0 } }
        { a: (Om.ask :: Om.Om { greeting :: String } () { greeting :: String }) <#> _.greeting
        , b: pure 42 :: Om.Om {} () Int
        }
        # liftAff
      result.a `shouldEqual` "hi"
      result.b `shouldEqual` 42

  describe "Yoga.Om - sequenceOmRecord" do

    it "sequences a record of Oms into one Om" do
      result <- Om.sequenceOmRecord
          { a: (Om.ask :: Om.Om { x :: Int } () { x :: Int }) <#> _.x
          , b: (Om.ask :: Om.Om { y :: String } () { y :: String }) <#> _.y
          }
        # Om.runOm { x: 1, y: "two" } { exception: \_ -> pure { a: 0, b: "" } }
        # liftAff
      result.a `shouldEqual` 1
      result.b `shouldEqual` "two"

  describe "Yoga.Om - runOms" do

    it "maps a record of Oms to a record of Affs" do
      let
        affs = Om.runOms { greeting: "hello" }
          { exception: \_ -> pure unit }
          { name: (Om.ask :: Om.Om { greeting :: String } () { greeting :: String }) <#> _.greeting
          , number: pure 42 :: Om.Om {} () Int
          }
      name <- affs.name # liftAff
      number <- affs.number # liftAff
      name `shouldEqual` "hello"
      number `shouldEqual` 42

    it "runs each Aff independently" do
      ref <- Ref.new 0 # liftEffect
      let
        affs = Om.runOms {}
          { exception: \_ -> pure unit }
          { inc: Ref.modify (_ + 1) ref # liftEffect :: Om.Om {} () Int
          }
      _ <- affs.inc # liftAff
      _ <- affs.inc # liftAff
      _ <- affs.inc # liftAff
      result <- Ref.read ref # liftEffect
      result `shouldEqual` 3

    it "expands different context rows to a shared context" do
      let
        affs = Om.runOms { foo: 1, bar: "hi" }
          { exception: \_ -> pure unit }
          { fromFoo: (Om.ask :: Om.Om { foo :: Int } () { foo :: Int }) <#> _.foo
          , fromBar: (Om.ask :: Om.Om { bar :: String } () { bar :: String }) <#> _.bar
          }
      foo <- affs.fromFoo # liftAff
      bar <- affs.fromBar # liftAff
      foo `shouldEqual` 1
      bar `shouldEqual` "hi"

  describe "Yoga.Om - runOmsInOm" do

    it "runs Oms using context from ask" do
      affs <- Om.runOmsInOm
          { exception: \_ -> pure unit }
          { name: (Om.ask :: Om.Om { greeting :: String } () { greeting :: String }) <#> _.greeting
          , number: pure 42 :: Om.Om {} () Int
          }
        # Om.runOm { greeting: "world" }
            { exception: \_ -> pure { name: pure "", number: pure 0 } }
        # liftAff
      name <- affs.name # liftAff
      number <- affs.number # liftAff
      name `shouldEqual` "world"
      number `shouldEqual` 42

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

    it "preserves the error when retries are exhausted" do
      result <-
        recovering (constantDelay (Milliseconds 0.0) <> limitRetries 2)
          (\_ -> { networkError: \(_ :: String) -> pure true })
          (\_ -> Om.throw { networkError: "server down" })
          # Om.runReader {}
          # liftAff
      case result of
        Left err -> do
          let msg = err # match
                { exception: \_ -> "exception"
                , networkError: \e -> e
                }
          msg `shouldEqual` "server down"
        Right _ -> "should have failed" `shouldEqual` "but succeeded"

    it "only retries the specified error in a multi-error layer" do
      attemptsRef <- Ref.new 0 # liftEffect
      result <-
        recovering (constantDelay (Milliseconds 0.0) <> limitRetries 5)
          (\_ -> { networkError: \(_ :: String) -> pure true })
          (\_ -> do
            attempts <- Ref.modify (_ + 1) attemptsRef # liftEffect
            if attempts <= 2
              then Om.throw { networkError: "timeout" }
              else Om.throw { authError: "forbidden" }
          )
          # Om.runReader {}
          # liftAff
      case result of
        Left err -> do
          let msg = err # match
                { exception: \_ -> "exception"
                , networkError: \e -> e
                , authError: \e -> e
                }
          msg `shouldEqual` "forbidden"
        Right _ -> "should have failed" `shouldEqual` "but succeeded"
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

    it "repeats while condition holds" do
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

foreign import throwingEffect :: Effect Unit

runExampleOm :: Om {} (badError :: String) String -> Aff String
runExampleOm = Om.runOm {} { exception: \_ -> pure "exception", badError: pure }
