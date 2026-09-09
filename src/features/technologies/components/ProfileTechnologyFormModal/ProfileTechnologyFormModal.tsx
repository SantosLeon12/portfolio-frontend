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
  Select,
} from "@/shared/components/admin/Select/Select";
import {
  Switch,
} from "@/shared/components/admin/Switch/Switch";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProfileTechnologyMutations,
} from "../../hooks/technology.mutations";

import {
  profileTechnologySchema,
  type ProfileTechnologyFormValues,
} from "../../schemas/technology.schema";

import type {
  ProfileTechnology,
  Technology,
} from "../../types/technology.types";

import styles from "../TechnologyForms.module.css";


type Props = {
  open: boolean;

  assignment?:
  | ProfileTechnology
  | null;

  technologies:
  Technology[];

  onClose: () => void;
};


export function ProfileTechnologyFormModal({
  open,
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
    useProfileTechnologyMutations();

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
    useForm<ProfileTechnologyFormValues>({
      resolver:
        zodResolver(
          profileTechnologySchema,
        ),

      defaultValues: {
        technology_id: 0,

        featured: false,

        display_order: 0,

        is_visible: true,
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

      featured:
        assignment
          ?.featured ??
        false,

      display_order:
        assignment
          ?.display_order ??
        0,

      is_visible:
        assignment
          ?.is_visible ??
        true,
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
      ProfileTechnologyFormValues,
  ) => {
    try {
      if (
        editing &&
        assignment
      ) {
        await updateMutation
          .mutateAsync({
            technologyId:
              assignment.technology.id,

            payload: {
              featured:
                values.featured,

              display_order:
                values.display_order,

              is_visible:
                values.is_visible,
            },
          });
      } else {
        await createMutation
          .mutateAsync(values);
      }

      showToast({
        title: editing
          ? "Profile technology updated"
          : "Technology added to profile",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save profile technology",

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
          ? "Edit profile technology"
          : "Add technology to profile"
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
              htmlFor="assigned_technology"
            >
              <Input
                id="assigned_technology"
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
            htmlFor="profile_technology"
            required
            error={
              errors.technology_id
                ?.message
            }
          >
            <Select
              id="profile_technology"
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
          htmlFor="profile_technology_order"
        >
          <Input
            id="profile_technology_order"
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

        <div
          className={
            styles.switches
          }
        >
          <Controller
            control={control}
            name="featured"
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
                label="Featured technology"
              />
            )}
          />

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
              : "Add to profile"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}