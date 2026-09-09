export type ContactType =
  | "EMAIL"
  | "PHONE"
  | "WHATSAPP"
  | "OTHER";


export type ProfileContact = {
  id: number;

  contact_type: ContactType;

  label: string | null;
  value: string;

  is_primary: boolean;
  display_order: number;
  is_visible: boolean;
};


export type SocialLink = {
  id: number;

  platform: string;

  label: string | null;
  url: string;

  display_order: number;
  is_visible: boolean;
};


export type Strength = {
  id: number;

  title: string;
  description: string | null;

  display_order: number;
  is_visible: boolean;
};


export type Interest = {
  id: number;

  name: string;
  description: string | null;

  display_order: number;
  is_visible: boolean;
};


export type Profile = {
  id: number;

  full_name: string;
  professional_title: string;

  headline: string | null;
  short_bio: string | null;

  about: string | null;
  mission: string | null;

  location: string | null;

  availability_text:
    | string
    | null;

  contacts: ProfileContact[];

  social_links: SocialLink[];

  strengths: Strength[];

  interests: Interest[];

  created_at: string;
  updated_at: string;
};


export type ProfileUpdatePayload = {
  full_name?: string;

  professional_title?: string;

  headline?: string | null;
  short_bio?: string | null;

  about?: string | null;
  mission?: string | null;

  location?: string | null;

  availability_text?:
    | string
    | null;
};


export type ContactCreatePayload = {
  contact_type: ContactType;

  label?: string | null;
  value: string;

  is_primary: boolean;
  display_order: number;
  is_visible: boolean;
};


export type ContactUpdatePayload =
  Partial<ContactCreatePayload>;


export type SocialLinkCreatePayload = {
  platform: string;

  label?: string | null;
  url: string;

  display_order: number;
  is_visible: boolean;
};


export type SocialLinkUpdatePayload =
  Partial<SocialLinkCreatePayload>;


export type StrengthCreatePayload = {
  title: string;

  description?: string | null;

  display_order: number;
  is_visible: boolean;
};


export type StrengthUpdatePayload =
  Partial<StrengthCreatePayload>;


export type InterestCreatePayload = {
  name: string;

  description?: string | null;

  display_order: number;
  is_visible: boolean;
};


export type InterestUpdatePayload =
  Partial<InterestCreatePayload>;