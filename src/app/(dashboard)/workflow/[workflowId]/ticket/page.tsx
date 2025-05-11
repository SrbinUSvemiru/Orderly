import { SearchParams } from "@/types";

import TicketForm from "./TicketForm";

interface PageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ workflowId: string }>;
}

async function Ticket(props: PageProps) {
  const { workflowId } = await props.params;
  const { stageId } = await props.searchParams;
  const validStageId = typeof stageId === "string" ? stageId : "";

  return <TicketForm workflowId={workflowId} stageId={validStageId} />;
}

export default Ticket;
