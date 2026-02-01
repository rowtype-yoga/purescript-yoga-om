module Yoga.Om.Strom.Examples.DoVsOperators where

import Prelude

import Data.Array as Array
import Data.Int (even)
import Data.Maybe (Maybe(..))
import Data.String as String
import Data.Tuple (Tuple(..))
import Effect.Aff (Milliseconds(..))
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Strom as Strom
import Yoga.Om.Strom.Do (guard)

--------------------------------------------------------------------------------
-- Example 1: File Processing Pipeline
--------------------------------------------------------------------------------

type LogEntry = { timestamp :: String, level :: String, message :: String }
type ErrorReport = { timestamp :: String, message :: String, context :: String }

-- WITHOUT DO: Nested bind hell 😱
processLogs_operators :: Strom ctx err ErrorReport
processLogs_operators =
  readLogFiles "logs/"
    >>= (\filename ->
      parseLogFile filename
        >>= (\entry ->
          if entry.level == "ERROR"
          then enrichWithContext entry >>= (\context ->
            Strom.succeed { timestamp: entry.timestamp, message: entry.message, context }
          )
          else Strom.empty
        )
    )

-- WITH DO: Clear, linear flow ✨
processLogs_do :: Strom ctx err ErrorReport
processLogs_do = do
  filename <- readLogFiles "logs/"
  entry <- parseLogFile filename
  guard (entry.level == "ERROR")
  context <- enrichWithContext entry
  pure { timestamp: entry.timestamp, message: entry.message, context }

--------------------------------------------------------------------------------
-- Example 2: Database Query Streaming
--------------------------------------------------------------------------------

type UserId = Int
type User = { id :: UserId, name :: String, active :: Boolean }
type Order = { userId :: UserId, orderId :: String, total :: Number }
type Report = { userName :: String, orderId :: String, total :: Number }

-- WITHOUT DO: Deeply nested bind 🤯
generateReport_operators :: Strom ctx err Report
generateReport_operators =
  streamActiveUserIds
    >>= (\userId ->
      fetchUser userId
        >>= (\user ->
          streamUserOrders userId
            >>= (\order ->
              if order.total > 100.0
              then Strom.succeed { userName: user.name, orderId: order.orderId, total: order.total }
              else Strom.empty
            )
        )
    )

-- WITH DO: Natural, readable flow ✨
generateReport_do :: Strom ctx err Report
generateReport_do = do
  userId <- streamActiveUserIds
  user <- fetchUser userId
  order <- streamUserOrders userId
  guard (order.total > 100.0)
  pure { userName: user.name, orderId: order.orderId, total: order.total }

--------------------------------------------------------------------------------
-- Example 3: Event Processing with Multiple Conditions
--------------------------------------------------------------------------------

type Event = { eventType :: String, userId :: String, data :: String }
type ProcessedEvent = { userId :: String, userName :: String, action :: String }

-- WITHOUT DO: Nested bind with multiple filters
processEvents_operators :: Strom ctx err ProcessedEvent
processEvents_operators =
  readEventStream
    >>= (\event ->
      if event.eventType == "user_action"
      then
        if isValidEvent event
        then
          lookupUser event.userId
            >>= (\userName ->
              parseAction event.data
                >>= (\action ->
                  Strom.succeed { userId: event.userId, userName, action }
                )
            )
        else Strom.empty
      else Strom.empty
    )

-- WITH DO: Clean guards and linear flow ✨
processEvents_do :: Strom ctx err ProcessedEvent
processEvents_do = do
  event <- readEventStream
  guard (event.eventType == "user_action")
  guard (isValidEvent event)
  userName <- lookupUser event.userId
  action <- parseAction event.data
  pure { userId: event.userId, userName, action }

--------------------------------------------------------------------------------
-- Example 4: Network Request Fanout
--------------------------------------------------------------------------------

type ApiEndpoint = String
type ApiResponse = { endpoint :: String, data :: String, statusCode :: Int }
type ValidatedResponse = { endpoint :: String, parsedData :: String }

-- WITHOUT DO: Nested bind for multiple requests
fetchFromMultipleApis_operators :: Array ApiEndpoint -> Strom ctx err ValidatedResponse
fetchFromMultipleApis_operators endpoints =
  Strom.fromArray endpoints
    >>= (\endpoint ->
      makeHttpRequest endpoint
        >>= (\response ->
          if response.statusCode == 200
          then
            validateResponse response
              >>= (\validData ->
                Strom.succeed { endpoint: response.endpoint, parsedData: validData }
              )
          else Strom.empty
        )
    )

