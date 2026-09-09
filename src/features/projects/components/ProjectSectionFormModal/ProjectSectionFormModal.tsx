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
  Textarea,
} from "@/shared/components/admin/Textarea/Textarea";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProjectSectionMutations,
} from "../../hooks/project.mutations";

import {
  projectSectionSchema,
  type ProjectSectionFormValues,
} from "../../schemas/project.schema";

import type {
  ProjectSection,
} from "../../types/project.types";

import styles from "../ProjectForms.module.css";


type Props = {
  open: boolean;
  projectId: number;

  section?:
    | ProjectSection
    | null;

  onClose: () => void;
};


function nullable(
  value: string,
) {
  return value.trim() ||
    null;
}


export function ProjectSectionFormModal({
  open,
  projectId,
  section,
  onClose,
}: Props) {
  const editing =
    !!section;

  const {
    createMutation,
    updateMutation,
  } =
    useProjectSectionMutations(
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
  } =
    useForm<ProjectSectionFormValues>({
      resolver:
        zodResolver(
          projectSectionSchema,
        ),

      defaultValues: {
        section_type:
          "OVERVIEW",

        title: "",
        body: "",

        display_order: 0,

        is_visible: true,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      section_type:
        section
          ?.section_type ??
        "OVERVIEW",

      title:
        section?.title ?? "",

      body:
        section?.body ?? "",

      display_order:
        section
          ?.display_order ?? 0,

      is_visible:
        section
          ?.is_visible ?? true,
    });
  }, [
    open,
    section,
    reset,
  ]);


  const submit = async (
    values:
      ProjectSectionFormValues,
  ) => {
    const payload = {
      section_type:
        values.section_type,

      title:
        nullable(
          values.title,
        ),

      body:
        nullable(
          values.body,
        ),

      display_order:
        values.display_order,

      is_visible:
        values.is_visible,
    };


    try {
      if (
        editing &&
        section
      ) {
        await updateMutation
          .mutateAsync({
            sectionId:
              section.id,

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
            ? "Section updated"
            : "Section created",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save section",

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
          ? "Edit section"
          : "Add section"
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
          label="Section type"
          htmlFor="section_type"
        >
          <Select
            id="section_type"
            {...register(
              "section_type",
            )}
          >
            <option value="OVERVIEW">
              Overview
            </option>
            <option value="PROBLEM">
              Problem
            </option>
            <option value="RESPONSIBILITIES">
              Responsibilities
            </option>
            <option value="SOLUTION">
              Solution
            </option>
            <option value="ARCHITECTURE">
              Architecture
            </option>
            <option value="CHALLENGES">
              Challenges
            </option>
            <option value="RESULTS">
              Results
            </option>
            <option value="LEARNINGS">
              Learnings
            </option>
            <option value="CUSTOM">
              Custom
            </option>
          </Select>
        </FormField>

        <FormField
          label="Title"
          htmlFor="section_title"
        >
          <Input
            id="section_title"
            {...register(
              "title",
            )}
          />
        </FormField>

        <FormField
          label="Body"
          htmlFor="section_body"
        >
          <Textarea
            id="section_body"
            rows={6}
            {...register(
              "body",
            )}
          />
        </FormField>

        <FormField
          label="Display order"
          htmlFor="section_order"
        >
          <Input
            id="section_order"
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

          <Button type="submit">
            Save
          </Button>
        </footer>
      </form>
    </Modal>
  );
}