import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

import {
  createUserData,
  deleteUserData,
  getUserById,
  getUserList,
  updateUserData,
  type UserPayload,
} from '../services/index.js';
import { asyncHandler, HttpError } from '../utils/index.js';

const userFields = ['email', 'name', 'password', 'user_type', 'address'] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const pickUserPayload = (body: unknown): UserPayload => {
  if (!isRecord(body)) {
    return {};
  }

  return userFields.reduce<UserPayload>((payload, field) => {
    const value = body[field];

    if (value !== undefined) {
      return {
        ...payload,
        [field]: value,
      };
    }

    return payload;
  }, {});
};

const validateUserId = (id: string) => {
  if (!isValidObjectId(id)) {
    throw new HttpError(400, '유효하지 않은 유저 ID입니다.');
  }
};

export const getUsers: RequestHandler = asyncHandler(async (_req, res) => {
  const users = await getUserList();

  res.json(users);
});

export const getUser: RequestHandler = asyncHandler(async (req, res) => {
  validateUserId(req.params.id);

  const user = await getUserById(req.params.id);
  if (!user) {
    throw new HttpError(404, '유저를 찾을 수 없습니다.');
  }

  res.json(user);
});

export const createUser: RequestHandler = asyncHandler(async (req, res) => {
  const user = await createUserData(pickUserPayload(req.body));

  res.status(201).json(user);
});

export const updateUser: RequestHandler = asyncHandler(async (req, res) => {
  validateUserId(req.params.id);

  const user = await updateUserData(req.params.id, pickUserPayload(req.body));

  if (!user) {
    throw new HttpError(404, '유저를 찾을 수 없습니다.');
  }

  res.json(user);
});

export const deleteUser: RequestHandler = asyncHandler(async (req, res) => {
  validateUserId(req.params.id);

  const user = await deleteUserData(req.params.id);
  if (!user) {
    throw new HttpError(404, '유저를 찾을 수 없습니다.');
  }

  res.status(204).send();
});
