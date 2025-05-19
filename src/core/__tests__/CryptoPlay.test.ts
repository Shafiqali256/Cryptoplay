import { CryptoPlay } from '../CryptoPlay';
import { WalletConfig, GameConfig } from '../../types';

describe('CryptoPlay', () => {
  const mockWalletConfig: WalletConfig = {
    privateKey: 'test-private-key',
    provider: {
      network: 'testnet',
      apiKey: 'test-api-key'
    }
  };

  const mockGameConfig: GameConfig = {
    name: 'TestGame',
    description: 'Test game description',
    token: {
      name: 'TestToken',
      symbol: 'TST',
      initialSupply: '1000000000000000000000000'
    },
    nft: {
      name: 'TestNFT',
      symbol: 'TNFT',
      baseURI: 'https://test.com/assets/',
      maxSupply: 1000
    }
  };

  let cryptoPlay: CryptoPlay;

  beforeEach(() => {
    cryptoPlay = new CryptoPlay({
      wallet: mockWalletConfig,
      config: mockGameConfig
    });
  });

  describe('initialize', () => {
    it('should initialize the SDK successfully', async () => {
      await expect(cryptoPlay.initialize()).resolves.not.toThrow();
    });
  });

  describe('mintNFT', () => {
    it('should mint an NFT successfully', async () => {
      const metadata = {
        name: 'Test NFT',
        description: 'Test NFT description',
        attributes: [
          { trait_type: 'Test', value: 'Value' }
        ]
      };

      const result = await cryptoPlay.mintNFT(metadata);
      expect(result).toHaveProperty('hash');
      expect(result).toHaveProperty('status', true);
    });
  });

  describe('getGameState', () => {
    it('should return the current game state', async () => {
      const state = await cryptoPlay.getGameState();
      expect(state).toHaveProperty('wallet');
      expect(state).toHaveProperty('tokens');
      expect(state).toHaveProperty('nfts');
    });
  });
}); 