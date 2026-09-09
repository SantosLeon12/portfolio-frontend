"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createStrength,
  deleteStrength,
  updateStrength,
} from "../api/profile.api";

import type {
  StrengthUpdatePayload,
} from "../types/profile.types";

import {
  adminProfileQueryKey,
} from "./useAdminProfile";


export function useStrengthMutations() {
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
          createStrength,

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
            StrengthUpdatePayload;
        }) =>
          updateStrength(
            id,
            payload,
          ),

        onSuccess: refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteStrength,

        onSuccess: refresh,
      }),
  };
}