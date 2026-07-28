import { create } from "zustand";
import { TaskStatus, TaskPriority } from "@/types/task.types";

interface FilterState {
  search: string;
  status: TaskStatus | "ALL";
  priority: TaskPriority | "ALL";
  setSearch: (search: string) => void;
  setStatus: (status: TaskStatus | "ALL") => void;
  setPriority: (priority: TaskPriority | "ALL") => void;
  resetFilters: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  search: "",
  status: "ALL",
  priority: "ALL",
  setSearch: (search) => set({ search }),
  setStatus: (status) => set({ status }),
  setPriority: (priority) => set({ priority }),
  resetFilters: () => set({ search: "", status: "ALL", priority: "ALL" }),
}));