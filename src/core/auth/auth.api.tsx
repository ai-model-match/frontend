import { callApi } from "../api/api";

export const callAuthApi = async (url: string, method: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE', body: Record<string, unknown> | null = null) => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    let response;

    // If the access token is defined, call the API
    if (accessToken) {
        response = await callApi(url, method, accessToken, body);
    }

    // If access token were not defined or we received a 401, try refresh and call API again 
    if ((response == null || response.status === 401) && refreshToken) {
        const refreshRes = await callApi(`/api/v1/auth/refresh`, 'POST', null, { refreshToken });
        if (!refreshRes.ok) {
            throw new Error('refresh-token-failed');
        }
        const data = await refreshRes.json();
        localStorage.setItem('accessToken', data.item.accessToken);
        localStorage.setItem('refreshToken', data.item.refreshToken);
        response = await callApi(url, method, data.item.accessToken, body);
    };
    return response;
};