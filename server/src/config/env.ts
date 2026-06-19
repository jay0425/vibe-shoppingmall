import 'dotenv/config';

type NodeEnv = 'development' | 'test' | 'production';

type Env = {
  nodeEnv: NodeEnv;
  port: number;
  mongoUri: string;
  corsOrigins: string[];
  jwtSecret: string;
};

const DEFAULT_MONGO_URI = 'mongodb://127.0.0.1:27017/shopping-mall';

const parsePort = (value: string | undefined): number => {
  const port = Number(value ?? 4000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT는 양의 정수여야 합니다.');
  }

  return port;
};

const parseNodeEnv = (value: string | undefined): NodeEnv => {
  if (value === 'production' || value === 'test' || value === 'development') {
    return value;
  }

  return 'development';
};

const parseCorsOrigins = (value: string | undefined): string[] => {
  const origins = value?.split(',').map((origin) => origin.trim()) ?? ['http://localhost:3000'];

  return origins.filter(Boolean);
};

const requireEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} 환경변수가 필요합니다.`);
  }

  return value;
};

const parseMongoUri = (value: string | undefined, nodeEnv: NodeEnv): string => {
  if (value) {
    return value;
  }

  if (nodeEnv === 'production') {
    return requireEnv('MONGODB_URI');
  }

  return DEFAULT_MONGO_URI;
};

const parseJwtSecret = (value: string | undefined, nodeEnv: NodeEnv): string => {
  if (value) {
    return value;
  }

  if (nodeEnv === 'production') {
    return requireEnv('JWT_SECRET');
  }

  return 'shopping-mall-development-jwt-secret';
};

const nodeEnv = parseNodeEnv(process.env.NODE_ENV);

export const env: Env = {
  nodeEnv,
  port: parsePort(process.env.PORT),
  mongoUri: parseMongoUri(process.env.MONGODB_URI, nodeEnv),
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGIN),
  jwtSecret: parseJwtSecret(process.env.JWT_SECRET, nodeEnv),
};
