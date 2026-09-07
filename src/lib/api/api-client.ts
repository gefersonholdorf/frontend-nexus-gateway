import { env } from "@/config/env";
import { ApiError } from "@/lib/api/api-error";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ApiClientOptions {
  getToken: () => string | null | undefined;
  onUnauthorized: () => void;
  baseUrl?: string;
}

export interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  signal?: AbortSignal;
  errorMessage?: string;
}

function buildQueryString(
  query?: Record<string, string | number | boolean | undefined | null>,
): string {
  if (!query) return "";

  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly getToken: () => string | null | undefined;
  private readonly onUnauthorized: () => void;

  constructor(options: ApiClientOptions) {
    this.baseUrl = env.apiUrl;
    this.getToken = options.getToken;
    this.onUnauthorized = options.onUnauthorized;
  }

  private async request<TResponse>(
    method: HttpMethod,
    path: string,
    options: RequestOptions = {},
  ): Promise<TResponse> {
    const { query, body, signal, errorMessage } = options;

    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${this.baseUrl}${path}${buildQueryString(query)}`;

    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });

    if (response.status === 401) {
      this.onUnauthorized();
      throw new ApiError({
        status: 401,
        code: "UNAUTHORIZED",
        message: "Sessão expirada. Faça login novamente.",
      });
    }

    if (response.status === 204) {
      return undefined as TResponse;
    }

    if (!response.ok) {
      let message = errorMessage ?? "Ocorreu um erro ao processar a requisição.";
      let code: string | undefined;

      try {
        const errorBody = (await response.json()) as {
          error?: string;
          message?: string;
        };
        if (errorBody?.message) {
          message = errorBody.message;
        }
        if (errorBody?.error) {
          code = errorBody.error;
        }
      } catch {
        // Corpo de erro não é JSON válido: mantém a mensagem padrão.
      }

      throw new ApiError({ status: response.status, code, message });
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return undefined as TResponse;
    }

    return (await response.json()) as TResponse;
  }

  get<TResponse>(path: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>("GET", path, options);
  }

  post<TResponse>(path: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>("POST", path, options);
  }

  put<TResponse>(path: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>("PUT", path, options);
  }

  patch<TResponse>(path: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>("PATCH", path, options);
  }

  delete<TResponse>(path: string, options?: RequestOptions): Promise<TResponse> {
    return this.request<TResponse>("DELETE", path, options);
  }
}