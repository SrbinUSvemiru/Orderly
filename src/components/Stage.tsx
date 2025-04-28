"use client";
import { SortableContext } from "@dnd-kit/sortable";
import { CirclePlus } from "lucide-react";
import Link from "next/link";
import { FC, useEffect } from "react";
import React from "react";

import useGetTicketsCountQuery from "@/lib/queries/useGetTicketsCountQuery";
import useGetTicketsQuery from "@/lib/queries/useGetTicketsQuery";
import { triggerHeader } from "@/lib/triggerHeader";
import { cn } from "@/lib/utils";
import { useHeaderStore } from "@/stores/headerStore";
import { Stage as StageType } from "@/types/stage";
import { Ticket as TicketType } from "@/types/ticket";

import Droppable from "./Droppable";
import Ticket from "./Ticket";
import { Tooltip } from "./Tooltip";
import { Badge } from "./__ui/badge";
import { Button } from "./__ui/button";
import { Separator } from "./__ui/separator";

type StageProps = {
  dataTickets?: TicketType[];
  index?: number;
  setData: React.Dispatch<React.SetStateAction<Map<string, TicketType[]>>>;
  stage: StageType;
};

const Stage: FC<StageProps> = ({ stage, setData, dataTickets }) => {
  const headerData = useHeaderStore((state) => state.headerData);

  const { data: tickets, isLoading } = useGetTicketsQuery(stage?.id, {
    enabled: !!stage?.id,
  });

  const { data: ticketsCount } = useGetTicketsCountQuery(stage?.id, {
    enabled: !!stage?.id,
  });

  useEffect(() => {
    if (tickets?.tickets?.length) {
      setData((prev: Map<string, TicketType[]>) => {
        const newData = new Map(prev);
        newData.set(stage.id, tickets?.tickets);
        return newData;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, tickets, stage?.id]);

  return (
    <Droppable
      stage={stage}
      className={cn(
        "flex-col items-center animate-fade-in-ticket justify-start shadow-xs border-zinc-200 border dark:bg-zinc-900 dark:border-zinc-700 rounded-lg p-1.5 h-full min-w-[330px]"
      )}
    >
      <div className="rounded-md px-2   flex items-center justify-between">
        <p>{stage?.name}</p>
        {ticketsCount && (
          <Tooltip text="Number of tickets">
            <Badge variant="secondary">{ticketsCount?.count}</Badge>
          </Tooltip>
        )}
        <Link
          href={`/workflow/${stage?.workflowId}/ticket?stageId=${stage?.id}`}
          onClick={() =>
            triggerHeader({
              ...(headerData || { title: "", type: "ticket" }),
              type: "ticket",
              breadcrumb: [...(headerData?.breadcrumb || [])],
            })
          }
        >
          <Button variant="ghost" className="px-1 py-1 flex">
            <CirclePlus className="h-3 w-3" />
          </Button>
        </Link>
      </div>
      <Separator className="mb-3 mt-1" orientation="horizontal" />
      <div className="grid gap-2 overflow-y-scroll max-h-[calc(100vh-180px)]">
        <SortableContext items={dataTickets?.map((el) => el.id) || []}>
          {dataTickets?.map((el: TicketType) => (
            <Ticket
              ticket={el}
              key={el.id}
              link={`/workflow/${stage?.workflowId}/${el?.id}`}
            />
          ))}
        </SortableContext>
      </div>
    </Droppable>
  );
};

export default Stage;
