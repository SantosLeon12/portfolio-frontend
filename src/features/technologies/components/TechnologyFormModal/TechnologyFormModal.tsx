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
  slugify,
} from "@/shared/utils/slugify";

import {
  useTechnologyMutations,
} from "../../hooks/technology.mutations";

import {
  technologySchema,
  type TechnologyFormValues,
} from "../../schemas/technology.schema";

import type {
  Technology,
  TechnologyCategory,
} from "../../types/technology.types";

import styles from "../TechnologyForms.module.css";


type Props = {
  open: boolean;

  technology?:
  | Technology
  | null;

  categories:
  TechnologyCategory[];

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


export function TechnologyFormModal({
  open,
  technology,
  categories,
  onClose,
}: Props) {
  const editing =
    !!technology;

  const {
    createMutation,
    updateMutation,
  } =
    useTechnologyMutations();

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
    useForm<TechnologyFormValues>({
      resolver:
        zodResolver(
          technologySchema,
        ),

      defaultValues: {
        name: "",
        slug: "",

        technology_category_id: 0,

        official_url: "",
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name:
        technology?.name ?? "",

      slug:
        technology?.slug ?? "",

      technology_category_id:
        technology
          ?.technology_category_id ??
        categories[0]?.id ??
        0,

      official_url:
        technology
          ?.official_url ?? "",
    });
  }, [
    open,
    technology,
    categories,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const nameField =
    register("name");


  const submit = async (
    values:
      TechnologyFormValues,
  ) => {
    const payload = {
      name:
        values.name.trim(),

      slug:
        values.slug
          .trim()
          .toLowerCase(),

      technology_category_id:
        values.technology_category_id,

      official_url:
        nullable(
          values.official_url,
        ),
    };

    try {
      if (
        editing &&
        technology
      ) {
        await updateMutation
          .mutateAsync({
            id:
              technology.id,

            payload,
          });
      } else {
        await createMutation
          .mutateAsync({
            ...payload,

            icon_media_id:
              null,
          });
      }

      showToast({
        title: editing
          ? "Technology updated"
          : "Technology created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save technology",

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
          ? "Edit technology"
          : "Add technology"
      }
      description="
        Technologies can later be
        assigned to your profile,
        experience and projects.
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
          <FormField
            label="Name"
            htmlFor="technology_name"
            required
            error={
              errors.name?.message
            }
          >
            <Input
              id="technology_name"
              invalid={
                !!errors.name
              }
              placeholder="FastAPI"
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
            label="Category"
            htmlFor="technology_category"
            required
            error={
              errors.technology_category_id
                ?.message
            }
          >
            <Select
              id="technology_category"
              invalid={
                !!errors.technology_category_id
              }
              {...register(
                "technology_category_id",
                {
                  valueAsNumber:
                    true,
                },
              )}
            >
              {categories.map(
                (category) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.id
                    }
                  >
                    {category.name}
                  </option>
                ),
              )}
            </Select>
          </FormField>

          <div
            className={
              styles.fullWidth
            }
          >
            <FormField
              label="Slug"
              htmlFor="technology_slug"
              required
              error={
                errors.slug?.message
              }
            >
              <Input
                id="technology_slug"
                invalid={
                  !!errors.slug
                }
                placeholder="fastapi"
                {...register(
                  "slug",
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
              label="Official URL"
              htmlFor="technology_url"
              error={
                errors.official_url
                  ?.message
              }
            >
              <Input
                id="technology_url"
                type="url"
                placeholder="https://fastapi.tiangolo.com/"
                invalid={
                  !!errors.official_url
                }
                {...register(
                  "official_url",
                )}
              />
            </FormField>
          </div>
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
              : "Add technology"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}