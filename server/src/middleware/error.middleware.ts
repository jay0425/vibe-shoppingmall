import type { ErrorRequestHandler, RequestHandler } from 'express';

import { HttpError } from '../utils/index.js';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `라우트를 찾을 수 없습니다: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error instanceof HttpError ? error.statusCode : 500;

  res.status(statusCode).json({
    message: error instanceof Error ? error.message : '서버 내부 오류가 발생했습니다.',
  });
};
