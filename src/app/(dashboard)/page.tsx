"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useLayoutEffect } from "react";

import prefetchWorkflowsQuery from "@/lib/queries/prefetchWorkflowsQuery";
import { triggerHeader } from "@/lib/triggerHeader";
import { useUserStore } from "@/stores/userStore";

function Workflows() {
  const queryClient = useQueryClient();
  prefetchWorkflowsQuery(queryClient);
  const user = useUserStore((state) => state.user);

  useLayoutEffect(() => {
    triggerHeader({ type: "default" });
  }, []);

  return (
    <>
      <p>
        Welcome back {user?.firstName} {user?.lastName}
      </p>
    </>
  );
}

export default Workflows;
