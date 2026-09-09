export type TechnologyCategory = {
  id: number;

  name: string;
  slug: string;

  display_order: number;

  created_at?: string;
  updated_at?: string;
};


export type Technology = {
  id: number;

  technology_category_id: number;

  name: string;
  slug: string;

  official_url:
    | string
    | null;

  icon_media_id:
    | number
    | null;

  category?:
    | TechnologyCategory
    | null;

  created_at?: string;
  updated_at?: string;
};


export type ProfileTechnology = {
  profile_id: number;
  technology_id: number;

  featured: boolean;
  display_order: number;
  is_visible: boolean;

  technology: Technology;
};


export type TechnologyCategoryCreatePayload = {
  name: string;
  slug: string;
  display_order: number;
};


export type TechnologyCategoryUpdatePayload =
  Partial<
    TechnologyCategoryCreatePayload
  >;


export type TechnologyCreatePayload = {
  technology_category_id: number;

  name: string;
  slug: string;

  official_url?:
    | string
    | null;

  icon_media_id?:
    | number
    | null;
};


export type TechnologyUpdatePayload =
  Partial<
    TechnologyCreatePayload
  >;


export type ProfileTechnologyCreatePayload = {
  technology_id: number;

  featured: boolean;
  display_order: number;
  is_visible: boolean;
};


export type ProfileTechnologyUpdatePayload = {
  featured?: boolean;
  display_order?: number;
  is_visible?: boolean;
};