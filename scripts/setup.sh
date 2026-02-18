#!/usr/bin/env bash

# Interactive Setup Script
#
# Streamlined onboarding experience that validates prerequisites and sets up
# the environment with interactive prompts.
#
# Usage: bash scripts/setup.sh [options]

set -euo pipefail

# Color output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Example directories
EXAMPLE_DIRS=(
    "taller-ia-agentes-mcp/01-agente-tareas"
    "taller-ia-agentes-mcp/02-agente-investigador"
    "taller-ia-agentes-mcp/03-mcp-servers"
)

# Print colored output
print_success() {
    echo -e "${GREEN}✅${NC} $1"
}

print_error() {
    echo -e "${RED}❌${NC} $1" >&2
}

print_warning() {
    echo -e "${YELLOW}⚠️${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ️${NC} $1"
}

# Show usage
show_help() {
    cat << EOF
Usage: bash scripts/setup.sh [options]

Streamlined onboarding experience for Código Sin Siesta examples.

OPTIONS:
    -h, --help              Show this help message
    -k, --api-key KEY       Set API key non-interactively
    -s, --skip-prompts      Skip interactive prompts (requires --api-key)
    -v, --validate-only     Only validate prerequisites, don't modify files

EXAMPLES:
    # Interactive setup with prompts
    bash scripts/setup.sh

    # Non-interactive setup with API key
    bash scripts/setup.sh --api-key sk-ant-xxx

    # Validate prerequisites only
    bash scripts/setup.sh --validate-only

GETTING STARTED:
    Get your API key at: https://console.anthropic.com/settings/keys
    Minimum requirements: Node.js 20.0+

EOF
}

# Parse command line arguments
API_KEY=""
SKIP_PROMPTS=false
VALIDATE_ONLY=false

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        -k|--api-key)
            if [[ -z "${2:-}" ]] || [[ "${2:0:1}" == "-" ]]; then
                print_error "Option --api-key requires a value"
                exit 1
            fi
            API_KEY="$2"
            shift 2
            ;;
        -s|--skip-prompts)
            SKIP_PROMPTS=true
            shift
            ;;
        -v|--validate-only)
            VALIDATE_ONLY=true
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Validate arguments
if [[ "$SKIP_PROMPTS" == true ]] && [[ -z "$API_KEY" ]]; then
    print_error "--skip-prompts requires --api-key to be set"
    exit 1
fi

# Check if we're in the project root
if [[ ! -f "${PROJECT_ROOT}/package.json" ]]; then
    print_error "Not in project root. Expected to find package.json at ${PROJECT_ROOT}"
    exit 1
fi

cd "$PROJECT_ROOT"

print_info "Código Sin Siesta - Interactive Setup"
echo ""

# Step 1: Validate prerequisites
print_info "Step 1: Validating prerequisites..."

if [[ -f "${SCRIPT_DIR}/validate-prerequisites.js" ]]; then
    if node "${SCRIPT_DIR}/validate-prerequisites.js" 2>&1; then
        print_success "Prerequisites validated"
    else
        print_error "Prerequisites validation failed"
        print_info "Please fix the issues above and run again"
        exit 1
    fi
else
    print_warning "validate-prerequisites.js not found, skipping validation"
fi

echo ""

# If validate-only mode, exit here
if [[ "$VALIDATE_ONLY" == true ]]; then
    print_success "Validation complete. No files were modified."
    exit 0
fi

