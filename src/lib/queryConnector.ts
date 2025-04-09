import { QueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants/queryKeys";

type QueryConnector = {
  queryClient: QueryClient;
  setQueryClient: () => void;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
const queryConnector: QueryConnector = {
  setQueryClient: function () {
    if (!this.queryClient) {
      this.queryClient = new QueryClient();
    }
  },
};

export const refetchUserInfo = (userId?: string) => {
  queryConnector.queryClient.refetchQueries({
    queryKey: QUERY_KEYS.UserInfo(userId),
  });
};

export const refetchWorkflows = (): void => {
  queryConnector.queryClient.refetchQueries({
    queryKey: QUERY_KEYS.Workflows(),
  });
};

export const refetchTickets = (stageId: string): void => {
  queryConnector.queryClient.refetchQueries({
    queryKey: QUERY_KEYS.Tickets(stageId),
  });
};

export default queryConnector;
