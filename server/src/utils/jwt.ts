import { createHmac } from 'node:crypto';

const base64UrlEncode = (value: string | Buffer) =>
  Buffer.from(value).toString('base64url');

export type JwtPayload = Record<string, string | number | boolean>;

export const signJwt = (
  payload: JwtPayload,
  secret: string,
  expiresInSeconds: number,
) => {
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
  const signature = createHmac('sha256', secret).update(unsignedToken).digest('base64url');

  return `${unsignedToken}.${signature}`;
};
