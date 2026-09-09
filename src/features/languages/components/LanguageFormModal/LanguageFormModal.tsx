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
  useLanguageMutations,
} from "../../hooks/language.mutations";

import {
  languageSchema,
  type LanguageFormValues,
} from "../../schemas/language.schema";

import type {
  Language,
} from "../../types/language.types";

import styles from "../LanguageForms.module.css";


type Props = {
  open: boolean;

  language?:
    | Language
    | null;

  onClose: () => void;
};


export function LanguageFormModal({
  open,
  language,
  onClose,
}: Props) {
  const editing =
    !!language;

  const {
    createMutation,
    updateMutation,
  } =
    useLanguageMutations();

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
    useForm<LanguageFormValues>({
      resolver:
        zodResolver(
          languageSchema,
        ),

      defaultValues: {
        name: "",
        iso_code: "",
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name:
        language?.name ?? "",

      iso_code:
        language?.iso_code ?? "",
    });
  }, [
    open,
    language,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      LanguageFormValues,
  ) => {
    const payload = {
      name:
        values.name.trim(),

      iso_code:
        values.iso_code
          .trim()
          .toLowerCase(),
    };

    try {
      if (
        editing &&
        language
      ) {
        await updateMutation
          .mutateAsync({
            id:
              language.id,

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
            ? "Language updated"
            : "Language created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save language",

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
          ? "Edit language"
          : "Add language"
      }
      description="
        Languages available for
        your professional profile.
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
            label="Language"
            htmlFor="language_name"
            required
            error={
              errors.name?.message
            }
          >
            <Input
              id="language_name"
              placeholder="English"
              invalid={
                !!errors.name
              }
              {...register("name")}
            />
          </FormField>

          <FormField
            label="ISO code"
            htmlFor="language_iso"
            required
            error={
              errors.iso_code
                ?.message
            }
            hint="Example: en, es, fr"
          >
            <Input
              id="language_iso"
              placeholder="en"
              invalid={
                !!errors.iso_code
              }
              {...register(
                "iso_code",
              )}
            />
          </FormField>
        </div>

        <footer
          className={styles.actions}
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
              : "Add language"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}