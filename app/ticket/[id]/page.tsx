"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AuthWrapper } from '@/components/AuthWrapper';
import { Button } from '@/components/ui/button';
import Message from '@/components/Message';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  userName: string;
  userImage: string | null;
}

interface MessageData {
  id: string;
  content: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
}

export default function TicketDetailPage() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
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

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages?ticketId=${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages);
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    if (params.id) {
      fetchTicket();
      fetchMessages();
    }

    // Set up polling for new messages
    const intervalId = setInterval(fetchMessages, 5000); // Fetch every 5 seconds

    return () => clearInterval(intervalId); // Clean up on component unmount
  }, [params.id]);

  if (!ticket) {
    return <div>Loading...</div>;
  }

  const handleDeleteTicket = async () => {
    try {
      const response = await fetch(`/api/tickets?ticketId=${ticket.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete ticket');
      }

      router.push('/tickets');
    } catch (error) {
      console.error('Failed to delete ticket:', error);
    }
  };

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
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Messages</h2>
          {messages.map((message) => (
            <Message
              key={message.id}
              content={message.content}
              userName={message.userName}
              userAvatar={message.userAvatar}
              timestamp={message.timestamp}
            />
          ))}
        </div>
        <Button onClick={() => router.back()} className="mt-4">Back to Tickets</Button>
        <Button onClick={handleDeleteTicket} className="mt-4">Delete Ticket</Button>
      </div>
    </AuthWrapper>
  );
}