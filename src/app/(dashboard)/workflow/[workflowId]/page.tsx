import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import prefetchStagesQuery from "@/lib/queries/prefetchStagesQuery";
import WorkflowsPage from "./WorkflowsPage";

async function Workflows({
  params,
}: {
  params: { workflowId: string };
}): Promise<JSX.Element> {
  const queryClient = new QueryClient();
  const { workflowId } = params;

  await prefetchStagesQuery(queryClient, workflowId);

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <WorkflowsPage workflowId={workflowId} />
    </HydrationBoundary>
  );
}

export default Workflows;
