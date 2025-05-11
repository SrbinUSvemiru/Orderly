"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ModalData, useModalStore } from "../../stores/modalStore";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Client } from "./Client/inviteClient";
import { Stage } from "./Stage/stage";
import { Ticket } from "./Ticket/ticket";
import { Workflow } from "./Workflow/workflow";

interface Props extends React.ComponentProps<"div"> {
  modalData: ModalData;
  closeModal: () => void;
}

const DialogProvider = ({ children, modalData, closeModal }: Props) => (
  <Dialog open={Boolean(modalData)} onOpenChange={closeModal}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-xl">
          {modalData.title || "Notification"}
        </DialogTitle>
        <DialogDescription>{modalData.message}</DialogDescription>
      </DialogHeader>

      {children}
    </DialogContent>
  </Dialog>
);

const DrawerProvider = ({ children, modalData, closeModal }: Props) => (
  <Sheet open={Boolean(modalData)} onOpenChange={closeModal}>
    <SheetContent className="p-2 pt-4">
      <SheetHeader>
        <SheetTitle className="text-xl">
          {modalData.title || "Notification"}
        </SheetTitle>
        <SheetDescription>{modalData.message}</SheetDescription>
      </SheetHeader>
      <div className="px-4">{children}</div>
    </SheetContent>
  </Sheet>
);

const Provider = ({ modalData, closeModal, children }: Props) => {
  const type = modalData?.type || "dialog";

  if (type === "drawer") {
    return (
      <DrawerProvider modalData={modalData} closeModal={closeModal}>
        {children}
      </DrawerProvider>
    );
  }

  return (
    <DialogProvider modalData={modalData} closeModal={closeModal}>
      {children}
    </DialogProvider>
  );
};

export function GlobalModal() {
  const { modalData, closeModal } = useModalStore();

  if (!modalData) return null;

  return (
    <Provider modalData={modalData} closeModal={closeModal}>
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
    </Provider>
  );
}
