import {
  adminApiClient,
} from "@/shared/api/admin-api-client";

import type {
  MediaAsset,
  MediaAssetListResponse,
  ProfileDocument,
  ProfileDocumentCreatePayload,
  ProfileDocumentListResponse,
  ProfileDocumentUpdatePayload,
  ProfileMedia,
  ProfileMediaCreatePayload,
  ProfileMediaListResponse,
  ProfileMediaUpdatePayload,
} from "../types/media.types";


/* =========================
   MEDIA ASSETS
========================= */

export async function getMediaAssets():
  Promise<MediaAsset[]> {
  const response =
    await adminApiClient<
      MediaAssetListResponse
    >(
      "/media",
    );

  if (
    !Array.isArray(
      response.items,
    )
  ) {
    throw new Error(
      "Invalid media response",
    );
  }

  return response.items;
}


export function getMediaAsset(
  mediaAssetId: number,
) {
  return adminApiClient<
    MediaAsset
  >(
    `/media/${mediaAssetId}`,
  );
}


export function uploadMedia(
  file: File,
) {
  const formData =
    new FormData();

  formData.append(
    "file",
    file,
  );

  return adminApiClient<
    MediaAsset
  >(
    "/media/upload",
    {
      method: "POST",
      body: formData,
    },
  );
}


export function deleteMediaAsset(
  mediaAssetId: number,
) {
  return adminApiClient<void>(
    `/media/${mediaAssetId}`,
    {
      method: "DELETE",
    },
  );
}


/* =========================
   PROFILE MEDIA
========================= */

export async function getProfileMedia():
  Promise<ProfileMedia[]> {
  const response =
    await adminApiClient<
      ProfileMediaListResponse
    >(
      "/profile/media",
    );

  if (
    !Array.isArray(
      response.items,
    )
  ) {
    throw new Error(
      "Invalid profile media response",
    );
  }

  return response.items;
}


export function createProfileMedia(
  payload:
    ProfileMediaCreatePayload,
) {
  return adminApiClient<
    ProfileMedia
  >(
    "/profile/media",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateProfileMedia(
  profileMediaId: number,
  payload:
    ProfileMediaUpdatePayload,
) {
  return adminApiClient<
    ProfileMedia
  >(
    `/profile/media/${profileMediaId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteProfileMedia(
  profileMediaId: number,
) {
  return adminApiClient<void>(
    `/profile/media/${profileMediaId}`,
    {
      method: "DELETE",
    },
  );
}


/* =========================
   PROFILE DOCUMENTS
========================= */

export async function getProfileDocuments():
  Promise<ProfileDocument[]> {
  const response =
    await adminApiClient<
      ProfileDocumentListResponse
    >(
      "/profile/documents",
    );

  if (
    !Array.isArray(
      response.items,
    )
  ) {
    throw new Error(
      "Invalid profile documents response",
    );
  }

  return response.items;
}


export function createProfileDocument(
  payload:
    ProfileDocumentCreatePayload,
) {
  return adminApiClient<
    ProfileDocument
  >(
    "/profile/documents",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateProfileDocument(
  documentId: number,
  payload:
    ProfileDocumentUpdatePayload,
) {
  return adminApiClient<
    ProfileDocument
  >(
    `/profile/documents/${documentId}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteProfileDocument(
  documentId: number,
) {
  return adminApiClient<void>(
    `/profile/documents/${documentId}`,
    {
      method: "DELETE",
    },
  );
}