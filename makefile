-include .env

.PHONY: deploy verify help

# Default account key - can be overridden with DEPLOY_KEY env var
DEPLOY_KEY ?= testingAddress

# Scroll Sepolia Network Arguments
SCROLL_SEPOLIA_ARGS := --rpc-url $(RPC_URL_SCROLL_SEPOLIA) \
                       --account $(DEPLOY_KEY) \
                       --broadcast \
                       --verify \
                       --verifier-url https://api-sepolia.scrollscan.com/api/v2 \
                       --verifier blockscout \
                       --etherscan-api-key $(SCROLLSCAN_API_KEY) \
                       --via-ir

# Deployment command
deploy:
	@echo "Deploying ZkHeriloom3 to Scroll Sepolia testnet"
	@forge clean
	@forge script src/contract/script/zkheriloom3.s.sol:DeployZkHeriloom3 $(SCROLL_SEPOLIA_ARGS) -vvvvvv

# Default contract name - can be overridden with CONTRACT_NAME env var
CONTRACT_NAME ?= src/contract/zkheriloom3.sol:ZkHeriloom3

# Verification only (for already deployed contracts)
verify:
	@LATEST_BROADCAST="broadcast/zkheriloom3.s.sol/534351/run-latest.json"; \
	if [ -z "$(CONTRACT_ADDRESS)" ] && [ -f "$$LATEST_BROADCAST" ]; then \
		if command -v jq >/dev/null 2>&1; then \
			CONTRACT_ADDR=$$(jq -r '.returns."0".value // .transactions[0].contractAddress // empty' "$$LATEST_BROADCAST" 2>/dev/null | grep -E '^0x[a-fA-F0-9]{40}$$' || echo ""); \
		else \
			CONTRACT_ADDR=$$(grep -o '"value": "[^"]*"' "$$LATEST_BROADCAST" 2>/dev/null | grep -oE '0x[a-fA-F0-9]{40}' | head -1 || \
			grep -o '"contractAddress": "[^"]*"' "$$LATEST_BROADCAST" 2>/dev/null | grep -oE '0x[a-fA-F0-9]{40}' | head -1 || echo ""); \
		fi; \
	else \
		CONTRACT_ADDR="$(CONTRACT_ADDRESS)"; \
	fi; \
	if [ -z "$$CONTRACT_ADDR" ]; then \
		echo "❌ Error: CONTRACT_ADDRESS is required and no deployment found"; \
		echo "Usage: make verify CONTRACT_ADDRESS=0x... [CONTRACT_NAME=src/contract/zkheriloom3.sol:ZkHeriloom3]"; \
		echo "   Or run 'make deploy' first to generate deployment artifacts"; \
		exit 1; \
	fi; \
	echo "Verifying contract on Scroll Sepolia via Sourcify..."; \
	echo "Contract Address: $$CONTRACT_ADDR"; \
	echo "Contract Name: $(CONTRACT_NAME)"; \
	forge verify-contract \
		--rpc-url $(RPC_URL_SCROLL_SEPOLIA) \
		--verifier sourcify \
		--chain-id 534351 \
		$$CONTRACT_ADDR \
		$(CONTRACT_NAME) \
		$(if $(CONSTRUCTOR_ARGS),--constructor-args $(CONSTRUCTOR_ARGS),) || \
	(echo "" && echo "⚠️  Verification failed. Manual: https://sepolia.scrollscan.com/address/$$CONTRACT_ADDR#code")

# Help command
help:
	@echo "================================================================================="
	@echo "                      Scroll Sepolia Deployment - Makefile"
	@echo "================================================================================="
	@echo ""
	@echo "========================== Deployment Commands ============================="
	@echo ""
	@echo "  make deploy ----------------- Deploy contracts to Scroll Sepolia testnet"
	@echo "                                 Requires: RPC_URL_SCROLL_SEPOLIA, DEPLOY_KEY"
	@echo ""
	@echo "  make verify ----------------- Verify deployed contracts on Scroll Sepolia"
	@echo "                                 Auto-detects address from latest deployment"
	@echo "                                 Optional: CONTRACT_ADDRESS=0x... CONTRACT_NAME=..."
	@echo ""
	@echo "================================= Environment ===================================="
	@echo ""
	@echo "  Required .env variables:"
	@echo "    RPC_URL_SCROLL_SEPOLIA  - Scroll Sepolia RPC endpoint"
	@echo "    DEPLOY_KEY              - Foundry account name for deployment (default: testingAddress)"
	@echo ""
	@echo "  For verification (optional, uses defaults from latest deployment):"
	@echo "    CONTRACT_ADDRESS        - Address of deployed contract (auto-detected if not provided)"
	@echo "    CONTRACT_NAME           - Contract name (default: src/contract/zkheriloom3.sol:ZkHeriloom3)"
	@echo "    CONSTRUCTOR_ARGS        - Constructor arguments (optional, hex encoded)"
	@echo ""
	@echo "================================= Examples ===================================="
	@echo ""
	@echo "  make deploy"
	@echo "  make verify                    # Uses latest deployment"
	@echo "  make verify CONTRACT_ADDRESS=0x... CONTRACT_NAME=..."
	@echo ""
	@echo "================================================================================="
