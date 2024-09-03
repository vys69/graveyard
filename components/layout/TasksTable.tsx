import { Task } from '@/lib/task';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PencilIcon, TrashIcon } from "lucide-react"

interface TasksTableProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => void;
}

export default function TasksTable({ tasks, onEdit, onDelete }: TasksTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tasks</CardTitle>
                <CardDescription>Manage your tasks</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableCaption>A list of your tasks.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Task</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>{task.title}</TableCell>
                                <TableCell>{task.dueDate ? task.dueDate.toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell>{task.status}</TableCell>
                                <TableCell>{task.client || 'N/A'}</TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
                                        <PencilIcon className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
                                        <TrashIcon className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}