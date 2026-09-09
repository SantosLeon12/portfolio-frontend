"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getEducations,
  getExperience,
  getExperiences,
} from "../api/professional.api";


export const experiencesQueryKey = [
  "experiences",
] as const;


export const educationsQueryKey = [
  "educations",
] as const;


export function experienceQueryKey(
  experienceId: number,
) {
  return [
    "experiences",
    experienceId,
  ] as const;
}


export function useExperiences() {
  return useQuery({
    queryKey:
      experiencesQueryKey,

    queryFn:
      getExperiences,
  });
}


export function useExperience(
  experienceId: number,
) {
  return useQuery({
    queryKey:
      experienceQueryKey(
        experienceId,
      ),

    queryFn: () =>
      getExperience(
        experienceId,
      ),

    enabled:
      experienceId > 0,
  });
}


export function useEducations() {
  return useQuery({
    queryKey:
      educationsQueryKey,

    queryFn:
      getEducations,
  });
}