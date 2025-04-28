import { ErrorHandler } from "@/types/error";

import fetchFromServer from "../fetchFromServer";

const addWorkflow = async ({
  userId,
  name,
  organizationId,
  handleError,
}: {
  userId: string;
  name: string;
  organizationId: string;
  handleError: ErrorHandler;
}) => {
  if (!userId || !name || !organizationId) {
    throw new Error(
      "Validation error: userId, name and organizationId are required"
    );
  }

  const response = await fetchFromServer(
    "/api/workflows",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, userId, organizationId }),
    },
    handleError
  );

  return response;
};

export default addWorkflow;
