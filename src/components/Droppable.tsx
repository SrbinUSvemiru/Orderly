"use client";
import { useDroppable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { Stage } from "@/types/stage";

function Droppable({
  children,
  stage,
  className,
}: {
  children: React.ReactNode;
  stage: Stage;
  className?: string;
}) {
  const { setNodeRef } = useDroppable({
    id: stage.id,
    data: { ...stage, type: "stage" },
  });

  return (
    <div className={cn("w-full h-full", className)} ref={setNodeRef}>
      {children}
    </div>
  );
}

export default Droppable;
