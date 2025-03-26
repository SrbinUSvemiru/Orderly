import { create } from "zustand";

export interface ModalData {
  title: string;
  message?: string;
  workflowId?: string;
  action?: () => void;
  modalType: string;
  submitButton?: { label: string };
}

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
