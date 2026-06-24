import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

import {
  createUserData,
  deleteUserData,
  getUserById,
  getUserList,
  loginUserData,
  updateUserData,
  type UserPayload,
} from '../services/index.js';
import { env } from '../config/env.js';
import { asyncHandler, HttpError, signJwt } from '../utils/index.js';

const userFields = ['email', 'name', 'password', 'user_type', 'address'] as const;
const ACCESS_TOKEN_EXPIRES_IN_SECONDS = 60 * 60 * 24;

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

const pickLoginPayload = (body: unknown) => {
  if (!isRecord(body)) {
    throw new HttpError(400, '이메일과 비밀번호를 입력해주세요.');
  }

  const { email, password } = body;

  if (typeof email !== 'string' || email.trim() === '') {
    throw new HttpError(400, '이메일을 입력해주세요.');
  }

  if (typeof password !== 'string' || password === '') {
    throw new HttpError(400, '비밀번호를 입력해주세요.');
  }

  return {
    email,
    password,
  };
};

const serializeUser = (user: {
  _id: unknown;
  email: string;
  name: string;
  user_type: string;
  address?: string | null;
}) => ({
  id: String(user._id),
  email: user.email,
  name: user.name,
  user_type: user.user_type,
  address: user.address,
});

export const getUsers: RequestHandler = asyncHandler(async (_req, res) => {
  const users = await getUserList();

  res.json(users.map(serializeUser));
});

export const getUser: RequestHandler = asyncHandler(async (req, res) => {
  validateUserId(req.params.id);

  const user = await getUserById(req.params.id);
  if (!user) {
    throw new HttpError(404, '유저를 찾을 수 없습니다.');
  }

  res.json(serializeUser(user));
});

export const createUser: RequestHandler = asyncHandler(async (req, res) => {
  const user = await createUserData(pickUserPayload(req.body));

  res.status(201).json(serializeUser(user));
});

export const loginUser: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password } = pickLoginPayload(req.body);
  const user = await loginUserData(email, password);

  if (!user) {
    throw new HttpError(401, '이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  const accessToken = signJwt(
    {
      sub: String(user._id),
      email: user.email,
      user_type: user.user_type,
    },
    env.jwtSecret,
    ACCESS_TOKEN_EXPIRES_IN_SECONDS,
  );

  res.json({
    message: '로그인에 성공했습니다.',
    accessToken,
    tokenType: 'Bearer',
    expiresIn: ACCESS_TOKEN_EXPIRES_IN_SECONDS,
    user: serializeUser(user),
  });
});

export const getMe: RequestHandler = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new HttpError(401, '인증이 필요합니다.');
  }

  const user = await getUserById(req.user.id);
  if (!user) {
    throw new HttpError(404, '유저를 찾을 수 없습니다.');
  }

  res.json(serializeUser(user));
});

export const updateUser: RequestHandler = asyncHandler(async (req, res) => {
  validateUserId(req.params.id);

  const user = await updateUserData(req.params.id, pickUserPayload(req.body));

  if (!user) {
    throw new HttpError(404, '유저를 찾을 수 없습니다.');
  }

  res.json(serializeUser(user));
});

export const deleteUser: RequestHandler = asyncHandler(async (req, res) => {
  validateUserId(req.params.id);

  const user = await deleteUserData(req.params.id);
  if (!user) {
    throw new HttpError(404, '유저를 찾을 수 없습니다.');
  }

  res.status(204).send();
});
