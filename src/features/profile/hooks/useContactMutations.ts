"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createContact,
  deleteContact,
  updateContact,
} from "../api/profile.api";

import type {
  ContactUpdatePayload,
} from "../types/profile.types";

import {
  adminProfileQueryKey,
} from "./useAdminProfile";


export function useContactMutations() {
  const queryClient =
    useQueryClient();

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey:
        adminProfileQueryKey,
    });


  const createMutation =
    useMutation({
      mutationFn:
        createContact,

      onSuccess: refresh,
    });


  const updateMutation =
    useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: number;
        payload:
          ContactUpdatePayload;
      }) =>
        updateContact(
          id,
          payload,
        ),

      onSuccess: refresh,
    });


  const deleteMutation =
    useMutation({
      mutationFn:
        deleteContact,

      onSuccess: refresh,
    });


  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}