-- WITH DO: Straightforward request pipeline ✨
fetchFromMultipleApis_do :: Array ApiEndpoint -> Strom ctx err ValidatedResponse
fetchFromMultipleApis_do endpoints = do
  endpoint <- Strom.fromArray endpoints
  response <- makeHttpRequest endpoint
  guard (response.statusCode == 200)
  validData <- validateResponse response
  pure { endpoint: response.endpoint, parsedData: validData }

--------------------------------------------------------------------------------
-- Example 5: Streaming File Search
--------------------------------------------------------------------------------

type FilePath = String
type SearchResult = { file :: FilePath, lineNumber :: Int, content :: String }

-- WITHOUT DO: Triple nested bind for file search 😱😱😱
searchInFiles_operators :: String -> Strom ctx err SearchResult
searchInFiles_operators searchTerm =
  scanDirectory "src/"
    >>= (\filepath ->
      readFileLines filepath
        >>= (\lineInfo ->
          if String.contains (String.Pattern searchTerm) lineInfo.content
          then Strom.succeed 
            { file: filepath
            , lineNumber: lineInfo.lineNumber
            , content: lineInfo.content
            }
          else Strom.empty
        )
    )

-- WITH DO: Clear search logic ✨
searchInFiles_do :: String -> Strom ctx err SearchResult
searchInFiles_do searchTerm = do
  filepath <- scanDirectory "src/"
  lineInfo <- readFileLines filepath
  guard (String.contains (String.Pattern searchTerm) lineInfo.content)
  pure { file: filepath, lineNumber: lineInfo.lineNumber, content: lineInfo.content }

--------------------------------------------------------------------------------
-- Example 6: Real-time Data Processing
--------------------------------------------------------------------------------

type SensorReading = { sensorId :: String, value :: Number, timestamp :: String }
type Alert = { sensorId :: String, value :: Number, threshold :: Number, timestamp :: String }

-- WITHOUT DO: Nested bind with threshold checks
monitorSensors_operators :: Strom ctx err Alert
monitorSensors_operators =
  pollSensors
    >>= (\reading ->
      fetchThreshold reading.sensorId
        >>= (\threshold ->
          if reading.value > threshold
          then
            validateReading reading
              >>= (\validated ->
                if validated
                then Strom.succeed
                  { sensorId: reading.sensorId
                  , value: reading.value
                  , threshold
                  , timestamp: reading.timestamp
                  }
                else Strom.empty
              )
          else Strom.empty
        )
    )

-- WITH DO: Clear monitoring logic ✨
monitorSensors_do :: Strom ctx err Alert
monitorSensors_do = do
  reading <- pollSensors
  threshold <- fetchThreshold reading.sensorId
  guard (reading.value > threshold)
  validated <- validateReading reading
  guard validated
  pure 
    { sensorId: reading.sensorId
    , value: reading.value
    , threshold
    , timestamp: reading.timestamp
    }

--------------------------------------------------------------------------------
-- Example 7: WebSocket Message Processing
--------------------------------------------------------------------------------

type WebSocketMessage = { messageType :: String, payload :: String, sessionId :: String }
type ProcessedMessage = { sessionId :: String, userName :: String, command :: String }

-- WITHOUT DO: Nested bind for message handling
handleWebSocket_operators :: Strom ctx err ProcessedMessage
handleWebSocket_operators =
  receiveWebSocketMessages
    >>= (\msg ->
      if msg.messageType == "command"
      then
        getSession msg.sessionId
          >>= (\session ->
            authorizeUser session
              >>= (\userName ->
                parseCommand msg.payload
                  >>= (\command ->
                    Strom.succeed { sessionId: msg.sessionId, userName, command }
                  )
              )
          )
      else Strom.empty
    )

-- WITH DO: Clear message handling ✨
handleWebSocket_do :: Strom ctx err ProcessedMessage
handleWebSocket_do = do
  msg <- receiveWebSocketMessages
  guard (msg.messageType == "command")
  session <- getSession msg.sessionId
  userName <- authorizeUser session
  command <- parseCommand msg.payload
  pure { sessionId: msg.sessionId, userName, command }

--------------------------------------------------------------------------------
-- Example 8: Batch Processing with Dependencies
--------------------------------------------------------------------------------

type JobId = String
type Job = { jobId :: JobId, status :: String, dependencies :: Array JobId }
type ReadyJob = { jobId :: JobId, inputs :: Array String }

