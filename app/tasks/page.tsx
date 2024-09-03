"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Task } from '@/lib/task';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import TasksTable from "@/components/layout/TasksTable";
import { TaskModal } from "@/components/TaskModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const clients = ['Client A', 'Client B', 'Client C']; // Add your clients here

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? { ...task, ...taskData } : task));
    } else {
      const newTask: Task = {
        id: Date.now().toString(),
        createdAt: new Date(),
        ...taskData,
      };
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleClientChange = (value: string) => {
    setSelectedClient(value === "all" ? null : value);
  };

  const filteredTasks = selectedClient
    ? tasks.filter(task => task.client === selectedClient)
    : tasks;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex items-center space-x-4">
          <Select onValueChange={handleClientChange} value={selectedClient || "all"}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by client" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clients</SelectItem>
              {clients.map((client) => (
                <SelectItem key={client} value={client}>{client}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => { setEditingTask(null); setIsModalOpen(true); }}>
            <PlusCircle className="mr-2 h-4 w-4" /> New Task
          </Button>
        </div>
      </div>
      <TasksTable 
        tasks={filteredTasks} 
        onEdit={handleEditTask} 
        onDelete={handleDeleteTask} 
      />
      <TaskModal
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onSaveTask={handleSaveTask}
        editingTask={editingTask}
        clients={clients}
      />
    </div>
  );
}