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
  useExperienceTechnologyMutations,
} from "../../hooks/professional.mutations";

import {
  experienceTechnologySchema,
  type ExperienceTechnologyFormValues,
} from "../../schemas/professional.schema";

import type {
  Technology,
} from "@/features/technologies/types/technology.types";

import type {
  ExperienceTechnology,
} from "../../types/professional.types";

import styles from "../ProfessionalForms.module.css";


type Props = {
  open: boolean;

  experienceId:
    number;

  assignment?:
    | ExperienceTechnology
    | null;

  technologies:
    Technology[];

  onClose: () => void;
};


export function ExperienceTechnologyFormModal({
  open,
  experienceId,
  assignment,
  technologies,
  onClose,
}: Props) {
  const editing =
    !!assignment;

  const {
    createMutation,
    updateMutation,
  } =
    useExperienceTechnologyMutations(
      experienceId,
    );

  const {
    showToast,
  } = useToast();


  const {
    register,
    handleSubmit,
    reset,
  } =
    useForm<ExperienceTechnologyFormValues>({
      resolver:
        zodResolver(
          experienceTechnologySchema,
        ),

      defaultValues: {
        technology_id: 0,
        display_order: 0,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      technology_id:
        assignment
          ?.technology.id ??
        technologies[0]?.id ??
        0,

      display_order:
        assignment
          ?.display_order ?? 0,
    });
  }, [
    open,
    assignment,
    technologies,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      ExperienceTechnologyFormValues,
  ) => {
    try {
      if (
        editing &&
        assignment
      ) {
        await updateMutation
          .mutateAsync({
            technologyId:
              assignment
                .technology
                .id,

            payload: {
              display_order:
                values.display_order,
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
            ? "Experience technology updated"
            : "Technology added to experience",
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
          ? "Edit experience technology"
          : "Add technology"
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
              label="Technology"
              htmlFor="experience_technology"
            >
              <Input
                id="experience_technology"
                value={
                  assignment
                    .technology
                    .name
                }
                readOnly
              />
            </FormField>

            <input
              type="hidden"
              {...register(
                "technology_id",
                {
                  valueAsNumber:
                    true,
                },
              )}
            />
          </>
        ) : (
          <FormField
            label="Technology"
            htmlFor="experience_technology"
            required
          >
            <Select
              id="experience_technology"
              {...register(
                "technology_id",
                {
                  valueAsNumber:
                    true,
                },
              )}
            >
              {technologies.map(
                (technology) => (
                  <option
                    key={
                      technology.id
                    }
                    value={
                      technology.id
                    }
                  >
                    {
                      technology.name
                    }
                  </option>
                ),
              )}
            </Select>
          </FormField>
        )}

        <FormField
          label="Display order"
          htmlFor="experience_technology_order"
        >
          <Input
            id="experience_technology_order"
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
            Save
          </Button>
        </footer>
      </form>
    </Modal>
  );
}