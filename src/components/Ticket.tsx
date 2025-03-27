"use client";
import { FC } from "react";
import { Ticket as TicketType } from "@/types/ticket";
import React from "react";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const Ticket: FC<{
  ticket: TicketType;
}> = ({ ticket }) => {
  const { attributes, setNodeRef, listeners, transform } = useDraggable({
    id: ticket.id,
    data: { ...ticket },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <div className="w-full min-h-[100px] bg-amber-500 rounded-md">
        <div className="rounded-md px-2 py-1">
          <p>{ticket?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
