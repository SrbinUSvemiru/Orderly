import { ModalData,useModalStore } from "../stores/modalStore";

export const triggerModal = (data: ModalData) => {
  useModalStore.getState().openModal(data);
};
