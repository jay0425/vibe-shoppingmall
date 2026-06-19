import { useMutation } from '@tanstack/react-query';

import { loginUser, useAuthStore } from '@/entities/user';

import type { LoginUserPayload, LoginUserResponse } from '@/entities/user';

type LoginVariables = LoginUserPayload & {
  remember: boolean;
};

export const useLogin = () => {
  const saveAuthSession = useAuthStore((state) => state.login);

  return useMutation<LoginUserResponse, Error, LoginVariables>({
    mutationFn: ({ remember: _remember, ...payload }) => loginUser(payload),
    onSuccess: (response, variables) => {
      saveAuthSession(response, variables.remember);
    },
  });
};
