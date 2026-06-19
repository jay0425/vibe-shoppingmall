import { httpClient } from '@/shared/api';

import type { CreateUserPayload, User } from '../model';

export const getUsers = (): Promise<User[]> => httpClient<User[]>('/api/users');

export const createUser = (payload: CreateUserPayload): Promise<User> =>
  httpClient<User>('/api/users', {
    method: 'POST',
    body: payload,
  });
