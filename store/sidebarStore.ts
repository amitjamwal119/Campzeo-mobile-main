import { create } from "zustand";
import { SidebarState } from "../types/types";


export const useSidebarStore = create<SidebarState>((set) => ({
  sidebarOpen: false,
  openSidebar: () => set({ sidebarOpen: true }),
  closeSidebar: () => set({ sidebarOpen: false }),
}));
