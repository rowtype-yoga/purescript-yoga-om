module Test.Rom where

import Prelude

import Test.Spec (Spec, describe, it, pending)

-- | Test specification for yoga-om-rom package
romSpec :: Spec Unit
romSpec = do
  describe "Yoga.Om.Rom" do
    
    describe "Event integration" do
      pending "omToEvent converts Om to Event"
      pending "eventToOm converts Event to Om"
      pending "streamOms streams multiple Oms as events"
    
    describe "Event combinators" do
      pending "raceEvents races multiple events"
      pending "filterMapOm filters and maps Om computations"
      pending "foldOms folds over Om computations"
    
    describe "Context handling" do
      pending "withEventStream preserves Om context"
      pending "Event streams handle errors appropriately"
