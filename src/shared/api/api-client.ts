import { env } from "@/config/env";

type ApiRequestOptions = RequestInit & {
  token?: string | null;
};

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(
    message: string,
    status: number,
    data: unknown,
  ) {
    super(message);

    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiClient<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    token,
    headers,
    ...requestOptions
  } = options;

  const response = await fetch(
    `${env.apiUrl}${path}`,
    {
      ...requestOptions,

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {}),

        ...headers,
      },
    },
  );

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data),
      response.status,
      data,
    );
  }

  return data as T;
}

function getErrorMessage(
  data: unknown,
): string {
  if (
    typeof data === "object" &&
    data !== null &&
    "detail" in data
  ) {
    const detail = (
      data as {
        detail?: unknown;
      }
    ).detail;

    if (typeof detail === "string") {
      return detail;
    }
  }

  return "An unexpected API error occurred";
}

export async function uploadFile<T>(
  path: string,
  file: File,
  token: string,
): Promise<T> {
  const formData = new FormData();

  formData.append(
    "file",
    file,
  );

  const response = await fetch(
    `${env.apiUrl}${path}`,
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      getErrorMessage(data),
      response.status,
      data,
    );
  }

  return data as T;
}