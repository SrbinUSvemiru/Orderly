import { Separator } from "@/components/ui/separator";
import AppSidebar from "@/components/Sidebar";

import Header from "@/components/header/Header";

async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-h-screen overflow-hidden">
        <Header />
        <Separator />
        <div className="overflow-hidden h-full flex">
          <div className="flex-1 w-full overflow-auto p-8 bg-slate-50 dark:bg-black ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
