import { create } from "zustand";
import { Task } from "@/types/task.types";

interface UIState {
  isSidebarOpen: boolean;
  isTaskModalOpen: boolean;
  selectedTask: Task | null;
  toggleSidebar: () => void;
  setTaskModalOpen: (open: boolean, task?: Task | null) => void;
  setSelectedTask: (task: Task | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isTaskModalOpen: false,
  selectedTask: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setTaskModalOpen: (open, task = null) =>
    set({ isTaskModalOpen: open, selectedTask: task }),
  setSelectedTask: (task) => set({ selectedTask: task }),
}));