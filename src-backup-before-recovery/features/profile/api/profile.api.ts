import {
  apiClient,
} from "@/shared/api/api-client";

import {
  adminApiClient,
} from "@/shared/api/admin-api-client";

import type {
  ContactCreatePayload,
  ContactUpdatePayload,
  InterestCreatePayload,
  InterestUpdatePayload,
  Profile,
  ProfileContact,
  ProfileUpdatePayload,
  SocialLink,
  SocialLinkCreatePayload,
  SocialLinkUpdatePayload,
  Strength,
  StrengthCreatePayload,
  StrengthUpdatePayload,
  Interest,
} from "../types/profile.types";


export function getPublicProfile() {
  return apiClient<Profile>(
    "/public/profile",
    {
      cache: "no-store",
    },
  );
}


export function getAdminProfile() {
  return adminApiClient<Profile>(
    "/profile",
  );
}


export function updateAdminProfile(
  payload: ProfileUpdatePayload,
) {
  return adminApiClient<Profile>(
    "/profile",
    {
      method: "PATCH",
      body: payload,
    },
  );
}


/* CONTACTS */

export function createContact(
  payload: ContactCreatePayload,
) {
  return adminApiClient<ProfileContact>(
    "/profile/contacts",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateContact(
  id: number,
  payload: ContactUpdatePayload,
) {
  return adminApiClient<ProfileContact>(
    `/profile/contacts/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteContact(
  id: number,
) {
  return adminApiClient<void>(
    `/profile/contacts/${id}`,
    {
      method: "DELETE",
    },
  );
}


/* SOCIAL LINKS */

export function createSocialLink(
  payload: SocialLinkCreatePayload,
) {
  return adminApiClient<SocialLink>(
    "/profile/social-links",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateSocialLink(
  id: number,
  payload: SocialLinkUpdatePayload,
) {
  return adminApiClient<SocialLink>(
    `/profile/social-links/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteSocialLink(
  id: number,
) {
  return adminApiClient<void>(
    `/profile/social-links/${id}`,
    {
      method: "DELETE",
    },
  );
}


/* STRENGTHS */

export function createStrength(
  payload: StrengthCreatePayload,
) {
  return adminApiClient<Strength>(
    "/profile/strengths",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateStrength(
  id: number,
  payload: StrengthUpdatePayload,
) {
  return adminApiClient<Strength>(
    `/profile/strengths/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteStrength(
  id: number,
) {
  return adminApiClient<void>(
    `/profile/strengths/${id}`,
    {
      method: "DELETE",
    },
  );
}


/* INTERESTS */

export function createInterest(
  payload: InterestCreatePayload,
) {
  return adminApiClient<Interest>(
    "/profile/interests",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateInterest(
  id: number,
  payload: InterestUpdatePayload,
) {
  return adminApiClient<Interest>(
    `/profile/interests/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteInterest(
  id: number,
) {
  return adminApiClient<void>(
    `/profile/interests/${id}`,
    {
      method: "DELETE",
    },
  );
}