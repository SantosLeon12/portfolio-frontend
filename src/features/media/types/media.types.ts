export type MediaAsset = {
  id: number;

  storage_provider: string;
  storage_key: string;
  url: string;

  mime_type:
    | string
    | null;

  file_size:
    | number
    | null;

  width:
    | number
    | null;

  height:
    | number
    | null;

  created_at: string;
};


export type MediaAssetListResponse = {
  items: MediaAsset[];
  total: number;
};


export type ProfileMediaRole =
  | "AVATAR"
  | "HERO"
  | "ABOUT"
  | "BACKGROUND"
  | "OTHER";


export type ProfileMedia = {
  id: number;

  media_role:
    ProfileMediaRole;

  alt_text:
    | string
    | null;

  display_order: number;

  media_asset:
    MediaAsset;
};


export type ProfileMediaListResponse = {
  items: ProfileMedia[];
  total: number;
};


export type ProfileMediaCreatePayload = {
  media_asset_id: number;

  media_role:
    ProfileMediaRole;

  alt_text?:
    | string
    | null;

  display_order: number;
};


export type ProfileMediaUpdatePayload =
  Partial<{
    media_role:
      ProfileMediaRole;

    alt_text:
      | string
      | null;

    display_order:
      number;
  }>;


export type ProfileDocumentType =
  | "CV"
  | "RESUME"
  | "CERTIFICATE"
  | "OTHER";


export type ProfileDocument = {
  id: number;

  document_type:
    ProfileDocumentType;

  title: string;

  version:
    | string
    | null;

  is_current:
    boolean;

  media_asset:
    MediaAsset;

  created_at: string;
  updated_at: string;
};


export type ProfileDocumentListResponse = {
  items:
    ProfileDocument[];

  total: number;
};


export type ProfileDocumentCreatePayload = {
  media_asset_id:
    number;

  document_type:
    ProfileDocumentType;

  title: string;

  version?:
    | string
    | null;

  is_current: boolean;
};


export type ProfileDocumentUpdatePayload =
  Partial<{
    document_type:
      ProfileDocumentType;

    title: string;

    version:
      | string
      | null;

    is_current:
      boolean;
  }>;