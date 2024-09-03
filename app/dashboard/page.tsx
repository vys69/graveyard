"use client";

import { CardTask } from '@/components/ui/CardTask';
import { cardTasks } from '@/lib/data';
import { AuthWrapper } from '@/components/AuthWrapper';

export default function Dashboard() {
  return (
    <AuthWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardTasks.map((task, index) => (
            <div key={index} className="bg-card rounded-md">
              <CardTask {...task} />
            </div>
          ))}
        </div>
      </div>
    </AuthWrapper>
  );
}