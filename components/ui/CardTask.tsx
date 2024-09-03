import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { CardTaskData } from '@/lib/data';

export function CardTask({ title, icon: Icon, tasks }: CardTaskData) {
  return (
    <Card className="bg-card text-card-foreground h-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Icon className="h-6 w-6" />
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      {tasks && (
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {tasks.map((task, index) => (
              <Link 
                key={index} 
                href={task.link}
                className="flex flex-col items-center justify-center p-4 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
              >
                <task.icon className="h-8 w-8 mb-2" />
                <span className="text-xs text-center">{task.title}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}