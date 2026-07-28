'use client';

import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task.types";
import Link from "next/link";
import { Clock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function TasksPage() {
  const { tasks, isLoading } = useTasks();

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">Manage and view all workspace tasks</p>
      </div>

      <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks found.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task: Task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-4 bg-muted/40 hover:bg-muted/80 rounded-lg border border-border/60 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">{task.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      task.priority === "URGENT" 
                        ? "bg-destructive/10 text-destructive border border-destructive/20" 
                        : "bg-secondary text-secondary-foreground"
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {task.description || "No description provided."}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-xs px-2.5 py-1 bg-secondary text-secondary-foreground rounded font-medium">
                    {task.status}
                  </span>
                  
                  {/* Link to Single Task Page */}
                  <Link
                    href={`/dashboard/tasks/${task.id}`}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}