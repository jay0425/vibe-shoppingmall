import { API_BASE_URL } from '@/shared/config';

type HttpClientOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const getErrorMessage = (value: unknown): string => {
  if (typeof value === 'object' && value !== null && 'message' in value) {
    const message = value.message;

    if (typeof message === 'string') {
      return message;
    }
  }

  return '요청 처리 중 오류가 발생했습니다.';
};

const getNetworkErrorMessage = (): string => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return '인터넷 연결이 끊어졌습니다. 연결 상태를 확인한 뒤 다시 시도해주세요.';
  }

  return '서버와 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
};

export const httpClient = async <ResponseData>(
  path: string,
  options: HttpClientOptions = {},
): Promise<ResponseData> => {
  const headers = new Headers(options.headers);

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new ApiError(0, getNetworkErrorMessage());
  }

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => null);

    throw new ApiError(response.status, getErrorMessage(errorBody));
  }

  if (response.status === 204) {
    return undefined as ResponseData;
  }

  return response.json() as Promise<ResponseData>;
};
