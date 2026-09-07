'use client';

import { useUIStore } from "@/store/uiStore";
import { TaskForm } from "./TaskForm";
import { X } from "lucide-react";
import { Task } from "@/types/task.types";

interface TaskModalProps {
  projectId: string;
  initialData?: Task | null;
}

export function TaskModal({ projectId, initialData }: TaskModalProps) {
  const { isTaskModalOpen, setTaskModalOpen } = useUIStore();

  if (!isTaskModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl p-6 shadow-xl border border-gray-200 dark:border-gray-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {initialData ? "Edit Task" : "Create New Task"}
          </h2>
          <button
            onClick={() => setTaskModalOpen(false)}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <TaskForm
          projectId={projectId}
          initialData={initialData}
          onSuccess={() => setTaskModalOpen(false)}
        />
      </div>
    </div>
  );
}