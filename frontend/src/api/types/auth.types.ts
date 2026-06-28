export type AuthUser = {
  id: string;
  email: string;
  fullname: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUser;
};
