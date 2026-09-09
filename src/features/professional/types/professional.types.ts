import type {
  Organization,
} from "@/features/organizations/types/organization.types";

import type {
  Technology,
} from "@/features/technologies/types/technology.types";


export type ExperienceHighlight = {
  id: number;

  experience_id?: number;

  content: string;

  display_order: number;
  is_visible: boolean;
};


export type ExperienceTechnology = {
  display_order: number;

  technology: Technology;
};


export type Experience = {
  id: number;

  profile_id?: number;

  organization_id: number;

  role_title: string;

  employment_type:
    | string
    | null;

  location:
    | string
    | null;

  start_date: string;

  end_date:
    | string
    | null;

  summary:
    | string
    | null;

  display_order: number;

  is_visible: boolean;

  organization?:
    | Organization
    | null;

  highlights?:
    ExperienceHighlight[];

  technologies?:
    ExperienceTechnology[];

  created_at?: string;
  updated_at?: string;
};


export type Education = {
  id: number;

  profile_id?: number;

  organization_id: number;

  degree: string;

  field_of_study: string;

  location:
    | string
    | null;

  start_date: string;

  end_date:
    | string
    | null;

  description:
    | string
    | null;

  display_order: number;

  is_visible: boolean;

  organization?:
    | Organization
    | null;

  created_at?: string;
  updated_at?: string;
};


/* =========================
   EXPERIENCE PAYLOADS
========================= */

export type ExperienceCreatePayload = {
  organization_id: number;

  role_title: string;

  employment_type?:
    | string
    | null;

  location?:
    | string
    | null;

  start_date: string;

  end_date?:
    | string
    | null;

  summary?:
    | string
    | null;

  display_order: number;

  is_visible: boolean;
};


export type ExperienceUpdatePayload =
  Partial<
    ExperienceCreatePayload
  >;


/* =========================
   EDUCATION PAYLOADS
========================= */

export type EducationCreatePayload = {
  organization_id: number;

  degree: string;

  field_of_study: string;

  location?:
    | string
    | null;

  start_date: string;

  end_date?:
    | string
    | null;

  description?:
    | string
    | null;

  display_order: number;

  is_visible: boolean;
};


export type EducationUpdatePayload =
  Partial<
    EducationCreatePayload
  >;


/* =========================
   HIGHLIGHTS
========================= */

export type ExperienceHighlightCreatePayload = {
  content: string;

  display_order: number;

  is_visible: boolean;
};


export type ExperienceHighlightUpdatePayload =
  Partial<
    ExperienceHighlightCreatePayload
  >;


/* =========================
   EXPERIENCE TECHNOLOGIES
========================= */

export type ExperienceTechnologyCreatePayload = {
  technology_id: number;

  display_order: number;
};


export type ExperienceTechnologyUpdatePayload = {
  display_order?: number;
};