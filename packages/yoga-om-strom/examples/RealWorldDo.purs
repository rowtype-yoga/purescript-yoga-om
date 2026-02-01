module Yoga.Om.Strom.Examples.RealWorldDo where

import Prelude

import Data.Array as Array
import Data.Maybe (Maybe(..))
import Data.Tuple (Tuple(..))
import Yoga.Om (Om)
import Yoga.Om as Om
import Yoga.Om.Strom as Strom
import Yoga.Om.Strom.Do (guard, when)

--------------------------------------------------------------------------------
-- Real-World Example: E-Commerce Analytics Pipeline
--------------------------------------------------------------------------------

type Context = 
  { logger :: String -> Om {} () Unit
  , database :: Database
  }

type Database = Unit  -- Placeholder
type Order = 
  { orderId :: String
  , userId :: String
  , productId :: String
  , amount :: Number
  , status :: String
  , timestamp :: Int
  }

type User = 
  { userId :: String
  , email :: String
  , tier :: String  -- "basic", "premium", "vip"
  , active :: Boolean
  }

type Product = 
  { productId :: String
  , name :: String
  , category :: String
  , inStock :: Boolean
  }

type AnalyticsReport = 
  { order :: Order
  , user :: User
  , product :: Product
  , discountApplied :: Boolean
  , priority :: Int
  }

--------------------------------------------------------------------------------
-- WITHOUT DO-NOTATION: The Old Way 😱
--------------------------------------------------------------------------------

analyticsOldWay :: Strom Context () AnalyticsReport
analyticsOldWay =
  -- Get all orders
  Strom.fromOm fetchAllOrders
    >>= Strom.fromArray
    -- Filter completed orders
    # Strom.filter (\order -> order.status == "completed")
    >>= (\order ->
        -- Fetch user data
        Strom.fromOm (fetchUser order.userId)
          # Strom.filter (_.active)  -- Only active users
          >>= (\user ->
              -- Fetch product data
              Strom.fromOm (fetchProduct order.productId)
                # Strom.filter (_.inStock)  -- Only in-stock products
                >>= (\product ->
                    -- Check if discount applies
                    Strom.fromOm (checkDiscount user product order)
                      >>= (\discount ->
                          -- Calculate priority
                          Strom.fromOm (calculatePriority user order)
                            # Strom.map (\priority ->
                                -- Finally, build the report
                                { order
                                , user
                                , product
                                , discountApplied: discount
                                , priority
                                }
                              )
                        )
                  )
            )
      )

-- 😱 That was HORRIBLE! Deeply nested, hard to read, hard to modify

--------------------------------------------------------------------------------
-- WITH DO-NOTATION: The Modern Way ✨
--------------------------------------------------------------------------------

analyticsModernWay :: Strom Context () AnalyticsReport
analyticsModernWay = do
  -- Get orders
  orders <- Strom.fromOm fetchAllOrders
  order <- Strom.fromArray orders
  guard (order.status == "completed")
  
  -- Get user
  user <- Strom.fromOm (fetchUser order.userId)
  guard user.active
  
  -- Get product
  product <- Strom.fromOm (fetchProduct order.productId)
  guard product.inStock
  
  -- Calculate extras
  discount <- Strom.fromOm (checkDiscount user product order)
  priority <- Strom.fromOm (calculatePriority user order)
  
  -- Build report
  pure { order, user, product, discountApplied: discount, priority }

-- ✨ Beautiful! Clear, linear, easy to read and modify

--------------------------------------------------------------------------------
-- WITH CONDITIONAL PROCESSING
--------------------------------------------------------------------------------

type Config = 
  { validateInventory :: Boolean
  , enrichUserData :: Boolean
  , calculateShipping :: Boolean
  }

analyticsWithConfig :: Config -> Strom Context () AnalyticsReport
analyticsWithConfig config = do
  -- Get orders
  orders <- Strom.fromOm fetchAllOrders
  order <- Strom.fromArray orders
  guard (order.status == "completed")
  
  -- Get user
  user <- Strom.fromOm (fetchUser order.userId)
  guard user.active
  
  -- Optional: Enrich user data
  enrichedUser <- when config.enrichUserData do
    Strom.fromOm (enrichUser user)
  let finalUser = if config.enrichUserData then enrichedUser else user
  
  -- Get product
  product <- Strom.fromOm (fetchProduct order.productId)
  
  -- Optional: Validate inventory
  when config.validateInventory do
    guard product.inStock
  
  -- Calculate discount
  discount <- Strom.fromOm (checkDiscount finalUser product order)
  
  -- Calculate priority
  priority <- Strom.fromOm (calculatePriority finalUser order)
  
  pure { order, user: finalUser, product, discountApplied: discount, priority }

