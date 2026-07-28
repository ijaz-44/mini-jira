'use client';

import { Task } from "@/types/task.types";

export function KanbanCard({ task }: { task: Task }) {
  return (
    <div className="p-3 bg-card rounded-lg border border-border shadow-sm space-y-2 hover:border-primary transition-colors cursor-pointer">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-muted-foreground">#{task.id.slice(-4)}</span>
        <span className={`px-2 py-0.5 rounded font-medium ${
          task.priority === "URGENT" ? "bg-destructive/15 text-destructive" : "bg-secondary text-secondary-foreground"
        }`}>
          {task.priority}
        </span>
      </div>
      <h4 className="text-sm font-medium text-card-foreground">{task.title}</h4>
      {task.description && <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>}
    </div>
  );
}