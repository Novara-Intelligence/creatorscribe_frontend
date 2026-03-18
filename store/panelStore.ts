import { create } from "zustand";

type PanelId = "uploads" | null;

interface PanelStore {
  activePanel: PanelId;
  togglePanel: (id: PanelId) => void;
  closePanel: () => void;
  pendingFiles: File[];
  addPendingFiles: (files: File[]) => void;
  clearPendingFiles: () => void;
  draggedFile: File | null;
  setDraggedFile: (file: File | null) => void;
  uploadRefreshKey: number;
  triggerUploadRefresh: () => void;
}

const usePanelStore = create<PanelStore>((set) => ({
  activePanel: null,
  togglePanel: (id) => set((s) => ({ activePanel: s.activePanel === id ? null : id })),
  closePanel: () => set({ activePanel: null }),
  pendingFiles: [],
  addPendingFiles: (files) => set((s) => ({ activePanel: "uploads", pendingFiles: [...s.pendingFiles, ...files] })),
  clearPendingFiles: () => set({ pendingFiles: [] }),
  draggedFile: null,
  setDraggedFile: (file) => set({ draggedFile: file }),
  uploadRefreshKey: 0,
  triggerUploadRefresh: () => set((s) => ({ uploadRefreshKey: s.uploadRefreshKey + 1 })),
}));

export default usePanelStore;
