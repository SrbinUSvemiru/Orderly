"use client";

import useStages from "@/lib/queries/useStages";
import { triggerHeader } from "@/lib/triggerHeader";
import { Stage } from "@/types/stage";
import { DndContext } from "@dnd-kit/core";

import { useEffect } from "react";
import { use } from "react";

function Workflows({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = use(params);

  const { stages } = useStages({ workflowId: `${workflowId}` });
  console.log(workflowId);
  useEffect(() => {
    triggerHeader({
      title: "Workflows",
      type: "workflow",
      workflowId: `${workflowId}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DndContext>
      {stages?.map((el: Stage) => (
        <p key={el?.name}>{el?.name}</p>
      ))}
    </DndContext>
  );
}

export default Workflows;
