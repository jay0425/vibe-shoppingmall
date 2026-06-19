export type User = {
  _id: string;
  email: string;
  name: string;
  password: string;
  user_type: 'customer' | 'admin';
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateUserPayload = {
  email: string;
  name: string;
  password: string;
};
