"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getLanguages,
  getProfileLanguages,
  getProficiencyLevels,
} from "../api/languages.api";


export const languagesQueryKey = [
  "languages",
] as const;


export const proficiencyLevelsQueryKey = [
  "proficiency-levels",
] as const;


export const profileLanguagesQueryKey = [
  "admin",
  "profile-languages",
] as const;


export function useLanguages() {
  return useQuery({
    queryKey:
      languagesQueryKey,

    queryFn:
      getLanguages,
  });
}


export function useProficiencyLevels() {
  return useQuery({
    queryKey:
      proficiencyLevelsQueryKey,

    queryFn:
      getProficiencyLevels,
  });
}


export function useProfileLanguages() {
  return useQuery({
    queryKey:
      profileLanguagesQueryKey,

    queryFn:
      getProfileLanguages,
  });
}