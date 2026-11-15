'use client';

import { Task, TaskStatus } from "@/types/task.types";
import { KanbanColumn } from "./KanbanColumn";

const COLUMNS: { title: string; status: TaskStatus }[] = [
  { title: "To Do", status: "TODO" },
  { title: "In Progress", status: "IN_PROGRESS" },
  { title: "In Review", status: "IN_REVIEW" },
  { title: "Done", status: "DONE" },
];

export function KanbanBoard({ tasks = [], onEditTask, onDeleteTask }: { 
  tasks: Task[];
  onEditTask?: (task: Task) => void;
  onDeleteTask?: (taskId: string) => void; 
}) {
  return (
    <div className="w-full overflow-x-auto pb-4 pt-1">
      {/* min-w-max ensures columns never get squished and take their exact required width */}
      <div className="flex gap-4 min-w-max items-start">
        {COLUMNS.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col.status);
          return (
            <div key={col.status} className="w-80 shrink-0">
              <KanbanColumn
                title={col.title}
                status={col.status}
                tasks={columnTasks}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}            
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}