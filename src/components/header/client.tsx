"use client";

import { triggerModal } from "@/lib/triggerModal";
import { ClientHeaderData } from "@/stores/headerStore";

import { Button } from "../ui/button";

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
            message: "Email associated with another account will not be valid",
            type: "drawer",
            modalType: "client",
          })
        }
      >
        Invite client
      </Button>
    </>
  );
};
