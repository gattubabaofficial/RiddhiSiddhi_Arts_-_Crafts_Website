/**
 * API + media URL resolution.
 *
 * Nothing here hardcodes a host or a port. By default the browser talks to the
 * SAME ORIGIN (`/api/v1`, `/static/uploads/...`) and next.config.mjs proxies
 * those paths to the backend. That means no CORS preflight, and no mixed-content
 * failure when the site is served over HTTPS -- the previous `http://${host}:8000`
 * construction broke on any real deployment.
 *
 * Set NEXT_PUBLIC_API_URL to call a different origin directly instead; if you do,
 * add that origin to ALLOWED_ORIGINS on the backend.
 */

const DEFAULT_BACKEND_ORIGIN = 'http://127.0.0.1:8000';

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

/** Origin used for server-side rendering, where relative URLs are not valid. */
function serverOrigin(): string {
  return trimTrailingSlash(process.env.BACKEND_ORIGIN || DEFAULT_BACKEND_ORIGIN);
}

export function getAPIBaseURL(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return trimTrailingSlash(configured);

  if (typeof window === 'undefined') {
    return `${serverOrigin()}/api/v1`;
  }
  return '/api/v1';
}

export function getMediaUrl(url?: string | null): string {
  if (!url) return '';

  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:') ||
    url.startsWith('data:')
  ) {
    return url;
  }

  const path = url.startsWith('/') ? url : `/${url}`;
  const configured = process.env.NEXT_PUBLIC_MEDIA_URL?.trim();
  if (configured) return `${trimTrailingSlash(configured)}${path}`;

  // Same origin in the browser; absolute when rendering on the server.
  return typeof window === 'undefined' ? `${serverOrigin()}${path}` : path;
}

export function getEmbedUrl(url?: string | null): string {
  if (!url) return '';

  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split(/[?#]/)[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }
  if (url.includes('youtube.com/watch')) {
    const match = url.match(/[?&]v=([^&#]+)/);
    if (match && match[1]) return `https://www.youtube.com/embed/${match[1]}`;
  }
  if (url.includes('youtube.com/shorts/')) {
    const id = url.split('youtube.com/shorts/')[1]?.split(/[?#]/)[0];
    if (id) return `https://www.youtube.com/embed/${id}`;
  }
  return url;
}

const TOKEN_KEY = 'riddhi_admin_token';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* private browsing / storage disabled */
  }
}

export function removeAuthToken() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

/** Sends the admin back to the login screen when a token is rejected. */
function handleUnauthorized() {
  removeAuthToken();
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
    window.location.href = '/admin/login';
  }
}

export class APIError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = 'APIError';
  }
}

function extractDetail(body: unknown, fallback: string): string {
  if (!body || typeof body !== 'object') return fallback;
  const detail = (body as { detail?: unknown }).detail;

  if (typeof detail === 'string') return detail;

  // FastAPI validation errors arrive as a list of objects; joining them keeps
  // the admin UI from rendering "[object Object]".
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) =>
        item && typeof item === 'object' && 'msg' in item
          ? String((item as { msg: unknown }).msg)
          : null
      )
      .filter(Boolean);
    if (messages.length) return messages.join('; ');
  }
  return fallback;
}

export async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
  timeoutMs: number = 15000
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = getAPIBaseURL();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });

    if (!res.ok) {
      if (res.status === 401) handleUnauthorized();

      const body = await res.json().catch(() => null);
      throw new APIError(
        extractDetail(body, `Request failed with status ${res.status}`),
        res.status
      );
    }

    if (res.status === 204) return {} as T;
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof APIError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new APIError(
        `Request timed out after ${Math.round(timeoutMs / 1000)}s.`,
        408
      );
    }
    if (err instanceof Error && err.message.includes('Failed to fetch')) {
      throw new APIError(
        'Unable to reach the API. Please make sure the backend server is running.',
        0
      );
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export function uploadFilesWithProgress(
  files: File[],
  onProgress?: (percent: number) => void
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    if (!files || files.length === 0) {
      resolve([]);
      return;
    }

    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${getAPIBaseURL()}/upload`);

    const token = getAuthToken();
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    }

    if (onProgress && xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(Math.round((event.loaded / event.total) * 100));
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new APIError('Upload succeeded but the response was unreadable.', xhr.status));
        }
        return;
      }

      if (xhr.status === 401) {
        handleUnauthorized();
        reject(new APIError('Your session expired. Please log in again.', 401));
        return;
      }

      let message = `Upload failed with status ${xhr.status}`;
      try {
        message = extractDetail(JSON.parse(xhr.responseText), message);
      } catch {
        /* keep the generic message */
      }
      reject(new APIError(message, xhr.status));
    };

    xhr.onerror = () =>
      reject(new APIError('Network error while uploading. Is the backend running?', 0));
    xhr.ontimeout = () =>
      reject(new APIError('Upload timed out. Try a smaller file or a faster connection.', 408));

    xhr.timeout = 300000;
    xhr.send(formData);
  });
}

export async function uploadFiles(files: File[]): Promise<string[]> {
  return uploadFilesWithProgress(files);
}
