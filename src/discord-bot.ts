import { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, ChannelType, Message } from 'discord.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

// Hard-coded category ID
const TICKET_CATEGORY_ID = '1241518374765203537'; // Replace with your actual category ID

const createTicketCommand = new SlashCommandBuilder()
  .setName('create-ticket')
  .setDescription('Create a new ticket')
  .addStringOption(option =>
    option.setName('title')
      .setDescription('The title of the ticket')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('description')
      .setDescription('The description of the ticket')
      .setRequired(true));

async function main() {
  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: [createTicketCommand.toJSON()] },
    );
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }

  client.on('ready', () => {
    console.log(`Logged in as ${client.user!.tag}!`);
  });

  client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'create-ticket') {
      const title = interaction.options.getString('title')!;
      const description = interaction.options.getString('description')!;
      const userId = interaction.user.id;
      const userName = interaction.user.username;
      const userAvatar = interaction.user.avatarURL();

      const apiUrl = `${process.env.API_BASE_URL}/api/tickets`;
      console.log('Sending request to:', apiUrl);

      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.API_TOKEN}`,
          },
          body: JSON.stringify({
            title,
            description,
            userId,
            userName,
            userAvatar,
            categoryId: TICKET_CATEGORY_ID,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to create ticket:', response.status, errorText);
          console.error('Request body:', {
            title,
            description,
            userId,
            userName,
            userAvatar,
            categoryId: TICKET_CATEGORY_ID,
          });
          console.error('API Token:', process.env.API_TOKEN); // Be careful with logging sensitive information
          await interaction.reply('Failed to create ticket. Please try again later.');
          return;
        }

        const ticket = await response.json();

        // Create a new channel for the ticket
        if (interaction.guild) {
          const category = await interaction.guild.channels.fetch(TICKET_CATEGORY_ID);
          if (!category || category.type !== ChannelType.GuildCategory) {
            await interaction.reply('Invalid category ID. Please contact an administrator.');
            return;
          }

          const channel = await interaction.guild.channels.create({
            name: `ticket-${ticket.id}`,
            type: ChannelType.GuildText,
            topic: `Ticket: ${title}`,
            parent: category.id,
          });

          // Set permissions for the channel
          await channel.permissionOverwrites.create(interaction.user, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
          });

          await channel.send(`Ticket created by ${interaction.user}. Title: ${title}\nDescription: ${description}`);
        }

        await interaction.reply(`Ticket created successfully! Ticket ID: ${ticket.id}`);
      } catch (error) {
        console.error('Error creating ticket:', error);
        await interaction.reply('An error occurred while creating the ticket.');
      }
    }
  });

  client.on('messageCreate', async (message: Message) => {
    // Log all messages received
    console.log(`Message received in channel ID: ${message.channel.id}`);

    // Function to safely get channel name
    const getChannelName = (channel: Message['channel']): string => {
      if (channel.isTextBased() && 'name' in channel) {
        return channel.name ?? 'Unknown Channel';
      }
      return 'Unknown Channel';
    };

    const channelName = getChannelName(message.channel);
    console.log(`Channel name: ${channelName}`);

    // Check if the message is in a text channel
    if (message.channel.isTextBased() && !message.channel.isDMBased()) {
      console.log(`Message is in a text channel: ${channelName}`);

      // Check if the channel name starts with 'ticket-'
      if (channelName.startsWith('ticket-')) {
        console.log(`Message detected in ticket channel: ${channelName}`);
        const ticketId = channelName.split('-')[1];
        console.log(`Extracted ticket ID: ${ticketId}`);

        // Log message details
        console.log(`Message content: ${message.content}`);
        console.log(`Author: ${message.author.username} (ID: ${message.author.id})`);
        console.log(`Timestamp: ${message.createdAt.toISOString()}`);

        // Send message data to your API
        try {
          console.log(`Sending message data to API for ticket: ${ticketId}`);
          const response = await fetch(`${process.env.API_BASE_URL}/api/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.API_TOKEN}`,
            },
            body: JSON.stringify({
              ticketId,
              content: message.content,
              userId: message.author.id,
              userName: message.author.username,
              userAvatar: message.author.avatarURL() ?? null, // Use null-coalescing operator
              timestamp: message.createdAt.toISOString(),
            }),
          });

          if (response.ok) {
            console.log(`Successfully saved message to API for ticket: ${ticketId}`);
          } else {
            console.error(`Failed to save message to API for ticket: ${ticketId}`);
            console.error('API response:', await response.text());
          }
        } catch (error) {
          console.error('Error saving message to API:', error);
        }
      } else {
        console.log(`Message is not in a ticket channel: ${channelName}`);
      }
    } else {
      console.log(`Message is not in a text channel. Channel type: ${message.channel.type}`);
    }
  });

  client.login(process.env.DISCORD_BOT_TOKEN);
}

main().catch(console.error);