import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import fetchFromServer from "../fetchFromServer";

const useGetTicketsCountQuery = (
  stageId: string,
  options?: { enabled: boolean }
) => {
  return useQuery<{ count: number }>({
    queryKey: QUERY_KEYS.TicketsCount(stageId),
    queryFn: async () => {
      const response = await fetchFromServer(
        `/api/tickets/count?id=${stageId}`,
        {
          method: "GET",
        }
        // should fail silently
      );

      return response || {};
    },
    staleTime: Infinity,
    ...options,
  });
};

export default useGetTicketsCountQuery;
