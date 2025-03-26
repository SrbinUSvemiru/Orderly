import useSWR from "swr";
import fetcher from "../fetcher";

type UseStagesProps = {
  method?: string;
  workflowId: string;
};

function useStages({ method = "GET", workflowId }: UseStagesProps) {
  const { data, error, isLoading } = useSWR(
    `/api/stages?id=${workflowId}`,
    (url) => fetcher(url, { method: method })
  );

  return {
    stages: data,
    isLoading,
    isError: error,
  };
}

export default useStages;
