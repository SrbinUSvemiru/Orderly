import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys";
import fetchFromServer from "../fetchFromServer";
import { User } from "../../types/user";

const useGetUserInfoQuery = (
  userId: string,
  options?: { enabled: boolean }
) => {
  return useQuery<User>({
    queryKey: QUERY_KEYS.UserInfo(userId),
    queryFn: async () => {
      if (!userId) {
        return {};
      }
      const response = await fetchFromServer(
        `/api/users?id=${userId}`,
        {
          method: "GET",
        }
        // should fail silently
      );
      return response || ({} as User);
    },
    staleTime: Infinity,
    ...options,
  });
};

export default useGetUserInfoQuery;
