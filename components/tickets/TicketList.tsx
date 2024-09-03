import { Button } from '@/components/ui/button';

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
}

export function TicketList({ tickets }: { tickets: Ticket[] }) {
  return (
    <ul className="space-y-4">
      {tickets.map((ticket) => (
        <li key={ticket.id} className="border p-4 rounded">
          <h3 className="font-semibold">{ticket.title}</h3>
          <p className="text-sm text-gray-600">{ticket.description}</p>
          <p className="text-sm text-gray-600">Status: {ticket.status}</p>
          <div className="mt-2 space-x-2">
            <Button variant="outline" size="sm">Edit</Button>
            <Button variant="outline" size="sm">Delete</Button>
            <Button variant="outline" size="sm">Mute</Button>
          </div>
        </li>
      ))}
    </ul>
  );
}