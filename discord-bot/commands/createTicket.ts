import { CommandInteraction } from 'discord.js';
import { createTicket } from '../utils/api.js';
import { TicketPlus } from 'lucide-react';

export async function handleCreateTicket(interaction: CommandInteraction) {
  console.log('Handling create ticket command');
  await interaction.deferReply();
  try {
    const title = interaction.options.get('title')?.value as string;
    const userId = interaction.user.id;

    console.log('Creating ticket...');
    const ticket = await createTicket({
      title,
      userId,
    });

    console.log('Ticket created successfully:', ticket);
    await interaction.editReply(`Ticket created successfully! Ticket ID: ${ticket.id}`);
  } catch (error) {
    console.error('Error creating ticket:', error);
    await interaction.editReply('An error occurred while creating the ticket. Please try again later.');
  }
}
