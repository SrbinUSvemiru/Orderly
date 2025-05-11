import GlobalHeader from "@/components/header/GlobalHeader";
import AppSidebar from "@/components/Sidebar";
import { Separator } from "@/components/ui/separator";

async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex overflow-hidden ">
      <AppSidebar />
      <div className="flex flex-1 flex-col shadow-lg md:rounded-tl-2xl md:mt-4 overflow-hidden">
        <GlobalHeader />
        <Separator />

        <div className="flex-1 w-full overflow-scroll px-8 py-5 bg-white dark:bg-zinc-900 ">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
