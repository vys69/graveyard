import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/../.env` });

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

const commands = [
  {
    name: 'create-ticket',
    description: 'Create a new support ticket',
    options: [
      {
        name: 'title',
        type: 3, // STRING
        description: 'The title of the ticket',
        required: true,
      },
      {
        name: 'description',
        type: 3, // STRING
        description: 'The description of the ticket',
        required: true,
      },
    ],
  },
  {
    name: 'list-tickets',
    description: 'List all your open tickets',
  },
  {
    name: 'close-ticket',
    description: 'Close an open ticket',
    options: [
      {
        name: 'ticket_id',
        type: 3, // STRING
        description: 'The ID of the ticket to close',
        required: true,
      },
    ],
  },
  {
    name: 'add-comment',
    description: 'Add a comment to an existing ticket',
    options: [
      {
        name: 'ticket_id',
        type: 3, // STRING
        description: 'The ID of the ticket to comment on',
        required: true,
      },
      {
        name: 'comment',
        type: 3, // STRING
        description: 'The comment to add',
        required: true,
      },
    ],
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_BOT_TOKEN!);

client.once('ready', () => {
  console.log('Bot is ready!');
});

import { handleCreateTicket } from './commands/createTicket.js';
import { handleListTickets } from './commands/listTickets.js';
import { handleCloseTicket } from './commands/closeTicket.js';
import { handleAddComment } from './commands/addComment.js';

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  switch (interaction.commandName) {
    case 'create-ticket':
      await handleCreateTicket(interaction);
      break;
    case 'list-tickets':
      await handleListTickets(interaction);
      break;
    case 'close-ticket':
      await handleCloseTicket(interaction);
      break;
    case 'add-comment':
      await handleAddComment(interaction);
      break;
    default:
      await interaction.reply('Unknown command');
  }
});

async function main() {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: commands }
    );

    console.log('Successfully reloaded application (/) commands.');

    await client.login(process.env.DISCORD_BOT_TOKEN);
  } catch (error) {
    console.error(error);
  }
}

main();
