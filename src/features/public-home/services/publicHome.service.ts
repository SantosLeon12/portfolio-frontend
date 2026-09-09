import "server-only";

import {
  serverEnv,
} from "@/config/server-env";

import type {
  PublicEducationList,
  PublicExperienceList,
  PublicHomeData,
  PublicProfile,
  PublicProfileDocument,
  PublicProfileLanguageList,
  PublicProfileMedia,
  PublicProfileTechnologyList,
  PublicProjectList,
  PublicProjectMedia,
  PublicProjectWithMedia,
} from "../types/publicHome.types";

const API_BASE_URL =
  serverEnv.apiUrl.replace(
    /\/$/,
    "",
  );


/* =========================================================
   BASE FETCH
   ========================================================= */

async function fetchPublicData<T>(
  path: string,
): Promise<T> {
  const response = await fetch(
    `${API_BASE_URL}${path}`,
    {
      method: "GET",

      headers: {
        Accept:
          "application/json",
      },

      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error(
      [
        "Failed to fetch public data.",
        `Endpoint: ${path}`,
        `Status: ${response.status}`,
      ].join(" "),
    );
  }

  return response.json() as Promise<T>;
}


/* =========================================================
   PROFILE
   ========================================================= */

export async function getPublicProfile(): Promise<PublicProfile> {
  return fetchPublicData<PublicProfile>(
    "/public/profile",
  );
}


/* =========================================================
   PROFILE MEDIA
   ========================================================= */

export async function getPublicProfileMedia(): Promise<
  PublicProfileMedia[]
> {
  return fetchPublicData<
    PublicProfileMedia[]
  >(
    "/public/media/profile",
  );
}


/* =========================================================
   DOCUMENTS
   ========================================================= */

export async function getPublicProfileDocuments(): Promise<
  PublicProfileDocument[]
> {
  return fetchPublicData<
    PublicProfileDocument[]
  >(
    "/public/media/documents",
  );
}


/* =========================================================
   TECHNOLOGIES
   ========================================================= */

export async function getPublicProfileTechnologies() {
  const response =
    await fetchPublicData<
      PublicProfileTechnologyList
    >(
      "/public/profile/technologies",
    );

  return response.items;
}


/* =========================================================
   PROJECT MEDIA
   ========================================================= */

export async function getPublicProjectMedia(
  projectSlug: string,
): Promise<PublicProjectMedia[]> {
  return fetchPublicData<
    PublicProjectMedia[]
  >(
    `/public/media/projects/${projectSlug}`,
  );
}


/* =========================================================
   PROJECTS
   ========================================================= */

export async function getPublicProjects(): Promise<
  PublicProjectWithMedia[]
> {
  const response =
    await fetchPublicData<
      PublicProjectList
    >(
      "/public/projects",
    );

  const sortedProjects =
    [...response.items].sort(
      (a, b) =>
        a.display_order -
        b.display_order,
    );

  return Promise.all(
    sortedProjects.map(
      async (project) => {
        const media =
          await getPublicProjectMedia(
            project.slug,
          );

        return {
          project,

          media:
            [...media].sort(
              (a, b) =>
                a.display_order -
                b.display_order,
            ),
        };
      },
    ),
  );
}


/* =========================================================
   EXPERIENCE
   ========================================================= */

export async function getPublicExperiences() {
  const response =
    await fetchPublicData<
      PublicExperienceList
    >(
      "/public/experiences",
    );

  return [...response.items]
    .filter(
      (item) =>
        item.is_visible,
    )
    .sort(
      (a, b) =>
        a.display_order -
        b.display_order,
    );
}


/* =========================================================
   EDUCATION
   ========================================================= */

export async function getPublicEducations() {
  const response =
    await fetchPublicData<
      PublicEducationList
    >(
      "/public/educations",
    );

  return [...response.items]
    .filter(
      (item) =>
        item.is_visible,
    )
    .sort(
      (a, b) =>
        a.display_order -
        b.display_order,
    );
}


/* =========================================================
   LANGUAGES
   ========================================================= */

export async function getPublicLanguages() {
  const response =
    await fetchPublicData<
      PublicProfileLanguageList
    >(
      "/public/languages",
    );

  return [...response.items].sort(
    (a, b) =>
      a.display_order -
      b.display_order,
  );
}


/* =========================================================
   HOME
   ========================================================= */

export async function getPublicHomeData(): Promise<PublicHomeData> {
  const [
    profile,
    profileMedia,
    documents,
    technologies,
    projects,
    experiences,
    educations,
    languages,
  ] = await Promise.all([
    getPublicProfile(),
    getPublicProfileMedia(),
    getPublicProfileDocuments(),
    getPublicProfileTechnologies(),
    getPublicProjects(),
    getPublicExperiences(),
    getPublicEducations(),
    getPublicLanguages(),
  ]);

  return {
    profile,
    profileMedia,
    documents,
    technologies,
    projects,
    experiences,
    educations,
    languages,
  };
}