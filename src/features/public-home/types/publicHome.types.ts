/* =========================================================
   PROFILE
   ========================================================= */

export type PublicProfileContact = {
  id: number;
  contact_type: string;
  label: string | null;
  value: string;
  is_primary: boolean;
  display_order: number;
  is_visible: boolean;
};

export type PublicSocialLink = {
  id: number;
  platform: string;
  label: string | null;
  url: string;
  display_order: number;
  is_visible: boolean;
};

export type PublicStrength = {
  id: number;
  title: string;
  description: string | null;
  display_order: number;
  is_visible: boolean;
};

export type PublicInterest = {
  id: number;
  name: string;
  description: string | null;
  display_order: number;
  is_visible: boolean;
};

export type PublicProfile = {
  id: number;

  full_name: string;
  professional_title: string;

  headline: string | null;
  short_bio: string | null;
  about: string | null;
  mission: string | null;

  location: string | null;
  availability_text: string | null;

  contacts: PublicProfileContact[];
  social_links: PublicSocialLink[];
  strengths: PublicStrength[];
  interests: PublicInterest[];

  created_at: string;
  updated_at: string;
};


/* =========================================================
   MEDIA
   ========================================================= */

export type PublicMediaAsset = {
  id: number;

  url: string;

  mime_type: string | null;

  width: number | null;
  height: number | null;
};

export type PublicProfileMedia = {
  id: number;

  media_role: string;

  alt_text: string | null;

  display_order: number;

  media_asset: PublicMediaAsset;
};

export type PublicProfileDocument = {
  id: number;

  document_type: string;

  title: string;

  version: string | null;

  media_asset: PublicMediaAsset;
};

export type PublicProjectMedia = {
  id: number;

  media_role: string;

  alt_text: string | null;

  caption: string | null;

  display_order: number;

  media_asset: PublicMediaAsset;
};


/* =========================================================
   TECHNOLOGIES
   ========================================================= */

export type PublicTechnologyCategory = {
  id: number;

  name: string;

  slug: string;

  display_order: number;
};

export type PublicTechnology = {
  id: number;

  name: string;

  slug: string;

  official_url: string | null;

  technology_category_id: number;

  icon_media_id: number | null;

  category: PublicTechnologyCategory;
};

export type PublicProfileTechnology = {
  featured: boolean;

  display_order: number;

  is_visible: boolean;

  technology: PublicTechnology;
};

export type PublicProfileTechnologyList = {
  items: PublicProfileTechnology[];

  total: number;
};


/* =========================================================
   ORGANIZATIONS
   ========================================================= */

export type PublicOrganization = {
  id: number;

  name: string;

  slug: string;

  organization_type: string;

  website_url: string | null;

  logo_media_id: number | null;

  created_at: string;
  updated_at: string;
};


/* =========================================================
   PROJECTS
   ========================================================= */

export type PublicProjectCategory = {
  id: number;

  name: string;

  slug: string;

  display_order: number;

  created_at: string;
  updated_at: string;
};

export type PublicProjectCategoryRelation = {
  category: PublicProjectCategory;
};

export type PublicProjectTechnology = {
  display_order: number;

  technology: PublicTechnology;
};

export type PublicProjectLink = {
  id: number;

  link_type: string;

  label: string | null;

  url: string;

  display_order: number;

  is_visible: boolean;
};

export type PublicProjectSectionItem = {
  id: number;

  content: string;

  display_order: number;

  is_visible: boolean;
};

export type PublicProjectSection = {
  id: number;

  section_type: string;

  title: string | null;

  body: string | null;

  display_order: number;

  is_visible: boolean;

  items: PublicProjectSectionItem[];
};

export type PublicProject = {
  id: number;

  organization_id: number | null;

  organization:
    PublicOrganization | null;

  title: string;

  slug: string;

  short_description: string | null;

  overview: string | null;

  role_summary: string | null;

  start_date: string | null;

  end_date: string | null;

  status: string;

  featured: boolean;

  display_order: number;

  published_at: string | null;

  categories:
    PublicProjectCategoryRelation[];

  technologies:
    PublicProjectTechnology[];

  links:
    PublicProjectLink[];

  sections:
    PublicProjectSection[];

  created_at: string;

  updated_at: string;
};

export type PublicProjectList = {
  items: PublicProject[];

  total: number;
};

export type PublicProjectWithMedia = {
  project: PublicProject;

  media: PublicProjectMedia[];
};


/* =========================================================
   EXPERIENCE
   ========================================================= */

export type PublicExperienceHighlight = {
  id: number;

  content: string;

  display_order: number;

  is_visible: boolean;
};

export type PublicExperienceTechnology = {
  display_order: number;

  technology: PublicTechnology;
};

export type PublicExperience = {
  id: number;

  organization_id: number;

  organization:
    PublicOrganization;

  role_title: string;

  employment_type: string | null;

  location: string | null;

  start_date: string;

  end_date: string | null;

  summary: string | null;

  display_order: number;

  is_visible: boolean;

  highlights:
    PublicExperienceHighlight[];

  technologies:
    PublicExperienceTechnology[];

  created_at: string;

  updated_at: string;
};

export type PublicExperienceList = {
  items: PublicExperience[];

  total: number;
};


/* =========================================================
   EDUCATION
   ========================================================= */

export type PublicEducation = {
  id: number;

  organization_id: number;

  organization:
    PublicOrganization;

  degree: string;

  field_of_study: string | null;

  location: string | null;

  start_date: string;

  end_date: string | null;

  description: string | null;

  display_order: number;

  is_visible: boolean;

  created_at: string;

  updated_at: string;
};

export type PublicEducationList = {
  items: PublicEducation[];

  total: number;
};


/* =========================================================
   LANGUAGES
   ========================================================= */

export type PublicLanguage = {
  id: number;

  name: string;

  iso_code: string;
};

export type PublicProficiencyLevel = {
  id: number;

  code: string;

  name: string;

  rank: number;
};

export type PublicProfileLanguage = {
  display_order: number;

  language:
    PublicLanguage;

  proficiency_level:
    PublicProficiencyLevel;
};

export type PublicProfileLanguageList = {
  items:
    PublicProfileLanguage[];

  total: number;
};


/* =========================================================
   CONTACT
   ========================================================= */

export type PublicContactMessageCreate = {
  name: string;

  email: string;

  subject: string;

  message: string;
};

export type PublicContactMessageResponse = {
  id: number;

  name: string;

  email: string;

  subject: string;

  message: string;

  status: string;

  created_at: string;

  read_at: string | null;
};


/* =========================================================
   PUBLIC HOME
   ========================================================= */

export type PublicHomeData = {
  profile: PublicProfile;

  profileMedia:
    PublicProfileMedia[];

  documents:
    PublicProfileDocument[];

  technologies:
    PublicProfileTechnology[];

  projects:
    PublicProjectWithMedia[];

  experiences:
    PublicExperience[];

  educations:
    PublicEducation[];

  languages:
    PublicProfileLanguage[];
};