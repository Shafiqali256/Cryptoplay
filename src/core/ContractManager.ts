import { ethers } from 'ethers';
import { CryptoPlayWallet } from './Wallet';
import { GameConfig, NFTMetadata, TransactionResult } from '../types';
import GameTokenABI from '../contracts/abis/GameToken.json';
import GameNFTABI from '../contracts/abis/GameNFT.json';

export class ContractManager {
  private wallet: CryptoPlayWallet;
  private config: GameConfig;
  private tokenContract: ethers.Contract | null = null;
  private nftContract: ethers.Contract | null = null;

  constructor(wallet: CryptoPlayWallet, config: GameConfig) {
    this.wallet = wallet;
    this.config = config;
  }

  getTokenContract(): ethers.Contract | null {
    return this.tokenContract;
  }

  getNFTContract(): ethers.Contract | null {
    return this.nftContract;
  }

  async deployContracts(): Promise<{
    tokenAddress: string;
    nftAddress: string;
  }> {
    // Deploy token contract
    const tokenFactory = new ethers.ContractFactory(
      GameTokenABI,
      this.config.token.initialSupply,
      this.wallet.getSigner()
    );
    this.tokenContract = await tokenFactory.deploy(
      this.config.token.name,
      this.config.token.symbol,
      this.config.token.initialSupply
    );
    await this.tokenContract.deployed();

    // Deploy NFT contract
    const nftFactory = new ethers.ContractFactory(
      GameNFTABI,
      this.config.nft.baseURI,
      this.wallet.getSigner()
    );
    this.nftContract = await nftFactory.deploy(
      this.config.nft.name,
      this.config.nft.symbol,
      this.config.nft.baseURI,
      this.config.nft.maxSupply
    );
    await this.nftContract.deployed();

    return {
      tokenAddress: this.tokenContract.address,
      nftAddress: this.nftContract.address
    };
  }

  async mintNFT(metadata: NFTMetadata): Promise<TransactionResult> {
    if (!this.nftContract) {
      throw new Error('NFT contract not deployed');
    }

    try {
      const tx = await this.nftContract.mint(
        this.wallet.address,
        JSON.stringify(metadata)
      );
      const receipt = await tx.wait();

      return {
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: receipt.from,
        to: receipt.to,
        status: receipt.status === 1
      };
    } catch (error) {
      throw new Error(`Failed to mint NFT: ${error.message}`);
    }
  }

  async transferToken(to: string, amount: string): Promise<TransactionResult> {
    if (!this.tokenContract) {
      throw new Error('Token contract not deployed');
    }

    try {
      const tx = await this.tokenContract.transfer(
        to,
        ethers.utils.parseEther(amount)
      );
      const receipt = await tx.wait();

      return {
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: receipt.from,
        to: receipt.to,
        status: receipt.status === 1
      };
    } catch (error) {
      throw new Error(`Failed to transfer tokens: ${error.message}`);
    }
  }

  async approveToken(spender: string, amount: string): Promise<TransactionResult> {
    if (!this.tokenContract) {
      throw new Error('Token contract not deployed');
    }

    try {
      const tx = await this.tokenContract.approve(
        spender,
        ethers.utils.parseEther(amount)
      );
      const receipt = await tx.wait();

      return {
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: receipt.from,
        to: receipt.to,
        status: receipt.status === 1
      };
    } catch (error) {
      throw new Error(`Failed to approve tokens: ${error.message}`);
    }
  }

  async getTokenBalance(address: string): Promise<string> {
    if (!this.tokenContract) {
      throw new Error('Token contract not deployed');
    }

    const balance = await this.tokenContract.balanceOf(address);
    return ethers.utils.formatEther(balance);
  }

  async getNFTBalance(address: string): Promise<number> {
    if (!this.nftContract) {
      throw new Error('NFT contract not deployed');
    }

    const balance = await this.nftContract.balanceOf(address);
    return balance.toNumber();
  }

  async getNFTMetadata(tokenId: number): Promise<NFTMetadata> {
    if (!this.nftContract) {
      throw new Error('NFT contract not deployed');
    }

    const uri = await this.nftContract.tokenURI(tokenId);
    return JSON.parse(uri) as NFTMetadata;
  }

  async getNFTsByOwner(address: string): Promise<Array<{ id: number; metadata: NFTMetadata }>> {
    if (!this.nftContract) {
      throw new Error('NFT contract not deployed');
    }

    const balance = await this.nftContract.balanceOf(address);
    const nfts = [];

    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await this.nftContract.tokenOfOwnerByIndex(address, i);
      const metadata = await this.getNFTMetadata(tokenId.toNumber());

      nfts.push({
        id: tokenId.toNumber(),
        metadata
      });
    }

    return nfts;
  }

  async transferNFT(to: string, tokenId: number): Promise<TransactionResult> {
    if (!this.nftContract) {
      throw new Error('NFT contract not deployed');
    }

    try {
      const tx = await this.nftContract.transferFrom(
        this.wallet.address,
        to,
        tokenId
      );
      const receipt = await tx.wait();

      return {
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: receipt.from,
        to: receipt.to,
        status: receipt.status === 1
      };
    } catch (error) {
      throw new Error(`Failed to transfer NFT: ${error.message}`);
    }
  }

  async approveNFT(operator: string, tokenId: number): Promise<TransactionResult> {
    if (!this.nftContract) {
      throw new Error('NFT contract not deployed');
    }

    try {
      const tx = await this.nftContract.approve(operator, tokenId);
      const receipt = await tx.wait();

      return {
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: receipt.from,
        to: receipt.to,
        status: receipt.status === 1
      };
    } catch (error) {
      throw new Error(`Failed to approve NFT: ${error.message}`);
    }
  }

  async setApprovalForAll(operator: string, approved: boolean): Promise<TransactionResult> {
    if (!this.nftContract) {
      throw new Error('NFT contract not deployed');
    }

    try {
      const tx = await this.nftContract.setApprovalForAll(operator, approved);
      const receipt = await tx.wait();

      return {
        hash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        from: receipt.from,
        to: receipt.to,
        status: receipt.status === 1
      };
    } catch (error) {
      throw new Error(`Failed to set approval for all: ${error.message}`);
    }
  }
} 