import { ethers } from 'ethers';
import { CryptoPlayWallet } from './Wallet';
import { ContractManager } from './ContractManager';
import { EventManager, EventSubscription, NFTMintedEvent, TokenTransferEvent, NFTTransferEvent } from './EventManager';
import { GameConfig, NFTMetadata, TransactionResult, GameState, SDKConfig } from '../types';

export class CryptoPlay {
  private wallet: CryptoPlayWallet;
  private config: GameConfig;
  private contractManager: ContractManager;
  private eventManager: EventManager;
  private contracts: {
    tokenAddress: string;
    nftAddress: string;
  } | null = null;

  constructor(config: SDKConfig) {
    this.wallet = new CryptoPlayWallet(config.wallet);
    this.config = config.config;
    this.contractManager = new ContractManager(this.wallet, this.config);
    this.eventManager = new EventManager(this.contractManager);
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
} 