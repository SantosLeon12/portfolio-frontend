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
  slugify,
} from "@/shared/utils/slugify";

import {
  useTechnologyCategoryMutations,
} from "../../hooks/technology.mutations";

import {
  technologyCategorySchema,
  type TechnologyCategoryFormValues,
} from "../../schemas/technology.schema";

import type {
  TechnologyCategory,
} from "../../types/technology.types";

import styles from "../TechnologyForms.module.css";


type Props = {
  open: boolean;

  category?:
    | TechnologyCategory
    | null;

  onClose: () => void;
};


export function TechnologyCategoryFormModal({
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
    useTechnologyCategoryMutations();

  const {
    showToast,
  } = useToast();


  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,

    formState: {
      errors,
    },
  } =
    useForm<TechnologyCategoryFormValues>({
      resolver:
        zodResolver(
          technologyCategorySchema,
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


  const nameField =
    register("name");


  const submit = async (
    values:
      TechnologyCategoryFormValues,
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
            id: category.id,
            payload,
          });
      } else {
        await createMutation
          .mutateAsync(payload);
      }

      showToast({
        title: editing
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

        variant: "error",
      });
    }
  };


  return (
    <Modal
      open={open}
      title={
        editing
          ? "Edit category"
          : "Add technology category"
      }
      description="
        Categories organize your
        technologies by area.
      "
      onClose={onClose}
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit(
          submit,
        )}
      >
        <FormField
          label="Name"
          htmlFor="technology_category_name"
          required
          error={
            errors.name?.message
          }
        >
          <Input
            id="technology_category_name"
            invalid={
              !!errors.name
            }
            {...nameField}
            onBlur={(event) => {
              nameField.onBlur(
                event,
              );

              if (
                !getValues(
                  "slug",
                ).trim()
              ) {
                setValue(
                  "slug",
                  slugify(
                    event.target.value,
                  ),
                  {
                    shouldDirty:
                      true,

                    shouldValidate:
                      true,
                  },
                );
              }
            }}
          />
        </FormField>

        <FormField
          label="Slug"
          htmlFor="technology_category_slug"
          required
          error={
            errors.slug?.message
          }
        >
          <Input
            id="technology_category_slug"
            invalid={
              !!errors.slug
            }
            placeholder="backend"
            {...register("slug")}
          />
        </FormField>

        <FormField
          label="Display order"
          htmlFor="technology_category_order"
        >
          <Input
            id="technology_category_order"
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
              : "Add category"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}