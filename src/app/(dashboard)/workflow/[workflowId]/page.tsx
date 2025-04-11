"use client";

import Stage from "@/components/Stage";
import { triggerHeader } from "@/lib/triggerHeader";
import { Stage as StageType } from "@/types/stage";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragOverEvent,
} from "@dnd-kit/core";
import { Ticket as TicketType } from "@/types/ticket";
import Ticket from "@/components/Ticket";
// import { restrictToParentElement } from "@dnd-kit/modifiers";

import { useCallback, useEffect, useState } from "react";
import { use } from "react";
import { toast } from "sonner";
import useGetStagesQuery from "@/lib/queries/useGetStagesQuery";
import updateTicket from "@/lib/actions/updateTicket";
import DashboardSkeleton from "@/components/skeleton/dashboard";
import { createPortal } from "react-dom";
import { arrayMove } from "@dnd-kit/sortable";

function Workflows({ params }: { params: Promise<{ workflowId: string }> }) {
  const { workflowId } = use(params);

  const [data, setData] = useState<Map<string, TicketType[]>>(new Map());

  const [activeDraggable, setActiveDraggable] = useState<{
    index: number;
    data: TicketType;
  } | null>(null);

  const sensor = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  const { data: stages, isLoading } = useGetStagesQuery(workflowId, {
    enabled: !!workflowId,
  });

  const moveTicketBetweenStages = useCallback(
    ({
      activeId,
      overId,
      activeStageId,
      overStageId,
      ticket,
      data,
    }: {
      activeId: string;
      overId: string;
      activeStageId: string;
      overStageId: string;
      ticket: TicketType;
      data: Map<string, TicketType[]>;
    }): Map<string, TicketType[]> => {
      const newData = new Map(data);

      const activeTickets = newData.get(activeStageId) || [];
      const overTickets = [...(newData.get(overStageId) || [])];

      const overTicketIdx = overTickets.findIndex((t) => t.id === overId);
      const activeTicketIdx = activeTickets.findIndex((t) => t.id === activeId);

      if (overStageId === activeStageId) {
        const newActiveTickets = arrayMove(
          activeTickets,
          activeTicketIdx,
          overTicketIdx
        );
        newData.set(activeStageId, newActiveTickets);
        return newData;
      }

      const filteredActive = activeTickets.filter((t) => t.id !== activeId);

      const insertIndex =
        overTicketIdx >= 0 ? overTicketIdx : overTickets.length;

      overTickets.splice(insertIndex, 0, {
        ...ticket,
        stageId: overStageId,
      });

      newData.set(activeStageId, filteredActive);
      newData.set(overStageId || overId, overTickets);

      return newData;
    },
    []
  );

  const handleOnDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;
    const activeId = active?.id;
    const overId = over?.id;

    if (activeId === overId || !overId) return;

    const overStageId =
      over.data.current?.type === "ticket"
        ? over.data.current?.stageId
        : over.id;

    setData((prev) =>
      moveTicketBetweenStages({
        activeId: `${activeId}`,
        overId: `${overId}`,
        activeStageId: active.data.current?.stageId,
        overStageId: overStageId,
        ticket: active.data.current as TicketType,
        data: prev,
      })
    );
  };

  const handleDragStart = async (event: DragStartEvent) => {
    const { active } = event;
    setActiveDraggable({
      index: active.data.current?.sortable.index,
      data: active.data.current as TicketType,
    });
  };

  const handleOnDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    const overId = over?.id;

    if (!overId) return;

    if (activeDraggable?.data?.stageId === active?.data.current?.stageId)
      return;

    const response = await updateTicket({
      ticketId: active.id as string,
      values: { stageId: String(active.data.current?.stageId) },
      handleError: (error) => {
        toast.error(error as string);
      },
    });

    if (!response.success) {
      //rollback the data
      setData((prev) => {
        const newData = new Map(prev);
        const oldStageId = activeDraggable?.data?.stageId; // push to old stage
        const newStageId = active.data.current?.stageId;

        const oldTickets = [...(newData.get(oldStageId || "") || [])]; // push to old stage
        const newTickets = [
          ...(newData
            .get(newStageId)
            ?.filter((el) => el?.id !== activeDraggable?.data?.id) || []),
        ]; // filter from new

        const insertIndex = activeDraggable?.index || 0;

        if (activeDraggable) {
          oldTickets.splice(insertIndex, 0, {
            ...activeDraggable?.data,
          });
        }
        newData.set(oldStageId || "", oldTickets);
        newData.set(newStageId, newTickets);

        return newData;
      });
      return;
    }
    setActiveDraggable(null);
    toast.success(response.message);
  };

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
    <DndContext
      onDragEnd={handleOnDragEnd}
      onDragStart={handleDragStart}
      onDragOver={handleOnDragOver}
      collisionDetection={closestCenter}
      sensors={sensor}
    >
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="flex gap-x-4 h-full w-full">
          {stages?.map((el: StageType, index) => (
            <Stage
              setData={setData}
              stage={el}
              dataTickets={data.get(el?.id) || []}
              index={index + 1}
              key={el.id}
            />
          ))}
        </div>
      )}
      {typeof window !== "undefined" &&
        createPortal(
          <DragOverlay>
            {activeDraggable && <Ticket ticket={activeDraggable?.data} />}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}

export default Workflows;
