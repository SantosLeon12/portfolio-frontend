"use client";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

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
  Modal,
} from "@/shared/components/admin/Modal/Modal";

import {
  Select,
} from "@/shared/components/admin/Select/Select";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useOrganizationMutations,
} from "../../hooks/useOrganizationMutations";

import {
  organizationSchema,
  type OrganizationFormValues,
} from "../../schemas/organization.schema";

import type {
  Organization,
  OrganizationCreatePayload,
} from "../../types/organization.types";


type Props = {
  open: boolean;

  organization?:
    | Organization
    | null;

  onClose: () => void;
};


function nullable(
  value: string,
) {
  const normalized =
    value.trim();

  return normalized
    ? normalized
    : null;
}


export function OrganizationFormModal({
  open,
  organization,
  onClose,
}: Props) {
  const editing =
    !!organization;

  const {
    createMutation,
    updateMutation,
  } =
    useOrganizationMutations();

  const {
    showToast,
  } = useToast();


  const {
    register,
    handleSubmit,
    reset,

    formState: {
      errors,
    },
  } =
    useForm<OrganizationFormValues>({
      resolver:
        zodResolver(
          organizationSchema,
        ),

      defaultValues: {
        name: "",
        slug: "",

        organization_type:
          "COMPANY",

        website_url: "",

        logo_media_id:
          null,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name:
        organization?.name ??
        "",

      slug:
        organization?.slug ??
        "",

      organization_type:
        organization
          ?.organization_type ??
        "COMPANY",

      website_url:
        organization
          ?.website_url ??
        "",

      logo_media_id:
        organization
          ?.logo_media_id ??
        null,
    });
  }, [
    open,
    organization,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      OrganizationFormValues,
  ) => {
    const payload:
      OrganizationCreatePayload =
    {
      name:
        values.name.trim(),

      slug:
        values.slug
          .trim()
          .toLowerCase(),

      organization_type:
        values.organization_type,

      website_url:
        nullable(
          values.website_url,
        ),

      logo_media_id:
        values.logo_media_id,
    };

    try {
      if (
        editing &&
        organization
      ) {
        await updateMutation
          .mutateAsync({
            id:
              organization.id,

            payload,
          });
      } else {
        await createMutation
          .mutateAsync(
            payload,
          );
      }

      showToast({
        title: editing
          ? "Organization updated"
          : "Organization created",

        message: editing
          ? `${payload.name} was updated successfully.`
          : `${payload.name} was added successfully.`,
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save organization",

        message:
          error instanceof Error
            ? error.message
            : undefined,

        variant:
          "error",
      });
    }
  };


  return (
    <Modal
      open={open}
      title={
        editing
          ? "Edit organization"
          : "Add organization"
      }
      description="
        Companies, universities,
        schools and clients used
        throughout the portfolio.
      "
      onClose={onClose}
    >
      <form
        className="organization-form"
        onSubmit={handleSubmit(
          submit,
        )}
      >
        <div
          style={{
            display: "grid",
            gap: "1.25rem",
          }}
        >
          <FormField
            label="Name"
            htmlFor="organization_name"
            required
            error={
              errors.name
                ?.message
            }
          >
            <Input
              id="organization_name"
              invalid={
                !!errors.name
              }
              placeholder="Rótulos y Offset de Cancún"
              {...register(
                "name",
              )}
            />
          </FormField>

          <FormField
            label="Slug"
            htmlFor="organization_slug"
            required
            error={
              errors.slug
                ?.message
            }
            hint="
              Stable identifier used
              internally and in URLs.
            "
          >
            <Input
              id="organization_slug"
              invalid={
                !!errors.slug
              }
              placeholder="rotulos-y-offset"
              {...register(
                "slug",
              )}
            />
          </FormField>

          <FormField
            label="Type"
            htmlFor="organization_type"
            required
          >
            <Select
              id="organization_type"
              {...register(
                "organization_type",
              )}
            >
              <option value="COMPANY">
                Company
              </option>

              <option value="UNIVERSITY">
                University
              </option>

              <option value="SCHOOL">
                School
              </option>

              <option value="CLIENT">
                Client
              </option>

              <option value="OTHER">
                Other
              </option>
            </Select>
          </FormField>

          <FormField
            label="Website"
            htmlFor="website_url"
            error={
              errors.website_url
                ?.message
            }
          >
            <Input
              id="website_url"
              type="url"
              placeholder="https://..."
              invalid={
                !!errors.website_url
              }
              {...register(
                "website_url",
              )}
            />
          </FormField>

          <div
            style={{
              display: "flex",
              justifyContent:
                "flex-end",
              gap: "0.75rem",
              paddingTop:
                "1rem",
              borderTop:
                "1px solid var(--border)",
            }}
          >
            <Button
              type="button"
              variant="secondary"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              loading={loading}
            >
              {editing
                ? "Save changes"
                : "Add organization"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}