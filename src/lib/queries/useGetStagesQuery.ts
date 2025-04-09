import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import fetchFromServer from "../fetchFromServer";

import { Stage } from "@/types/stage";

const useGetStagesQuery = (
  workflowId: string,
  options?: { enabled: boolean }
) => {
  return useQuery<Stage[]>({
    queryKey: QUERY_KEYS.Stages(workflowId),
    queryFn: async () => {
      const response = await fetchFromServer(
        `/api/stages?id=${workflowId}`,
        {
          method: "GET",
        }
        // should fail silently
      );
      return response || ([] as Stage[]);
    },
    staleTime: Infinity,
    ...options,
  });
};

export default useGetStagesQuery;
