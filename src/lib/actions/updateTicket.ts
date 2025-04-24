import fetchFromServer from "../fetchFromServer";

import { Ticket } from "@/types/ticket";

export type UpdateTicketParams = {
  ticketId: string;
  values: Partial<Ticket>;
  handleError?: (error: unknown) => void;
};

const updateTicket = async ({
  ticketId,
  values,
  handleError,
}: UpdateTicketParams) => {
  if (!ticketId) {
    throw new Error("No id provided");
  }

  const response = await fetchFromServer(
    `/api/tickets?id=${ticketId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    },
    handleError
  );

  return response;
};

export default updateTicket;
