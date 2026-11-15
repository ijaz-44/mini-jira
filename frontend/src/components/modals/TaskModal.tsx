'use client';

import { Task } from "@/types/task.types";
import { X } from "lucide-react";
import { TaskForm } from "@/components/modals/TaskForm";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export function TaskModal({ isOpen, onClose, taskToEdit }: CreateTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border text-card-foreground w-full max-w-md rounded-xl p-6 shadow-xl space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h3 className="font-semibold text-lg tracking-tight">
            {taskToEdit ? "Edit Task" : "Create New Task"}
          </h3>
          <button 
            type="button"
            onClick={onClose} 
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-accent transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Form Component */}
        <TaskForm 
          taskToEdit={taskToEdit} 
          onSuccess={onClose} 
        />
        
      </div>
    </div>
  );
}