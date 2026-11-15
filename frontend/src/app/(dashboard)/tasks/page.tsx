'use client';

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Task } from "@/types/task.types";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { TaskCard } from "./TaskCard";
import { TaskModal } from "@/components/modals/TaskModal";
import { TaskDetailsModal } from "@/components/modals/TaskDetailsModal";

export default function TasksPage() {
  const { tasks, isLoading, deleteTask } = useTasks();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Modal states for Create/Edit Task
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleTaskClick = (taskId: string) => {
    if (!taskId) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set('taskId', taskId);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
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

  const handleDeleteTask = async (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-sm text-muted-foreground gap-2">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading tasks...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header with Create Task Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground">Manage and view all workspace tasks</p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 font-medium text-sm rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Task
        </button>
      </div>

      {/* Tasks List Container */}
      <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm">
        {!tasks || tasks.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No tasks found.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map((task: Task) => {
              const taskId = task._id || task.id || "";
              return (
                <TaskCard
                  key={taskId || task.title}
                  task={task}
                  onViewDetails={handleTaskClick}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDeleteTask}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* URL-Synced Task Details Popup */}
      <TaskDetailsModal />

      {/* Reusable Create / Edit Task Modal */}
      <TaskModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        taskToEdit={editingTask}
      />
    </div>
  );
}