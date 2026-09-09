"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateAdminProfile,
} from "../api/profile.api";

import {
  adminProfileQueryKey,
} from "./useAdminProfile";


export function useUpdateProfile() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      updateAdminProfile,

    onSuccess: (profile) => {
      queryClient.setQueryData(
        adminProfileQueryKey,
        profile,
      );
    },
  });
}