export type OrganizationType =
  | "COMPANY"
  | "UNIVERSITY"
  | "SCHOOL"
  | "CLIENT"
  | "OTHER";


export type Organization = {
  id: number;

  name: string;
  slug: string;

  organization_type:
    OrganizationType;

  website_url:
    | string
    | null;

  logo_media_id:
    | number
    | null;

  created_at: string;
  updated_at: string;
};


export type OrganizationListResponse = {
  items: Organization[];
  total: number;
};


export type OrganizationCreatePayload = {
  name: string;
  slug: string;

  organization_type:
    OrganizationType;

  website_url?:
    | string
    | null;

  logo_media_id?:
    | number
    | null;
};


export type OrganizationUpdatePayload =
  Partial<OrganizationCreatePayload>;