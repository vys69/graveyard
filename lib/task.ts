export interface Task {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'in-progress' | 'closed';
    createdAt: Date;
    dueDate?: Date;
    client?: string;
}