import { API_ROUTES } from '../../../shared/constants';

const baseUrl = (process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  token?: string | null;
  body?: unknown;
};

export function getApiBaseUrl() {
  return baseUrl;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const hasBody = options.body !== undefined;
  if (hasBody) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
    body: hasBody ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const fallbackMessage = `HTTP ${response.status}`;
    const text = await response.text();
    try {
      const data = JSON.parse(text) as { message?: string | string[] };
      const message = Array.isArray(data.message) ? data.message.join(', ') : data.message;
      throw new Error(message || fallbackMessage);
    } catch {
      throw new Error(text || fallbackMessage);
    }
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export { API_ROUTES };
