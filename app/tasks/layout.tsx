"use client"

import React, { useState, useEffect } from 'react';
import { TaskModal } from "@/components/TaskModal";
import { usePathname, useRouter } from 'next/navigation';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  createdAt: Date;
  dueDate?: Date;
  client?: string;
}

interface User {
  id: string;
  name: string;
}

const users: User[] = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  // Add more users as needed
];

const clients = ['Client A', 'Client B', 'Client C']; // Add your clients here

export default function TasksLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsOpen(pathname === '/tasks/new');
  }, [pathname]);

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
    setIsOpen(false);
    setEditingTask(null);
    router.push('/tasks');
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    router.push('/tasks');
  };

  return (
    <>
      {React.cloneElement(children as React.ReactElement, { tasks, setTasks })}
      <TaskModal
        isOpen={isOpen}
        setIsOpen={handleCloseModal}
        onSaveTask={handleSaveTask}
        editingTask={editingTask}
        clients={clients}
      />
    </>
  );
}