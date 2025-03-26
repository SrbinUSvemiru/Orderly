import { LucideIcon } from "lucide-react";
import { create } from "zustand";

interface HeaderItem {
  id: string;
  url?: string;
  title: string;
  icon: LucideIcon;
  type: "popover" | "default";
  actionButton?: {
    icon: LucideIcon;
    label: string;
    onClick?: () => void;
  };
  subitems?: HeaderItem[];
}

export interface HeaderData {
  title: string;
  message?: string;
  workflowId?: string;
  type: string;
  actions?: () => void;
  items?: HeaderItem[];
}

interface HeaderStore {
  headerData: HeaderData | null;
  setHeaderData: (data: HeaderData) => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  headerData: null,
  setHeaderData: (data) => set({ headerData: data }),
}));
