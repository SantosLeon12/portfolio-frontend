import {
  z,
} from "zod";


export const profileMediaSchema =
  z.object({
    media_asset_id:
      z
        .number()
        .int()
        .positive(
          "Select a media asset",
        ),

    media_role:
      z.enum([
        "AVATAR",
        "HERO",
        "ABOUT",
        "BACKGROUND",
        "OTHER",
      ]),

    alt_text:
      z
        .string()
        .max(
          255,
          "Maximum 255 characters",
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


export const profileDocumentSchema =
  z.object({
    media_asset_id:
      z
        .number()
        .int()
        .positive(
          "Select a media asset",
        ),

    document_type:
      z.enum([
        "CV",
        "RESUME",
        "CERTIFICATE",
        "OTHER",
      ]),

    title:
      z
        .string()
        .trim()
        .min(
          1,
          "Title is required",
        )
        .max(
          180,
          "Maximum 180 characters",
        ),

    version:
      z
        .string()
        .max(
          50,
          "Maximum 50 characters",
        ),

    is_current:
      z.boolean(),
  });


export type ProfileMediaFormValues =
  z.infer<
    typeof profileMediaSchema
  >;


export type ProfileDocumentFormValues =
  z.infer<
    typeof profileDocumentSchema
  >;