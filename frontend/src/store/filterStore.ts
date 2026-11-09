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

export const useFilterStore = create<FilterState>((set: any) => ({
  search: "",
  status: "ALL",
  priority: "ALL",
  setSearch: (search: any) => set({ search }),
  setStatus: (status: any) => set({ status }),
  setPriority: (priority: any) => set({ priority }),
  resetFilters: () => set({ search: "", status: "ALL", priority: "ALL" }),
}));