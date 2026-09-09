import {
  adminApiClient,
} from "@/shared/api/admin-api-client";

import type {
  Education,
  EducationCreatePayload,
  EducationUpdatePayload,
  Experience,
  ExperienceCreatePayload,
  ExperienceHighlight,
  ExperienceHighlightCreatePayload,
  ExperienceHighlightUpdatePayload,
  ExperienceTechnology,
  ExperienceTechnologyCreatePayload,
  ExperienceTechnologyUpdatePayload,
  ExperienceUpdatePayload,
} from "../types/professional.types";


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
   EXPERIENCES
========================= */

export async function getExperiences():
  Promise<Experience[]> {
  const response =
    await adminApiClient<
      ListResponse<Experience>
    >(
      "/experiences",
    );

  return normalizeList(
    response,
    "experiences",
  );
}


export function getExperience(
  experienceId: number,
) {
  return adminApiClient<
    Experience
  >(
    `/experiences/${experienceId}`,
  );
}


export function createExperience(
  payload:
    ExperienceCreatePayload,
) {
  return adminApiClient<
    Experience
  >(
    "/experiences",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateExperience(
  id: number,
  payload:
    ExperienceUpdatePayload,
) {
  return adminApiClient<
    Experience
  >(
    `/experiences/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteExperience(
  id: number,
) {
  return adminApiClient<void>(
    `/experiences/${id}`,
    {
      method: "DELETE",
    },
  );
}


/* =========================
   HIGHLIGHTS
========================= */

export function createExperienceHighlight(
  experienceId: number,
  payload:
    ExperienceHighlightCreatePayload,
) {
  return adminApiClient<
    ExperienceHighlight
  >(
    `/experiences/${experienceId}/highlights`,
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateExperienceHighlight(
  experienceId: number,
  highlightId: number,
  payload:
    ExperienceHighlightUpdatePayload,
) {
  return adminApiClient<
    ExperienceHighlight
  >(
    `/experiences/${experienceId}/highlights/${highlightId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteExperienceHighlight(
  experienceId: number,
  highlightId: number,
) {
  return adminApiClient<void>(
    `/experiences/${experienceId}/highlights/${highlightId}`,
    {
      method: "DELETE",
    },
  );
}


/* =========================
   EXPERIENCE TECHNOLOGIES
========================= */

export function createExperienceTechnology(
  experienceId: number,
  payload:
    ExperienceTechnologyCreatePayload,
) {
  return adminApiClient<
    ExperienceTechnology
  >(
    `/experiences/${experienceId}/technologies`,
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateExperienceTechnology(
  experienceId: number,
  technologyId: number,
  payload:
    ExperienceTechnologyUpdatePayload,
) {
  return adminApiClient<
    ExperienceTechnology
  >(
    `/experiences/${experienceId}/technologies/${technologyId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteExperienceTechnology(
  experienceId: number,
  technologyId: number,
) {
  return adminApiClient<void>(
    `/experiences/${experienceId}/technologies/${technologyId}`,
    {
      method: "DELETE",
    },
  );
}


/* =========================
   EDUCATION
========================= */

export async function getEducations():
  Promise<Education[]> {
  const response =
    await adminApiClient<
      ListResponse<Education>
    >(
      "/educations",
    );

  return normalizeList(
    response,
    "education",
  );
}


export function createEducation(
  payload:
    EducationCreatePayload,
) {
  return adminApiClient<
    Education
  >(
    "/educations",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateEducation(
  id: number,
  payload:
    EducationUpdatePayload,
) {
  return adminApiClient<
    Education
  >(
    `/educations/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteEducation(
  id: number,
) {
  return adminApiClient<void>(
    `/educations/${id}`,
    {
      method: "DELETE",
    },
  );
}