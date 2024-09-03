import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ToolsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tools</CardTitle>
        <CardDescription>Quick access to productivity tools</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Add tool buttons here */}
        </div>
      </CardContent>
    </Card>
  );
}