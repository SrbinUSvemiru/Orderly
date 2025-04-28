"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import prefetchWorkflowsQuery from "@/lib/queries/prefetchWorkflowsQuery";

function Workflows() {
  const { data: session } = useSession();

  const queryClient = useQueryClient();
  prefetchWorkflowsQuery(queryClient);

  return (
    <>
      <p>Welcome back {session?.user?.name}</p>
    </>
  );
}

export default Workflows;
