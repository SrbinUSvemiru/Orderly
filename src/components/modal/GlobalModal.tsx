"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { useModalStore } from "../../stores/modalStore";
import { Workflow } from "./Workflow/workflow";
import { Stage } from "./Stage/stage";
import { Ticket } from "./Ticket/ticket";
import { Client } from "./Client/inviteClient";

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
        {modalData.modalType === "ticket" && (
          <Ticket closeModal={closeModal} modalData={modalData} />
        )}
        {modalData.modalType === "client" && (
          <Client closeModal={closeModal} modalData={modalData} />
        )}
      </DialogContent>
    </Dialog>
  );
}
