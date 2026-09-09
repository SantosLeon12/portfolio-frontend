import {
  apiClient,
} from "@/shared/api/api-client";

import {
  adminApiClient,
} from "@/shared/api/admin-api-client";

import type {
  ProfileTechnology,
  ProfileTechnologyCreatePayload,
  ProfileTechnologyUpdatePayload,
  Technology,
  TechnologyCategory,
  TechnologyCategoryCreatePayload,
  TechnologyCategoryUpdatePayload,
  TechnologyCreatePayload,
  TechnologyUpdatePayload,
} from "../types/technology.types";


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
  if (
    Array.isArray(response)
  ) {
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
   CATEGORIES
========================= */

export async function getTechnologyCategories():
  Promise<TechnologyCategory[]> {
  const response =
    await apiClient<
      ListResponse<TechnologyCategory>
    >(
      "/public/technologies/categories",
      {
        cache: "no-store",
      },
    );

  return normalizeList(
    response,
    "technology categories",
  );
}


export function createTechnologyCategory(
  payload:
    TechnologyCategoryCreatePayload,
) {
  return adminApiClient<
    TechnologyCategory
  >(
    "/technology-categories",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateTechnologyCategory(
  id: number,
  payload:
    TechnologyCategoryUpdatePayload,
) {
  return adminApiClient<
    TechnologyCategory
  >(
    `/technology-categories/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteTechnologyCategory(
  id: number,
) {
  return adminApiClient<void>(
    `/technology-categories/${id}`,
    {
      method: "DELETE",
    },
  );
}


/* =========================
   TECHNOLOGIES
========================= */

export async function getTechnologies():
  Promise<Technology[]> {
  const response =
    await apiClient<
      ListResponse<Technology>
    >(
      "/public/technologies",
      {
        cache: "no-store",
      },
    );

  return normalizeList(
    response,
    "technologies",
  );
}


export function createTechnology(
  payload:
    TechnologyCreatePayload,
) {
  return adminApiClient<Technology>(
    "/technologies",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateTechnology(
  id: number,
  payload:
    TechnologyUpdatePayload,
) {
  return adminApiClient<Technology>(
    `/technologies/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteTechnology(
  id: number,
) {
  return adminApiClient<void>(
    `/technologies/${id}`,
    {
      method: "DELETE",
    },
  );
}


/* =========================
   PROFILE TECHNOLOGIES
========================= */

export async function getProfileTechnologies():
  Promise<ProfileTechnology[]> {
  const response =
    await adminApiClient<
      ListResponse<ProfileTechnology>
    >(
      "/profile/technologies",
    );

  return normalizeList(
    response,
    "profile technologies",
  );
}


export function createProfileTechnology(
  payload:
    ProfileTechnologyCreatePayload,
) {
  return adminApiClient<
    ProfileTechnology
  >(
    "/profile/technologies",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateProfileTechnology(
  technologyId: number,
  payload:
    ProfileTechnologyUpdatePayload,
) {
  return adminApiClient<
    ProfileTechnology
  >(
    `/profile/technologies/${technologyId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteProfileTechnology(
  technologyId: number,
) {
  return adminApiClient<void>(
    `/profile/technologies/${technologyId}`,
    {
      method: "DELETE",
    },
  );
}