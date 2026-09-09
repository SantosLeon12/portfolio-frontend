"use client";

import {
  zodResolver,
} from "@hookform/resolvers/zod";
import {
  Save,
} from "lucide-react";
import {
  useEffect,
} from "react";
import {
  useForm,
} from "react-hook-form";

import {
  Button,
} from "@/shared/components/admin/Button/Button";
import {
  FormField,
} from "@/shared/components/admin/FormField/FormField";
import {
  Input,
} from "@/shared/components/admin/Input/Input";
import {
  PageHeader,
} from "@/shared/components/admin/PageHeader/PageHeader";
import {
  SectionCard,
} from "@/shared/components/admin/SectionCard/SectionCard";
import {
  Textarea,
} from "@/shared/components/admin/Textarea/Textarea";
import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProfile,
} from "../../hooks/useProfile";
import {
  useUpdateProfile,
} from "../../hooks/useUpdateProfile";
import {
  profileFormSchema,
  type ProfileFormValues,
} from "../../schemas/profile.schema";
import type {
  ProfileUpdatePayload,
} from "../../types/profile.types";

import styles from "./ProfileForm.module.css";
import type {
  Profile,
} from "../../types/profile.types";

function nullable(
  value: string,
): string | null {
  const normalized =
    value.trim();

  return normalized.length > 0
    ? normalized
    : null;
}

type ProfileFormProps = {
  profile: Profile;
};

export function ProfileForm({
  profile,
}: ProfileFormProps) {

  const updateProfile =
    useUpdateProfile();

  const {
    showToast,
  } = useToast();


  const {
    register,
    handleSubmit,
    reset,

    formState: {
      errors,
      isDirty,
    },
  } = useForm<ProfileFormValues>({
    resolver:
      zodResolver(
        profileFormSchema,
      ),

    defaultValues: {
      full_name: "",
      professional_title: "",

      headline: "",
      location: "",
      availability_text: "",

      short_bio: "",
      about: "",
      mission: "",
    },
  });


  useEffect(() => {
    if (!profile) {
      return;
    }

    reset({
      full_name:
        profile.full_name,

      professional_title:
        profile.professional_title,

      headline:
        profile.headline ?? "",

      location:
        profile.location ?? "",

      availability_text:
        profile.availability_text ??
        "",

      short_bio:
        profile.short_bio ?? "",

      about:
        profile.about ?? "",

      mission:
        profile.mission ?? "",
    });
  }, [
    profile,
    reset,
  ]);


  const onSubmit = async (
    values: ProfileFormValues,
  ) => {
    const payload:
      ProfileUpdatePayload = {
      full_name:
        values.full_name.trim(),

      professional_title:
        values.professional_title.trim(),

      headline:
        nullable(
          values.headline,
        ),

      location:
        nullable(
          values.location,
        ),

      availability_text:
        nullable(
          values.availability_text,
        ),

      short_bio:
        nullable(
          values.short_bio,
        ),

      about:
        nullable(
          values.about,
        ),

      mission:
        nullable(
          values.mission,
        ),
    };

    try {
      const updated =
        await updateProfile.mutateAsync(
          payload,
        );

      reset({
        full_name:
          updated.full_name,

        professional_title:
          updated.professional_title,

        headline:
          updated.headline ?? "",

        location:
          updated.location ?? "",

        availability_text:
          updated.availability_text ??
          "",

        short_bio:
          updated.short_bio ?? "",

        about:
          updated.about ?? "",

        mission:
          updated.mission ?? "",
      });

      showToast({
        title:
          "Profile updated",

        message:
          "Your profile information was saved successfully.",

        variant:
          "success",
      });
    } catch (error) {
      showToast({
        title:
          "Unable to update profile",

        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",

        variant: "error",
      });
    }
  };

  return (
    <div
      className={styles.page}
    >

      <form
        id="profile-form"
        className={styles.form}
        onSubmit={handleSubmit(
          onSubmit,
        )}
      >
        <SectionCard
          title="Basic information"
          description="
            Main professional information
            used across the portfolio.
          "
        >
          <div
            className={
              styles.grid
            }
          >
            <FormField
              label="Full name"
              htmlFor="full_name"
              required
              error={
                errors.full_name
                  ?.message
              }
            >
              <Input
                id="full_name"
                autoComplete="name"
                invalid={
                  !!errors.full_name
                }
                {...register(
                  "full_name",
                )}
              />
            </FormField>

            <FormField
              label="Professional title"
              htmlFor="professional_title"
              required
              error={
                errors
                  .professional_title
                  ?.message
              }
            >
              <Input
                id="professional_title"
                invalid={
                  !!errors
                    .professional_title
                }
                {...register(
                  "professional_title",
                )}
              />
            </FormField>

            <div
              className={
                styles.fullWidth
              }
            >
              <FormField
                label="Headline"
                htmlFor="headline"
                hint="
                  Short phrase displayed
                  prominently in the public
                  portfolio.
                "
              >
                <Input
                  id="headline"
                  {...register(
                    "headline",
                  )}
                />
              </FormField>
            </div>

            <FormField
              label="Location"
              htmlFor="location"
            >
              <Input
                id="location"
                placeholder="Cancún, Mexico"
                {...register(
                  "location",
                )}
              />
            </FormField>

            <FormField
              label="Availability"
              htmlFor="availability_text"
            >
              <Input
                id="availability_text"
                placeholder="Available for..."
                {...register(
                  "availability_text",
                )}
              />
            </FormField>
          </div>
        </SectionCard>


        <SectionCard
          title="Biography"
          description="
            Longer content used by the
            About and introduction
            sections.
          "
        >
          <div
            className={
              styles.textareas
            }
          >
            <FormField
              label="Short bio"
              htmlFor="short_bio"
            >
              <Textarea
                id="short_bio"
                rows={4}
                {...register(
                  "short_bio",
                )}
              />
            </FormField>

            <FormField
              label="About"
              htmlFor="about"
            >
              <Textarea
                id="about"
                rows={8}
                {...register(
                  "about",
                )}
              />
            </FormField>

            <FormField
              label="Mission"
              htmlFor="mission"
            >
              <Textarea
                id="mission"
                rows={5}
                {...register(
                  "mission",
                )}
              />
            </FormField>
          </div>
        </SectionCard>
      </form>
    </div>
  );
}