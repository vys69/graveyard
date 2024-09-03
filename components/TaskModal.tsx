import { useState, useEffect } from 'react';
import { Task } from '@/lib/task';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSaveTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  editingTask: Task | null;
  clients: string[];
}

export function TaskModal({ isOpen, setIsOpen, onSaveTask, editingTask, clients }: TaskModalProps) {
  const [task, setTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    status: 'open',
    client: '',
  });

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask);
    } else {
      setTask({
        title: '',
        description: '',
        status: 'open',
        client: '',
      });
    }
  }, [editingTask]);

  const handleSubmit = () => {
    onSaveTask(task as Omit<Task, 'id' | 'createdAt'>);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          <DialogDescription>
            {editingTask ? 'Edit your task details.' : 'Add a new task to your list. Click save when you\'re done.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Client
            </Label>
            <Select
              value={task.client}
              onValueChange={(value) => setTask({ ...task, client: value })}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client} value={client}>{client}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleSubmit}>{editingTask ? 'Update' : 'Save'} Task</Button>
      </DialogContent>
    </Dialog>
  );
}