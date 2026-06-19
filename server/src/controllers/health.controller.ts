import type { RequestHandler } from 'express';

import { getHealthStatus } from '../services/index.js';

export const getHealth: RequestHandler = (_req, res) => {
  res.json(getHealthStatus());
};
