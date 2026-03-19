#!/bin/bash
# Local CI validation script
# Run this before pushing to ensure CI will pass

set -e

echo "Ã°Å¸â€Â Running local CI checks..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILED=0

# Function to run a check
run_check() {
    local name="$1"
    local command="$2"
    local dir="${3:-.}"
    
    echo -e "${YELLOW}Ã¢â€“Â¶ $name${NC}"
    if (cd "$dir" && eval "$command"); then
        echo -e "${GREEN}Ã¢Å“â€œ $name passed${NC}"
        echo ""
    else
        echo -e "${RED}Ã¢Å“â€” $name failed${NC}"
        echo ""
        FAILED=1
    fi
}

# Rust checks
echo "=== Rust Contract Checks ==="
run_check "Rust formatting" "cargo fmt --check" "contracts/token-factory"
run_check "Rust clippy" "cargo clippy --lib -- -D warnings" "contracts/token-factory"
run_check "Rust tests" "cargo test --lib" "contracts/token-factory"
run_check "Rust build (wasm)" "cargo build --release --target wasm32-unknown-unknown" "contracts/token-factory"

# Frontend checks
echo "=== Frontend Checks ==="
run_check "Frontend dependencies" "npm ci" "frontend"
run_check "Frontend linting" "npm run lint" "frontend"
run_check "Frontend tests" "npm test -- --run" "frontend"
run_check "Frontend build" "npm run build" "frontend"

# Spec validation
echo "=== Spec Validation ==="
if [ -d ".nova/specs" ]; then
    echo -e "${YELLOW}Ã¢â€“Â¶ Validating spec files${NC}"
    SPEC_VALID=1
    for spec_dir in .nova/specs/*/; do
        if [ -d "$spec_dir" ]; then
            spec_name=$(basename "$spec_dir")
            echo "  Checking spec: $spec_name"
            
            if [ ! -f "${spec_dir}requirements.md" ]; then
                echo -e "${RED}  Ã¢Å“â€” Missing requirements.md in $spec_name${NC}"
                SPEC_VALID=0
            fi
            
            if [ ! -f "${spec_dir}design.md" ]; then
                echo -e "${RED}  Ã¢Å“â€” Missing design.md in $spec_name${NC}"
                SPEC_VALID=0
            fi
            
            if [ ! -f "${spec_dir}tasks.md" ]; then
                echo -e "${RED}  Ã¢Å“â€” Missing tasks.md in $spec_name${NC}"
                SPEC_VALID=0
            fi
        fi
    done
    
    if [ $SPEC_VALID -eq 1 ]; then
        echo -e "${GREEN}Ã¢Å“â€œ Spec validation passed${NC}"
    else
        echo -e "${RED}Ã¢Å“â€” Spec validation failed${NC}"
        FAILED=1
    fi
    echo ""
else
    echo -e "${YELLOW}Ã¢Å¡Â  No specs directory found, skipping validation${NC}"
    echo ""
fi

# Summary
echo "=== Summary ==="
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}Ã¢Å“â€œ All checks passed! Ready to push.${NC}"
    exit 0
else
    echo -e "${RED}Ã¢Å“â€” Some checks failed. Please fix the issues before pushing.${NC}"
    exit 1
fi