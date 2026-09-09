import {
  adminApiClient,
} from "@/shared/api/admin-api-client";

import type {
  Language,
  LanguageCreatePayload,
  LanguageUpdatePayload,
  ProfileLanguage,
  ProfileLanguageCreatePayload,
  ProfileLanguageUpdatePayload,
  ProficiencyLevel,
  ProficiencyLevelCreatePayload,
  ProficiencyLevelUpdatePayload,
} from "../types/language.types";


type ListResponse<T> =
  | T[]
  | {
      items: T[];
      total?: number;
    };


function normalizeList<T>(
  response: ListResponse<T>,
  resource: string,
): T[] {
  if (Array.isArray(response)) {
    return response;
  }

  if (
    response &&
    Array.isArray(
      response.items,
    )
  ) {
    return response.items;
  }

  throw new Error(
    `Invalid ${resource} response`,
  );
}


/* =========================
   LANGUAGES
========================= */

export async function getLanguages():
  Promise<Language[]> {
  const response =
    await adminApiClient<
      ListResponse<Language>
    >(
      "/languages",
    );

  return normalizeList(
    response,
    "languages",
  );
}


export function createLanguage(
  payload:
    LanguageCreatePayload,
) {
  return adminApiClient<Language>(
    "/languages",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateLanguage(
  id: number,
  payload:
    LanguageUpdatePayload,
) {
  return adminApiClient<Language>(
    `/languages/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteLanguage(
  id: number,
) {
  return adminApiClient<void>(
    `/languages/${id}`,
    {
      method: "DELETE",
    },
  );
}


/* =========================
   PROFICIENCY LEVELS
========================= */

export async function getProficiencyLevels():
  Promise<ProficiencyLevel[]> {
  const response =
    await adminApiClient<
      ListResponse<ProficiencyLevel>
    >(
      "/languages/proficiency-levels",
    );

  return normalizeList(
    response,
    "proficiency levels",
  );
}


export function createProficiencyLevel(
  payload:
    ProficiencyLevelCreatePayload,
) {
  return adminApiClient<
    ProficiencyLevel
  >(
    "/languages/proficiency-levels",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateProficiencyLevel(
  id: number,
  payload:
    ProficiencyLevelUpdatePayload,
) {
  return adminApiClient<
    ProficiencyLevel
  >(
    `/languages/proficiency-levels/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteProficiencyLevel(
  id: number,
) {
  return adminApiClient<void>(
    `/languages/proficiency-levels/${id}`,
    {
      method: "DELETE",
    },
  );
}


/* =========================
   PROFILE LANGUAGES
========================= */

export async function getProfileLanguages():
  Promise<ProfileLanguage[]> {
  const response =
    await adminApiClient<
      ListResponse<ProfileLanguage>
    >(
      "/languages/profile",
    );

  return normalizeList(
    response,
    "profile languages",
  );
}


export function createProfileLanguage(
  payload:
    ProfileLanguageCreatePayload,
) {
  return adminApiClient<
    ProfileLanguage
  >(
    "/languages/profile",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateProfileLanguage(
  languageId: number,
  payload:
    ProfileLanguageUpdatePayload,
) {
  return adminApiClient<
    ProfileLanguage
  >(
    `/languages/profile/${languageId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteProfileLanguage(
  languageId: number,
) {
  return adminApiClient<void>(
    `/languages/profile/${languageId}`,
    {
      method: "DELETE",
    },
  );
}