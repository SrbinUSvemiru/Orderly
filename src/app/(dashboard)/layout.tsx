import { Separator } from "@/components/ui/separator";
import AppSidebar from "@/components/Sidebar";
import { ModeToggle } from "@/components/ModeToggle";

async function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-h-screen">
        <header className="flex items-center justify-end  px-6 py-4 h-[64px]">
          <ModeToggle />
        </header>
        <Separator />
        <div className="overflow-auto h-full">
          <div className="flex-1  p-4 text-accent-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
