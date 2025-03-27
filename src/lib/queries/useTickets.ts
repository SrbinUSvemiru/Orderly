import useSWR from "swr";
import fetcher from "../fetcher";
import { Ticket as TicketType } from "../../types/ticket";

type UseTicketsProps = {
  method?: string;
  stageId: string;
};

function useTickets({ method = "GET", stageId }: UseTicketsProps) {
  const { data, error, isLoading, mutate } = useSWR<TicketType[]>(
    `/api/tickets?id=${stageId}`,
    (url: string) => fetcher(url, { method: method })
  );

  return {
    tickets: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export default useTickets;
