import { useQuery } from "@tanstack/react-query";

import { Workflow } from "@/types/workflow";

import { QUERY_KEYS } from "../../constants/queryKeys";
import fetchFromServer from "../fetchFromServer";

const useGetWorkflowsQuery = (options?: { enabled: boolean }) => {
  return useQuery<Workflow[]>({
    queryKey: QUERY_KEYS.Workflows(),
    queryFn: async () => {
      const response = await fetchFromServer(
        "/api/workflows",
        {
          method: "GET",
        }
        // should fail silently
      );
      return response || ([] as Workflow[]);
    },
    staleTime: Infinity,
    ...options,
  });
};

export default useGetWorkflowsQuery;
