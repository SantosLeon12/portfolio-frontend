import { NextResponse } from "next/server";

import { serverEnv } from "@/config/server-env";

import type {
  LoginResponse,
} from "@/features/auth/types/auth.types";


export async function POST(
  request: Request,
) {
  const body = await request.json();

  const response = await fetch(
    `${serverEnv.apiUrl}/auth/login`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),

      cache: "no-store",
    },
  );

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      data,
      {
        status: response.status,
      },
    );
  }

  const loginData =
    data as LoginResponse;

  const result = NextResponse.json({
    admin: loginData.admin,
  });

  result.cookies.set(
    "portfolio_access_token",
    loginData.access_token,
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "lax",

      path: "/",

      maxAge: loginData.expires_in,
    },
  );

  return result;
}