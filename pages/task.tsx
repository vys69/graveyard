"use client"

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AuthWrapper } from "@/components/AuthWrapper";
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  createdAt: Date;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [isOpen, setIsOpen] = useState(false);

  const handleCreateTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'open',
      createdAt: new Date(),
    };
    setTasks([...tasks, task]);
    setNewTask({ title: '', description: '' });
    setIsOpen(false);
  };

  return (
    <AuthWrapper>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <PlusCircle className="mr-2 h-4 w-4" /> New Task
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to your list. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreateTask}>Save Task</Button>
        </DialogContent>
      </Dialog>
      <div className="space-y-4">
        {tasks.map((task) => (
          <div key={task.id} className="border p-4 rounded-md">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Status: {task.status} | Created: {task.createdAt.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
    </AuthWrapper>
  );
}