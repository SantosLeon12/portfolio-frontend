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
  useProfileLanguageMutations,
} from "../../hooks/language.mutations";

import {
  profileLanguageSchema,
  type ProfileLanguageFormValues,
} from "../../schemas/language.schema";

import type {
  Language,
  ProfileLanguage,
  ProficiencyLevel,
} from "../../types/language.types";

import styles from "../LanguageForms.module.css";


type Props = {
  open: boolean;

  assignment?:
    | ProfileLanguage
    | null;

  languages: Language[];

  levels:
    ProficiencyLevel[];

  onClose: () => void;
};


export function ProfileLanguageFormModal({
  open,
  assignment,
  languages,
  levels,
  onClose,
}: Props) {
  const editing =
    !!assignment;

  const {
    createMutation,
    updateMutation,
  } =
    useProfileLanguageMutations();

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
    useForm<ProfileLanguageFormValues>({
      resolver:
        zodResolver(
          profileLanguageSchema,
        ),

      defaultValues: {
        language_id: 0,

        proficiency_level_id:
          0,

        display_order: 0,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      language_id:
        assignment
          ?.language.id ??
        languages[0]?.id ??
        0,

      proficiency_level_id:
        assignment
          ?.proficiency_level.id ??
        levels[0]?.id ??
        0,

      display_order:
        assignment
          ?.display_order ??
        0,
    });
  }, [
    open,
    assignment,
    languages,
    levels,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      ProfileLanguageFormValues,
  ) => {
    try {
      if (
        editing &&
        assignment
      ) {
        await updateMutation
          .mutateAsync({
            languageId:
              assignment
                .language
                .id,

            payload: {
              proficiency_level_id:
                values
                  .proficiency_level_id,

              display_order:
                values
                  .display_order,
            },
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
            ? "Profile language updated"
            : "Language added to profile",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save profile language",

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
          ? "Edit profile language"
          : "Add language to profile"
      }
      onClose={onClose}
    >
      <form
        className={styles.form}
        onSubmit={handleSubmit(
          submit,
        )}
      >
        {editing &&
        assignment ? (
          <>
            <FormField
              label="Language"
              htmlFor="assigned_language"
            >
              <Input
                id="assigned_language"
                value={
                  assignment
                    .language
                    .name
                }
                readOnly
              />
            </FormField>

            <input
              type="hidden"
              {...register(
                "language_id",
                {
                  valueAsNumber:
                    true,
                },
              )}
            />
          </>
        ) : (
          <FormField
            label="Language"
            htmlFor="profile_language"
            required
            error={
              errors.language_id
                ?.message
            }
          >
            <Select
              id="profile_language"
              invalid={
                !!errors.language_id
              }
              {...register(
                "language_id",
                {
                  valueAsNumber:
                    true,
                },
              )}
            >
              {languages.map(
                (language) => (
                  <option
                    key={
                      language.id
                    }
                    value={
                      language.id
                    }
                  >
                    {language.name}
                  </option>
                ),
              )}
            </Select>
          </FormField>
        )}

        <FormField
          label="Proficiency level"
          htmlFor="profile_language_level"
          required
          error={
            errors
              .proficiency_level_id
              ?.message
          }
        >
          <Select
            id="profile_language_level"
            invalid={
              !!errors
                .proficiency_level_id
            }
            {...register(
              "proficiency_level_id",
              {
                valueAsNumber:
                  true,
              },
            )}
          >
            {levels.map(
              (level) => (
                <option
                  key={level.id}
                  value={level.id}
                >
                  {level.code}
                  {" — "}
                  {level.name}
                </option>
              ),
            )}
          </Select>
        </FormField>

        <FormField
          label="Display order"
          htmlFor="profile_language_order"
        >
          <Input
            id="profile_language_order"
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
              : "Add to profile"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}