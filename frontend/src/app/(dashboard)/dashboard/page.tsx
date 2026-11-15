'use client';

import { useState, useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { TaskModal } from "@/components/modals/TaskModal";
import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";
import { CheckCircle2, Clock, AlertCircle, FolderKanban, Plus, Loader2 } from "lucide-react";
import { Task } from "@/types/task.types";

export default function DashboardOverviewPage() {
  const { tasks = [], isLoading: tasksLoading, deleteTask } = useTasks();
  const { projects = [], isLoading: projectsLoading } = useProjects();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const stats = useMemo(() => ({
    completed: tasks.filter((t) => t.status === "DONE").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    urgent: tasks.filter((t) => t.priority === "URGENT").length,
  }), [tasks]);

  if (tasksLoading || projectsLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-muted-foreground gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading overview...
      </div>
    );
  }

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-muted-foreground">Manage your workspace and task statuses</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 font-medium text-sm rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Kanban Board Component */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Kanban Task Board</h2>
        <KanbanBoard 
          tasks={tasks} 
          onEditTask={handleOpenEditModal} 
          onDeleteTask={deleteTask} 
        />
      </div>

      {/* Metrics */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h2 className="text-lg font-semibold">Metrics Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Projects" value={projects.length} icon={FolderKanban} />
          <StatsCard title="In Progress" value={stats.inProgress} icon={Clock} />
          <StatsCard title="Completed" value={stats.completed} icon={CheckCircle2} />
          <StatsCard title="Urgent Tasks" value={stats.urgent} icon={AlertCircle} />
        </div>
      </div>

      {/* URL-Synced Task Details Popup */}
      <TaskDetailsModal />

      {/* Reusable Create/Edit Task Modal */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        taskToEdit={editingTask}
      />
    </div>
  );
}