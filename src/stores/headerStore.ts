// import { LucideIcon } from "lucide-react";
import { create } from "zustand";

// interface HeaderItem {
//   id: string;
//   url?: string;
//   title: string;
//   icon: LucideIcon;
//   type: "popover" | "default";
//   actionButton?: {
//     icon: LucideIcon;
//     label: string;
//     onClick?: () => void;
//   };
//   subitems?: HeaderItem[];
// }

interface BaseHeaderData {
  title: string;
  type: string;
  action?: () => void;
}

export interface WorkflowHeaderData extends BaseHeaderData {
  type: "workflow";
  workflowId: string;
}

export interface StageHeaderData extends BaseHeaderData {
  type: "stage";
  workflowId: string;
}

export interface TicketHeaderData extends BaseHeaderData {
  type: "ticket";
  stageId: string;
  workflowId?: string;
}

export interface ClientHeaderData extends BaseHeaderData {
  type: "client";
}

export type HeaderData =
  | WorkflowHeaderData
  | StageHeaderData
  | TicketHeaderData
  | ClientHeaderData;

interface HeaderStore {
  headerData: HeaderData | null;
  setHeaderData: (data: HeaderData) => void;
}

export const useHeaderStore = create<HeaderStore>((set) => ({
  headerData: null,
  setHeaderData: (data) => set({ headerData: data }),
}));