# Step 2: Get API key
if [[ -z "$API_KEY" ]]; then
    print_info "Step 2: Setting up Anthropic API key"

    # Check if .env file already exists in any example
    for example_dir in "${EXAMPLE_DIRS[@]}"; do
        env_file="${PROJECT_ROOT}/${example_dir}/.env"
        if [[ -f "$env_file" ]]; then
            # Try to read existing API key
            if [[ -f "$env_file" ]] && grep -q "ANTHROPIC_API_KEY=" "$env_file"; then
                existing_key=$(grep "^ANTHROPIC_API_KEY=" "$env_file" | cut -d'=' -f2)
                if [[ -n "$existing_key" ]] && [[ "$existing_key" != "your_anthropic_api_key_here" ]] && [[ ! "$existing_key" =~ ^[[:space:]]*$ ]]; then
                    echo ""
                    print_info "Found existing API key in ${example_dir}/.env"
                    read -p "  Use existing key? [Y/n]: " use_existing
                    use_existing=${use_existing:-Y}
                    if [[ "$use_existing" =~ ^[Yy]$ ]]; then
                        API_KEY="$existing_key"
                        print_success "Using existing API key"
                        break
                    fi
                fi
            fi
        fi
    done
fi

if [[ -z "$API_KEY" ]]; then
    echo ""
    echo "Get your API key at: https://console.anthropic.com/settings/keys"
    while [[ -z "$API_KEY" ]]; do
        read -p "  Enter your Anthropic API key: " API_KEY
        API_KEY=$(echo "$API_KEY" | xargs)  # Trim whitespace

        if [[ -z "$API_KEY" ]]; then
            print_warning "API key cannot be empty"
        fi
    done
fi

echo ""

# Step 3: Create .env files for examples
print_info "Step 3: Setting up .env files for examples..."

created_count=0
skipped_count=0

for example_dir in "${EXAMPLE_DIRS[@]}"; do
    env_example="${PROJECT_ROOT}/${example_dir}/.env.example"
    env_file="${PROJECT_ROOT}/${example_dir}/.env"

    if [[ ! -f "$env_example" ]]; then
        print_warning "No .env.example found in ${example_dir}, skipping"
        ((skipped_count++))
        continue
    fi

    if [[ -f "$env_file" ]]; then
        # Check if the file has the placeholder or empty API key
        if grep -q "ANTHROPIC_API_KEY=your_anthropic_api_key_here" "$env_file" || ! grep -q "ANTHROPIC_API_KEY=sk-" "$env_file"; then
            # Update the file with the new API key
            sed -i.tmp "s|^ANTHROPIC_API_KEY=.*|ANTHROPIC_API_KEY=${API_KEY}|" "$env_file" 2>/dev/null || \
                sed -e "s|^ANTHROPIC_API_KEY=.*|ANTHROPIC_API_KEY=${API_KEY}|" "$env_file" > "$env_file.tmp" && mv "$env_file.tmp" "$env_file"
            rm -f "${env_file}.tmp"
            print_success "Updated ${example_dir}/.env"
            ((created_count++))
        else
            print_info "Keeping existing ${example_dir}/.env (API key already set)"
            ((skipped_count++))
        fi
    else
        # Create .env from .env.example
        cp "$env_example" "$env_file"
        sed -i.tmp "s|^ANTHROPIC_API_KEY=.*|ANTHROPIC_API_KEY=${API_KEY}|" "$env_file" 2>/dev/null || \
            sed -e "s|^ANTHROPIC_API_KEY=.*|ANTHROPIC_API_KEY=${API_KEY}|" "$env_file" > "$env_file.tmp" && mv "$env_file.tmp" "$env_file"
        rm -f "${env_file}.tmp"
        print_success "Created ${example_dir}/.env"
        ((created_count++))
    fi
done

echo ""

# Summary
print_success "Setup complete!"
echo ""
echo "Summary:"
echo "  - Prerequisites: ✅ Validated"
echo "  - .env files created/updated: $created_count"
echo "  - .env files skipped: $skipped_count"
echo ""
print_info "Next steps:"
echo "  1. Navigate to an example directory:"
echo "     cd taller-ia-agentes-mcp/01-agente-tareas"
echo ""
echo "  2. Install dependencies:"
echo "     npm install"
echo ""
echo "  3. Run the example:"
echo "     npm start"
echo ""
echo "For more information, see README.md in each example directory."
