"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createOrganization,
  deleteOrganization,
  updateOrganization,
} from "../api/organizations.api";

import type {
  OrganizationUpdatePayload,
} from "../types/organization.types";

import {
  organizationsQueryKey,
} from "./useOrganizations";


export function useOrganizationMutations() {
  const queryClient =
    useQueryClient();

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey:
        organizationsQueryKey,
    });


  return {
    createMutation:
      useMutation({
        mutationFn:
          createOrganization,

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
            OrganizationUpdatePayload;
        }) =>
          updateOrganization(
            id,
            payload,
          ),

        onSuccess: refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteOrganization,

        onSuccess: refresh,
      }),
  };
}