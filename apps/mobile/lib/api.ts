import { API_ROUTES } from '../../../shared/constants';

function normalizeBaseUrl(rawBaseUrl: string) {
  const trimmedBaseUrl = rawBaseUrl.replace(/\/$/, '');
  const isPrivateDevHost =
    /^https:\/\/(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$/i.test(
      trimmedBaseUrl,
    );

  // Nest dev server is currently exposed over HTTP only. Downgrade private LAN
  // URLs in development so Expo Go does not try to negotiate TLS with a non-TLS server.
  if (__DEV__ && isPrivateDevHost) {
    return trimmedBaseUrl.replace(/^https:/i, 'http:');
  }

  return trimmedBaseUrl;
}

const baseUrl = normalizeBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000');
const REQUEST_TIMEOUT_MS = 10000;

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  token?: string | null;
  body?: unknown;
};

export function getApiBaseUrl() {
  return baseUrl;
}

function extractErrorMessage(text: string, fallbackMessage: string) {
  if (!text) {
    return fallbackMessage;
  }

  try {
    const data = JSON.parse(text) as { message?: string | string[] };
    const message = Array.isArray(data.message) ? data.message.join(', ') : data.message;
    return message || fallbackMessage;
  } catch {
    return text || fallbackMessage;
  }
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  if (options.signal) {
    if (options.signal.aborted) {
      controller.abort();
    } else {
      options.signal.addEventListener('abort', () => controller.abort(), { once: true });
    }
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  const hasBody = options.body !== undefined;
  if (hasBody) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
      body: hasBody ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const fallbackMessage = `HTTP ${response.status}`;
      const text = await response.text();
      throw new Error(extractErrorMessage(text, fallbackMessage));
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Không thể kết nối tới server sau ${REQUEST_TIMEOUT_MS / 1000} giây. Kiểm tra mạng LAN và EXPO_PUBLIC_API_BASE_URL.`);
    }

    if (error instanceof TypeError) {
      throw new Error('Không thể kết nối tới server. Kiểm tra mạng LAN và EXPO_PUBLIC_API_BASE_URL.');
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export { API_ROUTES };
