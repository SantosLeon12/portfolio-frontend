"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getOrganizations,
} from "../api/organizations.api";


export const organizationsQueryKey = [
  "organizations",
] as const;


export function useOrganizations() {
  return useQuery({
    queryKey:
      organizationsQueryKey,

    queryFn:
      getOrganizations,
  });
}