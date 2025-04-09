export type ServerError = {
  code: string;
  message: string;
};

export type ErrorHandler = (message?: string) => void;
