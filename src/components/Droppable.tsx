"use client";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";

function Droppable({
  children,
  id,
  className,
}: {
  children: React.ReactNode;
  id: string;
  className?: string;
}) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div className={cn("w-full h-full", className)} ref={setNodeRef}>
      {children}
    </div>
  );
}

export default Droppable;
