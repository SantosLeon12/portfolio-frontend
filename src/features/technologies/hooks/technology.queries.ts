"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getProfileTechnologies,
  getTechnologies,
  getTechnologyCategories,
} from "../api/technologies.api";


export const technologyCategoriesQueryKey = [
  "technology-categories",
] as const;


export const technologiesQueryKey = [
  "technologies",
] as const;


export const profileTechnologiesQueryKey = [
  "admin",
  "profile-technologies",
] as const;


export function useTechnologyCategories() {
  return useQuery({
    queryKey:
      technologyCategoriesQueryKey,

    queryFn:
      getTechnologyCategories,
  });
}


export function useTechnologies() {
  return useQuery({
    queryKey:
      technologiesQueryKey,

    queryFn:
      getTechnologies,
  });
}


export function useProfileTechnologies() {
  return useQuery({
    queryKey:
      profileTechnologiesQueryKey,

    queryFn:
      getProfileTechnologies,
  });
}