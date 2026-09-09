"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createEducation,
  createExperience,
  createExperienceHighlight,
  createExperienceTechnology,
  deleteEducation,
  deleteExperience,
  deleteExperienceHighlight,
  deleteExperienceTechnology,
  updateEducation,
  updateExperience,
  updateExperienceHighlight,
  updateExperienceTechnology,
} from "../api/professional.api";

import type {
  EducationUpdatePayload,
  ExperienceHighlightCreatePayload,
  ExperienceHighlightUpdatePayload,
  ExperienceTechnologyCreatePayload,
  ExperienceTechnologyUpdatePayload,
  ExperienceUpdatePayload,
} from "../types/professional.types";

import {
  educationsQueryKey,
  experienceQueryKey,
  experiencesQueryKey,
} from "./professional.queries";


export function useExperienceMutations() {
  const queryClient =
    useQueryClient();

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey:
        experiencesQueryKey,
    });


  return {
    createMutation:
      useMutation({
        mutationFn:
          createExperience,

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
            ExperienceUpdatePayload;
        }) =>
          updateExperience(
            id,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteExperience,

        onSuccess:
          refresh,
      }),
  };
}


export function useEducationMutations() {
  const queryClient =
    useQueryClient();

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey:
        educationsQueryKey,
    });


  return {
    createMutation:
      useMutation({
        mutationFn:
          createEducation,

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
            EducationUpdatePayload;
        }) =>
          updateEducation(
            id,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteEducation,

        onSuccess:
          refresh,
      }),
  };
}


export function useExperienceHighlightMutations(
  experienceId: number,
) {
  const queryClient =
    useQueryClient();

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey:
          experienceQueryKey(
            experienceId,
          ),
      }),

      queryClient.invalidateQueries({
        queryKey:
          experiencesQueryKey,
      }),
    ]);
  };


  return {
    createMutation:
      useMutation({
        mutationFn: (
          payload:
            ExperienceHighlightCreatePayload,
        ) =>
          createExperienceHighlight(
            experienceId,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          highlightId,
          payload,
        }: {
          highlightId:
            number;

          payload:
            ExperienceHighlightUpdatePayload;
        }) =>
          updateExperienceHighlight(
            experienceId,
            highlightId,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn: (
          highlightId:
            number,
        ) =>
          deleteExperienceHighlight(
            experienceId,
            highlightId,
          ),

        onSuccess:
          refresh,
      }),
  };
}


export function useExperienceTechnologyMutations(
  experienceId: number,
) {
  const queryClient =
    useQueryClient();

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey:
          experienceQueryKey(
            experienceId,
          ),
      }),

      queryClient.invalidateQueries({
        queryKey:
          experiencesQueryKey,
      }),
    ]);
  };


  return {
    createMutation:
      useMutation({
        mutationFn: (
          payload:
            ExperienceTechnologyCreatePayload,
        ) =>
          createExperienceTechnology(
            experienceId,
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
            ExperienceTechnologyUpdatePayload;
        }) =>
          updateExperienceTechnology(
            experienceId,
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
          deleteExperienceTechnology(
            experienceId,
            technologyId,
          ),

        onSuccess:
          refresh,
      }),
  };
}