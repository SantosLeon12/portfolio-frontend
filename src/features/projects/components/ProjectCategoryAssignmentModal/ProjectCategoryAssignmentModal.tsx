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
  Modal,
} from "@/shared/components/admin/Modal/Modal";

import {
  Select,
} from "@/shared/components/admin/Select/Select";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProjectCategoryRelationMutations,
} from "../../hooks/project.mutations";

import {
  projectCategoryAssignmentSchema,
  type ProjectCategoryAssignmentFormValues,
} from "../../schemas/project.schema";

import type {
  ProjectCategory,
} from "../../types/project.types";

import styles from "../ProjectForms.module.css";


type Props = {
  open: boolean;

  projectId: number;

  categories:
    ProjectCategory[];

  onClose: () => void;
};


export function ProjectCategoryAssignmentModal({
  open,
  projectId,
  categories,
  onClose,
}: Props) {
  const {
    addMutation,
  } =
    useProjectCategoryRelationMutations(
      projectId,
    );

  const {
    showToast,
  } = useToast();


  const {
    register,
    reset,
    handleSubmit,
  } =
    useForm<ProjectCategoryAssignmentFormValues>({
      resolver:
        zodResolver(
          projectCategoryAssignmentSchema,
        ),

      defaultValues: {
        category_id: 0,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      category_id:
        categories[0]?.id ??
        0,
    });
  }, [
    open,
    categories,
    reset,
  ]);


  const submit = async (
    values:
      ProjectCategoryAssignmentFormValues,
  ) => {
    try {
      await addMutation
        .mutateAsync(
          values.category_id,
        );

      showToast({
        title:
          "Category added to project",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to add category",

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
      title="Add category"
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
          label="Category"
          htmlFor="project_category"
        >
          <Select
            id="project_category"
            {...register(
              "category_id",
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
                  {
                    category.name
                  }
                </option>
              ),
            )}
          </Select>
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
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={
              addMutation
                .isPending
            }
          >
            Add
          </Button>
        </footer>
      </form>
    </Modal>
  );
}