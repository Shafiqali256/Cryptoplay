import { ethers } from 'ethers';
import { ContractManager } from './ContractManager';
import { NFTMetadata, TransactionResult } from '../types';

export interface EventSubscription {
  unsubscribe: () => void;
}

export interface NFTMintedEvent {
  tokenId: number;
  owner: string;
  metadata: NFTMetadata;
}

export interface TokenTransferEvent {
  from: string;
  to: string;
  amount: string;
}

export interface NFTTransferEvent {
  from: string;
  to: string;
  tokenId: number;
}

export class EventManager {
  private contractManager: ContractManager;

  constructor(contractManager: ContractManager) {
    this.contractManager = contractManager;
  }

  onNFTMinted(callback: (event: NFTMintedEvent) => void): EventSubscription {
    const nftContract = this.contractManager.getNFTContract();
    if (!nftContract) {
      throw new Error('NFT contract not deployed');
    }

    const filter = nftContract.filters.Transfer(null, null, null);
    const listener = async (from: string, to: string, tokenId: ethers.BigNumber) => {
      const metadata = await this.contractManager.getNFTMetadata(tokenId.toNumber());
      callback({
        tokenId: tokenId.toNumber(),
        owner: to,
        metadata
      });
    };

    nftContract.on(filter, listener);

    return {
      unsubscribe: () => {
        nftContract.off(filter, listener);
      }
    };
  }

  onTokenTransfer(callback: (event: TokenTransferEvent) => void): EventSubscription {
    const tokenContract = this.contractManager.getTokenContract();
    if (!tokenContract) {
      throw new Error('Token contract not deployed');
    }

    const filter = tokenContract.filters.Transfer(null, null, null);
    const listener = async (from: string, to: string, amount: ethers.BigNumber) => {
      callback({
        from,
        to,
        amount: ethers.utils.formatEther(amount)
      });
    };

    tokenContract.on(filter, listener);

    return {
      unsubscribe: () => {
        tokenContract.off(filter, listener);
      }
    };
  }

  onNFTTransfer(callback: (event: NFTTransferEvent) => void): EventSubscription {
    const nftContract = this.contractManager.getNFTContract();
    if (!nftContract) {
      throw new Error('NFT contract not deployed');
    }

    const filter = nftContract.filters.Transfer(null, null, null);
    const listener = async (from: string, to: string, tokenId: ethers.BigNumber) => {
      callback({
        from,
        to,
        tokenId: tokenId.toNumber()
      });
    };

    nftContract.on(filter, listener);

    return {
      unsubscribe: () => {
        nftContract.off(filter, listener);
      }
    };
  }

  async getPastNFTMints(fromBlock: number, toBlock: number): Promise<NFTMintedEvent[]> {
    const nftContract = this.contractManager.getNFTContract();
    if (!nftContract) {
      throw new Error('NFT contract not deployed');
    }

    const filter = nftContract.filters.Transfer(null, null, null);
    const events = await nftContract.queryFilter(filter, fromBlock, toBlock);
    
    return Promise.all(
      events.map(async (event) => {
        const tokenId = event.args?.tokenId;
        const metadata = await this.contractManager.getNFTMetadata(tokenId.toNumber());
        return {
          tokenId: tokenId.toNumber(),
          owner: event.args?.to,
          metadata
        };
      })
    );
  }

  async getPastTokenTransfers(fromBlock: number, toBlock: number): Promise<TokenTransferEvent[]> {
    const tokenContract = this.contractManager.getTokenContract();
    if (!tokenContract) {
      throw new Error('Token contract not deployed');
    }

    const filter = tokenContract.filters.Transfer(null, null, null);
    const events = await tokenContract.queryFilter(filter, fromBlock, toBlock);
    
    return events.map((event) => ({
      from: event.args?.from,
      to: event.args?.to,
      amount: ethers.utils.formatEther(event.args?.value)
    }));
  }

  async getPastNFTTransfers(fromBlock: number, toBlock: number): Promise<NFTTransferEvent[]> {
    const nftContract = this.contractManager.getNFTContract();
    if (!nftContract) {
      throw new Error('NFT contract not deployed');
    }

    const filter = nftContract.filters.Transfer(null, null, null);
    const events = await nftContract.queryFilter(filter, fromBlock, toBlock);
    
    return events.map((event) => ({
      from: event.args?.from,
      to: event.args?.to,
      tokenId: event.args?.tokenId.toNumber()
    }));
  }
} 