"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createProfileDocument,
  createProfileMedia,
  deleteMediaAsset,
  deleteProfileDocument,
  deleteProfileMedia,
  updateProfileDocument,
  updateProfileMedia,
  uploadMedia,
} from "../api/media.api";

import type {
  ProfileDocumentUpdatePayload,
  ProfileMediaUpdatePayload,
} from "../types/media.types";

import {
  mediaAssetsQueryKey,
  profileDocumentsQueryKey,
  profileMediaQueryKey,
} from "./media.queries";


export function useMediaMutations() {
  const queryClient =
    useQueryClient();

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey:
        mediaAssetsQueryKey,
    });


  return {
    uploadMutation:
      useMutation({
        mutationFn:
          uploadMedia,

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteMediaAsset,

        onSuccess:
          refresh,
      }),
  };
}


export function useProfileMediaMutations() {
  const queryClient =
    useQueryClient();

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey:
        profileMediaQueryKey,
    });


  return {
    createMutation:
      useMutation({
        mutationFn:
          createProfileMedia,

        onSuccess:
          refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          id,
          payload,
        }: {
          id: number;

          payload:
            ProfileMediaUpdatePayload;
        }) =>
          updateProfileMedia(
            id,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteProfileMedia,

        onSuccess:
          refresh,
      }),
  };
}


export function useProfileDocumentMutations() {
  const queryClient =
    useQueryClient();

  const refresh = () =>
    queryClient.invalidateQueries({
      queryKey:
        profileDocumentsQueryKey,
    });


  return {
    createMutation:
      useMutation({
        mutationFn:
          createProfileDocument,

        onSuccess:
          refresh,
      }),

    updateMutation:
      useMutation({
        mutationFn: ({
          id,
          payload,
        }: {
          id: number;

          payload:
            ProfileDocumentUpdatePayload;
        }) =>
          updateProfileDocument(
            id,
            payload,
          ),

        onSuccess:
          refresh,
      }),

    deleteMutation:
      useMutation({
        mutationFn:
          deleteProfileDocument,

        onSuccess:
          refresh,
      }),
  };
}