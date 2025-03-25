import useSWR from "swr";
import fetcher from "../fetcher";

type UseWorkflowsProps = {
  method?: string;
};

function useWorkflows({ method = "GET" }: UseWorkflowsProps = {}) {
  const { data, error, isLoading } = useSWR(`/api/workflows`, (url) =>
    fetcher(url, { method: method })
  );

  return {
    workflows: data,
    isLoading,
    isError: error,
  };
}

export default useWorkflows;
