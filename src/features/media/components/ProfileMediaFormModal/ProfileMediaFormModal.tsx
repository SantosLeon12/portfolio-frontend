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
  useProfileMediaMutations,
} from "../../hooks/media.mutations";

import {
  profileMediaSchema,
  type ProfileMediaFormValues,
} from "../../schemas/media.schema";

import type {
  MediaAsset,
  ProfileMedia,
  ProfileMediaCreatePayload,
} from "../../types/media.types";

import styles from "../MediaForms.module.css";


type Props = {
  open: boolean;

  assignment?:
    | ProfileMedia
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


export function ProfileMediaFormModal({
  open,
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
    useProfileMediaMutations();

  const {
    showToast,
  } = useToast();


  const {
    register,
    handleSubmit,
    reset,

    formState: {
      errors,
    },
  } =
    useForm<ProfileMediaFormValues>({
      resolver:
        zodResolver(
          profileMediaSchema,
        ),

      defaultValues: {
        media_asset_id: 0,

        media_role:
          "OTHER",

        alt_text: "",

        display_order: 0,
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

      display_order:
        assignment
          ?.display_order ?? 0,
    });
  }, [
    open,
    assignment,
    assets,
    reset,
  ]);


  const loading =
    createMutation.isPending ||
    updateMutation.isPending;


  const submit = async (
    values:
      ProfileMediaFormValues,
  ) => {
    try {
      if (
        editing &&
        assignment
      ) {
        await updateMutation
          .mutateAsync({
            id:
              assignment.id,

            payload: {
              media_role:
                values.media_role,

              alt_text:
                nullable(
                  values.alt_text,
                ),

              display_order:
                values.display_order,
            },
          });
      } else {
        const payload:
          ProfileMediaCreatePayload =
        {
          media_asset_id:
            values.media_asset_id,

          media_role:
            values.media_role,

          alt_text:
            nullable(
              values.alt_text,
            ),

          display_order:
            values.display_order,
        };

        await createMutation
          .mutateAsync(
            payload,
          );
      }

      showToast({
        title:
          editing
            ? "Profile media updated"
            : "Media added to profile",
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to save profile media",

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
          ? "Edit profile media"
          : "Add profile media"
      }
      description="
        Assign an uploaded image to
        a specific part of your profile.
      "
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
            <div
              className={
                styles.preview
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  assignment
                    .media_asset
                    .url
                }
                alt=""
              />
            </div>

            <FormField
              label="Media asset"
              htmlFor="profile_media_asset"
            >
              <Input
                id="profile_media_asset"
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
            htmlFor="profile_media_asset"
            required
            error={
              errors
                .media_asset_id
                ?.message
            }
          >
            <Select
              id="profile_media_asset"
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
          htmlFor="profile_media_role"
          required
        >
          <Select
            id="profile_media_role"
            {...register(
              "media_role",
            )}
          >
            <option value="AVATAR">
              Avatar
            </option>

            <option value="HERO">
              Hero
            </option>

            <option value="ABOUT">
              About
            </option>

            <option value="BACKGROUND">
              Background
            </option>

            <option value="OTHER">
              Other
            </option>
          </Select>
        </FormField>

        <FormField
          label="Alternative text"
          htmlFor="profile_media_alt"
          error={
            errors.alt_text
              ?.message
          }
          hint="
            Describe the image for
            accessibility.
          "
        >
          <Input
            id="profile_media_alt"
            placeholder="Portrait of Jorge Luis"
            {...register(
              "alt_text",
            )}
          />
        </FormField>

        <FormField
          label="Display order"
          htmlFor="profile_media_order"
        >
          <Input
            id="profile_media_order"
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
              : "Add to profile"}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}