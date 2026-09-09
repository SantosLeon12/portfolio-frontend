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

import type {
  Organization,
} from "@/features/organizations/types/organization.types";

import {
  useEducationMutations,
} from "../../hooks/professional.mutations";

import {
  educationSchema,
  type EducationFormValues,
} from "../../schemas/professional.schema";

import type {
  Education,
  EducationCreatePayload,
} from "../../types/professional.types";

import styles from "../ProfessionalForms.module.css";


type Props = {
  open: boolean;

  education?:
    | Education
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


export function EducationFormModal({
  open,
  education,
  organizations,
  onClose,
}: Props) {
  const editing =
    !!education;

  const {
    createMutation,
    updateMutation,
  } =
    useEducationMutations();

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
    useForm<EducationFormValues>({
      resolver:
        zodResolver(
          educationSchema,
        ),

      defaultValues: {
        organization_id: 0,
        degree: "",
        field_of_study: "",
        location: "",
        start_date: "",
        end_date: "",
        description: "",
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
        education
          ?.organization_id ??
        organizations[0]?.id ??
        0,

      degree:
        education?.degree ?? "",

      field_of_study:
        education
          ?.field_of_study ?? "",

      location:
        education
          ?.location ?? "",

      start_date:
        education
          ?.start_date ?? "",

      end_date:
        education
          ?.end_date ?? "",

      description:
        education
          ?.description ?? "",

      display_order:
        education
          ?.display_order ?? 0,

      is_visible:
        education
          ?.is_visible ?? true,
    });
  }, [
    open,
    education,
    organizations,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      EducationFormValues,
  ) => {
    const payload:
      EducationCreatePayload = {
      organization_id:
        values.organization_id,

      degree:
        values.degree.trim(),

      field_of_study:
        values
          .field_of_study
          .trim(),

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

      description:
        nullable(
          values.description,
        ),

      display_order:
        values.display_order,

      is_visible:
        values.is_visible,
    };

    try {
      if (
        editing &&
        education
      ) {
        await updateMutation
          .mutateAsync({
            id:
              education.id,

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
            ? "Education updated"
            : "Education created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save education",

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
          ? "Edit education"
          : "Add education"
      }
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
              label="Institution"
              htmlFor="education_organization"
              required
            >
              <Select
                id="education_organization"
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
            label="Degree"
            htmlFor="education_degree"
            required
            error={
              errors.degree
                ?.message
            }
          >
            <Input
              id="education_degree"
              placeholder="Software Engineering"
              {...register(
                "degree",
              )}
            />
          </FormField>

          <FormField
            label="Field of study"
            htmlFor="education_field"
            required
            error={
              errors
                .field_of_study
                ?.message
            }
          >
            <Input
              id="education_field"
              placeholder="Software Development"
              {...register(
                "field_of_study",
              )}
            />
          </FormField>

          <FormField
            label="Location"
            htmlFor="education_location"
          >
            <Input
              id="education_location"
              {...register(
                "location",
              )}
            />
          </FormField>

          <FormField
            label="Display order"
            htmlFor="education_order"
          >
            <Input
              id="education_order"
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
            htmlFor="education_start"
          >
            <Input
              id="education_start"
              type="date"
              {...register(
                "start_date",
              )}
            />
          </FormField>

          <FormField
            label="End date"
            htmlFor="education_end"
            error={
              errors.end_date
                ?.message
            }
          >
            <Input
              id="education_end"
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
              label="Description"
              htmlFor="education_description"
            >
              <Textarea
                id="education_description"
                rows={5}
                {...register(
                  "description",
                )}
              />
            </FormField>
          </div>
        </div>

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

        <footer
          className={
            styles.actions
          }
        >
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
          >
            {editing
              ? "Save changes"
              : "Add education"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}