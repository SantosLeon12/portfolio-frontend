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
  useProficiencyLevelMutations,
} from "../../hooks/language.mutations";

import {
  proficiencyLevelSchema,
  type ProficiencyLevelFormValues,
} from "../../schemas/language.schema";

import type {
  ProficiencyLevel,
} from "../../types/language.types";

import styles from "../LanguageForms.module.css";


type Props = {
  open: boolean;

  level?:
    | ProficiencyLevel
    | null;

  onClose: () => void;
};


export function ProficiencyLevelFormModal({
  open,
  level,
  onClose,
}: Props) {
  const editing =
    !!level;

  const {
    createMutation,
    updateMutation,
  } =
    useProficiencyLevelMutations();

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
    useForm<ProficiencyLevelFormValues>({
      resolver:
        zodResolver(
          proficiencyLevelSchema,
        ),

      defaultValues: {
        code: "",
        name: "",
        rank: 1,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      code:
        level?.code ?? "",

      name:
        level?.name ?? "",

      rank:
        level?.rank ?? 1,
    });
  }, [
    open,
    level,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      ProficiencyLevelFormValues,
  ) => {
    const payload = {
      code:
        values.code
          .trim()
          .toUpperCase(),

      name:
        values.name.trim(),

      rank:
        values.rank,
    };

    try {
      if (
        editing &&
        level
      ) {
        await updateMutation
          .mutateAsync({
            id:
              level.id,

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
            ? "Proficiency level updated"
            : "Proficiency level created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save proficiency level",

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
          ? "Edit proficiency level"
          : "Add proficiency level"
      }
      description="
        Define the language proficiency
        levels available in your profile.
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
            label="Code"
            htmlFor="level_code"
            required
            error={
              errors.code?.message
            }
            hint="Example: B1, B2, C1, NATIVE"
          >
            <Input
              id="level_code"
              placeholder="B2"
              invalid={
                !!errors.code
              }
              {...register("code")}
            />
          </FormField>

          <FormField
            label="Name"
            htmlFor="level_name"
            required
            error={
              errors.name?.message
            }
          >
            <Input
              id="level_name"
              placeholder="Upper Intermediate"
              invalid={
                !!errors.name
              }
              {...register("name")}
            />
          </FormField>

          <FormField
            label="Rank"
            htmlFor="level_rank"
            required
            error={
              errors.rank?.message
            }
            hint="
              Lower numbers represent
              lower proficiency.
            "
          >
            <Input
              id="level_rank"
              type="number"
              min={1}
              invalid={
                !!errors.rank
              }
              {...register(
                "rank",
                {
                  valueAsNumber:
                    true,
                },
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
              : "Add level"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}