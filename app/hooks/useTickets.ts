import { useState } from 'react';

export function useTickets() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTicket = async (ticketId: string, updatedTicket: {
    title: string;
    description: string;
    status: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTicket),
      });

      if (!response.ok) {
        throw new Error('Failed to update ticket');
      }

      const data = await response.json();
      setIsLoading(false);
      return data.ticket;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsLoading(false);
      return null;
    }
  };

  return { editTicket, isLoading, error };
}