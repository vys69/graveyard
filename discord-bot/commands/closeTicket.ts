import { CommandInteraction } from 'discord.js';
import { closeTicket } from '../utils/api.js';

export async function handleCloseTicket(interaction: CommandInteraction) {
  await interaction.deferReply();
  try {
    const ticketId = interaction.options.get('ticket_id')?.value as string;
    const closedTicket = await closeTicket(ticketId);

    await interaction.editReply(`Ticket ${closedTicket.id} has been closed successfully.`);
  } catch (error) {
    console.error('Error closing ticket:', error);
    await interaction.editReply('An error occurred while closing the ticket. Please try again later.');
  }
}
