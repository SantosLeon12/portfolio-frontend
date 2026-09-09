import {
  z,
} from "zod";


export const organizationSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Organization name is required",
      ),

    slug: z
      .string()
      .trim()
      .min(
        1,
        "Slug is required",
      )
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Use lowercase letters, numbers and hyphens only",
      ),

    organization_type:
      z.enum([
        "COMPANY",
        "UNIVERSITY",
        "SCHOOL",
        "CLIENT",
        "OTHER",
      ]),

    website_url:
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
        ),

    logo_media_id:
      z.number()
        .int()
        .positive()
        .nullable(),
  });


export type OrganizationFormValues =
  z.infer<
    typeof organizationSchema
  >;