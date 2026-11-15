'use client';

import { useState } from "react";
import { Task } from "@/types/task.types";
import { MoreVertical, Edit, Trash2, Calendar } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onViewDetails: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onViewDetails, onEdit, onDelete }: TaskCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const taskId = task._id || task.id || "";

  return (
    <div
      onClick={() => onViewDetails(taskId)}
      className="relative flex items-center justify-between p-4 bg-muted/40 hover:bg-muted/80 rounded-lg border border-border/65 transition-colors cursor-pointer group"
    >
      <div className="space-y-1 pr-8">
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
        {/* Due Date */}
        {task.dueDate && (
          <span className="text-xs text-muted-foreground hidden sm:flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}

        {/* Status Badge */}
        <span className="text-xs px-2.5 py-1 bg-secondary text-secondary-foreground rounded font-medium">
          {task.status}
        </span>

        {/* Three Dot Menu Button */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-colors cursor-pointer"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <>
              {/* Backdrop to close dropdown on outside click */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(false);
                }} 
              />
              <div className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-lg shadow-lg z-20 py-1 text-xs">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    onEdit(task);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:text-primary hover:bg-accent transition-colors cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Task
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    onDelete(taskId);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Task
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}