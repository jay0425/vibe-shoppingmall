import 'dotenv/config';

type NodeEnv = 'development' | 'test' | 'production';

type Env = {
  nodeEnv: NodeEnv;
  port: number;
  mongoUri: string;
  corsOrigins: string[];
  jwtSecret: string;
  portoneStoreId: string;
  portoneApiSecret: string;
};

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

const parseCorsOrigins = (value: string): string[] => {
  const origins = value.split(',').map((origin) => origin.trim());

  if (origins.length === 0 || origins.some((origin) => origin === '')) {
    throw new Error('CORS_ORIGIN은 하나 이상의 origin이어야 합니다.');
  }

  return origins;
};

const requireEnv = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} 환경변수가 필요합니다.`);
  }

  return value;
};

const parseJwtSecret = (value: string): string => {
  if (value.length < 32) {
    throw new Error('JWT_SECRET은 32자 이상이어야 합니다.');
  }

  return value;
};

const nodeEnv = parseNodeEnv(process.env.NODE_ENV);

export const env: Env = {
  nodeEnv,
  port: parsePort(process.env.PORT),
  mongoUri: requireEnv('MONGODB_URI'),
  corsOrigins: parseCorsOrigins(requireEnv('CORS_ORIGIN')),
  jwtSecret: parseJwtSecret(requireEnv('JWT_SECRET')),
  portoneStoreId: requireEnv('PORTONE_STORE_ID'),
  portoneApiSecret: requireEnv('PORTONE_API_SECRET'),
};
