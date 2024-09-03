import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function TicketsTable() {
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Support</CardTitle>
        <CardDescription>Manage user tickets and inquiries</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of support tickets.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Add ticket rows here */}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}