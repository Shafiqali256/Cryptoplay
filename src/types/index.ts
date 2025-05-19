export interface WalletConfig {
  privateKey: string;
  provider: {
    network: 'mainnet' | 'testnet';
    apiKey: string;
  };
}

export interface GameConfig {
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

export interface NFTMetadata {
  name: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  image?: string;
}

export interface TransactionResult {
  hash: string;
  blockNumber: number;
  from: string;
  to: string;
  status: boolean;
}

export interface GameState {
  wallet: {
    address: string;
    balance: string;
  };
  tokens: {
    balance: string;
    symbol: string;
  };
  nfts: Array<{
    id: number;
    metadata: NFTMetadata;
  }>;
}

export interface SDKConfig {
  wallet: WalletConfig;
  config: GameConfig;
}

export interface EventSubscription {
  unsubscribe: () => void;
}

export interface NFTMintedEvent {
  tokenId: number;
  owner: string;
  metadata: NFTMetadata;
  blockNumber: number;
  transactionHash: string;
}

export interface TokenTransferEvent {
  from: string;
  to: string;
  amount: string;
  blockNumber: number;
  transactionHash: string;
}

export interface NFTTransferEvent {
  from: string;
  to: string;
  tokenId: number;
  blockNumber: number;
  transactionHash: string;
}

export interface GameScore {
  playerAddress: string;
  score: number;
  timestamp: number;
  gameId: string;
}

export interface GameReward {
  type: 'token' | 'nft';
  amount?: string;
  nftMetadata?: NFTMetadata;
  gameId: string;
}

export interface Listing {
  tokenId: number;
  seller: string;
  price: string;
  timestamp: number;
  status: 'active' | 'sold' | 'cancelled';
}

export interface Offer {
  tokenId: number;
  buyer: string;
  price: string;
  timestamp: number;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
} 