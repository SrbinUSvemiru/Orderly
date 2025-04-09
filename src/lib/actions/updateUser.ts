import { User } from "@/types/user";
import fetchFromServer from "../fetchFromServer";
import { ErrorHandler } from "@/types/error";

const updateUser = async (
  userId: string,
  values: Partial<User>,
  handleError: ErrorHandler
) => {
  if (!userId) {
    throw new Error("No id provided");
  }

  const response = await fetchFromServer(
    `/api/users?id=${userId}`,
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

export default updateUser;