-- WITHOUT DO: Complex nested bind for dependency resolution
processJobQueue_operators :: Strom ctx err ReadyJob
processJobQueue_operators =
  streamPendingJobs
    >>= (\job ->
      if job.status == "pending"
      then
        checkDependencies job.dependencies
          >>= (\allComplete ->
            if allComplete
            then
              collectInputs job.dependencies
                >>= (\inputs ->
                  Strom.succeed { jobId: job.jobId, inputs }
                )
            else Strom.empty
          )
      else Strom.empty
    )

-- WITH DO: Clear dependency logic ✨
processJobQueue_do :: Strom ctx err ReadyJob
processJobQueue_do = do
  job <- streamPendingJobs
  guard (job.status == "pending")
  allComplete <- checkDependencies job.dependencies
  guard allComplete
  inputs <- collectInputs job.dependencies
  pure { jobId: job.jobId, inputs }

--------------------------------------------------------------------------------
-- Example 9: Multi-stage Data Pipeline
--------------------------------------------------------------------------------

type RawData = { id :: String, value :: String }
type ValidatedData = { id :: String, parsed :: Number }
type EnrichedData = { id :: String, parsed :: Number, metadata :: String }
type FinalOutput = { id :: String, score :: Number, metadata :: String }

-- WITHOUT DO: Four-level nested bind 🤮
dataPipeline_operators :: Strom ctx err FinalOutput
dataPipeline_operators =
  ingestRawData
    >>= (\raw ->
      parseAndValidate raw
        >>= (\validated ->
          enrichWithMetadata validated
            >>= (\enriched ->
              calculateScore enriched
                >>= (\score ->
                  Strom.succeed 
                    { id: enriched.id
                    , score
                    , metadata: enriched.metadata
                    }
                )
            )
        )
    )

-- WITH DO: Beautiful linear pipeline ✨✨✨
dataPipeline_do :: Strom ctx err FinalOutput
dataPipeline_do = do
  raw <- ingestRawData
  validated <- parseAndValidate raw
  enriched <- enrichWithMetadata validated
  score <- calculateScore enriched
  pure { id: enriched.id, score, metadata: enriched.metadata }

--------------------------------------------------------------------------------
-- Example 10: Conditional Branching in Streams
--------------------------------------------------------------------------------

type Document = { docId :: String, docType :: String, content :: String }
type ProcessedDoc = { docId :: String, result :: String }

-- WITHOUT DO: Nested bind with type-based branching
routeDocuments_operators :: Strom ctx err ProcessedDoc
routeDocuments_operators =
  streamDocuments
    >>= (\doc ->
      case doc.docType of
        "pdf" ->
          extractTextFromPdf doc
            >>= (\text ->
              analyzeText text
                >>= (\result ->
                  Strom.succeed { docId: doc.docId, result }
                )
            )
        "image" ->
          performOcr doc
            >>= (\text ->
              analyzeText text
                >>= (\result ->
                  Strom.succeed { docId: doc.docId, result }
                )
            )
        "text" ->
          analyzeText doc.content
            >>= (\result ->
              Strom.succeed { docId: doc.docId, result }
            )
        _ ->
          Strom.empty
    )

-- WITH DO: Clear type routing ✨
routeDocuments_do :: Strom ctx err ProcessedDoc
routeDocuments_do = do
  doc <- streamDocuments
  text <- case doc.docType of
    "pdf" -> extractTextFromPdf doc
    "image" -> performOcr doc
    "text" -> Strom.succeed doc.content
    _ -> Strom.empty
  result <- analyzeText text
  pure { docId: doc.docId, result }

--------------------------------------------------------------------------------
-- Helper Functions (simulating real streaming sources)
--------------------------------------------------------------------------------

-- File I/O
readLogFiles :: String -> Strom ctx err String
readLogFiles dir = Strom.succeed $ dir <> "app.log"

parseLogFile :: String -> Strom ctx err LogEntry
parseLogFile _ = Strom.succeed { timestamp: "2026-02-01", level: "ERROR", message: "Test" }

enrichWithContext :: LogEntry -> Strom ctx err String
enrichWithContext _ = Strom.succeed "stack trace context"

scanDirectory :: String -> Strom ctx err FilePath
scanDirectory _ = Strom.succeed "src/Main.purs"

readFileLines :: FilePath -> Strom ctx err { lineNumber :: Int, content :: String }
readFileLines _ = Strom.succeed { lineNumber: 42, content: "module Main where" }

-- Database
streamActiveUserIds :: Strom ctx err UserId
streamActiveUserIds = Strom.range 1 11

fetchUser :: UserId -> Strom ctx err User
fetchUser id = Strom.succeed { id, name: "User" <> show id, active: true }

