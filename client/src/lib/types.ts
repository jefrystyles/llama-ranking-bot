export interface Coin {
  id: number;
  name: string;
  symbol: string;
  price: number;
  percentChange24h: number;
  marketCap: number;
  rank: number;
  imageUrl?: string;
  lastUpdated?: Date;
}

export interface CommandInteraction {
  id: number;
  commandName: string;
  userId: string;
  guildId?: string;
  channelId: string;
  timestamp?: Date;
  success: boolean;
  errorMessage?: string | null;
}
