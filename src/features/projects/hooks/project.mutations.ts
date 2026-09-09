"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  addProjectCategory,
  addProjectTechnology,
  createProject,
  createProjectCategory,
  createProjectLink,
  createProjectMedia,
  createProjectSection,
  createProjectSectionItem,
  deleteProject,
  deleteProjectCategory,
  deleteProjectLink,
  deleteProjectMedia,
  deleteProjectSection,
  deleteProjectSectionItem,
  removeProjectCategory,
  removeProjectTechnology,
  updateProject,
  updateProjectCategory,
  updateProjectLink,
  updateProjectMedia,
  updateProjectSection,
  updateProjectSectionItem,
  updateProjectTechnology,
} from "../api/projects.api";

import type {
  ProjectCategoryUpdatePayload,
  ProjectLinkCreatePayload,
  ProjectLinkUpdatePayload,
  ProjectMediaCreatePayload,
  ProjectMediaUpdatePayload,
  ProjectSectionCreatePayload,
  ProjectSectionItemCreatePayload,
  ProjectSectionItemUpdatePayload,
  ProjectSectionUpdatePayload,
  ProjectTechnologyCreatePayload,
  ProjectTechnologyUpdatePayload,
  ProjectUpdatePayload,
} from "../types/project.types";

import {
  projectCategoriesQueryKey,
  projectsQueryKey,
} from "./project.queries";


function useProjectRefresh() {
  const queryClient =
    useQueryClient();

  return () =>
    queryClient.invalidateQueries({
      queryKey:
        projectsQueryKey,
    });
}


export function useProjectMutations() {
  const refresh =
    useProjectRefresh();

  return {
    createMutation:
      useMutation({
        mutationFn:
          createProject,
        onSuccess:
          refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          id,
          payload,
        }: {
          id: number;
          payload:
            ProjectUpdatePayload;
        }) =>
          updateProject(
            id,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteProject,

        onSuccess:
          refresh,
      }),
  };
}


export function useProjectCategoryCatalogMutations() {
  const queryClient =
    useQueryClient();

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey:
          projectCategoriesQueryKey,
      }),

      queryClient.invalidateQueries({
        queryKey:
          projectsQueryKey,
      }),
    ]);
  };

  return {
    createMutation:
      useMutation({
        mutationFn:
          createProjectCategory,
        onSuccess:
          refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          id,
          payload,
        }: {
          id: number;
          payload:
            ProjectCategoryUpdatePayload;
        }) =>
          updateProjectCategory(
            id,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteProjectCategory,

        onSuccess:
          refresh,
      }),
  };
}


export function useProjectCategoryRelationMutations(
  projectId: number,
) {
  const refresh =
    useProjectRefresh();

  return {
    addMutation:
      useMutation({
        mutationFn: (
          categoryId:
            number,
        ) =>
          addProjectCategory(
            projectId,
            categoryId,
          ),

        onSuccess:
          refresh,
      }),

    removeMutation:
      useMutation({
        mutationFn: (
          categoryId:
            number,
        ) =>
          removeProjectCategory(
            projectId,
            categoryId,
          ),

        onSuccess:
          refresh,
      }),
  };
}


export function useProjectTechnologyMutations(
  projectId: number,
) {
  const refresh =
    useProjectRefresh();

  return {
    createMutation:
      useMutation({
        mutationFn: (
          payload:
            ProjectTechnologyCreatePayload,
        ) =>
          addProjectTechnology(
            projectId,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          technologyId,
          payload,
        }: {
          technologyId:
            number;

          payload:
            ProjectTechnologyUpdatePayload;
        }) =>
          updateProjectTechnology(
            projectId,
            technologyId,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn: (
          technologyId:
            number,
        ) =>
          removeProjectTechnology(
            projectId,
            technologyId,
          ),

        onSuccess:
          refresh,
      }),
  };
}


export function useProjectLinkMutations(
  projectId: number,
) {
  const refresh =
    useProjectRefresh();

  return {
    createMutation:
      useMutation({
        mutationFn: (
          payload:
            ProjectLinkCreatePayload,
        ) =>
          createProjectLink(
            projectId,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          linkId,
          payload,
        }: {
          linkId: number;

          payload:
            ProjectLinkUpdatePayload;
        }) =>
          updateProjectLink(
            projectId,
            linkId,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn: (
          linkId: number,
        ) =>
          deleteProjectLink(
            projectId,
            linkId,
          ),

        onSuccess:
          refresh,
      }),
  };
}


export function useProjectMediaMutations(
  projectId: number,
) {
  const refresh =
    useProjectRefresh();

  return {
    createMutation:
      useMutation({
        mutationFn: (
          payload:
            ProjectMediaCreatePayload,
        ) =>
          createProjectMedia(
            projectId,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          projectMediaId,
          payload,
        }: {
          projectMediaId:
            number;

          payload:
            ProjectMediaUpdatePayload;
        }) =>
          updateProjectMedia(
            projectId,
            projectMediaId,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn: (
          projectMediaId:
            number,
        ) =>
          deleteProjectMedia(
            projectId,
            projectMediaId,
          ),

        onSuccess:
          refresh,
      }),
  };
}


export function useProjectSectionMutations(
  projectId: number,
) {
  const refresh =
    useProjectRefresh();

  return {
    createMutation:
      useMutation({
        mutationFn: (
          payload:
            ProjectSectionCreatePayload,
        ) =>
          createProjectSection(
            projectId,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          sectionId,
          payload,
        }: {
          sectionId:
            number;

          payload:
            ProjectSectionUpdatePayload;
        }) =>
          updateProjectSection(
            projectId,
            sectionId,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn: (
          sectionId:
            number,
        ) =>
          deleteProjectSection(
            projectId,
            sectionId,
          ),

        onSuccess:
          refresh,
      }),
  };
}


export function useProjectSectionItemMutations(
  projectId: number,
  sectionId: number,
) {
  const refresh =
    useProjectRefresh();

  return {
    createMutation:
      useMutation({
        mutationFn: (
          payload:
            ProjectSectionItemCreatePayload,
        ) =>
          createProjectSectionItem(
            projectId,
            sectionId,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          itemId,
          payload,
        }: {
          itemId: number;

          payload:
            ProjectSectionItemUpdatePayload;
        }) =>
          updateProjectSectionItem(
            projectId,
            sectionId,
            itemId,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn: (
          itemId: number,
        ) =>
          deleteProjectSectionItem(
            projectId,
            sectionId,
            itemId,
          ),

        onSuccess:
          refresh,
      }),
  };
}