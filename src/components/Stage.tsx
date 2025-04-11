"use client";
import { FC, useEffect } from "react";
import { Stage as StageType } from "@/types/stage";
import React from "react";
import Droppable from "./Droppable";
import { Ticket as TicketType } from "@/types/ticket";
import Ticket from "./Ticket";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";

import { triggerModal } from "@/lib/triggerModal";
import useGetTicketsQuery from "@/lib/queries/useGetTicketsQuery";
import { cn } from "@/lib/utils";

import { SortableContext } from "@dnd-kit/sortable";

type StageProps = {
  dataTickets?: TicketType[];
  index?: number;
  setData: React.Dispatch<React.SetStateAction<Map<string, TicketType[]>>>;
  stage: StageType;
};

const Stage: FC<StageProps> = ({ stage, setData, dataTickets }) => {
  const { data: tickets, isLoading } = useGetTicketsQuery(stage.id, {
    enabled: !!stage.id,
  });

  useEffect(() => {
    if (tickets?.length) {
      setData((prev: Map<string, TicketType[]>) => {
        const newData = new Map(prev);
        newData.set(stage.id, tickets);
        return newData;
      });
    }
  }, [isLoading, tickets, stage.id]);

  return (
    <Droppable
      stage={stage}
      className={cn(
        "flex-col items-center justify-start bg-slate-100 dark:bg-neutral-900 rounded-md p-1.5 h-full min-w-[330px]"
      )}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-md px-2 py-1 mb-3 flex items-center justify-between">
        <p>{stage?.name}</p>
        <Button
          onClick={() =>
            triggerModal({
              title: "Create new ticket",
              modalType: "ticket",
              stageId: stage.id,
            })
          }
          variant="ghost"
          className="px-1 py-1 flex"
        >
          <CirclePlus className="h-3 w-3" />
        </Button>
      </div>
      <div className="grid gap-2">
        <SortableContext items={dataTickets?.map((el) => el.id) || []}>
          {dataTickets?.map((el: TicketType) => (
            <Ticket ticket={el} key={el.id} />
          ))}
        </SortableContext>
      </div>
    </Droppable>
  );
};

export default Stage;
