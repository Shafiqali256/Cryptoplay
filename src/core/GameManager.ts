import { ethers } from 'ethers';
import { ContractManager } from './ContractManager';
import { GameState, NFTMetadata, TransactionResult } from '../types';

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

export class GameManager {
  private contractManager: ContractManager;
  private scores: Map<string, GameScore[]> = new Map();
  private rewards: Map<string, GameReward[]> = new Map();

  constructor(contractManager: ContractManager) {
    this.contractManager = contractManager;
  }

  async recordScore(playerAddress: string, score: number, gameId: string): Promise<void> {
    const playerScores = this.scores.get(playerAddress) || [];
    playerScores.push({
      playerAddress,
      score,
      timestamp: Date.now(),
      gameId
    });
    this.scores.set(playerAddress, playerScores);
  }

  async getPlayerScores(playerAddress: string): Promise<GameScore[]> {
    return this.scores.get(playerAddress) || [];
  }

  async getLeaderboard(gameId: string, limit: number = 10): Promise<GameScore[]> {
    const allScores: GameScore[] = [];
    this.scores.forEach(scores => {
      allScores.push(...scores.filter(s => s.gameId === gameId));
    });
    
    return allScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  async distributeReward(
    playerAddress: string,
    reward: GameReward
  ): Promise<TransactionResult> {
    const playerRewards = this.rewards.get(playerAddress) || [];
    playerRewards.push(reward);
    this.rewards.set(playerAddress, playerRewards);

    if (reward.type === 'token') {
      return this.contractManager.transferToken(
        playerAddress,
        reward.amount || '0'
      );
    } else if (reward.type === 'nft' && reward.nftMetadata) {
      return this.contractManager.mintNFT(reward.nftMetadata);
    }

    throw new Error('Invalid reward type or missing required data');
  }

  async getPlayerRewards(playerAddress: string): Promise<GameReward[]> {
    return this.rewards.get(playerAddress) || [];
  }

  async calculatePlayerRank(playerAddress: string, gameId: string): Promise<number> {
    const allScores = await this.getLeaderboard(gameId);
    const playerIndex = allScores.findIndex(
      score => score.playerAddress === playerAddress
    );
    return playerIndex + 1;
  }

  async getPlayerStats(playerAddress: string): Promise<{
    totalGames: number;
    averageScore: number;
    highestScore: number;
    totalRewards: number;
  }> {
    const scores = await this.getPlayerScores(playerAddress);
    const rewards = await this.getPlayerRewards(playerAddress);

    const totalGames = scores.length;
    const averageScore = scores.reduce((acc, curr) => acc + curr.score, 0) / totalGames;
    const highestScore = Math.max(...scores.map(s => s.score));
    const totalRewards = rewards.length;

    return {
      totalGames,
      averageScore,
      highestScore,
      totalRewards
    };
  }
} 