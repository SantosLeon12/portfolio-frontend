"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createLanguage,
  createProfileLanguage,
  createProficiencyLevel,
  deleteLanguage,
  deleteProfileLanguage,
  deleteProficiencyLevel,
  updateLanguage,
  updateProfileLanguage,
  updateProficiencyLevel,
} from "../api/languages.api";

import type {
  LanguageUpdatePayload,
  ProfileLanguageUpdatePayload,
  ProficiencyLevelUpdatePayload,
} from "../types/language.types";

import {
  languagesQueryKey,
  profileLanguagesQueryKey,
  proficiencyLevelsQueryKey,
} from "./language.queries";


export function useLanguageMutations() {
  const queryClient =
    useQueryClient();

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey:
          languagesQueryKey,
      }),

      queryClient.invalidateQueries({
        queryKey:
          profileLanguagesQueryKey,
      }),
    ]);
  };


  return {
    createMutation:
      useMutation({
        mutationFn:
          createLanguage,

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
            LanguageUpdatePayload;
        }) =>
          updateLanguage(
            id,
            payload,
          ),

        onSuccess: refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteLanguage,

        onSuccess: refresh,
      }),
  };
}


export function useProficiencyLevelMutations() {
  const queryClient =
    useQueryClient();

  const refresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey:
          proficiencyLevelsQueryKey,
      }),

      queryClient.invalidateQueries({
        queryKey:
          profileLanguagesQueryKey,
      }),
    ]);
  };


  return {
    createMutation:
      useMutation({
        mutationFn:
          createProficiencyLevel,

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
            ProficiencyLevelUpdatePayload;
        }) =>
          updateProficiencyLevel(
            id,
            payload,
          ),

        onSuccess: refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteProficiencyLevel,

        onSuccess: refresh,
      }),
  };
}


export function useProfileLanguageMutations() {
  const queryClient =
    useQueryClient();

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey:
        profileLanguagesQueryKey,
    });


  return {
    createMutation:
      useMutation({
        mutationFn:
          createProfileLanguage,

        onSuccess: refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          languageId,
          payload,
        }: {
          languageId: number;

          payload:
            ProfileLanguageUpdatePayload;
        }) =>
          updateProfileLanguage(
            languageId,
            payload,
          ),

        onSuccess: refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteProfileLanguage,

        onSuccess: refresh,
      }),
  };
}