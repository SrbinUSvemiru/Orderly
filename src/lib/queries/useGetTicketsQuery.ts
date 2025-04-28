import { useQuery } from "@tanstack/react-query";

import { Ticket } from "@/types/ticket";

import { QUERY_KEYS } from "../../constants/queryKeys";
import fetchFromServer from "../fetchFromServer";

const useGetTicketsQuery = (
  stageId: string,
  options?: { enabled: boolean }
) => {
  return useQuery<{ tickets: Ticket[]; count: number }>({
    queryKey: QUERY_KEYS.Tickets(stageId),
    queryFn: async () => {
      const response = await fetchFromServer(
        `/api/tickets?stageId=${stageId}`,
        {
          method: "GET",
        }
        // should fail silently
      );
      return response || ([] as Ticket[]);
    },
    staleTime: Infinity,
    ...options,
  });
};

export default useGetTicketsQuery;
