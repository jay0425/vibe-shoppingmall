import { useMutation } from '@tanstack/react-query';

import { createUser, getUsers } from '@/entities/user';

import type { CreateUserPayload, User } from '@/entities/user';

export const useSignup = () =>
  useMutation<User, Error, CreateUserPayload>({
    mutationFn: async (payload) => {
      const users = await getUsers();
      const isDuplicateEmail = users.some(
        (user) => user.email.toLowerCase() === payload.email.toLowerCase(),
      );

      if (isDuplicateEmail) {
        throw new Error('이미 가입된 이메일입니다.');
      }

      return createUser(payload);
    },
  });
