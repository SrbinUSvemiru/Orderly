"use client";

import { triggerHeader } from "@/lib/triggerHeader";
import { DndContext } from "@dnd-kit/core";
import { useEffect } from "react";

function WorkflowsProvider() {
  useEffect(() => {
    triggerHeader({ title: "Workflows", type: "workflow" });
  }, []);
  return (
    <DndContext>
      <p>sdsds</p>
    </DndContext>
  );
}

export default WorkflowsProvider;
