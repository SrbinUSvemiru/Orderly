import { create } from "zustand";

export interface BaseModalData {
  title: string;
  message?: string;
  action?: () => void;
  submitButton?: { label: string };
}

export interface WorkflowModalData extends BaseModalData {
  modalType: "workflow";
  organizationId: string;
  userId: string;
}

export interface StageModalData extends BaseModalData {
  modalType: "stage";
  workflowId: string;
}

export interface TicketModalData extends BaseModalData {
  modalType: "ticket";
  stageId: string;
  workflowId?: string;
}

export interface ClientModalData extends BaseModalData {
  modalType: "client";
}

export type ModalData =
  | WorkflowModalData
  | StageModalData
  | TicketModalData
  | ClientModalData;

interface ModalStore {
  modalData: ModalData | null;
  openModal: (data: ModalData) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  modalData: null,
  openModal: (data) => set({ modalData: data }),
  closeModal: () => set({ modalData: null }),
}));
