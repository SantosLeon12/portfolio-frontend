import {
  ApiError,
} from "./api-client";


type AdminRequestOptions =
  Omit<RequestInit, "body"> & {
    body?:
      | BodyInit
      | Record<string, unknown>
      | null;
  };


export async function adminApiClient<T>(
  path: string,
  options: AdminRequestOptions = {},
): Promise<T> {
  const {
    body,
    headers,
    ...requestOptions
  } = options;

  const isFormData =
    body instanceof FormData;

  const normalizedBody =
    body &&
    !isFormData &&
    typeof body === "object"
      ? JSON.stringify(body)
      : body as
          | BodyInit
          | null
          | undefined;


  const response = await fetch(
    `/api/backend/admin${path}`,
    {
      ...requestOptions,

      headers: {
        ...(!isFormData
          ? {
              "Content-Type":
                "application/json",
            }
          : {}),

        ...headers,
      },

      body: normalizedBody,
    },
  );


  /*
   * Successful responses without
   * content.
   */
  if (
    response.status === 204 ||
    response.status === 205
  ) {
    return undefined as T;
  }


  /*
   * Do not assume every response
   * contains JSON.
   */
  const contentType =
    response.headers.get(
      "content-type",
    );

  let data: unknown = null;


  if (
    contentType?.includes(
      "application/json",
    )
  ) {
    data = await response.json();
  } else {
    const text =
      await response.text();

    data = text || null;
  }


  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}`;


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

      if (
        typeof detail ===
        "string"
      ) {
        message = detail;
      }
    } else if (
      typeof data === "string" &&
      data
    ) {
      message = data;
    }


    throw new ApiError(
      message,
      response.status,
      data,
    );
  }


  return data as T;
}