import { callApi } from "../../../core/api/api";

type loginInputDto = {
    username: string;
    password: string;
};

type loginOutputDto = {
    accessToken: string;
    refreshToken: string;
};
export const callLoginApi = async (input: loginInputDto): Promise<loginOutputDto> => {
    const response = await callApi(`/api/v1/auth/login`, 'POST', null, {
        username: input.username,
        password: input.password
    });
    if (!response.ok) {
        throw new Error('login-failed');
    }
    const data = await response.json();
    return {
        accessToken: data.item.accessToken,
        refreshToken: data.item.refreshToken
    };
};