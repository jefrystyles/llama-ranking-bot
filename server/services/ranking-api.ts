import axios from 'axios';
import { InsertCoin, Coin } from '@shared/schema';
import { storage } from '../storage';

export class RankingService {
  private apiUrl: string;
  
  constructor() {
    // Get the API URL from environment variable or use a fallback
    this.apiUrl = process.env.RANKING_API_URL || 'https://n8n-n8n.hoc1tz.easypanel.host/webhook/ca40138d-c682-4de0-b0f7-e85a04317fc8';
  }
  
  /**
   * Fetches ranking data from the external webhook
   */
  async fetchRankingsFromApi(): Promise<Coin[]> {
    try {
      let response;
      // First try a GET request
      try {
        response = await axios.get(this.apiUrl, {
          timeout: 5000, // 5 second timeout
          headers: {
            'Accept': 'application/json',
          }
        });
      } catch (error: any) {
        console.log('GET request failed, trying POST:', error.message);
        // If GET fails, try POST with the same format the Discord bot is using
        response = await axios.post(this.apiUrl, {
          username: 'RankingBot',
          command: 'ranking'
        }, {
          timeout: 5000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
      }
      
      if (response.status !== 200) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      let data = response.data;
      
      // Some APIs might return { data: [...] } structure
      if (data && data.data && Array.isArray(data.data)) {
        data = data.data;
      } else if (data && !Array.isArray(data)) {
        // Try to extract an array if we can find one
        const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
        if (possibleArrays.length > 0) {
          data = possibleArrays[0];
        } else {
          // If no array found, wrap the object in an array if it has expected properties
          const hasCoinProps = data && typeof data === 'object' && 
            (data.name || data.symbol || data.price);
          if (hasCoinProps) {
            data = [data];
          } else {
            throw new Error('Invalid API response format: could not find coin data');
          }
        }
      }
      
      // Map the API response to our coin schema
      const coins: InsertCoin[] = data.map((item: any, index: number) => {
        return {
          name: item.name || `Unknown ${index}`,
          symbol: item.symbol || `$UNK${index}`,
          price: parseFloat(item.price) || 0,
          percentChange24h: parseFloat(item.percent_change_24h) || 0,
          marketCap: parseFloat(item.market_cap) || 0,
          rank: item.rank || index + 1,
          imageUrl: item.image_url || `https://via.placeholder.com/40?text=${index+1}`,
        };
      });
      
      // Update storage with the new data
      const storedCoins: Coin[] = [];
      
      // Clear existing coins from storage
      await storage.resetCoins();
      
      // Store the new coins with proper ranks
      for (let index = 0; index < coins.length; index++) {
        const coin = coins[index];
        // Make sure each coin has a unique rank
        const coinWithRank = {
          ...coin,
          rank: index + 1 // Assign sequential ranks
        };
        const stored = await storage.createCoin(coinWithRank);
        storedCoins.push(stored);
      }
      
      return storedCoins;
    } catch (error: any) {
      console.error('Error fetching rankings from API:', error);
      
      // Log additional details if available
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      }
      
      // For demo purposes, if the API fails, return stored data
      const storedCoins = await storage.getCoins();
      if (storedCoins.length > 0) {
        console.log('Falling back to stored coins data');
        return storedCoins;
      }
      
      // If we have no stored data, provide a more helpful error message
      let errorMessage = '';
      
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        errorMessage = `Webhook connection failed: The n8n webhook at ${this.apiUrl} is not currently active or reachable. Please ensure the n8n workflow is running and try again.`;
      } else if (error.response && error.response.status === 404) {
        errorMessage = `Webhook not found: The webhook URL (${this.apiUrl}) is not registered or may have been deleted. Please verify the webhook URL in n8n.`;
      } else if (error.code === 'ETIMEDOUT' || error.code === 'TIMEOUT') {
        errorMessage = `Webhook timeout: The n8n webhook did not respond in time. This often happens when the n8n service is under load or not fully initialized.`;
      } else {
        errorMessage = `Unable to fetch coin rankings: ${error.message}. Please ensure the n8n webhook (${this.apiUrl.split('/').slice(0, 3).join('/')}/...) is properly configured.`;
      }
      
      throw new Error(errorMessage);
    }
  }
  
  /**
   * Gets the current rankings, trying API first then falling back to stored data
   */
  async getRankings(): Promise<Coin[]> {
    try {
      // Try to fetch fresh data from API
      return await this.fetchRankingsFromApi();
    } catch (error) {
      console.error('Error fetching fresh rankings, falling back to stored data:', error);
      
      // Fallback to stored data
      const storedCoins = await storage.getCoins();
      if (storedCoins.length > 0) {
        return storedCoins;
      }
      
      // If we have no stored data either, throw the original error
      throw new Error('Unable to retrieve ranking data: ' + 
        (error instanceof Error ? error.message : 'Unknown error'));
    }
  }
}
