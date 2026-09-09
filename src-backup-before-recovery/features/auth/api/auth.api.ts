import type {
  AdminUser,
  LoginCredentials,
} from "../types/auth.types";


export async function login(
  credentials: LoginCredentials,
): Promise<AdminUser> {
  const response = await fetch(
    "/api/auth/login",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(
        credentials,
      ),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof data.detail === "string"
        ? data.detail
        : "Unable to sign in",
    );
  }

  return data.admin;
}


export async function logout() {
  await fetch(
    "/api/auth/logout",
    {
      method: "POST",
    },
  );
}