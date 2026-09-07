'use client';

import { Task, TaskStatus } from "@/types/task.types";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void;
}

export function KanbanColumn({ 
  title, 
  tasks, 
  onEditTask, 
  onDeleteTask 
}: KanbanColumnProps) {
  return (
    <div className="flex-1 bg-muted/40 p-4 rounded-xl min-w-70 flex flex-col space-y-3 border border-border">
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <span className="text-xs font-bold px-2.5 py-0.5 bg-muted text-muted-foreground rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-0.5">
        {tasks.length === 0 ? (
          <div className="h-24 flex items-center justify-center border-2 border-dashed border-border rounded-lg text-xs text-muted-foreground">
            No tasks
          </div>
        ) : (
          tasks.map((task) => (
            <KanbanCard 
              key={task.id || task._id} 
              task={task} 
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}