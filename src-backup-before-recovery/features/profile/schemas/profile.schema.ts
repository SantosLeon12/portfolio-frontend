import {
  z,
} from "zod";


export const profileFormSchema =
  z.object({
    full_name: z
      .string()
      .trim()
      .min(
        1,
        "Full name is required",
      ),

    professional_title: z
      .string()
      .trim()
      .min(
        1,
        "Professional title is required",
      ),

    headline: z.string(),

    location: z.string(),

    availability_text:
      z.string(),

    short_bio: z.string(),

    about: z.string(),

    mission: z.string(),
  });


export type ProfileFormValues =
  z.infer<
    typeof profileFormSchema
  >;