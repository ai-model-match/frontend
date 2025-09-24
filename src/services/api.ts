import { Method } from './api.type';

export const callApi = async (
  url: string,
  method: Method,
  accessToken: string | null,
  body: Record<string, unknown> | null = null
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let finalUrl = `${import.meta.env.VITE_BACKEND_URL}${url}`;
  let fetchBody: string | undefined;

  if (method === Method.GET || method === Method.HEAD) {
    if (body) {
      const query = new URLSearchParams(
        Object.entries(body)
          .filter(([, value]) => value != null)
          .map(([key, value]) => [key, String(value)])
      );
      finalUrl += `?${query.toString()}`;
    }
  } else {
    fetchBody = body ? JSON.stringify(body) : undefined;
  }

  return fetch(finalUrl, {
    method,
    headers,
    body: fetchBody,
  });
};
