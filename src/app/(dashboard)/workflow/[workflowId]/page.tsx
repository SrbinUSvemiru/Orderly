"use client";

import Stage from "@/components/Stage";
import { triggerHeader } from "@/lib/triggerHeader";
import { Stage as StageType } from "@/types/stage";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Ticket, Ticket as TicketType } from "@/types/ticket";
import { useQueryClient } from "@tanstack/react-query";

import { useCallback, useEffect } from "react";
import { use } from "react";
import { toast } from "sonner";
import useGetStagesQuery from "@/lib/queries/useGetStagesQuery";
import updateTicket, { UpdateTicketParams } from "@/lib/actions/updateTicket";
import { useMutation } from "@tanstack/react-query";
import DashboardSkeleton from "@/components/skeleton/dashboard";

function Workflows({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = use(params);
  const queryClient = useQueryClient();

  const { data: stages, isLoading } = useGetStagesQuery(workflowId, {
    enabled: !!workflowId,
  });

  const mutation = useMutation<void, Error, UpdateTicketParams>({
    mutationFn: updateTicket,
    onSuccess: () => {
      toast.success("Ticket successfully updated");
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    const stageId = over?.id;
    const ticketId = active?.data?.current?.id;

    if (active?.data?.current?.stageId === stageId || !stageId) return;

    // Optimistically update the cache
    queryClient.setQueryData(
      ["stages", workflowId],
      (currentData: StageType[] | undefined) => {
        if (!currentData) return [];

        return currentData.map((s) => {
          if (s.id !== stageId) {
            return {
              ...s,
              tickets: s.tickets?.filter((t) => t.id !== ticketId) || [],
            };
          } else {
            return {
              ...s,
              tickets: [
                ...(s.tickets || []),
                {
                  ...active.data.current,
                  stageId,
                } as TicketType,
              ],
            };
          }
        });
      }
    );

    try {
      await mutation.mutateAsync({
        ticketId,
        values: { stageId: String(stageId) },
      });
    } catch {
      // Rollback on error: refetch stages
      queryClient.invalidateQueries({ queryKey: ["stages", workflowId] });
    }
  };

  const initialStagesMutation = useCallback((id: string, tickets: Ticket[]) => {
    queryClient.setQueryData(
      ["stages", workflowId],
      (currentData: StageType[] | undefined) => {
        if (!currentData?.length) return [];

        return currentData?.map((s) =>
          s.id === id ? { ...s, tickets: [...tickets] } : s
        );
      }
    );
  }, []);

  useEffect(() => {
    triggerHeader({
      title: "Workflows",
      type: "workflow",
      workflowId: `${workflowId}`,
      action: async () => {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {isLoading || !stages?.length ? (
        <DashboardSkeleton />
      ) : (
        <div className="flex gap-x-4 h-full w-full">
          {stages?.map((el: StageType, index) => (
            <Stage
              stage={el}
              index={index + 1}
              key={el.id}
              initialStagesMutation={initialStagesMutation}
            />
          ))}
        </div>
      )}
    </DndContext>
  );
}

export default Workflows;
