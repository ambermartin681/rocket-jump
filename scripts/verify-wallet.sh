#!/bin/bash
set -e

echo "Ã°Å¸â€Â Wallet Event Handling Verification Script"
echo "=============================================="
echo ""

cd "$(dirname "$0")/../frontend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Ã°Å¸â€œÂ¦ Installing dependencies..."
    npm install
    echo "Ã¢Å“â€¦ Dependencies installed"
    echo ""
fi

# Run type check
echo "Ã°Å¸â€Â Running TypeScript type check..."
if npm run type-check; then
    echo "Ã¢Å“â€¦ No TypeScript errors"
else
    echo "Ã¢ÂÅ’ TypeScript errors found"
    exit 1
fi
echo ""

# Run wallet tests
echo "Ã°Å¸Â§Âª Running wallet tests..."
if npm test -- useWallet.test.ts --run; then
    echo "Ã¢Å“â€¦ All wallet tests passed"
else
    echo "Ã¢ÂÅ’ Some tests failed"
    exit 1
fi
echo ""

echo "Ã¢Å“â€¦ All checks passed!"
echo ""
echo "Ã°Å¸â€œâ€¹ Manual Testing Checklist:"
echo "  1. Start dev server: npm run dev"
echo "  2. Connect Freighter wallet"
echo "  3. Switch accounts in Freighter Ã¢â€ â€™ verify UI updates"
echo "  4. Switch network (testnet/mainnet) Ã¢â€ â€™ verify UI updates"
echo "  5. Refresh page Ã¢â€ â€™ verify auto-reconnect"
echo "  6. Disconnect wallet Ã¢â€ â€™ verify cleanup"
echo ""