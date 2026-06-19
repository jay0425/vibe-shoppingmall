import { httpClient } from '@/shared/api';

import type { CreateUserPayload, LoginUserPayload, LoginUserResponse, User } from '../model';

export const getUsers = (): Promise<User[]> => httpClient<User[]>('/api/users');

export const getMe = (accessToken: string): Promise<User> =>
  httpClient<User>('/api/users/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createUser = (payload: CreateUserPayload): Promise<User> =>
  httpClient<User>('/api/users', {
    method: 'POST',
    body: payload,
  });

export const loginUser = (payload: LoginUserPayload): Promise<LoginUserResponse> =>
  httpClient<LoginUserResponse>('/api/users/login', {
    method: 'POST',
    body: payload,
  });
