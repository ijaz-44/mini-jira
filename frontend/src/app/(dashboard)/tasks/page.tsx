'use client';

import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task.types";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import TaskDetailsModal from "./TaskDetailsModal";

export default function TasksPage() {
  const { tasks, isLoading } = useTasks();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTaskClick = (taskId: string) => {
    if (!taskId) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('taskId', taskId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (isLoading) {
    return <div className="text-sm text-muted-foreground p-4">Loading tasks...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">Manage and view all workspace tasks</p>
      </div>

      <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
        {!tasks || tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks found.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task: Task) => {
              const taskId = task._id || task.id || "";
              
              return (
                <div
                  key={taskId || task.title}
                  onClick={() => handleTaskClick(taskId)}
                  className="flex items-center justify-between p-4 bg-muted/40 hover:bg-muted/80 rounded-lg border border-border/60 transition-colors cursor-pointer group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                        {task.title}
                      </h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        task.priority === "URGENT" || task.priority === "HIGH"
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
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTaskClick(taskId);
                      }}
                      className="p-2 text-muted-foreground group-hover:text-foreground transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TaskDetailsModal />
    </div>
  );
}