import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

import { env } from '../config/env.js';
import { HttpError, verifyJwt } from '../utils/index.js';

const pickBearerToken = (authorization: string | undefined) => {
  if (!authorization) {
    throw new HttpError(401, '인증 토큰이 필요합니다.');
  }

  const [tokenType, token] = authorization.split(' ');

  if (tokenType !== 'Bearer' || !token) {
    throw new HttpError(401, '유효하지 않은 인증 토큰입니다.');
  }

  return token;
};

export const authenticate: RequestHandler = (req, _res, next) => {
  try {
    const token = pickBearerToken(req.headers.authorization);
    const payload = verifyJwt(token, env.jwtSecret);

    if (
      !payload ||
      typeof payload.sub !== 'string' ||
      !isValidObjectId(payload.sub) ||
      typeof payload.email !== 'string' ||
      typeof payload.user_type !== 'string'
    ) {
      throw new HttpError(401, '유효하지 않은 인증 토큰입니다.');
    }

    req.user = {
      id: payload.sub,
      email: payload.email,
      user_type: payload.user_type,
    };

    next();
  } catch (error) {
    next(error);
  }
};
