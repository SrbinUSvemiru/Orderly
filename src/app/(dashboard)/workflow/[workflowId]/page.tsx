import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import prefetchStagesQuery from "@/lib/queries/prefetchStagesQuery";
import WorkflowsPage from "./WorkflowsPage";

type PageProps = {
  params: { workflowId: string };
};

async function Workflows({ params }: PageProps) {
  const queryClient = new QueryClient();
  const { workflowId } = await params;
  await prefetchStagesQuery(queryClient, workflowId);

  const dehydratedState = dehydrate(queryClient);
  return (
    <HydrationBoundary state={dehydratedState}>
      <WorkflowsPage workflowId={workflowId} />
    </HydrationBoundary>
  );
}

export default Workflows;
