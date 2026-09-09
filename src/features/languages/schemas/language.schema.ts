import {
  z,
} from "zod";


export const languageSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Language name is required",
      ),

    iso_code: z
      .string()
      .trim()
      .min(
        2,
        "ISO code is required",
      )
      .max(
        10,
        "ISO code is too long",
      )
      .regex(
        /^[a-zA-Z-]+$/,
        "Use letters and hyphens only",
      ),
  });


export const proficiencyLevelSchema =
  z.object({
    code: z
      .string()
      .trim()
      .min(
        1,
        "Code is required",
      ),

    name: z
      .string()
      .trim()
      .min(
        1,
        "Level name is required",
      ),

    rank: z
      .number()
      .int()
      .positive(
        "Rank must be greater than zero",
      ),
  });


export const profileLanguageSchema =
  z.object({
    language_id: z
      .number()
      .int()
      .positive(
        "Select a language",
      ),

    proficiency_level_id:
      z
        .number()
        .int()
        .positive(
          "Select a proficiency level",
        ),

    display_order:
      z
        .number()
        .int()
        .min(
          0,
          "Display order cannot be negative",
        ),
  });


export type LanguageFormValues =
  z.infer<
    typeof languageSchema
  >;


export type ProficiencyLevelFormValues =
  z.infer<
    typeof proficiencyLevelSchema
  >;


export type ProfileLanguageFormValues =
  z.infer<
    typeof profileLanguageSchema
  >;