import { createHmac } from 'node:crypto';

const base64UrlEncode = (value: string | Buffer) => Buffer.from(value).toString('base64url');

const base64UrlDecode = (value: string) => Buffer.from(value, 'base64url').toString('utf8');

export type JwtPayload = Record<string, string | number | boolean>;

export type VerifiedJwtPayload = JwtPayload & {
  iat: number;
  exp: number;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const createSignature = (unsignedToken: string, secret: string) =>
  createHmac('sha256', secret).update(unsignedToken).digest('base64url');

export const signJwt = (payload: JwtPayload, secret: string, expiresInSeconds: number) => {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const unsignedToken = [
    base64UrlEncode(JSON.stringify(header)),
    base64UrlEncode(JSON.stringify(tokenPayload)),
  ].join('.');
  const signature = createSignature(unsignedToken, secret);

  return `${unsignedToken}.${signature}`;
};

export const verifyJwt = (token: string, secret: string): VerifiedJwtPayload | null => {
  const [encodedHeader, encodedPayload, signature] = token.split('.');

  if (!encodedHeader || !encodedPayload || !signature) {
    return null;
  }

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = createSignature(unsignedToken, secret);

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const header: unknown = JSON.parse(base64UrlDecode(encodedHeader));
    const payload: unknown = JSON.parse(base64UrlDecode(encodedPayload));

    if (
      !isRecord(header) ||
      header.alg !== 'HS256' ||
      !isRecord(payload) ||
      typeof payload.iat !== 'number' ||
      typeof payload.exp !== 'number'
    ) {
      return null;
    }

    if (payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload as VerifiedJwtPayload;
  } catch {
    return null;
  }
};
