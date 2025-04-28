"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
// import { restrictToParentElement } from "@dnd-kit/modifiers";
import { useCallback, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";

import DashboardSkeleton from "@/components/skeleton/dashboard";
import Stage from "@/components/Stage";
import Ticket from "@/components/Ticket";
import updateTicket from "@/lib/actions/updateTicket";
import useGetStagesQuery from "@/lib/queries/useGetStagesQuery";
import useGetWorkflowsQuery from "@/lib/queries/useGetWorkflowsQuery";
import { refetchTicketsCount } from "@/lib/queryConnector";
import { triggerHeader } from "@/lib/triggerHeader";
import { Stage as StageType } from "@/types/stage";
import { Ticket as TicketType } from "@/types/ticket";

function Workflows({ workflowId }: { workflowId: string }) {
  const workflows = useGetWorkflowsQuery();

  const { data: stages, isLoading } = useGetStagesQuery(workflowId, {
    enabled: !!workflowId,
  });

  const [data, setData] = useState<Map<string, TicketType[]>>(new Map());

  const [activeDraggable, setActiveDraggable] = useState<{
    index: number;
    data: TicketType;
  } | null>(null);

  const sensor = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

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
    const activeStageId = active.data.current?.stageId;
    const overStageId =
      over.data.current?.type === "ticket"
        ? over.data.current?.stageId
        : over.id;

    if (!activeStageId || !overStageId) return;

    if (activeStageId === overStageId) {
      return;
    }

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
    if (activeDraggable) {
      refetchTicketsCount(active.data.current?.stageId);
      refetchTicketsCount(activeDraggable?.data?.stageId);
    }
    setActiveDraggable(null);
    toast.success(response.message);
  };

  useLayoutEffect(() => {
    const currentWorkflow = workflows?.data?.find((el) => el.id === workflowId);
    if (!currentWorkflow) return;
    triggerHeader({
      title: "Workflows",
      type: "workflow",
      workflowId: `${workflowId}`,
      breadcrumb: [
        {
          id: "dashboard",
          label: "Dashboard",
          url: "",
        },
        {
          id: workflowId,
          label: currentWorkflow?.name || "",
          url: "/workflow/" + workflowId,
        },
      ],
      action: async () => {},
    });
  }, [workflowId, workflows]);

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
        <div className="flex gap-x-4 h-full w-fit">
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
            {activeDraggable && (
              <Ticket link="" ticket={activeDraggable?.data} />
            )}
          </DragOverlay>,
          document.body
        )}
    </DndContext>
  );
}

export default Workflows;
