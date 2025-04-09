import useSWR from "swr";
import fetcher from "../fetcher";
import { Stage as StageType } from "../../types/stage";

type UseStagesProps = {
  method?: string;
  workflowId: string;
};

function useStages({ method = "GET", workflowId }: UseStagesProps) {
  const { data, error, isLoading, mutate } = useSWR<StageType[]>(
    `/api/stages?id=${workflowId}`,
    (url: string) => fetcher(url, { method: method }),
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    stages: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export default useStages;
