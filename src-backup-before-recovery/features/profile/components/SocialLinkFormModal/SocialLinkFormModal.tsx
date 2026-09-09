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
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useSocialLinkMutations,
} from "../../hooks/useSocialLinkMutations";

import {
  socialLinkSchema,
  type SocialLinkFormValues,
} from "../../schemas/profile-collections.schema";

import type {
  SocialLink,
} from "../../types/profile.types";

import styles from "../ProfileEntityForm.module.css";


type Props = {
  open: boolean;
  socialLink?: SocialLink | null;
  onClose: () => void;
};


export function SocialLinkFormModal({
  open,
  socialLink,
  onClose,
}: Props) {
  const editing =
    !!socialLink;

  const {
    createMutation,
    updateMutation,
  } =
    useSocialLinkMutations();

  const { showToast } =
    useToast();


  const {
    register,
    control,
    handleSubmit,

    formState: {
      errors,
    },
  } =
    useForm<SocialLinkFormValues>({
      resolver:
        zodResolver(
          socialLinkSchema,
        ),

      values: {
        platform:
          socialLink?.platform ??
          "",

        label:
          socialLink?.label ??
          "",

        url:
          socialLink?.url ?? "",

        display_order:
          socialLink
            ?.display_order ?? 0,

        is_visible:
          socialLink
            ?.is_visible ?? true,
      },
    });


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      SocialLinkFormValues,
  ) => {
    const label =
      values.label.trim() ||
      null;

    try {
      if (
        editing &&
        socialLink
      ) {
        await updateMutation
          .mutateAsync({
            id: socialLink.id,

            payload: {
              ...values,
              label,
            },
          });
      } else {
        await createMutation
          .mutateAsync({
            ...values,
            label,
          });
      }

      showToast({
        title: editing
          ? "Social link updated"
          : "Social link created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save social link",

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
          ? "Edit social link"
          : "Add social link"
      }
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
            label="Platform"
            htmlFor="platform"
            required
            error={
              errors.platform
                ?.message
            }
          >
            <Input
              id="platform"
              placeholder="GitHub"
              {...register(
                "platform",
              )}
            />
          </FormField>

          <FormField
            label="Label"
            htmlFor="social_label"
          >
            <Input
              id="social_label"
              placeholder="GitHub profile"
              {...register(
                "label",
              )}
            />
          </FormField>

          <div
            className={
              styles.fullWidth
            }
          >
            <FormField
              label="URL"
              htmlFor="social_url"
              required
              error={
                errors.url?.message
              }
            >
              <Input
                id="social_url"
                placeholder="https://github.com/..."
                invalid={
                  !!errors.url
                }
                {...register(
                  "url",
                )}
              />
            </FormField>
          </div>

          <FormField
            label="Display order"
            htmlFor="social_order"
          >
            <Input
              id="social_order"
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
        </div>

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
            {editing
              ? "Save changes"
              : "Add link"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}