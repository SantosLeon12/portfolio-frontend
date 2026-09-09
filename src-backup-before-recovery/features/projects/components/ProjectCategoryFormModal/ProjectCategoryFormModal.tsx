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
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProjectCategoryCatalogMutations,
} from "../../hooks/project.mutations";

import {
  projectCategorySchema,
  type ProjectCategoryFormValues,
} from "../../schemas/project.schema";

import type {
  ProjectCategory,
} from "../../types/project.types";

import styles from "../ProjectForms.module.css";


type Props = {
  open: boolean;

  category?:
    | ProjectCategory
    | null;

  onClose: () => void;
};


export function ProjectCategoryFormModal({
  open,
  category,
  onClose,
}: Props) {
  const editing =
    !!category;

  const {
    createMutation,
    updateMutation,
  } =
    useProjectCategoryCatalogMutations();

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
    useForm<ProjectCategoryFormValues>({
      resolver:
        zodResolver(
          projectCategorySchema,
        ),

      defaultValues: {
        name: "",
        slug: "",
        display_order: 0,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name:
        category?.name ?? "",

      slug:
        category?.slug ?? "",

      display_order:
        category
          ?.display_order ?? 0,
    });
  }, [
    open,
    category,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      ProjectCategoryFormValues,
  ) => {
    const payload = {
      name:
        values.name.trim(),

      slug:
        values.slug
          .trim()
          .toLowerCase(),

      display_order:
        values.display_order,
    };

    try {
      if (
        editing &&
        category
      ) {
        await updateMutation
          .mutateAsync({
            id:
              category.id,

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
            ? "Category updated"
            : "Category created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save category",

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
          ? "Edit project category"
          : "Add project category"
      }
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
        <FormField
          label="Name"
          htmlFor="category_name"
          required
          error={
            errors.name
              ?.message
          }
        >
          <Input
            id="category_name"
            placeholder="Enterprise"
            {...register(
              "name",
            )}
          />
        </FormField>

        <FormField
          label="Slug"
          htmlFor="category_slug"
          required
          error={
            errors.slug
              ?.message
          }
        >
          <Input
            id="category_slug"
            placeholder="enterprise"
            {...register(
              "slug",
            )}
          />
        </FormField>

        <FormField
          label="Display order"
          htmlFor="category_order"
        >
          <Input
            id="category_order"
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
            Save
          </Button>
        </footer>
      </form>
    </Modal>
  );
}