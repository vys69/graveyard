import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function PortfolioSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio</CardTitle>
        <CardDescription>Inspiration and client work</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {/* Add portfolio items here */}
        </div>
      </CardContent>
    </Card>
  );
}