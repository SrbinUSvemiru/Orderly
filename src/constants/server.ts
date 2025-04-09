export const SERVER_URL =
  process.env.NEXT_PUBLIC_USE_LOCAL_SERVER === "true"
    ? process.env.NEXT_PUBLIC_API_URL
    : process.env.NEXT_PUBLIC_API_URL_PROD;
