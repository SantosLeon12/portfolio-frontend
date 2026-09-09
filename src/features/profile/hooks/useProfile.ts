"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getPublicProfile,
} from "../api/profile.api";


export const profileQueryKey = [
  "profile",
] as const;


export function useProfile() {
  return useQuery({
    queryKey: profileQueryKey,

    queryFn:
      getPublicProfile,
  });
}