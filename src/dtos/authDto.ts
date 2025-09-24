export type RefreshInputDto = {
  refreshToken: string;
};

export type RefreshOutputDto = {
  accessToken: string;
  refreshToken: string;
};

export type LogoutInputDto = {
  refreshToken: string;
};

export type LogoutOutputDto = {
  success: boolean;
};

export type LoginInputDto = {
  username: string;
  password: string;
};

export type LoginOutputDto = {
  accessToken: string;
  refreshToken: string;
};
