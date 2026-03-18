"use client";

import usePanelStore from "@/store/panelStore";

export function usePanel() {
  const activePanel = usePanelStore((s) => s.activePanel);
  const togglePanel = usePanelStore((s) => s.togglePanel);
  const closePanel = usePanelStore((s) => s.closePanel);
  const pendingFiles = usePanelStore((s) => s.pendingFiles);
  const addPendingFiles = usePanelStore((s) => s.addPendingFiles);
  const clearPendingFiles = usePanelStore((s) => s.clearPendingFiles);
  const draggedFile = usePanelStore((s) => s.draggedFile);
  const setDraggedFile = usePanelStore((s) => s.setDraggedFile);

  return { activePanel, togglePanel, closePanel, pendingFiles, addPendingFiles, clearPendingFiles, draggedFile, setDraggedFile };
}
