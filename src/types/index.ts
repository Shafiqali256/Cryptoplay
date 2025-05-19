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