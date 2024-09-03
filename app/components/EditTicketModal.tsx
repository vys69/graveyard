import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTickets } from '@/app/hooks/useTickets';
import { useSession } from 'next-auth/react';
interface EditTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketEdited: () => void;
  ticket: {
    id: string;
    title: string;
    description: string;
    status: string;
  };
  isAdmin: boolean;
}

export function EditTicketModal({ isOpen, onClose, onTicketEdited, ticket, isAdmin }: EditTicketModalProps) {
  const [title, setTitle] = useState(ticket.title);
  const [description, setDescription] = useState(ticket.description);
  const [status, setStatus] = useState(ticket.status);
  const { editTicket, isLoading, error } = useTickets();
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          status,
          userId: session?.user?.id,
        }),
      });
      if (response.ok) {
        onTicketEdited();
        onClose();
      } else {
        console.error('Failed to edit ticket');
      }
    } catch (error) {
      console.error('Error editing ticket:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="mb-4"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="mb-4"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mb-4 w-full p-2 border rounded"
            disabled={!isAdmin && status === 'CLOSED'}
          >
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
          </select>
          <DialogFooter>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}