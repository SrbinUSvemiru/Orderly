import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import fetchFromServer from "../fetchFromServer";

import { Ticket } from "@/types/ticket";

const useGetTicketsQuery = (
  stageId: string,
  options?: { enabled: boolean }
) => {
  return useQuery<Ticket[]>({
    queryKey: QUERY_KEYS.Tickets(stageId),
    queryFn: async () => {
      const response = await fetchFromServer(
        `/api/tickets?id=${stageId}`,
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
