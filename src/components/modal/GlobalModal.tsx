"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useModalStore } from "../../stores/modalStore";
import { Workflow } from "./modalTypes/Workflow/workflow";
import { Stage } from "./modalTypes/Stage/stage";

export function GlobalModal() {
  const { modalData, closeModal } = useModalStore();

  if (!modalData) return null;

  return (
    <Dialog open={Boolean(modalData)} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{modalData.title || "Notification"}</DialogTitle>
          <DialogDescription>{modalData.message}</DialogDescription>
        </DialogHeader>

        {modalData.modalType === "workflow" && (
          <Workflow closeModal={closeModal} modalData={modalData} />
        )}
        {modalData.modalType === "stage" && (
          <Stage closeModal={closeModal} modalData={modalData} />
        )}
      </DialogContent>
    </Dialog>
  );
}
