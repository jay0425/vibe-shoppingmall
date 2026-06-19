import { UserModel } from '../models/index.js';

export type UserPayload = {
  email?: string;
  name?: string;
  password?: string;
  user_type?: string;
  address?: string;
};

export const getUserList = async () => UserModel.find().sort({ createdAt: -1 });

export const getUserById = async (id: string) => UserModel.findById(id);

export const createUserData = async (payload: UserPayload) => UserModel.create(payload);

export const updateUserData = async (id: string, payload: UserPayload) =>
  UserModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

export const deleteUserData = async (id: string) => UserModel.findByIdAndDelete(id);
