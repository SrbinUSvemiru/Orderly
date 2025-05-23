import { useQuery } from "@tanstack/react-query";

import { Ticket } from "@/types/ticket";

import { QUERY_KEYS } from "../../constants/queryKeys";
import fetchFromServer from "../fetchFromServer";

const useGetTicketsQuery = (id: string, options?: { enabled: boolean }) => {
  return useQuery<{ ticket: Ticket }>({
    queryKey: QUERY_KEYS.Ticket(id),
    queryFn: async () => {
      const response = await fetchFromServer(
        `/api/tickets?id=${id}`,
        {
          method: "GET",
        }
        // should fail silently
      );
      return response || ({} as Ticket);
    },
    staleTime: Infinity,
    ...options,
  });
};

export default useGetTicketsQuery;
