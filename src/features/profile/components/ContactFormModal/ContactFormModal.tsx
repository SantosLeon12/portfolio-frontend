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
  Select,
} from "@/shared/components/admin/Select/Select";

import {
  Switch,
} from "@/shared/components/admin/Switch/Switch";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useContactMutations,
} from "../../hooks/useContactMutations";

import {
  contactSchema,
  type ContactFormValues,
} from "../../schemas/profile-collections.schema";

import type {
  ProfileContact,
} from "../../types/profile.types";

import styles from "../ProfileEntityForm.module.css";


type Props = {
  open: boolean;

  contact?: ProfileContact | null;

  onClose: () => void;
};


function nullable(
  value: string,
) {
  const normalized =
    value.trim();

  return normalized
    ? normalized
    : null;
}


export function ContactFormModal({
  open,
  contact,
  onClose,
}: Props) {
  const editing = !!contact;

  const {
    createMutation,
    updateMutation,
  } = useContactMutations();

  const {
    showToast,
  } = useToast();


  const {
    register,
    control,
    handleSubmit,

    formState: {
      errors,
    },
  } = useForm<ContactFormValues>({
    resolver:
      zodResolver(
        contactSchema,
      ),

    values: {
      contact_type:
        contact?.contact_type ??
        "EMAIL",

      label:
        contact?.label ?? "",

      value:
        contact?.value ?? "",

      is_primary:
        contact?.is_primary ??
        false,

      display_order:
        contact?.display_order ??
        0,

      is_visible:
        contact?.is_visible ??
        true,
    },
  });


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values: ContactFormValues,
  ) => {
    const payload = {
      ...values,

      label:
        nullable(
          values.label,
        ),
    };

    try {
      if (
        editing &&
        contact
      ) {
        await updateMutation
          .mutateAsync({
            id: contact.id,
            payload,
          });
      } else {
        await createMutation
          .mutateAsync(
            payload,
          );
      }

      showToast({
        title: editing
          ? "Contact updated"
          : "Contact created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save contact",

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
          ? "Edit contact"
          : "Add contact"
      }
      description="
        Configure how this contact
        information is displayed.
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
            label="Type"
            htmlFor="contact_type"
            required
          >
            <Select
              id="contact_type"
              {...register(
                "contact_type",
              )}
            >
              <option value="EMAIL">
                Email
              </option>

              <option value="PHONE">
                Phone
              </option>

              <option value="WHATSAPP">
                WhatsApp
              </option>

              <option value="OTHER">
                Other
              </option>
            </Select>
          </FormField>

          <FormField
            label="Label"
            htmlFor="contact_label"
          >
            <Input
              id="contact_label"
              placeholder="Work email"
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
              label="Value"
              htmlFor="contact_value"
              required
              error={
                errors.value
                  ?.message
              }
            >
              <Input
                id="contact_value"
                invalid={
                  !!errors.value
                }
                {...register(
                  "value",
                )}
              />
            </FormField>
          </div>

          <FormField
            label="Display order"
            htmlFor="contact_order"
          >
            <Input
              id="contact_order"
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

        <div
          className={styles.switches}
        >
          <Controller
            control={control}
            name="is_primary"
            render={({ field }) => (
              <Switch
                checked={
                  field.value
                }
                onCheckedChange={
                  field.onChange
                }
                label="Primary contact"
              />
            )}
          />

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
              : "Add contact"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}