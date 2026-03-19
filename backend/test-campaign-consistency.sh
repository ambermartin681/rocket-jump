#!/bin/bash

# Campaign Consistency Checker Test Runner

set -e

echo "Ã°Å¸â€Â Campaign Consistency Checker Test Suite"
echo "=========================================="
echo ""

if [ ! -f "package.json" ]; then
    echo "Ã¢ÂÅ’ Error: Must be run from backend directory"
    exit 1
fi

echo "Ã°Å¸Â§Âª Running Consistency Checker Tests..."
npm test -- campaignConsistencyChecker.test.ts --run
echo "Ã¢Å“â€¦ Consistency Checker Tests Complete"
echo ""

echo "Ã°Å¸Â§Âª Running Fixture Scenario Tests..."
npm test -- campaignConsistencyFixtures.test.ts --run
echo "Ã¢Å“â€¦ Fixture Tests Complete"
echo ""

echo "Ã°Å¸Â§Âª Running Randomized Trace Tests..."
npm test -- campaignConsistencyRandomized.test.ts --run
echo "Ã¢Å“â€¦ Randomized Tests Complete"
echo ""

echo "=========================================="
echo "Ã¢Å“â€¦ All Consistency Tests Passed!"
echo ""
echo "Verification Complete:"
echo "  Ã¢Å“â€¦ Backend aggregates match on-chain values"
echo "  Ã¢Å“â€¦ Fixture scenarios verified"
echo "  Ã¢Å“â€¦ Randomized execution traces verified"
echo "  Ã¢Å“â€¦ No consistency drift detected"