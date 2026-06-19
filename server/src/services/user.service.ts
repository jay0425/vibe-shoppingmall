import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
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

const verifyPassword = async (password: string, hashedPassword: string) => {
  const [algorithm, salt, storedKey] = hashedPassword.split(':');

  if (algorithm !== 'scrypt' || !salt || !storedKey) {
    return false;
  }

  const storedKeyBuffer = Buffer.from(storedKey, 'hex');
  const derivedKey = await scryptAsync(password, salt, storedKeyBuffer.length);

  return (
    storedKeyBuffer.length === derivedKey.length &&
    timingSafeEqual(storedKeyBuffer, derivedKey)
  );
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

export const loginUserData = async (email: string, password: string) => {
  const user = await UserModel.findOne({ email: email.trim().toLowerCase() });

  if (!user) {
    return null;
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  return isPasswordValid ? user : null;
};

export const createUserData = async (payload: UserPayload) =>
  UserModel.create(await hashPasswordInPayload(payload));

export const updateUserData = async (id: string, payload: UserPayload) =>
  UserModel.findByIdAndUpdate(id, await hashPasswordInPayload(payload), {
    new: true,
    runValidators: true,
  });

export const deleteUserData = async (id: string) => UserModel.findByIdAndDelete(id);
