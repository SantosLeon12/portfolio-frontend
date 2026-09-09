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
  useProfileDocumentMutations,
} from "../../hooks/media.mutations";

import {
  profileDocumentSchema,
  type ProfileDocumentFormValues,
} from "../../schemas/media.schema";

import type {
  MediaAsset,
  ProfileDocument,
  ProfileDocumentCreatePayload,
} from "../../types/media.types";

import styles from "../MediaForms.module.css";


type Props = {
  open: boolean;

  document?:
    | ProfileDocument
    | null;

  assets:
    MediaAsset[];

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


export function ProfileDocumentFormModal({
  open,
  document,
  assets,
  onClose,
}: Props) {
  const editing =
    !!document;

  const {
    createMutation,
    updateMutation,
  } =
    useProfileDocumentMutations();

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
    useForm<ProfileDocumentFormValues>({
      resolver:
        zodResolver(
          profileDocumentSchema,
        ),

      defaultValues: {
        media_asset_id: 0,

        document_type:
          "OTHER",

        title: "",

        version: "",

        is_current: false,
      },
    });


  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      media_asset_id:
        document
          ?.media_asset.id ??
        assets[0]?.id ??
        0,

      document_type:
        document
          ?.document_type ??
        "OTHER",

      title:
        document?.title ?? "",

      version:
        document?.version ?? "",

      is_current:
        document
          ?.is_current ?? false,
    });
  }, [
    open,
    document,
    assets,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      ProfileDocumentFormValues,
  ) => {
    try {
      if (
        editing &&
        document
      ) {
        await updateMutation
          .mutateAsync({
            id:
              document.id,

            payload: {
              document_type:
                values.document_type,

              title:
                values.title.trim(),

              version:
                nullable(
                  values.version,
                ),

              is_current:
                values.is_current,
            },
          });
      } else {
        const payload:
          ProfileDocumentCreatePayload =
        {
          media_asset_id:
            values.media_asset_id,

          document_type:
            values.document_type,

          title:
            values.title.trim(),

          version:
            nullable(
              values.version,
            ),

          is_current:
            values.is_current,
        };

        await createMutation
          .mutateAsync(
            payload,
          );
      }

      showToast({
        title:
          editing
            ? "Document updated"
            : "Document added to profile",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save document",

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
          ? "Edit document"
          : "Add profile document"
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
        document ? (
          <>
            <FormField
              label="Media asset"
              htmlFor="document_asset"
            >
              <Input
                id="document_asset"
                value={
                  document
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
            label="File"
            htmlFor="document_asset"
            required
          >
            <Select
              id="document_asset"
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
                    {" — "}
                    {
                      asset.mime_type ??
                      "Unknown"
                    }
                  </option>
                ),
              )}
            </Select>
          </FormField>
        )}

        <div
          className={
            styles.grid
          }
        >
          <FormField
            label="Document type"
            htmlFor="document_type"
            required
          >
            <Select
              id="document_type"
              {...register(
                "document_type",
              )}
            >
              <option value="CV">
                CV
              </option>

              <option value="RESUME">
                Resume
              </option>

              <option value="CERTIFICATE">
                Certificate
              </option>

              <option value="OTHER">
                Other
              </option>
            </Select>
          </FormField>

          <FormField
            label="Version"
            htmlFor="document_version"
            error={
              errors.version
                ?.message
            }
          >
            <Input
              id="document_version"
              placeholder="2026"
              {...register(
                "version",
              )}
            />
          </FormField>
        </div>

        <FormField
          label="Title"
          htmlFor="document_title"
          required
          error={
            errors.title
              ?.message
          }
        >
          <Input
            id="document_title"
            placeholder="Jorge Luis — CV"
            {...register(
              "title",
            )}
          />
        </FormField>

        <Controller
          control={control}
          name="is_current"
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
              label="Current version"
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
              : "Add document"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}