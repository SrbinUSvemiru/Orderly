"use client";

import Stage from "@/components/Stage";
import useStages from "@/lib/queries/useStages";
import { triggerHeader } from "@/lib/triggerHeader";
import { Stage as StageType } from "@/types/stage";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Ticket as TicketType } from "@/types/ticket";

import { useEffect } from "react";
import { use } from "react";
import { toast } from "sonner";

function Workflows({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = use(params);

  const { stages, mutate, isLoading } = useStages({
    workflowId: `${workflowId}`,
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    const stageId = over?.id;
    const ticketId = active?.data?.current?.id;

    if (active?.data?.current?.stageId === stageId) return;
    mutate((currentData: StageType[] | undefined) => {
      if (!currentData || !currentData.length) return [];

      return currentData?.map((s) => {
        if (s?.id !== stageId) {
          const newTickets = s.tickets
            ? s.tickets.filter((el) => el.id !== ticketId)
            : [];
          return {
            ...s,
            tickets: newTickets,
          };
        } else {
          const newTickets = [
            ...(s.tickets || []),
            { ...active.data.current, stageId: stageId } as TicketType,
          ];

          return {
            ...s,
            tickets: newTickets,
          };
        }
      });
    }, false); // Set false to avoid automatic revalidation
    try {
      const response = await fetch(`/api/tickets?id=${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stageId: stageId,
        }),
      });

      if (response.ok) {
        toast.success("Ticket successfully updated");
      }
    } catch {
      mutate();
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    triggerHeader({
      title: "Workflows",
      type: "workflow",
      workflowId: `${workflowId}`,
      action: async () => await mutate(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <div>Loading</div>;
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-x-4 h-full w-full">
        {stages?.map((el: StageType) => (
          <Stage stage={el} key={el.id} mutate={mutate} />
        ))}
      </div>
    </DndContext>
  );
}

export default Workflows;
