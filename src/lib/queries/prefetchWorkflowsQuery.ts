import { QueryClient } from "@tanstack/react-query";

import { Workflow } from "@/types/workflow";

import { QUERY_KEYS } from "../../constants/queryKeys";
import fetchFromServer from "../fetchFromServer";

const prefetchWorkflowsQuery = async (queryClient: QueryClient) => {
  await queryClient.prefetchQuery<Workflow[]>({
    queryKey: QUERY_KEYS.Workflows(),
    queryFn: async () => {
      const response = await fetchFromServer("/api/workflows", {
        method: "GET",
      });

      // Silent failure: return empty array if fetch fails
      return response || ([] as Workflow[]);
    },
    staleTime: Infinity,
  });
};

export default prefetchWorkflowsQuery;
