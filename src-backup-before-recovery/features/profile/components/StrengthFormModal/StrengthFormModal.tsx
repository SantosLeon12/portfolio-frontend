"use client";

import {
  zodResolver,
} from "@hookform/resolvers/zod";

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
  useStrengthMutations,
} from "../../hooks/useStrengthMutations";

import {
  strengthSchema,
  type StrengthFormValues,
} from "../../schemas/profile-collections.schema";

import type {
  Strength,
} from "../../types/profile.types";

import styles from "../ProfileEntityForm.module.css";


type Props = {
  open: boolean;
  strength?: Strength | null;
  onClose: () => void;
};


export function StrengthFormModal({
  open,
  strength,
  onClose,
}: Props) {
  const editing = !!strength;

  const {
    createMutation,
    updateMutation,
  } = useStrengthMutations();

  const { showToast } =
    useToast();


  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StrengthFormValues>({
    resolver:
      zodResolver(
        strengthSchema,
      ),

    values: {
      title:
        strength?.title ?? "",

      description:
        strength?.description ??
        "",

      display_order:
        strength?.display_order ??
        0,

      is_visible:
        strength?.is_visible ??
        true,
    },
  });


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values: StrengthFormValues,
  ) => {
    const payload = {
      ...values,

      description:
        values.description
          .trim() || null,
    };

    try {
      if (
        editing &&
        strength
      ) {
        await updateMutation
          .mutateAsync({
            id: strength.id,
            payload,
          });
      } else {
        await createMutation
          .mutateAsync(payload);
      }

      showToast({
        title: editing
          ? "Strength updated"
          : "Strength created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save strength",

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
          ? "Edit strength"
          : "Add strength"
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
          label="Title"
          htmlFor="strength_title"
          required
          error={
            errors.title?.message
          }
        >
          <Input
            id="strength_title"
            {...register("title")}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="strength_description"
        >
          <Textarea
            id="strength_description"
            rows={4}
            {...register(
              "description",
            )}
          />
        </FormField>

        <FormField
          label="Display order"
          htmlFor="strength_order"
        >
          <Input
            id="strength_order"
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
          render={({ field }) => (
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
          className={styles.actions}
        >
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
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