--------------------------------------------------------------------------------
-- COMPLEX: Multi-Source Data Aggregation
--------------------------------------------------------------------------------

type OrderWithReviews = 
  { order :: Order
  , user :: User
  , product :: Product
  , reviews :: Array Review
  , recommendations :: Array Product
  }

type Review = { rating :: Int, comment :: String }

aggregateOrderData :: Strom Context () OrderWithReviews
aggregateOrderData = do
  -- Base data
  order <- Strom.fromOm fetchAllOrders >>= Strom.fromArray
  guard (order.amount > 50.0)  -- High-value orders only
  
  user <- Strom.fromOm (fetchUser order.userId)
  guard (user.tier == "premium" || user.tier == "vip")
  
  product <- Strom.fromOm (fetchProduct order.productId)
  
  -- Parallel data fetching (using ado for independent operations)
  { reviews, recommendations } <- ado
    reviews <- Strom.fromOm (fetchReviews product.productId)
    recommendations <- Strom.fromOm (getRecommendations user.userId product.category)
    in { reviews, recommendations }
  
  pure { order, user, product, reviews, recommendations }

--------------------------------------------------------------------------------
-- REAL-WORLD: Fraud Detection Pipeline
--------------------------------------------------------------------------------

type FraudAlert = 
  { order :: Order
  , user :: User
  , riskScore :: Number
  , reasons :: Array String
  }

fraudDetectionPipeline :: Strom Context () FraudAlert
fraudDetectionPipeline = do
  -- Get recent orders
  orders <- Strom.fromOm fetchRecentOrders
  order <- Strom.fromArray orders
  
  -- Only check high-value orders
  guard (order.amount > 1000.0)
  
  -- Get user
  user <- Strom.fromOm (fetchUser order.userId)
  
  -- Calculate risk score
  riskScore <- Strom.fromOm (calculateRiskScore order user)
  
  -- Only alert on high risk
  guard (riskScore > 0.7)
  
  -- Get fraud reasons
  reasons <- Strom.fromOm (analyzeFraudReasons order user riskScore)
  
  -- Log alert
  _ <- Strom.fromOm do
    ctx <- Om.ask
    ctx.logger $ "FRAUD ALERT: Order " <> order.orderId <> " - Risk: " <> show riskScore
  
  pure { order, user, riskScore, reasons }

--------------------------------------------------------------------------------
-- REAL-WORLD: Recommendation Engine
--------------------------------------------------------------------------------

type Recommendation = 
  { userId :: String
  , recommendedProduct :: Product
  , score :: Number
  , reason :: String
  }

recommendationEngine :: String -> Strom Context () Recommendation
recommendationEngine userId = do
  -- Get user
  user <- Strom.fromOm (fetchUser userId)
  guard user.active
  
  -- Get user's order history
  orderHistory <- Strom.fromOm (fetchUserOrders userId)
  order <- Strom.fromArray orderHistory
  
  -- Get purchased product
  purchasedProduct <- Strom.fromOm (fetchProduct order.productId)
  
  -- Get similar products
  similarProducts <- Strom.fromOm (findSimilarProducts purchasedProduct)
  candidate <- Strom.fromArray similarProducts
  
  -- Filter out already purchased
  alreadyPurchased <- Strom.fromOm (checkIfPurchased userId candidate.productId)
  guard (not alreadyPurchased)
  
  -- Calculate recommendation score
  score <- Strom.fromOm (calculateRecommendationScore user purchasedProduct candidate)
  
  -- Only recommend high-scoring items
  guard (score > 0.5)
  
  pure 
    { userId
    , recommendedProduct: candidate
    , score
    , reason: "Based on " <> purchasedProduct.name
    }

--------------------------------------------------------------------------------
-- REAL-WORLD: ETL Pipeline
--------------------------------------------------------------------------------

