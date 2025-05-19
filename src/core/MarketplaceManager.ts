import { ethers } from 'ethers';
import { ContractManager } from './ContractManager';
import { NFTMetadata, TransactionResult } from '../types';

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

export class MarketplaceManager {
  private contractManager: ContractManager;
  private listings: Map<number, Listing> = new Map();
  private offers: Map<number, Offer[]> = new Map();

  constructor(contractManager: ContractManager) {
    this.contractManager = contractManager;
  }

  async createListing(
    tokenId: number,
    price: string,
    seller: string
  ): Promise<void> {
    // First approve the marketplace contract to handle the NFT
    await this.contractManager.approveNFT(
      this.contractManager.getNFTContract()?.address || '',
      tokenId
    );

    this.listings.set(tokenId, {
      tokenId,
      seller,
      price,
      timestamp: Date.now(),
      status: 'active'
    });
  }

  async cancelListing(tokenId: number): Promise<void> {
    const listing = this.listings.get(tokenId);
    if (!listing) {
      throw new Error('Listing not found');
    }

    listing.status = 'cancelled';
    this.listings.set(tokenId, listing);
  }

  async buyNFT(tokenId: number, buyer: string): Promise<TransactionResult> {
    const listing = this.listings.get(tokenId);
    if (!listing || listing.status !== 'active') {
      throw new Error('Listing not found or not active');
    }

    // Transfer tokens from buyer to seller
    await this.contractManager.transferToken(listing.seller, listing.price);

    // Transfer NFT from seller to buyer
    const tx = await this.contractManager.transferNFT(buyer, tokenId);

    // Update listing status
    listing.status = 'sold';
    this.listings.set(tokenId, listing);

    return tx;
  }

  async createOffer(
    tokenId: number,
    price: string,
    buyer: string
  ): Promise<void> {
    const listing = this.listings.get(tokenId);
    if (!listing || listing.status !== 'active') {
      throw new Error('Listing not found or not active');
    }

    const tokenOffers = this.offers.get(tokenId) || [];
    tokenOffers.push({
      tokenId,
      buyer,
      price,
      timestamp: Date.now(),
      status: 'pending'
    });
    this.offers.set(tokenId, tokenOffers);
  }

  async acceptOffer(tokenId: number, buyer: string): Promise<TransactionResult> {
    const offers = this.offers.get(tokenId) || [];
    const offer = offers.find(o => o.buyer === buyer && o.status === 'pending');
    if (!offer) {
      throw new Error('Offer not found or not pending');
    }

    // Transfer tokens from buyer to seller
    const listing = this.listings.get(tokenId);
    if (!listing) {
      throw new Error('Listing not found');
    }

    await this.contractManager.transferToken(listing.seller, offer.price);

    // Transfer NFT from seller to buyer
    const tx = await this.contractManager.transferNFT(buyer, tokenId);

    // Update offer and listing status
    offer.status = 'accepted';
    listing.status = 'sold';
    this.offers.set(tokenId, offers);
    this.listings.set(tokenId, listing);

    return tx;
  }

  async rejectOffer(tokenId: number, buyer: string): Promise<void> {
    const offers = this.offers.get(tokenId) || [];
    const offer = offers.find(o => o.buyer === buyer && o.status === 'pending');
    if (!offer) {
      throw new Error('Offer not found or not pending');
    }

    offer.status = 'rejected';
    this.offers.set(tokenId, offers);
  }

  async getActiveListings(): Promise<Listing[]> {
    return Array.from(this.listings.values()).filter(
      listing => listing.status === 'active'
    );
  }

  async getTokenOffers(tokenId: number): Promise<Offer[]> {
    return this.offers.get(tokenId) || [];
  }

  async getListingDetails(tokenId: number): Promise<Listing | null> {
    return this.listings.get(tokenId) || null;
  }

  async getMarketplaceStats(): Promise<{
    totalListings: number;
    activeListings: number;
    totalSales: number;
    totalVolume: string;
  }> {
    const listings = Array.from(this.listings.values());
    const activeListings = listings.filter(l => l.status === 'active');
    const soldListings = listings.filter(l => l.status === 'sold');

    const totalVolume = soldListings.reduce(
      (acc, curr) => acc + parseFloat(curr.price),
      0
    ).toString();

    return {
      totalListings: listings.length,
      activeListings: activeListings.length,
      totalSales: soldListings.length,
      totalVolume
    };
  }
} 