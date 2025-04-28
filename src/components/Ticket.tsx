"use client";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { FC } from "react";
import React from "react";

import getDataFromUnixTimestamp from "@/lib/date";
import { cn } from "@/lib/utils";
import { Ticket as TicketType } from "@/types/ticket";

const Ticket: FC<{
  ticket: TicketType;
  index?: number;
  link: string;
}> = ({ ticket, link }) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: ticket.id,
    data: { ...ticket, type: "ticket" },
  });

  const style = {
    cursor: isDragging ? "grabbing" : "default",
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className={cn("animate-fade-in-ticket")}
      >
        <div className="w-full min-h-[120px]   border-1 border-red-500  rounded-md">
          <div className="rounded-md px-2 py-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={cn("animate-fade-in-ticket")}
    >
      <div className="w-full min-h-[110px] flex dark:bg-zinc-800 bg-zinc-50 border-1 shadow-xs  dark:border-zinc-700 border-neutral-200 overflow-hidden rounded-md">
        <div className="rounded-md px-2 min-h-full w-full flex flex-col items-start justify-between  py-1">
          <div className="flex w-full items-center justify-between">
            <p className="text-[16px] font-[600]">{ticket?.name}</p>
            <Link href={link}>
              <ExternalLink className="h-4" />
            </Link>
          </div>

          <p className="text-[16px] font-[600]">
            {getDataFromUnixTimestamp(ticket?.createdAt, "dd-MM-yyyy HH:mm")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
