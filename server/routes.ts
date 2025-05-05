import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import { setupDiscordBot } from "./services/discord-bot";
import { z } from "zod";
import { RankingService } from "./services/ranking-api";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Initialize ranking service for API requests
  const rankingService = new RankingService();

  // Setup Discord bot if environment variables are available
  if (process.env.DISCORD_TOKEN && process.env.DISCORD_CLIENT_ID) {
    try {
      await setupDiscordBot();
      console.log("Discord bot initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Discord bot:", error);
    }
  } else {
    console.warn("Discord bot credentials not found in environment variables");
  }

  // REST API endpoints
  
  // Webhook endpoint to receive data from n8n
  app.post("/api/webhook/llamaranking", async (req, res) => {
    try {
      console.log("Received webhook callback from n8n:", req.body);
      
      // Validate that we have coin data in the request
      if (!req.body || (!Array.isArray(req.body) && !req.body.data)) {
        return res.status(400).json({
          success: false,
          message: "Invalid data format. Expected array of coins or object with data property."
        });
      }
      
      // Extract the coin data (handle different possible formats)
      let coinData = req.body;
      if (!Array.isArray(coinData) && coinData.data) {
        coinData = coinData.data;
      }
      
      // Further normalize if it's still not an array
      if (!Array.isArray(coinData)) {
        // Try to find an array property in the object
        for (const key in coinData) {
          if (Array.isArray(coinData[key])) {
            coinData = coinData[key];
            break;
          }
        }
      }
      
      // If we still don't have an array, wrap the object in an array if it looks like a coin
      if (!Array.isArray(coinData)) {
        if (coinData.name || coinData.symbol || coinData.price) {
          coinData = [coinData];
        } else {
          return res.status(400).json({
            success: false,
            message: "Could not find coin data in the request."
          });
        }
      }
      
      // Reset the storage before adding new coins
      await storage.resetCoins();
      
      // Process and store the coin data
      const storedCoins = [];
      
      for (let i = 0; i < coinData.length; i++) {
        const item = coinData[i];
        const coin = {
          name: item.name || `Unknown ${i}`,
          symbol: item.symbol || `$UNK${i}`,
          price: parseFloat(item.price) || 0,
          percentChange24h: parseFloat(item.percent_change_24h || item.percentChange24h) || 0,
          marketCap: parseFloat(item.market_cap || item.marketCap) || 0,
          rank: item.rank || i + 1,
          imageUrl: item.image_url || item.imageUrl || `https://via.placeholder.com/40?text=${i+1}`,
        };
        
        const stored = await storage.createCoin(coin);
        storedCoins.push(stored);
      }
      
      return res.json({
        success: true,
        message: `Successfully processed ${storedCoins.length} coins.`,
        coins: storedCoins
      });
    } catch (error) {
      console.error("Error processing webhook data:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to process webhook data",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
  
  // Get current coin rankings
  app.get("/api/rankings", async (req, res) => {
    try {
      const rankings = await rankingService.getRankings();
      return res.json(rankings);
    } catch (error) {
      console.error("Error fetching rankings:", error);
      return res.status(500).json({ 
        message: "Failed to fetch Llamacoin rankings",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Simulate what would happen if the bot received a slash command
  app.post("/api/simulate-command", async (req, res) => {
    const bodySchema = z.object({
      command: z.string(),
      userId: z.string().optional(),
      guildId: z.string().optional(),
      channelId: z.string().optional(),
    });

    try {
      const { command, userId, guildId, channelId } = bodySchema.parse(req.body);
      
      // Only support /ranking command for now
      if (command !== "ranking") {
        return res.status(400).json({ message: "Unsupported command" });
      }
      
      // Log the interaction
      await storage.createCommandInteraction({
        commandName: command,
        userId: userId || "simulator-user",
        guildId: guildId,
        channelId: channelId || "simulator-channel",
        success: true,
        errorMessage: null,
      });
      
      try {
        // Get rankings to send back
        const rankings = await rankingService.getRankings();
        return res.json({ rankings });
      } catch (rankingError) {
        console.error("Error fetching rankings:", rankingError);
        
        // Log the failed interaction
        await storage.createCommandInteraction({
          commandName: command,
          userId: userId || "simulator-user",
          guildId: guildId,
          channelId: channelId || "simulator-channel",
          success: false,
          errorMessage: rankingError instanceof Error ? rankingError.message : "Unknown error",
        });
        
        return res.status(500).json({ 
          error: rankingError instanceof Error ? rankingError.message : "Failed to retrieve ranking data" 
        });
      }
    } catch (error) {
      console.error("Error simulating command:", error);
      
      // If it's a validation error
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request parameters",
          errors: error.errors 
        });
      }
      
      // Log the failed interaction if we have command data
      if (req.body && typeof req.body.command === 'string') {
        await storage.createCommandInteraction({
          commandName: req.body.command,
          userId: req.body.userId || "simulator-user",
          guildId: req.body.guildId,
          channelId: req.body.channelId || "simulator-channel",
          success: false,
          errorMessage: error instanceof Error ? error.message : "Unknown error",
        });
      }
      
      return res.status(500).json({ 
        message: "Failed to process command",
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  return httpServer;
}