streamUserOrders :: UserId -> Strom ctx err Order
streamUserOrders userId = Strom.succeed { userId, orderId: "ORD-" <> show userId, total: 150.0 }

streamPendingJobs :: Strom ctx err Job
streamPendingJobs = Strom.succeed { jobId: "job-1", status: "pending", dependencies: [] }

checkDependencies :: Array JobId -> Strom ctx err Boolean
checkDependencies _ = Strom.succeed true

collectInputs :: Array JobId -> Strom ctx err (Array String)
collectInputs _ = Strom.succeed []

-- Network
makeHttpRequest :: ApiEndpoint -> Strom ctx err ApiResponse
makeHttpRequest endpoint = Strom.succeed { endpoint, data: "{}", statusCode: 200 }

validateResponse :: ApiResponse -> Strom ctx err String
validateResponse resp = Strom.succeed resp.data

-- Events
readEventStream :: Strom ctx err Event
readEventStream = Strom.succeed { eventType: "user_action", userId: "user-123", data: "click" }

isValidEvent :: Event -> Boolean
isValidEvent _ = true

lookupUser :: String -> Strom ctx err String
lookupUser userId = Strom.succeed $ "User(" <> userId <> ")"

parseAction :: String -> Strom ctx err String
parseAction action = Strom.succeed action

-- Sensors
pollSensors :: Strom ctx err SensorReading
pollSensors = Strom.succeed { sensorId: "temp-01", value: 85.5, timestamp: "2026-02-01" }

fetchThreshold :: String -> Strom ctx err Number
fetchThreshold _ = Strom.succeed 75.0

validateReading :: SensorReading -> Strom ctx err Boolean
validateReading _ = Strom.succeed true

-- WebSocket
receiveWebSocketMessages :: Strom ctx err WebSocketMessage
receiveWebSocketMessages = Strom.succeed 
  { messageType: "command", payload: "refresh", sessionId: "sess-123" }

getSession :: String -> Strom ctx err String
getSession sessionId = Strom.succeed sessionId

authorizeUser :: String -> Strom ctx err String
authorizeUser _ = Strom.succeed "admin"

parseCommand :: String -> Strom ctx err String
parseCommand cmd = Strom.succeed cmd

-- Data Pipeline
ingestRawData :: Strom ctx err RawData
ingestRawData = Strom.succeed { id: "data-1", value: "42.5" }

parseAndValidate :: RawData -> Strom ctx err ValidatedData
parseAndValidate raw = Strom.succeed { id: raw.id, parsed: 42.5 }

enrichWithMetadata :: ValidatedData -> Strom ctx err EnrichedData
enrichWithMetadata v = Strom.succeed { id: v.id, parsed: v.parsed, metadata: "enriched" }

calculateScore :: EnrichedData -> Strom ctx err Number
calculateScore e = Strom.succeed $ e.parsed * 2.0

-- Documents
streamDocuments :: Strom ctx err Document
streamDocuments = Strom.succeed { docId: "doc-1", docType: "pdf", content: "sample" }

extractTextFromPdf :: Document -> Strom ctx err String
extractTextFromPdf _ = Strom.succeed "extracted text"

performOcr :: Document -> Strom ctx err String
performOcr _ = Strom.succeed "ocr text"

analyzeText :: String -> Strom ctx err String
analyzeText text = Strom.succeed $ "analyzed: " <> text

--------------------------------------------------------------------------------
-- Summary
--------------------------------------------------------------------------------

{-
  OPERATOR STYLE (>>=):
  ❌ Deeply nested
  ❌ Hard to read
  ❌ Lots of lambdas (\x -> ...)
  ❌ Hard to add new steps
  ❌ Closing parentheses hell
  ❌ Error-prone indentation
  
  DO-NOTATION STYLE:
  ✅ Linear, top-to-bottom
  ✅ Easy to read
  ✅ No explicit lambdas
  ✅ Easy to add/remove steps
  ✅ Looks like imperative code
  ✅ Natural for sequential operations
  ✅ Guards make filtering elegant
  ✅ Pattern matching works naturally
  ✅ Standard PureScript idiom
  
  VERDICT: Do-notation is dramatically more readable for
           real-world streaming pipelines! 🎉
  
  NOTE: These examples use realistic streaming sources:
  - File I/O (log processing, directory scanning)
  - Database queries (user streams, order streams)
  - Network requests (HTTP APIs)
  - Real-time events (sensors, WebSocket)
  - Batch processing (job queues)
  
  Unlike toy examples with fromArray, these demonstrate
  actual use cases where streaming makes sense!
-}
