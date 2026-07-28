'use client';

import { useParams } from "next/navigation";
import { useTasks } from "@/hooks/useTasks";
import { Clock, Tag } from "lucide-react";
import { Task } from "@/types/task.types";

export default function SingleTaskPage() {
  const params = useParams();
  const taskId = params.id as string;
  const { tasks, isLoading } = useTasks();

  const task = tasks.find((t: Task) => t.id === taskId);

  if (isLoading) return <div className="text-sm text-muted-foreground">Loading task details...</div>;
  if (!task) return <div className="text-sm text-destructive font-medium">Task not found.</div>;

  return (
    <div className="max-w-3xl space-y-6 bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs px-2.5 py-1 bg-secondary text-secondary-foreground rounded font-semibold">
          {task.status}
        </span>
        <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
          task.priority === "URGENT" 
            ? "bg-destructive/10 text-destructive border border-destructive/20" 
            : "bg-muted text-muted-foreground"
        }`}>
          Priority: {task.priority}
        </span>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-foreground">{task.title}</h1>
        <p className="text-sm text-muted-foreground mt-2">{task.description || "No description provided."}</p>
      </div>

      <div className="pt-4 border-t border-border flex items-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" /> Created: {new Date(task.createdAt).toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1.5">
          <Tag className="w-4 h-4" /> Project ID: {task.projectId}
        </div>
      </div>
    </div>
  );
}