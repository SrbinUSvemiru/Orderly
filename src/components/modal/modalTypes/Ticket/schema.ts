import * as z from "zod";

export const TicketSchema = z.object({
  name: z.string().min(3, "Ticket must be at least 3 characters"),
});
