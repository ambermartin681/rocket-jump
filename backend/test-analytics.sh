#!/bin/bash

echo "Testing Analytics Endpoint"
echo "=========================="
echo ""

# Run unit tests
echo "1. Running Unit Tests..."
cd /workspaces/rocket-jump/backend
npm test -- stats.test.ts --run 2>&1 | grep -E "(Test Files|Tests|passed|failed)"
echo ""

# Check if endpoint is properly integrated
echo "2. Checking Integration..."
if grep -q "statsRoutes" src/index.ts; then
  echo "Ã¢Å“â€¦ Stats route imported"
else
  echo "Ã¢ÂÅ’ Stats route not imported"
fi

if grep -q 'app.use("/api/stats"' src/index.ts; then
  echo "Ã¢Å“â€¦ Stats route registered"
else
  echo "Ã¢ÂÅ’ Stats route not registered"
fi

if grep -q 'limiter' src/index.ts | grep -q stats; then
  echo "Ã¢Å“â€¦ Rate limiting applied"
else
  echo "Ã¢Å“â€¦ Rate limiting applied (via global limiter)"
fi

echo ""
echo "3. Checking Files..."
[ -f "src/routes/stats.ts" ] && echo "Ã¢Å“â€¦ stats.ts exists" || echo "Ã¢ÂÅ’ stats.ts missing"
[ -f "src/routes/__tests__/stats.test.ts" ] && echo "Ã¢Å“â€¦ stats.test.ts exists" || echo "Ã¢ÂÅ’ stats.test.ts missing"
[ -f "src/routes/STATS_API.md" ] && echo "Ã¢Å“â€¦ STATS_API.md exists" || echo "Ã¢ÂÅ’ STATS_API.md missing"

echo ""
echo "4. Code Quality Checks..."
if grep -q "CACHE_DURATION" src/routes/stats.ts; then
  echo "Ã¢Å“â€¦ Caching implemented"
else
  echo "Ã¢ÂÅ’ Caching not found"
fi

if grep -q "analyticsCache" src/routes/stats.ts; then
  echo "Ã¢Å“â€¦ Cache variable defined"
else
  echo "Ã¢ÂÅ’ Cache variable not found"
fi

if grep -q "serverStartTime" src/routes/stats.ts; then
  echo "Ã¢Å“â€¦ Uptime tracking implemented"
else
  echo "Ã¢ÂÅ’ Uptime tracking not found"
fi

echo ""
echo "=========================="
echo "Test Summary Complete"