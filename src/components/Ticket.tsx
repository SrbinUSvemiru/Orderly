"use client";
import { FC } from "react";
import { Ticket as TicketType } from "@/types/ticket";
import React from "react";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";

const Ticket: FC<{
  ticket: TicketType;
  index?: number;
}> = ({ ticket }) => {
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
        className="cursor-grab animate-fade-in-ticket"
      >
        <div className="w-full min-h-[100px]  bg-accent border-1 border-red-500 rounded-md">
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
      className={cn(
        isDragging ? "cursor-grabbing" : "cursor-grab",
        "animate-fade-in-ticket"
      )}
    >
      <div className="w-full min-h-[100px] bg-accent border-1 border-amber-500 rounded-md">
        <div className="rounded-md px-2 py-1">
          <p>{ticket?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
