import { ErrorHandler } from "@/types/error";

import fetchFromServer from "../fetchFromServer";

const addstage = async ({
  name,
  workflowId,
  handleError,
}: {
  name: string;
  workflowId: string;
  handleError: ErrorHandler;
}) => {
  if (!name || !workflowId) {
    throw new Error("Validation error: name and stageId are required");
  }

  const response = await fetchFromServer(
    "/api/stages",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, workflowId }),
    },
    handleError
  );

  return response;
};

export default addstage;
