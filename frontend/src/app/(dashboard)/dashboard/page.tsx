'use client';

import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { CheckCircle2, Clock, AlertCircle, FolderKanban } from "lucide-react";
import { Task } from "@/types/task.types";

export default function DashboardOverviewPage() {
  const { tasks, isLoading: tasksLoading } = useTasks();
  const { projects, isLoading: projectsLoading } = useProjects();

  if (tasksLoading || projectsLoading) {
    return <div className="text-sm text-muted-foreground">Loading overview analytics...</div>;
  }

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t: Task) => t.status === "DONE").length;
  const inProgressTasks = tasks.filter((t: Task) => t.status === "IN_PROGRESS").length;
  const urgentTasks = tasks.filter((t: Task) => t.priority === "URGENT").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Real-time metrics and operational updates</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Projects" value={projects.length} icon={FolderKanban} />
        <StatsCard title="In Progress" value={inProgressTasks} icon={Clock} />
        <StatsCard title="Completed" value={completedTasks} icon={CheckCircle2} />
        <StatsCard title="Urgent Tasks" value={urgentTasks} icon={AlertCircle} />
      </div>

      <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground">No tasks created yet.</p>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task: Task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50">
                <div>
                  <h4 className="text-sm font-medium text-foreground">{task.title}</h4>
                  <span className="text-xs text-muted-foreground">Status: {task.status}</span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  task.priority === "URGENT" 
                    ? "bg-destructive/10 text-destructive border border-destructive/20" 
                    : "bg-secondary text-secondary-foreground"
                }`}>
                  {task.priority}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}