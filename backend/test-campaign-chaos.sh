#!/bin/bash

# Campaign Chaos Testing Runner

set -e

echo "Ã°Å¸â€™Â¥ Campaign Chaos Testing Suite"
echo "================================"
echo ""

if [ ! -f "package.json" ]; then
    echo "Ã¢ÂÅ’ Error: Must be run from backend directory"
    exit 1
fi

echo "Ã°Å¸Â§Âª Running Chaos Tests with Reproducible Seeds..."
npm test -- campaignChaos.test.ts --run
echo "Ã¢Å“â€¦ Chaos Tests Complete"
echo ""

echo "================================"
echo "Ã¢Å“â€¦ All Chaos Tests Passed!"
echo ""
echo "Resilience Verified:"
echo "  Ã¢Å“â€¦ Interleaved concurrent campaigns"
echo "  Ã¢Å“â€¦ Indexer lag recovery"
echo "  Ã¢Å“â€¦ Duplicate event handling"
echo "  Ã¢Å“â€¦ Backend outage recovery"
echo "  Ã¢Å“â€¦ Retry storm resilience"
echo "  Ã¢Å“â€¦ Combined fault scenarios"
echo "  Ã¢Å“â€¦ Eventual consistency maintained"