"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createSocialLink,
  deleteSocialLink,
  updateSocialLink,
} from "../api/profile.api";

import type {
  SocialLinkUpdatePayload,
} from "../types/profile.types";

import {
  adminProfileQueryKey,
} from "./useAdminProfile";


export function useSocialLinkMutations() {
  const queryClient =
    useQueryClient();

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey:
        adminProfileQueryKey,
    });


  return {
    createMutation:
      useMutation({
        mutationFn:
          createSocialLink,

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
            SocialLinkUpdatePayload;
        }) =>
          updateSocialLink(
            id,
            payload,
          ),

        onSuccess: refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteSocialLink,

        onSuccess: refresh,
      }),
  };
}