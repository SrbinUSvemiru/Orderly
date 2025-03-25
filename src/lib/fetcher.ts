const fetcher = (url: string, options?: RequestInit) =>
  fetch(url, {
    method: options?.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    body: options?.body ? JSON.stringify(options.body) : undefined,
  }).then((res) => res.json());

export default fetcher;
