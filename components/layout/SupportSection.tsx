import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SupportSection() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Support</CardTitle>
          <CardDescription>Manage user tickets and inquiries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* Add support options here */}
          </div>
        </CardContent>
      </Card>
    );
  }