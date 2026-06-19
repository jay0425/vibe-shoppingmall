import { useRouter } from 'next/navigation';

import { useAuthStore } from '@/entities/user';

export const useLogout = () => {
  const router = useRouter();
  const clearAuthSession = useAuthStore((state) => state.logout);

  return () => {
    clearAuthSession();
    router.push('/');
  };
};
