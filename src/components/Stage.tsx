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

type StageProps = {
  index: number;
  stage: StageType;
  initialStagesMutation: (id: string, tickets: TicketType[]) => void;
};

const Stage: FC<StageProps> = ({ stage, initialStagesMutation }) => {
  const { data: tickets, isLoading } = useGetTicketsQuery(stage.id, {
    enabled: !!stage.id,
  });

  useEffect(() => {
    if (tickets?.length) {
      initialStagesMutation(stage.id, tickets);
    }
  }, [isLoading, tickets, stage.id]);

  return (
    <Droppable id={stage.id}>
      <div className="flex-col items-center justify-start rounded-md h-full min-w-[300px]">
        <div className="bg-accent rounded-md px-2 py-1 mb-3 flex items-center justify-between">
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
        <div className="grid gap-3">
          {stage?.tickets?.map((el: TicketType) => (
            <Ticket ticket={el} key={el.id} />
          ))}
        </div>
      </div>
    </Droppable>
  );
};

export default Stage;
