import {
  NextResponse,
} from "next/server";

import {
  serverEnv,
} from "@/config/server-env";

type ContactRequestBody = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function isValidContactBody(
  value: unknown,
): value is ContactRequestBody {
  if (
    !value ||
    typeof value !== "object"
  ) {
    return false;
  }

  const body =
    value as Partial<ContactRequestBody>;

  return (
    typeof body.name === "string" &&
    typeof body.email === "string" &&
    typeof body.subject === "string" &&
    typeof body.message === "string"
  );
}

export async function POST(
  request: Request,
) {
  try {
    let body: unknown;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          detail:
            "Invalid request body.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      !isValidContactBody(
        body,
      )
    ) {
      return NextResponse.json(
        {
          detail:
            "Name, email, subject and message are required.",
        },
        {
          status: 400,
        },
      );
    }

    const payload: ContactRequestBody =
      {
        name:
          body.name.trim(),

        email:
          body.email.trim(),

        subject:
          body.subject.trim(),

        message:
          body.message.trim(),
      };

    if (
      !payload.name ||
      !payload.email ||
      !payload.subject ||
      !payload.message
    ) {
      return NextResponse.json(
        {
          detail:
            "Name, email, subject and message are required.",
        },
        {
          status: 400,
        },
      );
    }

    const response =
      await fetch(
        `${serverEnv.apiUrl}/public/contact`,
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

          cache: "no-store",
        },
      );

    const responseText =
      await response.text();

    let responseBody:
      unknown = null;

    if (responseText) {
      try {
        responseBody =
          JSON.parse(
            responseText,
          );
      } catch {
        responseBody = {
          detail:
            responseText,
        };
      }
    }

    if (!response.ok) {
      console.error(
        "[Contact API] Backend rejected request:",
        response.status,
        responseBody,
      );

      return NextResponse.json(
        responseBody ?? {
          detail:
            "The message could not be sent.",
        },
        {
          status:
            response.status,
        },
      );
    }

    return NextResponse.json(
      responseBody ?? {
        success: true,
      },
      {
        status:
          response.status,
      },
    );
  } catch (error) {
    console.error(
      "[Contact API] Error communicating with backend:",
      error,
    );

    return NextResponse.json(
      {
        detail:
          "The contact service is currently unavailable.",
      },
      {
        status: 500,
      },
    );
  }
}