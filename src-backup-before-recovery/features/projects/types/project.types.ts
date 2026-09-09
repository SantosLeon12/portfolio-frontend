import type {
  Organization,
} from "@/features/organizations/types/organization.types";

import type {
  Technology,
} from "@/features/technologies/types/technology.types";

import type {
  MediaAsset,
} from "@/features/media/types/media.types";


export type ProjectStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED";


export type ProjectLinkType =
  | "REPOSITORY"
  | "LIVE_DEMO"
  | "DOCUMENTATION"
  | "CASE_STUDY"
  | "OTHER";


export type ProjectMediaRole =
  | "COVER"
  | "SCREENSHOT"
  | "GALLERY"
  | "DIAGRAM"
  | "LOGO"
  | "OTHER";


export type ProjectSectionType =
  | "OVERVIEW"
  | "PROBLEM"
  | "RESPONSIBILITIES"
  | "SOLUTION"
  | "ARCHITECTURE"
  | "CHALLENGES"
  | "RESULTS"
  | "LEARNINGS"
  | "CUSTOM";


export type ProjectCategory = {
  id: number;

  name: string;
  slug: string;

  display_order: number;

  created_at: string;
  updated_at: string;
};


export type ProjectCategoryRelation = {
  category:
    ProjectCategory;
};


export type ProjectTechnology = {
  display_order: number;

  technology:
    Technology;
};


export type ProjectLink = {
  id: number;

  link_type:
    ProjectLinkType;

  label:
    | string
    | null;

  url: string;

  display_order: number;

  is_visible: boolean;
};


export type ProjectMedia = {
  id: number;

  media_role:
    ProjectMediaRole;

  alt_text:
    | string
    | null;

  caption:
    | string
    | null;

  display_order: number;

  is_visible: boolean;

  media_asset:
    MediaAsset;
};


export type ProjectSectionItem = {
  id: number;

  content: string;

  display_order: number;

  is_visible: boolean;
};


export type ProjectSection = {
  id: number;

  section_type:
    ProjectSectionType;

  title:
    | string
    | null;

  body:
    | string
    | null;

  display_order: number;

  is_visible: boolean;

  items:
    ProjectSectionItem[];
};


export type Project = {
  id: number;

  organization_id:
    | number
    | null;

  organization:
    | Organization
    | null;

  title: string;
  slug: string;

  short_description:
    | string
    | null;

  overview:
    | string
    | null;

  role_summary:
    | string
    | null;

  start_date:
    | string
    | null;

  end_date:
    | string
    | null;

  status:
    ProjectStatus;

  featured: boolean;

  display_order: number;

  published_at:
    | string
    | null;

  categories:
    ProjectCategoryRelation[];

  technologies:
    ProjectTechnology[];

  links:
    ProjectLink[];

  media:
    ProjectMedia[];

  sections:
    ProjectSection[];

  created_at: string;
  updated_at: string;
};


export type ProjectListResponse = {
  items: Project[];
  total: number;
};


/* PROJECT */

export type ProjectCreatePayload = {
  organization_id:
    | number
    | null;

  title: string;
  slug: string;

  short_description?:
    | string
    | null;

  overview?:
    | string
    | null;

  role_summary?:
    | string
    | null;

  start_date?:
    | string
    | null;

  end_date?:
    | string
    | null;

  status:
    ProjectStatus;

  featured: boolean;

  display_order: number;
};


export type ProjectUpdatePayload =
  Partial<
    ProjectCreatePayload
  >;


/* CATEGORY */

export type ProjectCategoryCreatePayload = {
  name: string;
  slug: string;
  display_order: number;
};


export type ProjectCategoryUpdatePayload =
  Partial<
    ProjectCategoryCreatePayload
  >;


/* TECHNOLOGY */

export type ProjectTechnologyCreatePayload = {
  technology_id: number;
  display_order: number;
};


export type ProjectTechnologyUpdatePayload = {
  display_order: number;
};


/* LINKS */

export type ProjectLinkCreatePayload = {
  link_type:
    ProjectLinkType;

  label?:
    | string
    | null;

  url: string;

  display_order: number;

  is_visible: boolean;
};


export type ProjectLinkUpdatePayload =
  Partial<
    ProjectLinkCreatePayload
  >;


/* MEDIA */

export type ProjectMediaCreatePayload = {
  media_asset_id:
    number;

  media_role:
    ProjectMediaRole;

  alt_text?:
    | string
    | null;

  caption?:
    | string
    | null;

  display_order: number;

  is_visible: boolean;
};


export type ProjectMediaUpdatePayload =
  Partial<{
    media_role:
      ProjectMediaRole;

    alt_text:
      | string
      | null;

    caption:
      | string
      | null;

    display_order:
      number;

    is_visible:
      boolean;
  }>;


/* SECTIONS */

export type ProjectSectionCreatePayload = {
  section_type:
    ProjectSectionType;

  title?:
    | string
    | null;

  body?:
    | string
    | null;

  display_order: number;

  is_visible: boolean;
};


export type ProjectSectionUpdatePayload =
  Partial<
    ProjectSectionCreatePayload
  >;


/* SECTION ITEMS */

export type ProjectSectionItemCreatePayload = {
  content: string;

  display_order: number;

  is_visible: boolean;
};


export type ProjectSectionItemUpdatePayload =
  Partial<
    ProjectSectionItemCreatePayload
  >;