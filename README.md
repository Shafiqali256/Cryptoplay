# CryptoPlay SDK

A comprehensive SDK for blockchain gaming integration, providing easy-to-use tools for managing wallets, tokens, and NFTs in your blockchain games.

## Features

- 🔐 Secure wallet management
- 🎮 Game state tracking
- 🎨 NFT minting and management
- 💰 Token integration
- 📦 TypeScript support
- 🔄 Real-time blockchain interactions

## Installation

```bash
# Using npm
npm install cryptoplay-sdk

# Using yarn
yarn add cryptoplay-sdk
```

## Quick Start

```typescript
import { CryptoPlay, WalletConfig, GameConfig } from 'cryptoplay-sdk';

// Configure your wallet
const walletConfig: WalletConfig = {
  privateKey: process.env.PRIVATE_KEY,
  provider: {
    network: 'testnet',
    apiKey: process.env.INFURA_API_KEY
  }
};

// Configure your game
const gameConfig: GameConfig = {
  name: "MyGame",
  description: "Blockchain-powered game",
  token: {
    name: "GameToken",
    symbol: "GTK",
    initialSupply: "1000000000000000000000000" // 1 million tokens
  },
  nft: {
    name: "GameItems",
    symbol: "GITM",
    baseURI: "https://mygame.com/assets/",
    maxSupply: 10000
  }
};

// Initialize the SDK
const game = new CryptoPlay({ wallet: walletConfig, config: gameConfig });

// Connect and deploy contracts
await game.initialize();

// Mint an NFT
const nft = await game.mintNFT({
  name: "Legendary Sword",
  description: "A powerful weapon",
  attributes: [
    { trait_type: "Damage", value: 95 },
    { trait_type: "Rarity", value: "Legendary" }
  ]
});

// Get game state
const state = await game.getGameState();
console.log(state);
```

## API Reference

### CryptoPlay

The main SDK class that handles all game-related operations.

#### Constructor

```typescript
new CryptoPlay(config: SDKConfig)
```

#### Methods

- `initialize(): Promise<void>` - Connects wallet and deploys contracts
- `mintNFT(metadata: NFTMetadata): Promise<TransactionResult>` - Mints a new NFT
- `getGameState(): Promise<GameState>` - Gets current game state

### CryptoPlayWallet

Handles blockchain wallet operations.

#### Constructor

```typescript
new CryptoPlayWallet(config: WalletConfig)
```

#### Methods

- `connect(): Promise<void>` - Connects to the blockchain
- `getBalance(): Promise<string>` - Gets wallet balance
- `sendTransaction(to: string, value: string): Promise<string>` - Sends ETH
- `getSigner(): ethers.Signer` - Gets the ethers signer
- `getProvider(): ethers.providers.JsonRpcProvider` - Gets the provider

## Types

### WalletConfig

```typescript
interface WalletConfig {
  privateKey: string;
  provider: {
    network: 'mainnet' | 'testnet';
    apiKey: string;
  };
}
```

### GameConfig

```typescript
interface GameConfig {
  name: string;
  description: string;
  token: {
    name: string;
    symbol: string;
    initialSupply: string;
  };
  nft: {
    name: string;
    symbol: string;
    baseURI: string;
    maxSupply: number;
  };
}
```

### NFTMetadata

```typescript
interface NFTMetadata {
  name: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  image?: string;
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@cryptoplay.com or join our Discord community. 