import { callApi } from './api';
import { Method } from './api.type';

let refreshPromise: Promise<void> | null = null;

export const callAuthApi = async (
  url: string,
  method: Method,
  body: Record<string, unknown> | null = null
) => {
  let response;
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // If the access token is defined, call the API and if successful return the response
  if (accessToken) {
    response = await callApi(url, method, accessToken, body);
    if (response && response.ok) return response;
  }

  // Check if the refresh token is available
  if (!refreshToken) {
    throw new Error('refresh-token-failed');
  }
  // If there is no ongoing refresh operation, start one
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshResponse = await callApi(`/api/v1/auth/refresh`, Method.POST, null, {
        refreshToken,
      });
      if (!refreshResponse || !refreshResponse.ok) {
        throw new Error('refresh-token-failed');
      }
      const data = await refreshResponse.json();
      localStorage.setItem('accessToken', data.item.accessToken);
      localStorage.setItem('refreshToken', data.item.refreshToken);
      refreshPromise = null;
    })();
  }
  await refreshPromise;
  // Retry the original request with the new access token
  const newAccessToken = localStorage.getItem('accessToken');
  response = await callApi(url, method, newAccessToken, body);
  return response;
};
