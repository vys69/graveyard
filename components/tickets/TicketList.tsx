import { Button } from '@/components/ui/button';

export function TicketList({ tickets }: { tickets: any[] }) {
  return (
    <ul className="space-y-4">
      {tickets.map((ticket, index) => (
        <li key={index} className="border p-4 rounded">
          <h3 className="font-semibold">{ticket.title}</h3>
          <p className="text-sm text-gray-600">{ticket.description}</p>
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