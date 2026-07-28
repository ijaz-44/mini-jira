import { create } from "zustand";

interface UIState {
  isSidebarOpen: boolean;
  isTaskModalOpen: boolean;
  toggleSidebar: () => void;
  setTaskModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isTaskModalOpen: false,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setTaskModalOpen: (open) => set({ isTaskModalOpen: open }),
}));