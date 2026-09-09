"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProfileTechnology,
  createTechnology,
  createTechnologyCategory,
  deleteProfileTechnology,
  deleteTechnology,
  deleteTechnologyCategory,
  updateProfileTechnology,
  updateTechnology,
  updateTechnologyCategory,
} from "../api/technologies.api";

import type {
  ProfileTechnologyUpdatePayload,
  TechnologyCategoryUpdatePayload,
  TechnologyUpdatePayload,
} from "../types/technology.types";

import {
  profileTechnologiesQueryKey,
  technologiesQueryKey,
  technologyCategoriesQueryKey,
} from "./technology.queries";


export function useTechnologyCategoryMutations() {
  const queryClient =
    useQueryClient();

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey:
          technologyCategoriesQueryKey,
      }),

      queryClient.invalidateQueries({
        queryKey:
          technologiesQueryKey,
      }),

      queryClient.invalidateQueries({
        queryKey:
          profileTechnologiesQueryKey,
      }),
    ]);
  };


  return {
    createMutation:
      useMutation({
        mutationFn:
          createTechnologyCategory,

        onSuccess: refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          id,
          payload,
        }: {
          id: number;
          payload:
            TechnologyCategoryUpdatePayload;
        }) =>
          updateTechnologyCategory(
            id,
            payload,
          ),

        onSuccess: refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteTechnologyCategory,

        onSuccess: refresh,
      }),
  };
}


export function useTechnologyMutations() {
  const queryClient =
    useQueryClient();

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey:
          technologiesQueryKey,
      }),

      queryClient.invalidateQueries({
        queryKey:
          profileTechnologiesQueryKey,
      }),
    ]);
  };


  return {
    createMutation:
      useMutation({
        mutationFn:
          createTechnology,

        onSuccess: refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          id,
          payload,
        }: {
          id: number;

          payload:
            TechnologyUpdatePayload;
        }) =>
          updateTechnology(
            id,
            payload,
          ),

        onSuccess: refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteTechnology,

        onSuccess: refresh,
      }),
  };
}


export function useProfileTechnologyMutations() {
  const queryClient =
    useQueryClient();

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey:
        profileTechnologiesQueryKey,
    });


  return {
    createMutation:
      useMutation({
        mutationFn:
          createProfileTechnology,

        onSuccess: refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          technologyId,
          payload,
        }: {
          technologyId: number;

          payload:
            ProfileTechnologyUpdatePayload;
        }) =>
          updateProfileTechnology(
            technologyId,
            payload,
          ),

        onSuccess: refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteProfileTechnology,

        onSuccess: refresh,
      }),
  };
}