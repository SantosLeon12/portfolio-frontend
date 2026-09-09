import {
  z,
} from "zod";


const slugSchema = z
  .string()
  .trim()
  .min(
    1,
    "Slug is required",
  )
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Use lowercase letters, numbers and hyphens only",
  );


const optionalUrlSchema =
  z
    .string()
    .refine(
      (value) =>
        !value ||
        z.string()
          .url()
          .safeParse(value)
          .success,
      "Enter a valid URL",
    );


export const technologyCategorySchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Category name is required",
      ),

    slug: slugSchema,

    display_order:
      z
        .number()
        .int()
        .min(
          0,
          "Display order cannot be negative",
        ),
  });


export const technologySchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Technology name is required",
      ),

    slug: slugSchema,

    technology_category_id:
    z
      .number()
      .int()
      .positive(
        "Select a category",
      ),

    official_url:
      optionalUrlSchema,
  });


export const profileTechnologySchema =
  z.object({
    technology_id:
      z
        .number()
        .int()
        .positive(
          "Select a technology",
        ),

    featured:
      z.boolean(),

    display_order:
      z
        .number()
        .int()
        .min(0),

    is_visible:
      z.boolean(),
  });


export type TechnologyCategoryFormValues =
  z.infer<
    typeof technologyCategorySchema
  >;


export type TechnologyFormValues =
  z.infer<
    typeof technologySchema
  >;


export type ProfileTechnologyFormValues =
  z.infer<
    typeof profileTechnologySchema
  >;