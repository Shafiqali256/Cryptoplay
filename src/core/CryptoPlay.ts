import { ethers } from 'ethers';
import { CryptoPlayWallet } from './Wallet';
import { GameConfig, NFTMetadata, TransactionResult, GameState, SDKConfig } from '../types';

export class CryptoPlay {
  private wallet: CryptoPlayWallet;
  private config: GameConfig;
  private tokenContract: ethers.Contract | null = null;
  private nftContract: ethers.Contract | null = null;

  constructor(config: SDKConfig) {
    this.wallet = new CryptoPlayWallet(config.wallet);
    this.config = config.config;
  }

  async initialize(): Promise<void> {
    await this.wallet.connect();
    await this.deployContracts();
  }

  private async deployContracts(): Promise<void> {
    // Deploy token contract
    const tokenFactory = new ethers.ContractFactory(
      ['function mint(address to, uint256 amount)'],
      this.config.token.initialSupply,
      this.wallet.getSigner()
    );
    this.tokenContract = await tokenFactory.deploy();

    // Deploy NFT contract
    const nftFactory = new ethers.ContractFactory(
      ['function mint(address to, string memory uri)'],
      this.config.nft.baseURI,
      this.wallet.getSigner()
    );
    this.nftContract = await nftFactory.deploy();
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

  async getGameState(): Promise<GameState> {
    const balance = await this.wallet.getBalance();
    const tokenBalance = await this.getTokenBalance();
    const nfts = await this.getNFTs();

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

  private async getTokenBalance(): Promise<string> {
    if (!this.tokenContract) {
      throw new Error('Token contract not deployed');
    }

    const balance = await this.tokenContract.balanceOf(this.wallet.address);
    return ethers.utils.formatEther(balance);
  }

  private async getNFTs(): Promise<Array<{ id: number; metadata: NFTMetadata }>> {
    if (!this.nftContract) {
      throw new Error('NFT contract not deployed');
    }

    const balance = await this.nftContract.balanceOf(this.wallet.address);
    const nfts = [];

    for (let i = 0; i < balance.toNumber(); i++) {
      const tokenId = await this.nftContract.tokenOfOwnerByIndex(
        this.wallet.address,
        i
      );
      const uri = await this.nftContract.tokenURI(tokenId);
      const metadata = JSON.parse(uri) as NFTMetadata;

      nfts.push({
        id: tokenId.toNumber(),
        metadata
      });
    }

    return nfts;
  }
} 