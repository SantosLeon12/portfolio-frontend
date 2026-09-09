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

import type {
  Organization,
} from "@/features/organizations/types/organization.types";

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
  useProjectMutations,
} from "../../hooks/project.mutations";

import {
  projectSchema,
  type ProjectFormValues,
} from "../../schemas/project.schema";

import type {
  Project,
  ProjectCreatePayload,
} from "../../types/project.types";

import styles from "../ProjectForms.module.css";


type Props = {
  open: boolean;

  project?:
    | Project
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


export function ProjectFormModal({
  open,
  project,
  organizations,
  onClose,
}: Props) {
  const editing =
    !!project;

  const {
    createMutation,
    updateMutation,
  } =
    useProjectMutations();

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
    useForm<ProjectFormValues>({
      resolver:
        zodResolver(
          projectSchema,
        ),

      defaultValues: {
        organization_id: 0,

        title: "",
        slug: "",

        short_description: "",
        overview: "",
        role_summary: "",

        start_date: "",
        end_date: "",

        status:
          "DRAFT",

        featured:
          false,

        display_order: 0,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      organization_id:
        project
          ?.organization_id ??
        0,

      title:
        project?.title ?? "",

      slug:
        project?.slug ?? "",

      short_description:
        project
          ?.short_description ?? "",

      overview:
        project
          ?.overview ?? "",

      role_summary:
        project
          ?.role_summary ?? "",

      start_date:
        project
          ?.start_date ?? "",

      end_date:
        project
          ?.end_date ?? "",

      status:
        project
          ?.status ??
        "DRAFT",

      featured:
        project
          ?.featured ??
        false,

      display_order:
        project
          ?.display_order ?? 0,
    });
  }, [
    open,
    project,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      ProjectFormValues,
  ) => {
    const payload:
      ProjectCreatePayload =
    {
      organization_id:
        values.organization_id >
        0
          ? values.organization_id
          : null,

      title:
        values.title.trim(),

      slug:
        values.slug
          .trim()
          .toLowerCase(),

      short_description:
        nullable(
          values.short_description,
        ),

      overview:
        nullable(
          values.overview,
        ),

      role_summary:
        nullable(
          values.role_summary,
        ),

      start_date:
        values.start_date ||
        null,

      end_date:
        values.end_date ||
        null,

      status:
        values.status,

      featured:
        values.featured,

      display_order:
        values.display_order,
    };


    try {
      if (
        editing &&
        project
      ) {
        await updateMutation
          .mutateAsync({
            id:
              project.id,

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
            ? "Project updated"
            : "Project created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save project",

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
          ? "Edit project"
          : "Add project"
      }
      description="
        Define the core information
        for this portfolio project.
      "
      onClose={onClose}
    >
      <form
        className={
          styles.form
        }
        onSubmit={handleSubmit(
          submit,
        )}
      >
        <div
          className={
            styles.grid
          }
        >
          <FormField
            label="Title"
            htmlFor="project_title"
            required
            error={
              errors.title
                ?.message
            }
          >
            <Input
              id="project_title"
              placeholder="Hisoft ERP"
              {...register(
                "title",
              )}
            />
          </FormField>

          <FormField
            label="Slug"
            htmlFor="project_slug"
            required
            error={
              errors.slug
                ?.message
            }
          >
            <Input
              id="project_slug"
              placeholder="hisoft-erp"
              {...register(
                "slug",
              )}
            />
          </FormField>

          <div
            className={
              styles.fullWidth
            }
          >
            <FormField
              label="Organization"
              htmlFor="project_organization"
              hint="Optional"
            >
              <Select
                id="project_organization"
                {...register(
                  "organization_id",
                  {
                    valueAsNumber:
                      true,
                  },
                )}
              >
                <option value={0}>
                  Personal project / none
                </option>

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
            label="Status"
            htmlFor="project_status"
          >
            <Select
              id="project_status"
              {...register(
                "status",
              )}
            >
              <option value="DRAFT">
                Draft
              </option>

              <option value="PUBLISHED">
                Published
              </option>

              <option value="ARCHIVED">
                Archived
              </option>
            </Select>
          </FormField>

          <FormField
            label="Display order"
            htmlFor="project_order"
          >
            <Input
              id="project_order"
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
            htmlFor="project_start"
          >
            <Input
              id="project_start"
              type="date"
              {...register(
                "start_date",
              )}
            />
          </FormField>

          <FormField
            label="End date"
            htmlFor="project_end"
            error={
              errors.end_date
                ?.message
            }
          >
            <Input
              id="project_end"
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
              label="Short description"
              htmlFor="project_short"
            >
              <Textarea
                id="project_short"
                rows={3}
                {...register(
                  "short_description",
                )}
              />
            </FormField>
          </div>

          <div
            className={
              styles.fullWidth
            }
          >
            <FormField
              label="Overview"
              htmlFor="project_overview"
            >
              <Textarea
                id="project_overview"
                rows={5}
                {...register(
                  "overview",
                )}
              />
            </FormField>
          </div>

          <div
            className={
              styles.fullWidth
            }
          >
            <FormField
              label="Role summary"
              htmlFor="project_role"
            >
              <Textarea
                id="project_role"
                rows={4}
                {...register(
                  "role_summary",
                )}
              />
            </FormField>
          </div>
        </div>

        <Controller
          control={control}
          name="featured"
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
              label="Featured project"
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
              : "Create project"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}