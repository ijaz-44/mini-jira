'use client';

import { Task } from "@/types/task.types";
import { MoreVertical, Edit2, Trash2, Calendar, GripVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExtendedTask extends Task {
  dueDate?: string | Date;
}

interface KanbanCardProps {
  task: ExtendedTask;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  dragHandleProps?: Record<string, unknown>;
}

export function KanbanCard({
  task,
  onEdit,
  onDelete,
  dragHandleProps,
}: KanbanCardProps) {
  const taskId = task.id || task._id || "";

  const priorityColors: Record<string, string> = {
    LOW: "bg-muted text-muted-foreground",
    MEDIUM: "bg-secondary text-secondary-foreground",
    HIGH: "bg-accent text-accent-foreground font-semibold",
    URGENT: "bg-destructive/15 text-destructive font-bold",
  };

  return (
    <div className="relative bg-card text-card-foreground p-3.5 rounded-lg border border-border shadow-xs hover:shadow-md transition-all">
      {/* Header: Drag Handle + Title + Permanent 3-Dot Dropdown */}
      <div className="flex items-start justify-between gap-2 mb-2">
        
        {/* Drag Handle (Left Side) & Title */}
        <div className="flex items-start gap-1.5 flex-1 min-w-0 pr-6">
          <button
            type="button"
            {...dragHandleProps}
            className="cursor-grab active:cursor-grabbing text-muted-foreground/60 hover:text-foreground mt-0.5 shrink-0"
            title="Drag task"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <h4 className="text-sm font-semibold line-clamp-2 text-foreground">
            {task.title}
          </h4>
        </div>

        {/* Top-Right Permanently Visible 3-Dot Button */}
        <div className="absolute top-3 right-3 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger
              className="flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Actions</span>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-36">
              {onEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="cursor-pointer gap-2"
                >
                  <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Edit</span>
                </DropdownMenuItem>
              )}

              {onDelete && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    if (taskId) onDelete(taskId);
                  }}
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 pl-5">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50 pl-5">
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider ${
            priorityColors[task.priority] || priorityColors.LOW
          }`}
        >
          {task.priority}
        </span>

        {task.dueDate && (
          <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
            <Calendar className="h-3 w-3" />
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>
    </div>
  );
}