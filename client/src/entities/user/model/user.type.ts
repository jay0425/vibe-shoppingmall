export type User = {
  id: string;
  email: string;
  name: string;
  user_type: 'customer' | 'admin';
  address?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateUserPayload = {
  email: string;
  name: string;
  password: string;
};

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  user_type: 'customer' | 'admin';
  address?: string | null;
};

export type LoginUserPayload = {
  email: string;
  password: string;
};

export type LoginUserResponse = {
  message: string;
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: AuthUser;
};
