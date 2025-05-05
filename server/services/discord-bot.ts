import { 
  Client, 
  GatewayIntentBits, 
  REST, 
  Routes, 
  SlashCommandBuilder, 
  ChatInputCommandInteraction 
} from 'discord.js';
import { storage } from '../storage';
import { RankingService } from './ranking-api';
import axios from 'axios';

// Initialize the Discord client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rankingService = new RankingService();

// Define the slash commands
const commands = [
  new SlashCommandBuilder()
    .setName('ranking')
    .setDescription('Get the latest Llamacoin rankings')
    .addStringOption(option => 
      option
        .setName('type')
        .setDescription('Type of ranking to display')
        .setRequired(false)
        .addChoices(
          { name: 'Top 10', value: 'top10' },
          { name: 'Trending', value: 'trending' },
          { name: 'Watchlist', value: 'watchlist' }
        )
    ),
];

// Handle interaction creation (slash commands)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Log the interaction to storage
  const commandInteraction: {
    commandName: string;
    userId: string;
    guildId?: string;
    channelId: string;
    success: boolean;
    errorMessage: string | null;
  } = {
    commandName: interaction.commandName,
    userId: interaction.user.id,
    guildId: interaction.guildId || undefined,
    channelId: interaction.channelId,
    success: true,
    errorMessage: null,
  };

  try {
    if (interaction.commandName === 'ranking') {
      await handleRankingCommand(interaction);
    }
  } catch (error) {
    console.error('Error handling command:', error);
    commandInteraction.success = false;
    commandInteraction.errorMessage = error instanceof Error ? error.message : 'Unknown error';
  } finally {
    // Save the interaction log
    await storage.createCommandInteraction(commandInteraction);
  }
});

// ❌ NO ENVÍA RESPUESTA, SOLO SILENCIA TODO Y ENVÍA A WEBHOOK
async function handleRankingCommand(interaction: ChatInputCommandInteraction) {
  try {
    // Evita el error de timeout del bot
    await interaction.deferReply({ ephemeral: true });

    // Enviar al webhook (n8n)
    await axios.post(process.env.WEBHOOK_URL!, {
      command: 'ranking',
      userId: interaction.user.id,
      guildId: interaction.guildId,
      channelId: interaction.channelId,
    });

    // Eliminar la "respuesta" antes de que el usuario la vea
    await interaction.deleteReply();
  } catch (error) {
    console.error('Error in handleRankingCommand:', error);
    // No respondemos nada para mantener el silencio
  }
}

// Initialize the bot and register commands
export async function setupDiscordBot() {
  const token = process.env.DISCORD_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;

  if (!token || !clientId) {
    throw new Error('Missing Discord credentials in environment variables');
  }

  try {
    // Register slash commands
    const rest = new REST({ version: '10' }).setToken(token);
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(clientId), { body: commands });
    console.log('Successfully reloaded application (/) commands.');

    // Login
    await client.login(token);
    console.log(`Logged in as ${client.user?.tag}`);
    return client;
  } catch (error) {
    console.error('Failed to initialize Discord bot:', error);
    throw error;
  }
}
