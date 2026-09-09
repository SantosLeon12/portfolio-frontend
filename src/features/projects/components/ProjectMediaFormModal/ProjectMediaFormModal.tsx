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

import type {
  MediaAsset,
} from "@/features/media/types/media.types";

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
  useProjectMediaMutations,
} from "../../hooks/project.mutations";

import {
  projectMediaSchema,
  type ProjectMediaFormValues,
} from "../../schemas/project.schema";

import type {
  ProjectMedia,
} from "../../types/project.types";

import styles from "../ProjectForms.module.css";


type Props = {
  open: boolean;

  projectId: number;

  assignment?:
    | ProjectMedia
    | null;

  assets:
    MediaAsset[];

  onClose: () => void;
};


function nullable(
  value: string,
) {
  return value.trim() ||
    null;
}


export function ProjectMediaFormModal({
  open,
  projectId,
  assignment,
  assets,
  onClose,
}: Props) {
  const editing =
    !!assignment;

  const {
    createMutation,
    updateMutation,
  } =
    useProjectMediaMutations(
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
    useForm<ProjectMediaFormValues>({
      resolver:
        zodResolver(
          projectMediaSchema,
        ),

      defaultValues: {
        media_asset_id: 0,

        media_role:
          "OTHER",

        alt_text: "",
        caption: "",

        display_order: 0,

        is_visible: true,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      media_asset_id:
        assignment
          ?.media_asset.id ??
        assets[0]?.id ??
        0,

      media_role:
        assignment
          ?.media_role ??
        "OTHER",

      alt_text:
        assignment
          ?.alt_text ?? "",

      caption:
        assignment
          ?.caption ?? "",

      display_order:
        assignment
          ?.display_order ?? 0,

      is_visible:
        assignment
          ?.is_visible ?? true,
    });
  }, [
    open,
    assignment,
    assets,
    reset,
  ]);


  const submit = async (
    values:
      ProjectMediaFormValues,
  ) => {
    try {
      if (
        editing &&
        assignment
      ) {
        await updateMutation
          .mutateAsync({
            projectMediaId:
              assignment.id,

            payload: {
              media_role:
                values.media_role,

              alt_text:
                nullable(
                  values.alt_text,
                ),

              caption:
                nullable(
                  values.caption,
                ),

              display_order:
                values.display_order,

              is_visible:
                values.is_visible,
            },
          });
      } else {
        await createMutation
          .mutateAsync({
            media_asset_id:
              values.media_asset_id,

            media_role:
              values.media_role,

            alt_text:
              nullable(
                values.alt_text,
              ),

            caption:
              nullable(
                values.caption,
              ),

            display_order:
              values.display_order,

            is_visible:
              values.is_visible,
          });
      }

      showToast({
        title:
          editing
            ? "Project media updated"
            : "Media added to project",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save project media",

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
          ? "Edit project media"
          : "Add project media"
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
        {editing &&
        assignment ? (
          <>
            <FormField
              label="Asset"
              htmlFor="project_media_asset"
            >
              <Input
                id="project_media_asset"
                value={
                  assignment
                    .media_asset
                    .storage_key
                }
                readOnly
              />
            </FormField>

            <input
              type="hidden"
              {...register(
                "media_asset_id",
                {
                  valueAsNumber:
                    true,
                },
              )}
            />
          </>
        ) : (
          <FormField
            label="Image"
            htmlFor="project_media_asset"
          >
            <Select
              id="project_media_asset"
              {...register(
                "media_asset_id",
                {
                  valueAsNumber:
                    true,
                },
              )}
            >
              {assets.map(
                (asset) => (
                  <option
                    key={asset.id}
                    value={asset.id}
                  >
                    #{asset.id}
                    {" — "}
                    {
                      asset.storage_key
                    }
                  </option>
                ),
              )}
            </Select>
          </FormField>
        )}

        <FormField
          label="Role"
          htmlFor="project_media_role"
        >
          <Select
            id="project_media_role"
            {...register(
              "media_role",
            )}
          >
            <option value="COVER">
              Cover
            </option>
            <option value="SCREENSHOT">
              Screenshot
            </option>
            <option value="GALLERY">
              Gallery
            </option>
            <option value="DIAGRAM">
              Diagram
            </option>
            <option value="LOGO">
              Logo
            </option>
            <option value="OTHER">
              Other
            </option>
          </Select>
        </FormField>

        <FormField
          label="Alt text"
          htmlFor="project_media_alt"
        >
          <Input
            id="project_media_alt"
            {...register(
              "alt_text",
            )}
          />
        </FormField>

        <FormField
          label="Caption"
          htmlFor="project_media_caption"
        >
          <Input
            id="project_media_caption"
            {...register(
              "caption",
            )}
          />
        </FormField>

        <FormField
          label="Display order"
          htmlFor="project_media_order"
        >
          <Input
            id="project_media_order"
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