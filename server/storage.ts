import { 
  coins, type Coin, type InsertCoin, 
  commandInteractions, type CommandInteraction, type InsertCommandInteraction 
} from "@shared/schema";

export interface IStorage {
  // Coin rankings
  getCoins(): Promise<Coin[]>;
  getCoinByRank(rank: number): Promise<Coin | undefined>;
  createCoin(coin: InsertCoin): Promise<Coin>;
  updateCoin(id: number, coin: Partial<InsertCoin>): Promise<Coin | undefined>;
  resetCoins(): Promise<void>;
  
  // Command interactions
  getCommandInteractions(): Promise<CommandInteraction[]>;
  createCommandInteraction(interaction: InsertCommandInteraction): Promise<CommandInteraction>;
}

export class MemStorage implements IStorage {
  private coinsData: Map<number, Coin>;
  private commandInteractionsData: Map<number, CommandInteraction>;
  private coinId: number;
  private interactionId: number;

  constructor() {
    this.coinsData = new Map();
    this.commandInteractionsData = new Map();
    this.coinId = 1;
    this.interactionId = 1;
    
    // Initialize with sample data for development purposes
    this.initializeDevData();
  }

  private initializeDevData() {
    // This is only for development purposes to have some initial data
    const sampleCoins: InsertCoin[] = [
      {
        name: "BabyLlama",
        symbol: "$BLLAMA",
        price: 0.00384,
        percentChange24h: 12.4,
        marketCap: 28500000,
        rank: 1,
        imageUrl: "https://via.placeholder.com/40?text=BLLAMA",
      },
      {
        name: "AlpacaDAO",
        symbol: "$PACA",
        price: 0.00219,
        percentChange24h: 5.2,
        marketCap: 18300000,
        rank: 2,
        imageUrl: "https://via.placeholder.com/40?text=PACA",
      },
      {
        name: "CamelCoin",
        symbol: "$CMEL",
        price: 0.01084,
        percentChange24h: -2.8,
        marketCap: 15100000,
        rank: 3,
        imageUrl: "https://via.placeholder.com/40?text=CMEL",
      },
      {
        name: "VicuñaFi",
        symbol: "$VICU",
        price: 0.00073,
        percentChange24h: 1.4,
        marketCap: 9700000,
        rank: 4,
        imageUrl: "https://via.placeholder.com/40?text=VICU",
      },
      {
        name: "GuanacoSwap",
        symbol: "$GUAN",
        price: 0.00651,
        percentChange24h: -8.3,
        marketCap: 7200000,
        rank: 5,
        imageUrl: "https://via.placeholder.com/40?text=GUAN",
      },
      {
        name: "LlamaETF",
        symbol: "$LETF",
        price: 0.04233,
        percentChange24h: 9.7,
        marketCap: 32500000,
        rank: 6,
        imageUrl: "https://via.placeholder.com/40?text=LETF",
      },
      {
        name: "DramaLlama",
        symbol: "$DRAMA",
        price: 0.00097,
        percentChange24h: -4.1,
        marketCap: 4300000,
        rank: 7,
        imageUrl: "https://via.placeholder.com/40?text=DRAMA",
      },
      {
        name: "LamaSwap",
        symbol: "$LAMA",
        price: 0.02153,
        percentChange24h: 3.6,
        marketCap: 22100000,
        rank: 8,
        imageUrl: "https://via.placeholder.com/40?text=LAMA",
      },
      {
        name: "CaravanCoin",
        symbol: "$CRVN",
        price: 0.00512,
        percentChange24h: 0.9,
        marketCap: 6700000,
        rank: 9,
        imageUrl: "https://via.placeholder.com/40?text=CRVN",
      },
      {
        name: "PackAlgo",
        symbol: "$PACK",
        price: 0.01324,
        percentChange24h: 7.3,
        marketCap: 11900000,
        rank: 10,
        imageUrl: "https://via.placeholder.com/40?text=PACK",
      }
    ];
    
    // Add sample coins
    sampleCoins.forEach(coin => this.createCoin(coin));
  }

  // Coin methods
  async getCoins(): Promise<Coin[]> {
    return Array.from(this.coinsData.values())
      .sort((a, b) => a.rank - b.rank);
  }

  async getCoinByRank(rank: number): Promise<Coin | undefined> {
    return Array.from(this.coinsData.values())
      .find(coin => coin.rank === rank);
  }

  async createCoin(insertCoin: InsertCoin): Promise<Coin> {
    const id = this.coinId++;
    const now = new Date();
    
    // Ensure all properties are properly typed
    const coin: Coin = { 
      id,
      name: insertCoin.name,
      symbol: insertCoin.symbol,
      price: insertCoin.price,
      percentChange24h: insertCoin.percentChange24h,
      marketCap: insertCoin.marketCap,
      rank: insertCoin.rank,
      imageUrl: insertCoin.imageUrl || null,
      lastUpdated: now
    };
    
    this.coinsData.set(id, coin);
    return coin;
  }

  async updateCoin(id: number, updates: Partial<InsertCoin>): Promise<Coin | undefined> {
    const coin = this.coinsData.get(id);
    if (!coin) return undefined;
    
    const now = new Date();
    const updatedCoin: Coin = { 
      ...coin, 
      ...updates, 
      lastUpdated: now
    };
    
    this.coinsData.set(id, updatedCoin);
    return updatedCoin;
  }
  
  async resetCoins(): Promise<void> {
    // Clear all existing coins
    this.coinsData.clear();
    this.coinId = 1; // Reset the ID counter
  }

  // Command interaction methods
  async getCommandInteractions(): Promise<CommandInteraction[]> {
    return Array.from(this.commandInteractionsData.values())
      .sort((a, b) => (b.timestamp?.getTime() ?? 0) - (a.timestamp?.getTime() ?? 0));
  }

  async createCommandInteraction(interaction: InsertCommandInteraction): Promise<CommandInteraction> {
    const id = this.interactionId++;
    const now = new Date();
    
    // Ensure all properties are properly typed
    const commandInteraction: CommandInteraction = { 
      id,
      commandName: interaction.commandName,
      userId: interaction.userId,
      guildId: interaction.guildId || null,
      channelId: interaction.channelId,
      timestamp: now,
      success: interaction.success,
      errorMessage: interaction.errorMessage || null
    };
    
    this.commandInteractionsData.set(id, commandInteraction);
    return commandInteraction;
  }
}

export const storage = new MemStorage();
