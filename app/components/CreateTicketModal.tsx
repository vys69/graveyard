import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated: () => void;
}

export function CreateTicketModal({ isOpen, onClose, onTicketCreated }: CreateTicketModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting ticket...');
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          userId: session?.user?.id,
        }),
      });
      console.log('Submit response status:', response.status);
      const data = await response.json();
      console.log('Submit response data:', data);
      if (response.ok) {
        onTicketCreated();
        onClose();
      } else {
        console.error('Failed to create ticket', data);
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">Create New Ticket</h2>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="Ticket Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mb-4"
          />
          <Textarea
            placeholder="Ticket Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-end">
            <Button type="button" onClick={onClose} className="mr-2">Cancel</Button>
            <Button type="submit">Create Ticket</Button>
          </div>
        </form>
      </div>
    </div>
  );
}