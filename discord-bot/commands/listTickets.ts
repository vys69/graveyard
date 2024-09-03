import { CommandInteraction } from 'discord.js';
import { listTickets } from '../utils/api.js';

export async function handleListTickets(interaction: CommandInteraction) {
  await interaction.deferReply({ ephemeral: true });

  try {
    const userId = interaction.user.id;
    const tickets = await listTickets(userId);

    if (tickets.length === 0) {
      await interaction.editReply('You have no open tickets.');
      return;
    }

    const ticketList = tickets.map(ticket => 
      `ID: ${ticket.id} - Title: ${ticket.title}`
    ).join('\n');

    await interaction.editReply(`Your tickets:\n${ticketList}`);
  } catch (error) {
    console.error('Error listing tickets:', error);
    await interaction.editReply('An error occurred while listing tickets. Please try again later.');
  }
}
