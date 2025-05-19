import { ethers } from 'ethers';
import { CryptoPlayWallet } from './Wallet';
import { ContractManager } from './ContractManager';
import { EventManager, EventSubscription, NFTMintedEvent, TokenTransferEvent, NFTTransferEvent } from './EventManager';
import { GameManager, GameScore, GameReward } from './GameManager';
import { MarketplaceManager, Listing, Offer } from './MarketplaceManager';
import { GameConfig, NFTMetadata, TransactionResult, GameState, SDKConfig } from '../types';

export class CryptoPlay {
  private wallet: CryptoPlayWallet;
  private config: GameConfig;
  private contractManager: ContractManager;
  private eventManager: EventManager;
  private gameManager: GameManager;
  private marketplaceManager: MarketplaceManager;
  private contracts: {
    tokenAddress: string;
    nftAddress: string;
  } | null = null;

  constructor(config: SDKConfig) {
    this.wallet = new CryptoPlayWallet(config.wallet);
    this.config = config.config;
    this.contractManager = new ContractManager(this.wallet, this.config);
    this.eventManager = new EventManager(this.contractManager);
    this.gameManager = new GameManager(this.contractManager);
    this.marketplaceManager = new MarketplaceManager(this.contractManager);
  }

  async initialize(): Promise<void> {
    await this.wallet.connect();
    this.contracts = await this.contractManager.deployContracts();
  }

  async mintNFT(metadata: NFTMetadata): Promise<TransactionResult> {
    return this.contractManager.mintNFT(metadata);
  }

  async transferToken(to: string, amount: string): Promise<TransactionResult> {
    return this.contractManager.transferToken(to, amount);
  }

  async approveToken(spender: string, amount: string): Promise<TransactionResult> {
    return this.contractManager.approveToken(spender, amount);
  }

  async getGameState(): Promise<GameState> {
    const balance = await this.wallet.getBalance();
    const tokenBalance = await this.contractManager.getTokenBalance(this.wallet.address);
    const nfts = await this.contractManager.getNFTsByOwner(this.wallet.address);

    return {
      wallet: {
        address: this.wallet.address,
        balance
      },
      tokens: {
        balance: tokenBalance,
        symbol: this.config.token.symbol
      },
      nfts
    };
  }

  async getNFTBalance(address: string): Promise<number> {
    return this.contractManager.getNFTBalance(address);
  }

  async getNFTMetadata(tokenId: number): Promise<NFTMetadata> {
    return this.contractManager.getNFTMetadata(tokenId);
  }

  async getNFTsByOwner(address: string): Promise<Array<{ id: number; metadata: NFTMetadata }>> {
    return this.contractManager.getNFTsByOwner(address);
  }

  async transferNFT(to: string, tokenId: number): Promise<TransactionResult> {
    return this.contractManager.transferNFT(to, tokenId);
  }

  async approveNFT(operator: string, tokenId: number): Promise<TransactionResult> {
    return this.contractManager.approveNFT(operator, tokenId);
  }

  async setApprovalForAll(operator: string, approved: boolean): Promise<TransactionResult> {
    return this.contractManager.setApprovalForAll(operator, approved);
  }

  onNFTMinted(callback: (event: NFTMintedEvent) => void): EventSubscription {
    return this.eventManager.onNFTMinted(callback);
  }

  onTokenTransfer(callback: (event: TokenTransferEvent) => void): EventSubscription {
    return this.eventManager.onTokenTransfer(callback);
  }

  onNFTTransfer(callback: (event: NFTTransferEvent) => void): EventSubscription {
    return this.eventManager.onNFTTransfer(callback);
  }

  async getPastNFTMints(fromBlock: number, toBlock: number): Promise<NFTMintedEvent[]> {
    return this.eventManager.getPastNFTMints(fromBlock, toBlock);
  }

  async getPastTokenTransfers(fromBlock: number, toBlock: number): Promise<TokenTransferEvent[]> {
    return this.eventManager.getPastTokenTransfers(fromBlock, toBlock);
  }

  async getPastNFTTransfers(fromBlock: number, toBlock: number): Promise<NFTTransferEvent[]> {
    return this.eventManager.getPastNFTTransfers(fromBlock, toBlock);
  }

  getContractAddresses(): { tokenAddress: string; nftAddress: string } | null {
    return this.contracts;
  }

  // Game Management Methods
  async recordScore(score: number, gameId: string): Promise<void> {
    return this.gameManager.recordScore(this.wallet.address, score, gameId);
  }

  async getPlayerScores(): Promise<GameScore[]> {
    return this.gameManager.getPlayerScores(this.wallet.address);
  }

  async getLeaderboard(gameId: string, limit?: number): Promise<GameScore[]> {
    return this.gameManager.getLeaderboard(gameId, limit);
  }

  async distributeReward(reward: GameReward): Promise<TransactionResult> {
    return this.gameManager.distributeReward(this.wallet.address, reward);
  }

  async getPlayerRewards(): Promise<GameReward[]> {
    return this.gameManager.getPlayerRewards(this.wallet.address);
  }

  async calculatePlayerRank(gameId: string): Promise<number> {
    return this.gameManager.calculatePlayerRank(this.wallet.address, gameId);
  }

  async getPlayerStats(): Promise<{
    totalGames: number;
    averageScore: number;
    highestScore: number;
    totalRewards: number;
  }> {
    return this.gameManager.getPlayerStats(this.wallet.address);
  }

  // Marketplace Methods
  async createListing(tokenId: number, price: string): Promise<void> {
    return this.marketplaceManager.createListing(
      tokenId,
      price,
      this.wallet.address
    );
  }

  async cancelListing(tokenId: number): Promise<void> {
    return this.marketplaceManager.cancelListing(tokenId);
  }

  async buyNFT(tokenId: number): Promise<TransactionResult> {
    return this.marketplaceManager.buyNFT(tokenId, this.wallet.address);
  }

  async createOffer(tokenId: number, price: string): Promise<void> {
    return this.marketplaceManager.createOffer(
      tokenId,
      price,
      this.wallet.address
    );
  }

  async acceptOffer(tokenId: number, buyer: string): Promise<TransactionResult> {
    return this.marketplaceManager.acceptOffer(tokenId, buyer);
  }

  async rejectOffer(tokenId: number, buyer: string): Promise<void> {
    return this.marketplaceManager.rejectOffer(tokenId, buyer);
  }

  async getActiveListings(): Promise<Listing[]> {
    return this.marketplaceManager.getActiveListings();
  }

  async getTokenOffers(tokenId: number): Promise<Offer[]> {
    return this.marketplaceManager.getTokenOffers(tokenId);
  }

  async getListingDetails(tokenId: number): Promise<Listing | null> {
    return this.marketplaceManager.getListingDetails(tokenId);
  }

  async getMarketplaceStats(): Promise<{
    totalListings: number;
    activeListings: number;
    totalSales: number;
    totalVolume: string;
  }> {
    return this.marketplaceManager.getMarketplaceStats();
  }
} 