import {
  apiClient,
} from "@/shared/api/api-client";

import {
  adminApiClient,
} from "@/shared/api/admin-api-client";

import type {
  Organization,
  OrganizationCreatePayload,
  OrganizationUpdatePayload,
  OrganizationListResponse,
} from "../types/organization.types";


export async function getOrganizations():
  Promise<Organization[]> {
  const response =
    await apiClient<
      OrganizationListResponse
    >(
      "/public/organizations",
      {
        cache: "no-store",
      },
    );

  return response.items;
}


export function createOrganization(
  payload:
    OrganizationCreatePayload,
) {
  return adminApiClient<
    Organization
  >(
    "/organizations",
    {
      method: "POST",
      body: payload,
    },
  );
}


export function updateOrganization(
  id: number,
  payload:
    OrganizationUpdatePayload,
) {
  return adminApiClient<
    Organization
  >(
    `/organizations/${id}`,
    {
      method: "PATCH",
      body: payload,
    },
  );
}


export function deleteOrganization(
  id: number,
) {
  return adminApiClient<void>(
    `/organizations/${id}`,
    {
      method: "DELETE",
    },
  );
}