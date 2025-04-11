"use client";

import { ModeToggle } from "@/components/ModeToggle";
import { useHeaderStore } from "@/stores/headerStore";
import { Workflow } from "./headerTypes/workflow";
import { Client } from "./headerTypes/client";

function Header() {
  const { headerData } = useHeaderStore();

  return (
    <header className="flex dark:bg-black items-center justify-end space-x-4 px-6 py-4 h-[64px]">
      {headerData?.type === "workflow" && <Workflow headerData={headerData} />}
      {headerData?.type === "client" && <Client headerData={headerData} />}
      <ModeToggle />
    </header>
  );
}

export default Header;
