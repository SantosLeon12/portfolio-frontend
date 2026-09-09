"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getAdminProfile,
} from "../api/profile.api";


export const adminProfileQueryKey = [
  "admin",
  "profile",
] as const;


export function useAdminProfile() {
  return useQuery({
    queryKey:
      adminProfileQueryKey,

    queryFn:
      getAdminProfile,
  });
}