export type PublicContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactErrorResponse = {
  detail?:
    | string
    | {
        msg?: string;
      }[];
};

function getErrorMessage(
  data: ContactErrorResponse | null,
) {
  if (!data?.detail) {
    return (
      "Something went wrong. Please try again."
    );
  }

  if (
    typeof data.detail ===
    "string"
  ) {
    return data.detail;
  }

  if (
    Array.isArray(
      data.detail,
    )
  ) {
    const firstError =
      data.detail[0];

    if (
      firstError &&
      typeof firstError.msg ===
        "string"
    ) {
      return firstError.msg;
    }
  }

  return (
    "Something went wrong. Please try again."
  );
}

export async function sendPublicContactMessage(
  payload: PublicContactPayload,
) {
  const response =
    await fetch(
      "/api/contact",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Accept:
            "application/json",
        },

        body:
          JSON.stringify(
            payload,
          ),
      },
    );

  let data:
    | ContactErrorResponse
    | null = null;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      getErrorMessage(
        data,
      ),
    );
  }

  return data;
}