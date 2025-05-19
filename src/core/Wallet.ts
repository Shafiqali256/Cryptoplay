import { ethers } from 'ethers';
import { WalletConfig } from '../types';

export class CryptoPlayWallet {
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  public address: string;

  constructor(config: WalletConfig) {
    const network = config.provider.network === 'mainnet' 
      ? 'mainnet' 
      : 'goerli';
    
    this.provider = new ethers.providers.InfuraProvider(
      network,
      config.provider.apiKey
    );
    
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
    this.address = this.wallet.address;
  }

  async connect(): Promise<void> {
    try {
      await this.wallet.connect(this.provider);
    } catch (error) {
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  async getBalance(): Promise<string> {
    try {
      const balance = await this.wallet.getBalance();
      return ethers.utils.formatEther(balance);
    } catch (error) {
      throw new Error(`Failed to get balance: ${error.message}`);
    }
  }

  async sendTransaction(to: string, value: string): Promise<string> {
    try {
      const tx = await this.wallet.sendTransaction({
        to,
        value: ethers.utils.parseEther(value)
      });
      return tx.hash;
    } catch (error) {
      throw new Error(`Failed to send transaction: ${error.message}`);
    }
  }

  getSigner(): ethers.Signer {
    return this.wallet;
  }

  getProvider(): ethers.providers.JsonRpcProvider {
    return this.provider;
  }
} 