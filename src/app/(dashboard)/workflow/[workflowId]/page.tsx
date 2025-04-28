// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from "@tanstack/react-query";
// import prefetchStagesQuery from "@/lib/queries/prefetchStagesQuery";
import WorkflowsPage from "./WorkflowsPage";

type Params = Promise<{ workflowId: string }>;

async function Workflows(props: { params: Params }) {
  const params = await props.params;

  // const dehydratedState = dehydrate(queryClient);
  return (
    // <HydrationBoundary state={dehydratedState}>
    <WorkflowsPage workflowId={params.workflowId} />
    // </HydrationBoundary>
  );
}

export default Workflows;
