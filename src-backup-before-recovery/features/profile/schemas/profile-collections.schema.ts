import {
  z,
} from "zod";


export const contactSchema =
  z.object({
    contact_type: z.enum([
      "EMAIL",
      "PHONE",
      "WHATSAPP",
      "OTHER",
    ]),

    label: z.string(),

    value: z
      .string()
      .trim()
      .min(
        1,
        "Contact value is required",
      ),

    is_primary: z.boolean(),

    display_order:
      z.number()
        .int()
        .min(0),

    is_visible:
      z.boolean(),
  });


export const socialLinkSchema =
  z.object({
    platform: z
      .string()
      .trim()
      .min(
        1,
        "Platform is required",
      ),

    label: z.string(),

    url: z
      .string()
      .trim()
      .url(
        "Enter a valid URL",
      ),

    display_order:
      z.number()
        .int()
        .min(0),

    is_visible:
      z.boolean(),
  });


export const strengthSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(
        1,
        "Title is required",
      ),

    description:
      z.string(),

    display_order:
      z.number()
        .int()
        .min(0),

    is_visible:
      z.boolean(),
  });


export const interestSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        "Name is required",
      ),

    description:
      z.string(),

    display_order:
      z.number()
        .int()
        .min(0),

    is_visible:
      z.boolean(),
  });


export type ContactFormValues =
  z.infer<
    typeof contactSchema
  >;

export type SocialLinkFormValues =
  z.infer<
    typeof socialLinkSchema
  >;

export type StrengthFormValues =
  z.infer<
    typeof strengthSchema
  >;

export type InterestFormValues =
  z.infer<
    typeof interestSchema
  >;