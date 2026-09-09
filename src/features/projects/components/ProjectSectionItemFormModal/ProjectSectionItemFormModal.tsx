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
  Switch,
} from "@/shared/components/admin/Switch/Switch";
import {
  Textarea,
} from "@/shared/components/admin/Textarea/Textarea";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProjectSectionItemMutations,
} from "../../hooks/project.mutations";

import {
  projectSectionItemSchema,
  type ProjectSectionItemFormValues,
} from "../../schemas/project.schema";

import type {
  ProjectSectionItem,
} from "../../types/project.types";

import styles from "../ProjectForms.module.css";


type Props = {
  open: boolean;

  projectId: number;
  sectionId: number;

  item?:
    | ProjectSectionItem
    | null;

  onClose: () => void;
};


export function ProjectSectionItemFormModal({
  open,
  projectId,
  sectionId,
  item,
  onClose,
}: Props) {
  const editing =
    !!item;

  const {
    createMutation,
    updateMutation,
  } =
    useProjectSectionItemMutations(
      projectId,
      sectionId,
    );

  const {
    showToast,
  } = useToast();


  const {
    register,
    control,
    reset,
    handleSubmit,

    formState: {
      errors,
    },
  } =
    useForm<ProjectSectionItemFormValues>({
      resolver:
        zodResolver(
          projectSectionItemSchema,
        ),

      defaultValues: {
        content: "",
        display_order: 0,
        is_visible: true,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      content:
        item?.content ?? "",

      display_order:
        item
          ?.display_order ?? 0,

      is_visible:
        item
          ?.is_visible ?? true,
    });
  }, [
    open,
    item,
    reset,
  ]);


  const submit = async (
    values:
      ProjectSectionItemFormValues,
  ) => {
    try {
      if (
        editing &&
        item
      ) {
        await updateMutation
          .mutateAsync({
            itemId:
              item.id,

            payload:
              values,
          });
      } else {
        await createMutation
          .mutateAsync(
            values,
          );
      }

      showToast({
        title:
          editing
            ? "Section item updated"
            : "Section item created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save section item",

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
          ? "Edit item"
          : "Add item"
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
          label="Content"
          htmlFor="section_item_content"
          error={
            errors.content
              ?.message
          }
        >
          <Textarea
            id="section_item_content"
            rows={5}
            {...register(
              "content",
            )}
          />
        </FormField>

        <FormField
          label="Display order"
          htmlFor="section_item_order"
        >
          <Input
            id="section_item_order"
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
          >
            Cancel
          </Button>

          <Button type="submit">
            Save
          </Button>
        </footer>
      </form>
    </Modal>
  );
}