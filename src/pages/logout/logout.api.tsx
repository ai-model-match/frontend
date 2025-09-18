import { callApi } from '../../core/api/api';

type logoutInputDto = {
    refreshToken: string;
};

export const callLogoutApi = async (input: logoutInputDto): Promise<void> => {
    const response = await callApi(`/api/v1/auth/logout`, 'POST', null, {
        refreshToken: input.refreshToken,
    });
    if (!response.ok) {
        throw new Error('logout-failed');
    }
    await response.json();
};
