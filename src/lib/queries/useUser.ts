import useSWR from "swr";
import fetcher from "../fetcher";

type UseUserProps = {
  id?: string;
  method?: string;
};

function useUser({ id, method = "GET" }: UseUserProps = {}) {
  const { data, error, isLoading } = useSWR(
    id ? `/api/users/${id}` : `/api/users`,
    (url: string) => fetcher(url, { method })
  );

  return {
    user: data,
    isLoading,
    isError: error,
  };
}

export default useUser;
