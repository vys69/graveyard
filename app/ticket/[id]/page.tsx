"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthWrapper } from '@/components/AuthWrapper';
import { Button } from '@/components/ui/button';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  userName: string;
  userImage: string | null;
}

export default function TicketDetailPage() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setTicket(data.ticket);
        } else {
          console.error('Failed to fetch ticket');
        }
      } catch (error) {
        console.error('Error fetching ticket:', error);
      }
    };

    if (params.id) {
      fetchTicket();
    }
  }, [params.id]);

  if (!ticket) {
    return <div>Loading...</div>;
  }

  return (
    <AuthWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Ticket Details</h1>
        <div className="mb-4">
          <p><strong>ID:</strong> {ticket.id}</p>
          <p><strong>Title:</strong> {ticket.title}</p>
          <p><strong>Description:</strong> {ticket.description}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <p><strong>Created by:</strong> {ticket.userName}</p>
        </div>
        <Button onClick={() => router.back()}>Back to Tickets</Button>
      </div>
    </AuthWrapper>
  );
}