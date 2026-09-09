import {
  z,
} from "zod";


const optionalText =
  z.string();


const dateRangeSchema =
  z
    .object({
      start_date: z
        .string()
        .min(
          1,
          "Start date is required",
        ),

      end_date: z.string(),
    })
    .refine(
      (values) => {
        if (
          !values.end_date
        ) {
          return true;
        }

        return (
          values.end_date >=
          values.start_date
        );
      },
      {
        message:
          "End date cannot be before start date",

        path: [
          "end_date",
        ],
      },
    );


export const experienceSchema =
  z
    .object({
      organization_id:
        z
          .number()
          .int()
          .positive(
            "Select an organization",
          ),

      role_title:
        z
          .string()
          .trim()
          .min(
            1,
            "Role title is required",
          ),

      employment_type:
        optionalText,

      location:
        optionalText,

      start_date:
        z.string(),

      end_date:
        z.string(),

      summary:
        optionalText,

      display_order:
        z
          .number()
          .int()
          .min(0),

      is_visible:
        z.boolean(),
    })
    .and(dateRangeSchema);


export const educationSchema =
  z
    .object({
      organization_id:
        z
          .number()
          .int()
          .positive(
            "Select an organization",
          ),

      degree:
        z
          .string()
          .trim()
          .min(
            1,
            "Degree is required",
          ),

      field_of_study:
        z
          .string()
          .trim()
          .min(
            1,
            "Field of study is required",
          ),

      location:
        optionalText,

      start_date:
        z.string(),

      end_date:
        z.string(),

      description:
        optionalText,

      display_order:
        z
          .number()
          .int()
          .min(0),

      is_visible:
        z.boolean(),
    })
    .and(dateRangeSchema);


export const experienceHighlightSchema =
  z.object({
    content:
      z
        .string()
        .trim()
        .min(
          1,
          "Highlight content is required",
        ),

    display_order:
      z
        .number()
        .int()
        .min(0),

    is_visible:
      z.boolean(),
  });


export const experienceTechnologySchema =
  z.object({
    technology_id:
      z
        .number()
        .int()
        .positive(
          "Select a technology",
        ),

    display_order:
      z
        .number()
        .int()
        .min(0),
  });


export type ExperienceFormValues =
  z.infer<
    typeof experienceSchema
  >;


export type EducationFormValues =
  z.infer<
    typeof educationSchema
  >;


export type ExperienceHighlightFormValues =
  z.infer<
    typeof experienceHighlightSchema
  >;


export type ExperienceTechnologyFormValues =
  z.infer<
    typeof experienceTechnologySchema
  >;