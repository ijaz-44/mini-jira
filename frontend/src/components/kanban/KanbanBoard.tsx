'use client';

import { Task, TaskStatus } from "@/types/task.types";
import { KanbanColumn } from "./KanbanColumn";

const COLUMNS: { title: string; status: TaskStatus }[] = [
  { title: "To Do", status: "TODO" },
  { title: "In Progress", status: "IN_PROGRESS" },
  { title: "In Review", status: "IN_REVIEW" },
  { title: "Done", status: "DONE" },
];

export function KanbanBoard({ tasks }: { tasks: Task[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {COLUMNS.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        return <KanbanColumn key={col.status} title={col.title} status={col.status} tasks={columnTasks} />;
      })}
    </div>
  );
}