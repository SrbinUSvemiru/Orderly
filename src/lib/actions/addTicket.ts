import fetchFromServer from "../fetchFromServer";
import { ErrorHandler } from "@/types/error";

const addTicket = async ({
  name,
  stageId,
  handleError,
}: {
  name: string;
  stageId: string;
  handleError: ErrorHandler;
}) => {
  if (!name || !stageId) {
    throw new Error("Validation error: name and stageId are required");
  }

  const response = await fetchFromServer(
    `/api/tickets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, stageId }),
    },
    handleError
  );

  return response;
};

export default addTicket;
