"use client";

import { useEffect } from "react";
import { triggerHeader } from "@/lib/triggerHeader";
import { useUserStore } from "@/stores/userStore";

function Clients() {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    triggerHeader({
      title: "Clients",
      type: "client",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return (
    <>
      <p>Clients</p>
    </>
  );
}

export default Clients;
