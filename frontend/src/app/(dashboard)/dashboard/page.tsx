'use client';

import { useState, useMemo } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { KanbanCard } from "@/components/kanban/KanbanCard";
import { CreateTaskModal } from "./CreateTaskModal";
import { CheckCircle2, Clock, AlertCircle, FolderKanban, Plus, Loader2 } from "lucide-react";
import { Task } from "@/types/task.types";

const COLUMNS: { label: string; status: Task["status"] }[] = [
  { label: "To Do", status: "TODO" },
  { label: "In Progress", status: "IN_PROGRESS" },
  { label: "Done", status: "DONE" },
];

export default function DashboardOverviewPage() {
  const { tasks = [], isLoading: tasksLoading, updateStatus, deleteTask } = useTasks();
  const { projects = [], isLoading: projectsLoading } = useProjects();
  
  const [draggedId, setDraggedId] = useState<string | null>(null);
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

  const handleDrop = (status: Task["status"]) => {
    if (draggedId) {
      // Fixed: Passing 2 separate arguments (taskId, status) as expected by useTasks
      updateStatus?.(draggedId, status);
      setDraggedId(null);
    }
  };

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

      {/* Kanban Board */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Kanban Task Board</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.status);
            return (
              <div
                key={col.status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(col.status)}
                className="bg-card/50 border border-border rounded-xl p-4 min-h-87.5 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center pb-2 border-b border-border">
                  <span className="font-semibold text-sm">{col.label}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {colTasks.map((task) => (
                    <div
                      key={task.id || task._id}
                      draggable
                      onDragStart={() => setDraggedId(task.id || task._id || null)}
                    >
                      <KanbanCard 
                        task={task} 
                        onDelete={deleteTask}
                        onEdit={handleOpenEditModal}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
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

      {/* Reusable Create/Edit Task Modal */}
      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        taskToEdit={editingTask}
      />
    </div>
  );
}