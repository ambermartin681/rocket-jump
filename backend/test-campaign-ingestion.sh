#!/bin/bash

# Campaign Ingestion Test Runner
# Runs all campaign-related tests and verifies acceptance criteria

set -e

echo "Ã°Å¸Å¡â‚¬ Campaign Ingestion Test Suite"
echo "================================"
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "Ã¢ÂÅ’ Error: Must be run from backend directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Ã°Å¸â€œÂ¦ Installing dependencies..."
    npm install
fi

# Check if Prisma client is generated
if [ ! -d "node_modules/.prisma" ]; then
    echo "Ã°Å¸â€Â§ Generating Prisma client..."
    npx prisma generate
fi

echo "Ã°Å¸Â§Âª Running Campaign Ingestion Tests..."
npm test -- campaignIngestion.test.ts --run
echo "Ã¢Å“â€¦ Campaign Ingestion Tests Complete"
echo ""

echo "================================"
echo "Ã¢Å“â€¦ All Campaign Ingestion Tests Passed!"
echo ""
echo "Acceptance Criteria Verified:"
echo "  Ã¢Å“â€¦ Parse and persist buyback event stream"
echo "  Ã¢Å“â€¦ Build projection logic for campaign status, totals, execution history"
echo "  Ã¢Å“â€¦ Implement replay-safe idempotent upserts"
echo "  Ã¢Å“â€¦ Add integration tests for out-of-order and duplicate events"
echo "  Ã¢Å“â€¦ Backend projections remain consistent under ingestion tests"
echo ""
echo "Ã°Å¸â€œÅ¡ See CAMPAIGN_INGESTION.md for full documentation"