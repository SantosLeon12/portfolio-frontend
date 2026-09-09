import { NextResponse } from "next/server";

import {
  getAdminSession,
} from "@/features/auth/lib/server-session";


export async function GET() {
  const admin =
    await getAdminSession();

  if (!admin) {
    return NextResponse.json(
      {
        authenticated: false,
      },
      {
        status: 401,
      },
    );
  }

  return NextResponse.json({
    authenticated: true,
    admin,
  });
}