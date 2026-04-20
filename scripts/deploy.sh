#!/bin/bash

# Configuration
NETWORK="testnet"
CONTRACT_NAME="increment"
RPC_URL="https://soroban-testnet.stellar.org"
WASMPATH="contracts/increment/target/wasm32-unknown-unknown/release/increment.wasm"

echo "🚀 Building contract..."
cargo build --target wasm32-unknown-unknown --release -p $CONTRACT_NAME

if [ ! -f "$WASMPATH" ]; then
    echo "❌ Build failed. Wasm file not found at $WASMPATH"
    exit 1
fi

echo "✅ Build successful!"

# We assume the user has a 'deployer' identity configured in stellar-cli
# Or we can create a temporary one
if ! stellar keys ls | grep -q "deployer"; then
    echo "🔑 Creating 'deployer' identity..."
    stellar keys generate deployer --network $NETWORK
fi

echo "💰 Funding deployer account..."
stellar keys fund deployer --network $NETWORK

echo "📦 Deploying contract..."
CONTRACT_ID=$(stellar contract deploy --wasm "$WASMPATH" --source deployer --network $NETWORK)

echo "🎉 Contract deployed successfully!"
echo "📍 Contract ID: $CONTRACT_ID"

# Save to .env.local in frontend
echo "PUBLIC_CONTRACT_ID=$CONTRACT_ID" > frontend/.env.local
echo "PUBLIC_NETWORK_PASSPHRASE=\"Test SDF Network ; September 2015\"" >> frontend/.env.local
echo "PUBLIC_RPC_URL=\"$RPC_URL\"" >> frontend/.env.local

echo "✅ Environment variables updated in frontend/.env.local"
