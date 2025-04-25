import { Separator } from "@/components/ui/separator";
import AppSidebar from "@/components/Sidebar";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import prefetchWorkflowsQuery from "@/lib/queries/prefetchWorkflowsQuery";

import GlobalHeader from "@/components/header/GlobalHeader";

async function Layout({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  await prefetchWorkflowsQuery(queryClient);

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="min-h-screen flex overflow-hidden">
        <AppSidebar />

        <div className="flex flex-1 flex-col shadow-lg md:rounded-tl-2xl md:mt-4 overflow-hidden">
          <GlobalHeader />

          <Separator />

          <div className="flex-1 w-full overflow-scroll px-8 py-5 bg-white dark:bg-zinc-900 ">
            {children}
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}

export default Layout;
