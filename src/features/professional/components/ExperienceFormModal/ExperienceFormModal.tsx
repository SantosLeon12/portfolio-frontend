"use client";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  useEffect,
} from "react";

import {
  Controller,
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
  Switch,
} from "@/shared/components/admin/Switch/Switch";

import {
  Textarea,
} from "@/shared/components/admin/Textarea/Textarea";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useExperienceMutations,
} from "../../hooks/professional.mutations";

import {
  experienceSchema,
  type ExperienceFormValues,
} from "../../schemas/professional.schema";

import type {
  Organization,
} from "@/features/organizations/types/organization.types";

import type {
  Experience,
  ExperienceCreatePayload,
} from "../../types/professional.types";

import styles from "../ProfessionalForms.module.css";


type Props = {
  open: boolean;

  experience?:
    | Experience
    | null;

  organizations:
    Organization[];

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


export function ExperienceFormModal({
  open,
  experience,
  organizations,
  onClose,
}: Props) {
  const editing =
    !!experience;

  const {
    createMutation,
    updateMutation,
  } =
    useExperienceMutations();

  const {
    showToast,
  } = useToast();


  const {
    register,
    control,
    handleSubmit,
    reset,

    formState: {
      errors,
    },
  } =
    useForm<ExperienceFormValues>({
      resolver:
        zodResolver(
          experienceSchema,
        ),

      defaultValues: {
        organization_id: 0,

        role_title: "",

        employment_type: "",

        location: "",

        start_date: "",

        end_date: "",

        summary: "",

        display_order: 0,

        is_visible: true,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      organization_id:
        experience
          ?.organization_id ??
        organizations[0]?.id ??
        0,

      role_title:
        experience
          ?.role_title ?? "",

      employment_type:
        experience
          ?.employment_type ?? "",

      location:
        experience
          ?.location ?? "",

      start_date:
        experience
          ?.start_date ?? "",

      end_date:
        experience
          ?.end_date ?? "",

      summary:
        experience
          ?.summary ?? "",

      display_order:
        experience
          ?.display_order ?? 0,

      is_visible:
        experience
          ?.is_visible ?? true,
    });
  }, [
    open,
    experience,
    organizations,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      ExperienceFormValues,
  ) => {
    const payload:
      ExperienceCreatePayload = {
      organization_id:
        values.organization_id,

      role_title:
        values.role_title.trim(),

      employment_type:
        nullable(
          values.employment_type,
        ),

      location:
        nullable(
          values.location,
        ),

      start_date:
        values.start_date,

      end_date:
        nullable(
          values.end_date,
        ),

      summary:
        nullable(
          values.summary,
        ),

      display_order:
        values.display_order,

      is_visible:
        values.is_visible,
    };

    try {
      if (
        editing &&
        experience
      ) {
        await updateMutation
          .mutateAsync({
            id:
              experience.id,

            payload,
          });
      } else {
        await createMutation
          .mutateAsync(
            payload,
          );
      }

      showToast({
        title:
          editing
            ? "Experience updated"
            : "Experience created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save experience",

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
          ? "Edit experience"
          : "Add experience"
      }
      description="
        Manage your professional
        work history.
      "
      onClose={onClose}
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit(
          submit,
        )}
      >
        <div
          className={styles.grid}
        >
          <div
            className={
              styles.fullWidth
            }
          >
            <FormField
              label="Organization"
              htmlFor="experience_organization"
              required
              error={
                errors
                  .organization_id
                  ?.message
              }
            >
              <Select
                id="experience_organization"
                {...register(
                  "organization_id",
                  {
                    valueAsNumber:
                      true,
                  },
                )}
              >
                {organizations.map(
                  (organization) => (
                    <option
                      key={
                        organization.id
                      }
                      value={
                        organization.id
                      }
                    >
                      {
                        organization.name
                      }
                    </option>
                  ),
                )}
              </Select>
            </FormField>
          </div>

          <FormField
            label="Role title"
            htmlFor="experience_role"
            required
            error={
              errors
                .role_title
                ?.message
            }
          >
            <Input
              id="experience_role"
              placeholder="Software Developer"
              {...register(
                "role_title",
              )}
            />
          </FormField>

          <FormField
            label="Employment type"
            htmlFor="employment_type"
          >
            <Input
              id="employment_type"
              placeholder="Full-time"
              {...register(
                "employment_type",
              )}
            />
          </FormField>

          <FormField
            label="Location"
            htmlFor="experience_location"
          >
            <Input
              id="experience_location"
              placeholder="Cancún, Mexico"
              {...register(
                "location",
              )}
            />
          </FormField>

          <FormField
            label="Display order"
            htmlFor="experience_order"
          >
            <Input
              id="experience_order"
              type="number"
              min={0}
              {...register(
                "display_order",
                {
                  valueAsNumber:
                    true,
                },
              )}
            />
          </FormField>

          <FormField
            label="Start date"
            htmlFor="experience_start"
            required
            error={
              errors
                .start_date
                ?.message
            }
          >
            <Input
              id="experience_start"
              type="date"
              {...register(
                "start_date",
              )}
            />
          </FormField>

          <FormField
            label="End date"
            htmlFor="experience_end"
            error={
              errors
                .end_date
                ?.message
            }
            hint="
              Leave empty if this
              is your current role.
            "
          >
            <Input
              id="experience_end"
              type="date"
              {...register(
                "end_date",
              )}
            />
          </FormField>

          <div
            className={
              styles.fullWidth
            }
          >
            <FormField
              label="Summary"
              htmlFor="experience_summary"
            >
              <Textarea
                id="experience_summary"
                rows={5}
                {...register(
                  "summary",
                )}
              />
            </FormField>
          </div>
        </div>

        <div
          className={
            styles.switches
          }
        >
          <Controller
            control={control}
            name="is_visible"
            render={({
              field,
            }) => (
              <Switch
                checked={
                  field.value
                }
                onCheckedChange={
                  field.onChange
                }
                label="Visible publicly"
              />
            )}
          />
        </div>

        <footer
          className={
            styles.actions
          }
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
              : "Add experience"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}