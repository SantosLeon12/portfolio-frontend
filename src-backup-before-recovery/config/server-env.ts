import "server-only";

const apiUrl = process.env.API_URL;

if (!apiUrl) {
  throw new Error(
    "API_URL is not defined",
  );
}

export const serverEnv = {
  apiUrl,
} as const;