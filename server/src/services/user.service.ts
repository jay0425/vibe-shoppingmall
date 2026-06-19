import { randomBytes, scrypt } from 'node:crypto';
import { promisify } from 'node:util';

import { UserModel } from '../models/index.js';

export type UserPayload = {
  email?: string;
  name?: string;
  password?: string;
  user_type?: string;
  address?: string;
};

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scryptAsync(password, salt, 64);

  return `scrypt:${salt}:${derivedKey.toString('hex')}`;
};

const hashPasswordInPayload = async (payload: UserPayload): Promise<UserPayload> => {
  if (!payload.password) {
    return payload;
  }

  return {
    ...payload,
    password: await hashPassword(payload.password),
  };
};

export const getUserList = async () => UserModel.find().sort({ createdAt: -1 });

export const getUserById = async (id: string) => UserModel.findById(id);

export const createUserData = async (payload: UserPayload) =>
  UserModel.create(await hashPasswordInPayload(payload));

export const updateUserData = async (id: string, payload: UserPayload) =>
  UserModel.findByIdAndUpdate(id, await hashPasswordInPayload(payload), {
    new: true,
    runValidators: true,
  });

export const deleteUserData = async (id: string) => UserModel.findByIdAndDelete(id);
