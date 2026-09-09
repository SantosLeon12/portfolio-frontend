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
  useProjectLinkMutations,
} from "../../hooks/project.mutations";

import {
  projectLinkSchema,
  type ProjectLinkFormValues,
} from "../../schemas/project.schema";

import type {
  ProjectLink,
} from "../../types/project.types";

import styles from "../ProjectForms.module.css";


type Props = {
  open: boolean;
  projectId: number;

  link?:
    | ProjectLink
    | null;

  onClose: () => void;
};


function nullable(
  value: string,
) {
  return value.trim() ||
    null;
}


export function ProjectLinkFormModal({
  open,
  projectId,
  link,
  onClose,
}: Props) {
  const editing =
    !!link;

  const {
    createMutation,
    updateMutation,
  } =
    useProjectLinkMutations(
      projectId,
    );

  const {
    showToast,
  } = useToast();


  const {
    register,
    control,
    reset,
    handleSubmit,

    formState: {
      errors,
    },
  } =
    useForm<ProjectLinkFormValues>({
      resolver:
        zodResolver(
          projectLinkSchema,
        ),

      defaultValues: {
        link_type:
          "OTHER",

        label: "",
        url: "",

        display_order: 0,

        is_visible: true,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      link_type:
        link
          ?.link_type ??
        "OTHER",

      label:
        link?.label ?? "",

      url:
        link?.url ?? "",

      display_order:
        link
          ?.display_order ?? 0,

      is_visible:
        link
          ?.is_visible ?? true,
    });
  }, [
    open,
    link,
    reset,
  ]);


  const submit = async (
    values:
      ProjectLinkFormValues,
  ) => {
    const payload = {
      link_type:
        values.link_type,

      label:
        nullable(
          values.label,
        ),

      url:
        values.url.trim(),

      display_order:
        values.display_order,

      is_visible:
        values.is_visible,
    };


    try {
      if (
        editing &&
        link
      ) {
        await updateMutation
          .mutateAsync({
            linkId:
              link.id,

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
            ? "Link updated"
            : "Link created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save link",

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
          ? "Edit link"
          : "Add link"
      }
      onClose={onClose}
    >
      <form
        className={
          styles.form
        }
        onSubmit={handleSubmit(
          submit,
        )}
      >
        <FormField
          label="Link type"
          htmlFor="link_type"
        >
          <Select
            id="link_type"
            {...register(
              "link_type",
            )}
          >
            <option value="REPOSITORY">
              Repository
            </option>

            <option value="LIVE_DEMO">
              Live demo
            </option>

            <option value="DOCUMENTATION">
              Documentation
            </option>

            <option value="CASE_STUDY">
              Case study
            </option>

            <option value="OTHER">
              Other
            </option>
          </Select>
        </FormField>

        <FormField
          label="Label"
          htmlFor="link_label"
        >
          <Input
            id="link_label"
            placeholder="View repository"
            {...register(
              "label",
            )}
          />
        </FormField>

        <FormField
          label="URL"
          htmlFor="link_url"
          required
          error={
            errors.url
              ?.message
          }
        >
          <Input
            id="link_url"
            placeholder="https://..."
            {...register(
              "url",
            )}
          />
        </FormField>

        <FormField
          label="Display order"
          htmlFor="link_order"
        >
          <Input
            id="link_order"
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
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
          >
            Save
          </Button>
        </footer>
      </form>
    </Modal>
  );
}