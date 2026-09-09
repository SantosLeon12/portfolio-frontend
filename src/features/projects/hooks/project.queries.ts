"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getProject,
  getProjectCategories,
  getProjects,
} from "../api/projects.api";


export const projectsQueryKey = [
  "projects",
] as const;


export const projectCategoriesQueryKey = [
  "project-categories",
] as const;


export function projectQueryKey(
  projectId: number,
) {
  return [
    "projects",
    projectId,
  ] as const;
}


export function useProjects() {
  return useQuery({
    queryKey:
      projectsQueryKey,

    queryFn:
      getProjects,
  });
}


export function useProject(
  projectId: number,
) {
  return useQuery({
    queryKey:
      projectQueryKey(
        projectId,
      ),

    queryFn: () =>
      getProject(
        projectId,
      ),

    enabled:
      projectId > 0,
  });
}


export function useProjectCategories() {
  return useQuery({
    queryKey:
      projectCategoriesQueryKey,

    queryFn:
      getProjectCategories,
  });
}