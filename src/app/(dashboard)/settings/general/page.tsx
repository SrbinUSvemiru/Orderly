"use client";

import { useLayoutEffect } from "react";

import { ModeToggle } from "@/components/ModeToggle";
import { triggerHeader } from "@/lib/triggerHeader";

function General() {
  useLayoutEffect(() => {
    triggerHeader({
      title: "Settings",
      type: "default",
      breadcrumb: [
        {
          id: "settings",
          label: "Settings",
          url: "",
        },
        {
          id: "general",
          label: "General",
          url: "",
        },
      ],
      action: async () => {},
    });
  }, []);
  return (
    <div>
      <ModeToggle />
    </div>
  );
}

export default General;
