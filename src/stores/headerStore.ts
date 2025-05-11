// import { LucideIcon } from "lucide-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
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

export interface Breadcrumb {
  id: string;
  label: string;
  url: string;
}

interface BaseHeaderData {
  title?: string;
  type?: string;
  breadcrumb?: Breadcrumb[];
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
  stageId?: string;
  workflowId?: string;
}

export interface ClientHeaderData extends BaseHeaderData {
  type: "client";
}

export interface DefaultHeaderData extends BaseHeaderData {
  type: "default";
}

export type HeaderData =
  | WorkflowHeaderData
  | StageHeaderData
  | TicketHeaderData
  | ClientHeaderData
  | DefaultHeaderData;

interface HeaderStore {
  headerData: HeaderData | null;
  setHeaderData: (_data: HeaderData) => void;
  setBreadcrumb: (_breadcrumb: Breadcrumb) => void;
}

export const useHeaderStore = create(
  persist<HeaderStore>(
    (set) => ({
      headerData: null,

      setHeaderData: (data) => set({ headerData: data }),
      setBreadcrumb: (breadcrumb: Breadcrumb) =>
        set((state) => {
          const breadcrumbs = state.headerData?.breadcrumb || [];
          return {
            headerData: {
              ...state.headerData,
              breadcrumb: [...breadcrumbs, breadcrumb],
            } as HeaderData,
          } as HeaderStore;
        }),
    }),
    {
      name: "header-storage",
      storage: {
        getItem: (key) => {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: (key, value) => {
          localStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: (key) => {
          localStorage.removeItem(key);
        },
      },
    }
  )
);
