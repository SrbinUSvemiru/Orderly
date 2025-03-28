"use client";
import { FC, useEffect } from "react";
import { Stage as StageType } from "@/types/stage";
import React from "react";
import Droppable from "./Droppable";
import { Ticket as TicketType } from "@/types/ticket";
import Ticket from "./Ticket";
import { Button } from "./ui/button";
import { CirclePlus } from "lucide-react";
import { KeyedMutator } from "swr";
import useTickets from "../lib/queries/useTickets";
import { triggerModal } from "@/lib/triggerModal";

const Stage: FC<{
  stage: StageType;
  mutate: KeyedMutator<StageType[]>;
}> = ({ stage, mutate }) => {
  const { tickets, isLoading } = useTickets({
    stageId: `${stage.id}`,
  });
  useEffect(() => {
    if (tickets?.length && !isLoading) {
      mutate((currentData: StageType[] | undefined) => {
        if (!currentData?.length) return [];

        return currentData?.map((s) =>
          s.id === stage.id ? { ...s, tickets: [...tickets] } : s
        );
      }, false);
    }
  }, [isLoading, tickets, stage.id, mutate]);

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
