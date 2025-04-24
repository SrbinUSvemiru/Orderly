"use client";

import { Button } from "../ui/button";
import { ClientHeaderData } from "@/stores/headerStore";
import { triggerModal } from "@/lib/triggerModal";

interface ClientProps {
  headerData: ClientHeaderData;
}

export const Client: React.FC<ClientProps> = ({}) => {
  return (
    <>
      <Button
        onClick={() =>
          triggerModal({
            title: "Invite client",
            submitButton: { label: "Invite" },
            modalType: "client",
          })
        }
      >
        Invite client
      </Button>
    </>
  );
};
