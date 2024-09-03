import { CommandInteraction } from 'discord.js';
import { addComment } from '../utils/api.js';

export async function handleAddComment(interaction: CommandInteraction) {
  await interaction.deferReply();
  try {
    const ticketId = interaction.options.get('ticket_id')?.value as string;
    const comment = interaction.options.get('comment')?.value as string;
    const userId = interaction.user.id;

    if (!ticketId || !comment) {
      throw new Error('Missing required options');
    }

    const updatedTicket = await addComment(ticketId, comment, userId);

    await interaction.editReply(`Comment added successfully to ticket ${updatedTicket.id}.`);
  } catch (error) {
    console.error('Error adding comment:', error);
    await interaction.editReply('An error occurred while adding the comment. Please try again later.');
  }
}
