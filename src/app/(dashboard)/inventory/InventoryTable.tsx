"use client";
import React, { useLayoutEffect } from "react";

import { triggerHeader } from "@/lib/triggerHeader";

function InventoryTable() {
  useLayoutEffect(() => {
    triggerHeader({
      title: "Inventory",
      type: "default",
      breadcrumb: [
        {
          id: "inventory",
          label: "Inventory",
          url: "",
        },
      ],
      action: async () => {},
    });
  }, []);

  return <div>InventoryTable</div>;
}

export default InventoryTable;
