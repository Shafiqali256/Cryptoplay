# CryptoPlay SDK

A comprehensive SDK for blockchain gaming integration, providing seamless interaction with NFTs, tokens, and game mechanics.

## Features

### Core Functionality
- **Wallet Integration**: Secure wallet management with private key support
- **Smart Contract Interaction**: Deploy and interact with token and NFT contracts
- **Event Management**: Real-time event subscriptions and historical event queries
- **Type Safety**: Full TypeScript support with comprehensive type definitions

### Game Management
- **Score Tracking**: Record and manage player scores
- **Leaderboards**: Create and query game-specific leaderboards
- **Player Statistics**: Track player performance and achievements
- **Reward System**: Distribute tokens and NFTs as game rewards
- **Player Rankings**: Calculate and track player rankings

### NFT Marketplace
- **Listings**: Create and manage NFT listings
- **Offers**: Make and manage purchase offers
- **Trading**: Execute NFT sales and transfers
- **Marketplace Stats**: Track marketplace activity and volume
- **Price Management**: Set and update NFT prices

### Token Management
- **Token Transfers**: Send and receive tokens
- **Token Approvals**: Manage token spending permissions
- **Balance Tracking**: Monitor token balances
- **Token Metadata**: Access token information

## Installation

```bash
npm install cryptoplay-sdk
```

## Quick Start

```typescript
import { CryptoPlay, SDKConfig } from 'cryptoplay-sdk';

// Configure the SDK
const config: SDKConfig = {
  wallet: {
    privateKey: 'your-private-key',
    provider: {
      network: 'testnet',
      apiKey: 'your-api-key'
    }
  },
  config: {
    name: 'MyGame',
    description: 'An awesome blockchain game',
    token: {
      name: 'GameToken',
      symbol: 'GAME',
      initialSupply: '1000000'
    },
    nft: {
      name: 'GameNFT',
      symbol: 'GNFT',
      baseURI: 'https://api.mygame.com/nfts/',
      maxSupply: 10000
    }
  }
};

// Initialize the SDK
const cryptoPlay = new CryptoPlay(config);
await cryptoPlay.initialize();

// Start using the SDK features
```

## Usage Examples

### Game Management

```typescript
// Record a player's score
await cryptoPlay.recordScore(1000, 'game-1');

// Get player statistics
const stats = await cryptoPlay.getPlayerStats();
console.log(`Total games: ${stats.totalGames}`);
console.log(`Average score: ${stats.averageScore}`);

// Get leaderboard
const leaderboard = await cryptoPlay.getLeaderboard('game-1', 10);
console.log('Top players:', leaderboard);

// Distribute rewards
await cryptoPlay.distributeReward({
  type: 'token',
  amount: '100',
  gameId: 'game-1'
});
```

### NFT Marketplace

```typescript
// Create an NFT listing
await cryptoPlay.createListing(1, '10.5');

// Get active listings
const listings = await cryptoPlay.getActiveListings();
console.log('Active listings:', listings);

// Make an offer
await cryptoPlay.createOffer(1, '9.5');

// Buy an NFT
await cryptoPlay.buyNFT(1);

// Get marketplace statistics
const stats = await cryptoPlay.getMarketplaceStats();
console.log(`Total volume: ${stats.totalVolume}`);
```

### Event Handling

```typescript
// Subscribe to NFT minting events
const subscription = cryptoPlay.onNFTMinted((event) => {
  console.log('New NFT minted:', event);
});

// Subscribe to token transfers
cryptoPlay.onTokenTransfer((event) => {
  console.log('Token transfer:', event);
});

// Get historical events
const pastEvents = await cryptoPlay.getPastNFTMints(1000000, 1000100);
```

## API Reference

### Core Classes

- `CryptoPlay`: Main SDK class
- `ContractManager`: Smart contract interaction
- `EventManager`: Event handling and subscriptions
- `GameManager`: Game mechanics and scoring
- `MarketplaceManager`: NFT marketplace functionality

### Key Interfaces

- `SDKConfig`: SDK configuration
- `GameConfig`: Game configuration
- `NFTMetadata`: NFT metadata structure
- `TransactionResult`: Transaction response
- `GameState`: Current game state
- `GameScore`: Player score data
- `GameReward`: Reward structure
- `Listing`: NFT listing data
- `Offer`: NFT offer data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the CryptoPlay team.

## Roadmap

- [ ] Multi-chain support
- [ ] Advanced game mechanics
- [ ] Social features
- [ ] Tournament system
- [ ] Cross-game compatibility
- [ ] Mobile SDK
- [ ] Unity/Unreal Engine integration 