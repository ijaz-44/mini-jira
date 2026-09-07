'use client';

import { useFilterStore } from "@/store/filterStore";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { TaskStatus, TaskPriority } from "@/types/task.types";

export function TaskFilters() {
  const { search, status, priority, setSearch, setStatus, setPriority, resetFilters } = useFilterStore();

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between mb-6">
      {/* Search Input */}
      <Input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-xs"
      />

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* Status Filter */}
        <div className="w-35">
          <Select value={status} onValueChange={(val) => setStatus(val as TaskStatus | "ALL")}>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="TODO">To Do</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="IN_REVIEW">In Review</SelectItem>
            <SelectItem value="DONE">Done</SelectItem>
          </Select>
        </div>

        {/* Priority Filter */}
        <div className="w-35">
          <Select value={priority} onValueChange={(val) => setPriority(val as TaskPriority | "ALL")}>
            <SelectItem value="ALL">All Priority</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="URGENT">Urgent</SelectItem>
          </Select>
        </div>

        {/* Reset Button */}
        <Button variant="outline" size="sm" onClick={resetFilters} title="Reset Filters" className="px-2.5">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}