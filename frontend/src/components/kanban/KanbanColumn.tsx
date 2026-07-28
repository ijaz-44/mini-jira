'use client';

import { Task, TaskStatus } from "@/types/task.types";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
}

export function KanbanColumn({ title, tasks }: KanbanColumnProps) {
  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-900/50 p-4 rounded-xl min-w-[280px] flex flex-col space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">{title}</h3>
        <span className="text-xs font-semibold px-2 py-0.5 bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}