type RawData = { csv :: String }
type ParsedData = { rows :: Array (Array String) }
type ValidatedData = { records :: Array Record }
type TransformedData = { enriched :: Array EnrichedRecord }

type Record = { id :: String, value :: String }
type EnrichedRecord = { id :: String, value :: String, metadata :: String }

etlPipeline :: Strom Context () EnrichedRecord
etlPipeline = do
  -- Extract: Read raw data
  rawData <- Strom.fromOm extractFromSource
  
  -- Parse CSV
  parsed <- Strom.fromOm (parseCSV rawData.csv)
  row <- Strom.fromArray parsed.rows
  
  -- Transform: Parse each row
  record <- Strom.fromOm (parseRow row)
  
  -- Validate
  guard (isValidRecord record)
  
  -- Enrich
  enriched <- Strom.fromOm (enrichRecord record)
  
  -- Additional validation
  guard (enriched.value /= "")
  
  -- Log progress
  _ <- Strom.fromOm do
    ctx <- Om.ask
    ctx.logger $ "Processed record: " <> enriched.id
  
  pure enriched

--------------------------------------------------------------------------------
-- Helper Functions (Placeholders)
--------------------------------------------------------------------------------

fetchAllOrders :: Om Context () (Array Order)
fetchAllOrders = pure []

fetchRecentOrders :: Om Context () (Array Order)
fetchRecentOrders = pure []

fetchUser :: String -> Om Context () User
fetchUser userId = pure 
  { userId
  , email: "user@example.com"
  , tier: "basic"
  , active: true
  }

fetchProduct :: String -> Om Context () Product
fetchProduct productId = pure 
  { productId
  , name: "Product"
  , category: "electronics"
  , inStock: true
  }

checkDiscount :: User -> Product -> Order -> Om Context () Boolean
checkDiscount _ _ _ = pure false

calculatePriority :: User -> Order -> Om Context () Int
calculatePriority _ _ = pure 1

enrichUser :: User -> Om Context () User
enrichUser = pure

fetchReviews :: String -> Om Context () (Array Review)
fetchReviews _ = pure []

getRecommendations :: String -> String -> Om Context () (Array Product)
getRecommendations _ _ = pure []

calculateRiskScore :: Order -> User -> Om Context () Number
calculateRiskScore _ _ = pure 0.5

analyzeFraudReasons :: Order -> User -> Number -> Om Context () (Array String)
analyzeFraudReasons _ _ _ = pure []

fetchUserOrders :: String -> Om Context () (Array Order)
fetchUserOrders _ = pure []

findSimilarProducts :: Product -> Om Context () (Array Product)
findSimilarProducts _ = pure []

checkIfPurchased :: String -> String -> Om Context () Boolean
checkIfPurchased _ _ = pure false

calculateRecommendationScore :: User -> Product -> Product -> Om Context () Number
calculateRecommendationScore _ _ _ = pure 0.6

extractFromSource :: Om Context () RawData
extractFromSource = pure { csv: "" }

parseCSV :: String -> Om Context () ParsedData
parseCSV _ = pure { rows: [] }

parseRow :: Array String -> Om Context () Record
parseRow _ = pure { id: "1", value: "test" }

isValidRecord :: Record -> Boolean
isValidRecord _ = true

enrichRecord :: Record -> Om Context () EnrichedRecord
enrichRecord r = pure { id: r.id, value: r.value, metadata: "" }

--------------------------------------------------------------------------------
-- SUMMARY: Why Do-Notation Wins
--------------------------------------------------------------------------------

{-
  BEFORE (Operator Style with >>=):
  ❌ Deeply nested bind calls
  ❌ Hard to read sequential logic
  ❌ Difficult to add new steps
  ❌ Closing bracket hell
  ❌ Hard to spot the business logic
  
  AFTER (Do-Notation):
  ✅ Linear, top-to-bottom flow
  ✅ Reads like English
  ✅ Easy to add/remove steps
  ✅ Business logic is obvious
  ✅ Guards make filtering elegant
  ✅ Looks like imperative code
  ✅ Much easier to maintain
  
  REAL BENEFIT:
  - Junior developers can understand it
  - Code reviews are easier
  - Bugs are easier to spot
  - Refactoring is straightforward
  - Business logic is self-documenting
-}
