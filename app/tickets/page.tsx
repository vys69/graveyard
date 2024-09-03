"use client";

import { useState, useEffect } from 'react';
import { AuthWrapper } from '@/components/AuthWrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSession } from 'next-auth/react';
import { CreateTicketModal } from '@/app/components/CreateTicketModal';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from 'next/navigation';
import { EditTicketModal } from '@/app/components/EditTicketModal';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  userName: string;
  userImage: string | null;
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const isAdmin = session?.user?.isAdmin || false; // Updated line

  const [userFilter, setUserFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [users, setUsers] = useState<{id: string, name: string}[]>([]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTickets();
      fetchUsers();
    }
  }, [session]);

  const fetchTickets = async () => {
    try {
      console.log('Fetching tickets...');
      const queryParams = new URLSearchParams({
        userFilter,
        statusFilter,
        titleFilter: filter
      });
      const response = await fetch(`/api/tickets?${queryParams}`);
      console.log('Fetch response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched tickets:', data);
        setTickets(data.tickets || []);
      } else {
        console.error('Failed to fetch tickets');
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    try {
      const response = await fetch(`/api/tickets?ticketId=${ticketId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchTickets();
      } else {
        const errorData = await response.json();
        console.error('Failed to delete ticket:', errorData.error);
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const handleEditTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsEditModalOpen(true);
  };

  const filteredTickets = tickets ? tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(filter.toLowerCase())
  ) : [];

  const openTickets = tickets.filter(ticket => ticket.status !== 'CLOSED');
  const closedTickets = tickets.filter(ticket => ticket.status === 'CLOSED');

  return (
    <AuthWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tickets</h1>
        <div className="flex justify-between mb-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Filter by title..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-sm"
            />
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">All Users</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="CLOSED">Closed</option>
            </select>
            <Button onClick={fetchTickets}>Apply Filters</Button>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>Create New Ticket</Button>
        </div>
        <Table>
          <TableHeader>

            <TableRow>
              <TableHead>Avatar</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id} className="cursor-pointer hover:bg-gray-100" onClick={() => router.push(`/ticket/${ticket.id}`)}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={ticket.userImage || undefined} />
                    <AvatarFallback>{ticket.userName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.userName}</TableCell>
                <TableCell>{ticket.title}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      handleEditTicket(ticket);
                    }}>Edit</Button>
                    <Button onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTicket(ticket.id);
                    }}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedTicket && (
        <EditTicketModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onTicketEdited={fetchTickets}
          ticket={selectedTicket}
          isAdmin={isAdmin}
        />
      )}
      <CreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTicketCreated={fetchTickets}
      />
    </AuthWrapper>
  );
}

const fetchUsers = async () => {
  try {
    const response = await fetch('/api/users');
    if (response.ok) {
      const data = await response.json();
      return data.users;
    } else {
      console.error('Failed to fetch users');
      return [];
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};