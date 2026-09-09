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
  useExperienceHighlightMutations,
} from "../../hooks/professional.mutations";

import {
  experienceHighlightSchema,
  type ExperienceHighlightFormValues,
} from "../../schemas/professional.schema";

import type {
  ExperienceHighlight,
} from "../../types/professional.types";

import styles from "../ProfessionalForms.module.css";


type Props = {
  open: boolean;

  experienceId:
    number;

  highlight?:
    | ExperienceHighlight
    | null;

  onClose: () => void;
};


export function ExperienceHighlightFormModal({
  open,
  experienceId,
  highlight,
  onClose,
}: Props) {
  const editing =
    !!highlight;

  const {
    createMutation,
    updateMutation,
  } =
    useExperienceHighlightMutations(
      experienceId,
    );

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
    useForm<ExperienceHighlightFormValues>({
      resolver:
        zodResolver(
          experienceHighlightSchema,
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
        highlight
          ?.content ?? "",

      display_order:
        highlight
          ?.display_order ?? 0,

      is_visible:
        highlight
          ?.is_visible ?? true,
    });
  }, [
    open,
    highlight,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      ExperienceHighlightFormValues,
  ) => {
    try {
      if (
        editing &&
        highlight
      ) {
        await updateMutation
          .mutateAsync({
            highlightId:
              highlight.id,

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
            ? "Highlight updated"
            : "Highlight created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save highlight",

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
          ? "Edit highlight"
          : "Add highlight"
      }
      onClose={onClose}
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit(
          submit,
        )}
      >
        <FormField
          label="Highlight"
          htmlFor="highlight_content"
          required
          error={
            errors.content
              ?.message
          }
        >
          <Textarea
            id="highlight_content"
            rows={4}
            {...register(
              "content",
            )}
          />
        </FormField>

        <FormField
          label="Display order"
          htmlFor="highlight_order"
        >
          <Input
            id="highlight_order"
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
            disabled={loading}
            onClick={onClose}
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