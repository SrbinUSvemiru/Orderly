export type ServerError = {
  code: string;
  message: string;
};

export type ErrorHandler = (_message?: string) => void;
