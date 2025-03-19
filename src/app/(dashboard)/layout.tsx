import { Separator } from "@/components/ui/separator";
import AppSidebar from "@/components/Sidebar";

async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-h-screen">
        <header className="flex items-center justify-between container px-6 py-4 h-[64px]">
          Orderly
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="flex-1 container p-4 text-accent-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
