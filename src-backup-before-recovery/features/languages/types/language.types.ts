export type Language = {
  id: number;

  name: string;
  iso_code: string;
};


export type ProficiencyLevel = {
  id: number;

  code: string;
  name: string;

  rank: number;
};


export type ProfileLanguage = {
  display_order: number;

  language: Language;

  proficiency_level:
    ProficiencyLevel;
};


export type LanguageCreatePayload = {
  name: string;
  iso_code: string;
};


export type LanguageUpdatePayload =
  Partial<LanguageCreatePayload>;


export type ProficiencyLevelCreatePayload = {
  code: string;
  name: string;
  rank: number;
};


export type ProficiencyLevelUpdatePayload =
  Partial<
    ProficiencyLevelCreatePayload
  >;


export type ProfileLanguageCreatePayload = {
  language_id: number;

  proficiency_level_id:
    number;

  display_order: number;
};


export type ProfileLanguageUpdatePayload = {
  proficiency_level_id?:
    number;

  display_order?:
    number;
};