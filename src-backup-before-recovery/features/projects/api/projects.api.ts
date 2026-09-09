import {
  adminApiClient,
} from "@/shared/api/admin-api-client";

import type {
  Project,
  ProjectCategory,
  ProjectCategoryCreatePayload,
  ProjectCategoryUpdatePayload,
  ProjectCreatePayload,
  ProjectLink,
  ProjectLinkCreatePayload,
  ProjectLinkUpdatePayload,
  ProjectListResponse,
  ProjectMedia,
  ProjectMediaCreatePayload,
  ProjectMediaUpdatePayload,
  ProjectSection,
  ProjectSectionCreatePayload,
  ProjectSectionItem,
  ProjectSectionItemCreatePayload,
  ProjectSectionItemUpdatePayload,
  ProjectSectionUpdatePayload,
  ProjectTechnology,
  ProjectTechnologyCreatePayload,
  ProjectTechnologyUpdatePayload,
  ProjectUpdatePayload,
} from "../types/project.types";


/* PROJECTS */

export async function getProjects():
  Promise<Project[]> {
  const response =
    await adminApiClient<
      ProjectListResponse
    >(
      "/projects",
    );

  return response.items;
}


export function getProject(
  projectId: number,
) {
  return adminApiClient<
    Project
  >(
    `/projects/${projectId}`,
  );
}


export function createProject(
  payload:
    ProjectCreatePayload,
) {
  return adminApiClient<
    Project
  >(
    "/projects",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateProject(
  projectId: number,
  payload:
    ProjectUpdatePayload,
) {
  return adminApiClient<
    Project
  >(
    `/projects/${projectId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteProject(
  projectId: number,
) {
  return adminApiClient<void>(
    `/projects/${projectId}`,
    {
      method: "DELETE",
    },
  );
}


/* CATEGORY CATALOG */

export function getProjectCategories() {
  return adminApiClient<
    ProjectCategory[]
  >(
    "/project-categories",
  );
}


export function createProjectCategory(
  payload:
    ProjectCategoryCreatePayload,
) {
  return adminApiClient<
    ProjectCategory
  >(
    "/project-categories",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateProjectCategory(
  categoryId: number,
  payload:
    ProjectCategoryUpdatePayload,
) {
  return adminApiClient<
    ProjectCategory
  >(
    `/project-categories/${categoryId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteProjectCategory(
  categoryId: number,
) {
  return adminApiClient<void>(
    `/project-categories/${categoryId}`,
    {
      method: "DELETE",
    },
  );
}


/* CATEGORY RELATIONS */

export function addProjectCategory(
  projectId: number,
  categoryId: number,
) {
  return adminApiClient<
    Project
  >(
    `/projects/${projectId}/categories/${categoryId}`,
    {
      method: "POST",
    },
  );
}


export function removeProjectCategory(
  projectId: number,
  categoryId: number,
) {
  return adminApiClient<void>(
    `/projects/${projectId}/categories/${categoryId}`,
    {
      method: "DELETE",
    },
  );
}


/* TECHNOLOGIES */

export function addProjectTechnology(
  projectId: number,
  payload:
    ProjectTechnologyCreatePayload,
) {
  return adminApiClient<
    ProjectTechnology
  >(
    `/projects/${projectId}/technologies`,
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateProjectTechnology(
  projectId: number,
  technologyId: number,
  payload:
    ProjectTechnologyUpdatePayload,
) {
  return adminApiClient<
    ProjectTechnology
  >(
    `/projects/${projectId}/technologies/${technologyId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function removeProjectTechnology(
  projectId: number,
  technologyId: number,
) {
  return adminApiClient<void>(
    `/projects/${projectId}/technologies/${technologyId}`,
    {
      method: "DELETE",
    },
  );
}


/* LINKS */

export function createProjectLink(
  projectId: number,
  payload:
    ProjectLinkCreatePayload,
) {
  return adminApiClient<
    ProjectLink
  >(
    `/projects/${projectId}/links`,
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateProjectLink(
  projectId: number,
  linkId: number,
  payload:
    ProjectLinkUpdatePayload,
) {
  return adminApiClient<
    ProjectLink
  >(
    `/projects/${projectId}/links/${linkId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteProjectLink(
  projectId: number,
  linkId: number,
) {
  return adminApiClient<void>(
    `/projects/${projectId}/links/${linkId}`,
    {
      method: "DELETE",
    },
  );
}


/* MEDIA */

export function createProjectMedia(
  projectId: number,
  payload:
    ProjectMediaCreatePayload,
) {
  return adminApiClient<
    ProjectMedia
  >(
    `/projects/${projectId}/media`,
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateProjectMedia(
  projectId: number,
  projectMediaId: number,
  payload:
    ProjectMediaUpdatePayload,
) {
  return adminApiClient<
    ProjectMedia
  >(
    `/projects/${projectId}/media/${projectMediaId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteProjectMedia(
  projectId: number,
  projectMediaId: number,
) {
  return adminApiClient<void>(
    `/projects/${projectId}/media/${projectMediaId}`,
    {
      method: "DELETE",
    },
  );
}


/* SECTIONS */

export function createProjectSection(
  projectId: number,
  payload:
    ProjectSectionCreatePayload,
) {
  return adminApiClient<
    ProjectSection
  >(
    `/projects/${projectId}/sections`,
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateProjectSection(
  projectId: number,
  sectionId: number,
  payload:
    ProjectSectionUpdatePayload,
) {
  return adminApiClient<
    ProjectSection
  >(
    `/projects/${projectId}/sections/${sectionId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteProjectSection(
  projectId: number,
  sectionId: number,
) {
  return adminApiClient<void>(
    `/projects/${projectId}/sections/${sectionId}`,
    {
      method: "DELETE",
    },
  );
}


/* SECTION ITEMS */

export function createProjectSectionItem(
  projectId: number,
  sectionId: number,
  payload:
    ProjectSectionItemCreatePayload,
) {
  return adminApiClient<
    ProjectSectionItem
  >(
    `/projects/${projectId}/sections/${sectionId}/items`,
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateProjectSectionItem(
  projectId: number,
  sectionId: number,
  itemId: number,
  payload:
    ProjectSectionItemUpdatePayload,
) {
  return adminApiClient<
    ProjectSectionItem
  >(
    `/projects/${projectId}/sections/${sectionId}/items/${itemId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteProjectSectionItem(
  projectId: number,
  sectionId: number,
  itemId: number,
) {
  return adminApiClient<void>(
    `/projects/${projectId}/sections/${sectionId}/items/${itemId}`,
    {
      method: "DELETE",
    },
  );
}