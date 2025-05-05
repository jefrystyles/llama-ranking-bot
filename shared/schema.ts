import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Coin ranking data model
export const coins = pgTable("coins", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  price: real("price").notNull(),
  percentChange24h: real("percent_change_24h").notNull(),
  marketCap: real("market_cap").notNull(),
  rank: integer("rank").notNull(),
  imageUrl: text("image_url"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const insertCoinSchema = createInsertSchema(coins).omit({
  id: true,
  lastUpdated: true,
});

export type InsertCoin = z.infer<typeof insertCoinSchema>;
export type Coin = typeof coins.$inferSelect;

// Discord slash command interactions
export const commandInteractions = pgTable("command_interactions", {
  id: serial("id").primaryKey(),
  commandName: text("command_name").notNull(),
  userId: text("user_id").notNull(),
  guildId: text("guild_id"),
  channelId: text("channel_id").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  success: boolean("success").notNull(),
  errorMessage: text("error_message"),
});

export const insertCommandInteractionSchema = createInsertSchema(commandInteractions).omit({
  id: true,
  timestamp: true,
});

export type InsertCommandInteraction = z.infer<typeof insertCommandInteractionSchema>;
export type CommandInteraction = typeof commandInteractions.$inferSelect;
