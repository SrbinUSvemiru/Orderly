import { SERVER_URL } from "../constants/server";
import { ErrorHandler } from "../types/error";

const defaultErrorHandler: ErrorHandler = (errorMessage) => {
  console.error("fetchFromServer error: ", errorMessage);
};

const getResult = async (response: Response) => {
  try {
    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : null;
  } catch {
    return null;
  }
};

const fetchFromServer = async (
  path: string,
  requestInit: RequestInit,
  errorHandler = defaultErrorHandler
) => {
  try {
    const response = await fetch(SERVER_URL + path, {
      credentials: "include",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      ...requestInit,
    });

    const result = await getResult(response);

    if (!response.ok) {
      const errorMessage = result?.code
        ? "error." + result.code
        : result.message;
      errorHandler(errorMessage);
      return null;
    }

    return result;
  } catch (error: unknown) {
    // errorMessage undefined means that we don't have a clue what errored out
    // in that case we must have a default error message to show to the user
    // which should be different with every fetch request
    console.error("fetchFromServer error: ", error);
    errorHandler();
    return null;
  }
};

export default fetchFromServer;
