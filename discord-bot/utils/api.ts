import axios from 'axios';
import { CardTaskData } from '../../lib/data';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

interface Ticket {
  id: string;
  title: string;
  userId: string;
}

export async function createTicket(ticket: Omit<Ticket, 'id'>): Promise<Ticket> {
  console.log('Creating ticket with data:', JSON.stringify(ticket, null, 2));
  try {
    console.log(`Sending POST request to ${API_BASE_URL}/tickets`);
    const response = await axios.post<{ message: string; ticket: Ticket }>(`${API_BASE_URL}/tickets`, ticket);
    console.log('API response:', JSON.stringify(response.data, null, 2));
    return response.data.ticket;
  } catch (error) {
    console.error('Error creating ticket:', error);
    throw error;
  }
}

export async function listTickets(userId: string): Promise<Ticket[]> {
  try {
    const response = await axios.get<Ticket[]>(`${API_BASE_URL}/tickets/list`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error listing tickets via API:', error);
    throw error;
  }
}

export async function closeTicket(ticketId: string): Promise<Ticket> {
  try {
    const response = await axios.post<Ticket>(`${API_BASE_URL}/tickets/close`, { ticketId });
    return response.data;
  } catch (error) {
    console.error('Error closing ticket via API:', error);
    throw error;
  }
}

export async function addComment(ticketId: string, comment: string, userId: string): Promise<Ticket> {
  try {
    const response = await axios.post<Ticket>(`${API_BASE_URL}/tickets/comment`, {
      ticketId,
      comment,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding comment via API:', error);
    throw error;
  }
}