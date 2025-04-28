import { QueryClient } from "@tanstack/react-query";

import { Stage } from "@/types/stage";

import { QUERY_KEYS } from "../../constants/queryKeys";
import fetchFromServer from "../fetchFromServer";

const prefetchStagesQuery = async (
  queryClient: QueryClient,
  workflowId: string
) => {
  await queryClient.prefetchQuery<Stage[]>({
    queryKey: QUERY_KEYS.Stages(workflowId),
    queryFn: async () => {
      const response = await fetchFromServer(`/api/stages?id=${workflowId}`, {
        method: "GET",
      });
      return response || ([] as Stage[]);
    },
    staleTime: Infinity,
  });
};

export default prefetchStagesQuery;
