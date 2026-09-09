import {
  z,
} from "zod";


export const projectSchema =
  z
    .object({
      organization_id:
        z
          .number()
          .int()
          .min(0),

      title:
        z
          .string()
          .trim()
          .min(
            1,
            "Project title is required",
          )
          .max(180),

      slug:
        z
          .string()
          .trim()
          .min(
            1,
            "Slug is required",
          )
          .max(180),

      short_description:
        z.string(),

      overview:
        z.string(),

      role_summary:
        z.string(),

      start_date:
        z.string(),

      end_date:
        z.string(),

      status:
        z.enum([
          "DRAFT",
          "PUBLISHED",
          "ARCHIVED",
        ]),

      featured:
        z.boolean(),

      display_order:
        z
          .number()
          .int()
          .min(0),
    })
    .superRefine(
      (
        values,
        ctx,
      ) => {
        if (
          values.start_date &&
          values.end_date &&
          values.end_date <
            values.start_date
        ) {
          ctx.addIssue({
            code:
              "custom",

            path: [
              "end_date",
            ],

            message:
              "End date cannot be earlier than start date",
          });
        }
      },
    );


export const projectCategorySchema =
  z.object({
    name:
      z
        .string()
        .trim()
        .min(
          1,
          "Category name is required",
        )
        .max(120),

    slug:
      z
        .string()
        .trim()
        .min(
          1,
          "Slug is required",
        )
        .max(120),

    display_order:
      z
        .number()
        .int()
        .min(0),
  });


export const projectCategoryAssignmentSchema =
  z.object({
    category_id:
      z
        .number()
        .int()
        .positive(
          "Select a category",
        ),
  });


export const projectTechnologySchema =
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


export const projectLinkSchema =
  z.object({
    link_type:
      z.enum([
        "REPOSITORY",
        "LIVE_DEMO",
        "DOCUMENTATION",
        "CASE_STUDY",
        "OTHER",
      ]),

    label:
      z.string(),

    url:
      z
        .string()
        .trim()
        .min(
          1,
          "URL is required",
        )
        .url(
          "Enter a valid URL",
        ),

    display_order:
      z
        .number()
        .int()
        .min(0),

    is_visible:
      z.boolean(),
  });


export const projectMediaSchema =
  z.object({
    media_asset_id:
      z
        .number()
        .int()
        .positive(
          "Select an image",
        ),

    media_role:
      z.enum([
        "COVER",
        "SCREENSHOT",
        "GALLERY",
        "DIAGRAM",
        "LOGO",
        "OTHER",
      ]),

    alt_text:
      z.string(),

    caption:
      z.string(),

    display_order:
      z
        .number()
        .int()
        .min(0),

    is_visible:
      z.boolean(),
  });


export const projectSectionSchema =
  z.object({
    section_type:
      z.enum([
        "OVERVIEW",
        "PROBLEM",
        "RESPONSIBILITIES",
        "SOLUTION",
        "ARCHITECTURE",
        "CHALLENGES",
        "RESULTS",
        "LEARNINGS",
        "CUSTOM",
      ]),

    title:
      z.string(),

    body:
      z.string(),

    display_order:
      z
        .number()
        .int()
        .min(0),

    is_visible:
      z.boolean(),
  });


export const projectSectionItemSchema =
  z.object({
    content:
      z
        .string()
        .trim()
        .min(
          1,
          "Content is required",
        ),

    display_order:
      z
        .number()
        .int()
        .min(0),

    is_visible:
      z.boolean(),
  });


export type ProjectFormValues =
  z.infer<
    typeof projectSchema
  >;

export type ProjectCategoryFormValues =
  z.infer<
    typeof projectCategorySchema
  >;

export type ProjectCategoryAssignmentFormValues =
  z.infer<
    typeof projectCategoryAssignmentSchema
  >;

export type ProjectTechnologyFormValues =
  z.infer<
    typeof projectTechnologySchema
  >;

export type ProjectLinkFormValues =
  z.infer<
    typeof projectLinkSchema
  >;

export type ProjectMediaFormValues =
  z.infer<
    typeof projectMediaSchema
  >;

export type ProjectSectionFormValues =
  z.infer<
    typeof projectSectionSchema
  >;

export type ProjectSectionItemFormValues =
  z.infer<
    typeof projectSectionItemSchema
  >;