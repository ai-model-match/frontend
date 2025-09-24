import {
  LoginInputDto,
  LoginOutputDto,
  RefreshInputDto,
  RefreshOutputDto,
  LogoutInputDto,
  LogoutOutputDto,
} from '@dtos/authDto';
import { callApi } from './api';
import { Method } from './api.type';

export const authService = {
  async login(input: LoginInputDto): Promise<LoginOutputDto> {
    const response = await callApi(`/api/v1/auth/login`, Method.POST, null, {
      username: input.username,
      password: input.password,
    });
    if (!response) {
      throw new Error('login-failed');
    }
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.errors[0]);
    }
    const data = await response.json();
    return {
      accessToken: data.item.accessToken,
      refreshToken: data.item.refreshToken,
    };
  },

  async refreshToken(input: RefreshInputDto): Promise<RefreshOutputDto> {
    const response = await callApi(`/api/v1/auth/refresh`, Method.POST, null, {
      refreshToken: input.refreshToken,
    });
    if (!response.ok) {
      throw new Error('refresh-token-failed');
    }
    const data = await response.json();
    return {
      accessToken: data.item.accessToken,
      refreshToken: data.item.refreshToken,
    };
  },

  async logout(input: LogoutInputDto): Promise<LogoutOutputDto> {
    const response = await callApi(`/api/v1/auth/logout`, Method.POST, null, {
      refreshToken: input.refreshToken,
    });
    if (!response.ok) {
      throw new Error('logout-failed');
    }
    await response.json();
    return {
      success: true,
    };
  },
};
