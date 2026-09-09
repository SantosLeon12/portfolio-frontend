import "server-only";

import { cookies } from "next/headers";

import { serverEnv } from "@/config/server-env";

import type {
  AdminUser,
} from "../types/auth.types";


export async function getAdminSession():
  Promise<AdminUser | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    "portfolio_access_token",
  )?.value;

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(
      `${serverEnv.apiUrl}/auth/me`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },

        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    return (
      await response.json()
    ) as AdminUser;
  } catch {
    return null;
  }
}