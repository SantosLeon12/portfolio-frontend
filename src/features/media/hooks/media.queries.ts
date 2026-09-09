"use client";

import {
  useQuery,
} from "@tanstack/react-query";

import {
  getMediaAssets,
  getProfileDocuments,
  getProfileMedia,
} from "../api/media.api";


export const mediaAssetsQueryKey = [
  "admin",
  "media-assets",
] as const;


export const profileMediaQueryKey = [
  "admin",
  "profile-media",
] as const;


export const profileDocumentsQueryKey = [
  "admin",
  "profile-documents",
] as const;


export function useMediaAssets() {
  return useQuery({
    queryKey:
      mediaAssetsQueryKey,

    queryFn:
      getMediaAssets,
  });
}


export function useProfileMedia() {
  return useQuery({
    queryKey:
      profileMediaQueryKey,

    queryFn:
      getProfileMedia,
  });
}


export function useProfileDocuments() {
  return useQuery({
    queryKey:
      profileDocumentsQueryKey,

    queryFn:
      getProfileDocuments,
  });
}