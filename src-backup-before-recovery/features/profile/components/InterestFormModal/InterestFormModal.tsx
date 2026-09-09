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
  useInterestMutations,
} from "../../hooks/useInterestMutations";

import {
  interestSchema,
  type InterestFormValues,
} from "../../schemas/profile-collections.schema";

import type {
  Interest,
} from "../../types/profile.types";

import styles from "../ProfileEntityForm.module.css";


type Props = {
  open: boolean;
  interest?: Interest | null;
  onClose: () => void;
};


export function InterestFormModal({
  open,
  interest,
  onClose,
}: Props) {
  const editing = !!interest;

  const {
    createMutation,
    updateMutation,
  } = useInterestMutations();

  const { showToast } =
    useToast();


  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<InterestFormValues>({
    resolver:
      zodResolver(
        interestSchema,
      ),

    values: {
      name:
        interest?.name ?? "",

      description:
        interest?.description ??
        "",

      display_order:
        interest?.display_order ??
        0,

      is_visible:
        interest?.is_visible ??
        true,
    },
  });


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values: InterestFormValues,
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
        interest
      ) {
        await updateMutation
          .mutateAsync({
            id: interest.id,
            payload,
          });
      } else {
        await createMutation
          .mutateAsync(payload);
      }

      showToast({
        title: editing
          ? "Interest updated"
          : "Interest created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save interest",

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
          ? "Edit interest"
          : "Add interest"
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
          label="Name"
          htmlFor="interest_name"
          required
          error={
            errors.name?.message
          }
        >
          <Input
            id="interest_name"
            {...register("name")}
          />
        </FormField>

        <FormField
          label="Description"
          htmlFor="interest_description"
        >
          <Textarea
            id="interest_description"
            rows={4}
            {...register(
              "description",
            )}
          />
        </FormField>

        <FormField
          label="Display order"
          htmlFor="interest_order"
        >
          <Input
            id="interest_order"
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