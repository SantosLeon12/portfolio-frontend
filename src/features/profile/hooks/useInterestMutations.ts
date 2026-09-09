"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createInterest,
  deleteInterest,
  updateInterest,
} from "../api/profile.api";

import type {
  InterestUpdatePayload,
} from "../types/profile.types";

import {
  adminProfileQueryKey,
} from "./useAdminProfile";


export function useInterestMutations() {
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
          createInterest,

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
            InterestUpdatePayload;
        }) =>
          updateInterest(
            id,
            payload,
          ),

        onSuccess: refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteInterest,

        onSuccess: refresh,
      }),
  };
}