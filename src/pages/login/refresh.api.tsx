import { callApi } from "../../core/api/api";

type refreshInputDto = {
    refreshToken: string;
};
type refreshOutputDto = {
    accessToken: string;
    refreshToken: string;
};

export const callRefreshApi = async (input: refreshInputDto): Promise<refreshOutputDto> => {
    const response = await callApi(`/api/v1/auth/refresh`, 'POST', null, {
        refreshToken: input.refreshToken,
    });
    if (!response.ok) {
        throw new Error('refresh-failed');
    }
    const data = await response.json();
    return {
        accessToken: data.item.accessToken,
        refreshToken: data.item.refreshToken
    };
};