"use client";

import {
  ImageIcon,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  Button,
} from "@/shared/components/admin/Button/Button";

import {
  ConfirmDialog,
} from "@/shared/components/admin/ConfirmDialog/ConfirmDialog";

import {
  EmptyState,
} from "@/shared/components/admin/EmptyState/EmptyState";

import {
  SearchInput,
} from "@/shared/components/admin/SearchInput/SearchInput";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProfileMediaMutations,
} from "../../hooks/media.mutations";

import {
  useMediaAssets,
  useProfileMedia,
} from "../../hooks/media.queries";

import type {
  ProfileMedia,
} from "../../types/media.types";

import {
  ProfileMediaFormModal,
} from "../ProfileMediaFormModal/ProfileMediaFormModal";

import styles from "../MediaAdmin.module.css";


export function ProfileMediaPanel() {
  const profileQuery =
    useProfileMedia();

  const assetsQuery =
    useMediaAssets();

  const {
    deleteMutation,
  } =
    useProfileMediaMutations();

  const {
    showToast,
  } = useToast();


  const [search, setSearch] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      ProfileMedia | null
    >(null);

  const [removing, setRemoving] =
    useState<
      ProfileMedia | null
    >(null);


  const assignments =
    profileQuery.data ?? [];

  const imageAssets =
    useMemo(
      () =>
        (
          assetsQuery.data ??
          []
        ).filter(
          (asset) =>
            asset.mime_type
              ?.startsWith(
                "image/",
              ),
        ),
      [
        assetsQuery.data,
      ],
    );


  const availableAssets =
    useMemo(
      () =>
        imageAssets.filter(
          (asset) =>
            !assignments.some(
              (assignment) =>
                assignment
                  .media_asset
                  .id ===
                asset.id,
            ),
        ),
      [
        imageAssets,
        assignments,
      ],
    );


  const filtered =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return assignments;
      }

      return assignments.filter(
        (assignment) =>
          assignment.media_role
            .toLowerCase()
            .includes(term) ||
          assignment.alt_text
            ?.toLowerCase()
            .includes(term) ||
          assignment.media_asset
            .storage_key
            .toLowerCase()
            .includes(term),
      );
    }, [
      assignments,
      search,
    ]);


  const remove = async () => {
    if (!removing) {
      return;
    }

    try {
      await deleteMutation
        .mutateAsync(
          removing.id,
        );

      showToast({
        title:
          "Media removed from profile",

        message:
          "The asset remains available in the Media Library.",
      });

      setRemoving(null);
    } catch (error) {
      showToast({
        title:
          "Unable to remove profile media",

        message:
          error instanceof Error
            ? error.message
            : undefined,

        variant:
          "error",
      });
    }
  };


  if (
    profileQuery.isLoading ||
    assetsQuery.isLoading
  ) {
    return (
      <div
        className={
          styles.state
        }
      >
        Loading profile media...
      </div>
    );
  }


  if (
    profileQuery.isError ||
    assetsQuery.isError
  ) {
    return (
      <div
        className={
          styles.errorState
        }
      >
        Unable to load profile media.
      </div>
    );
  }


  return (
    <>
      <section
        className={
          styles.panel
        }
      >
        <header
          className={
            styles.header
          }
        >
          <div>
            <h2>
              Profile media
            </h2>

            <p>
              Assign images from the
              Media Library to parts
              of your public profile.
            </p>
          </div>

          <Button
            size="sm"
            disabled={
              availableAssets
                .length === 0
            }
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus size={16} />
            Add media
          </Button>
        </header>


        <div
          className={
            styles.toolbar
          }
        >
          <SearchInput
            value={search}
            placeholder="Search profile media..."
            onChange={setSearch}
          />

          <span
            className={
              styles.count
            }
          >
            {filtered.length}
            {" "}
            assigned
          </span>
        </div>


        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <ImageIcon
                size={32}
              />
            }
            title={
              search
                ? "No matching media"
                : "No profile media"
            }
            description={
              !search
                ? "Assign an uploaded image to your profile."
                : undefined
            }
          />
        ) : (
          <div
            className={
              styles.relationGrid
            }
          >
            {filtered.map(
              (assignment) => (
                <article
                  key={
                    assignment.id
                  }
                  className={
                    styles.relationCard
                  }
                >
                  <div
                    className={
                      styles.imagePreview
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        assignment
                          .media_asset
                          .url
                      }
                      alt={
                        assignment
                          .alt_text ??
                        ""
                      }
                    />
                  </div>

                  <div
                    className={
                      styles.relationContent
                    }
                  >
                    <div
                      className={
                        styles.meta
                      }
                    >
                      <span
                        className={
                          styles.badge
                        }
                      >
                        {
                          assignment.media_role
                        }
                      </span>

                      <span
                        className={
                          styles.badge
                        }
                      >
                        Order{" "}
                        {
                          assignment.display_order
                        }
                      </span>
                    </div>

                    {assignment.alt_text && (
                      <p
                        className={
                          styles.muted
                        }
                      >
                        {
                          assignment.alt_text
                        }
                      </p>
                    )}

                    <div
                      className={
                        styles.actions
                      }
                    >
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditing(
                            assignment,
                          );

                          setFormOpen(
                            true,
                          );
                        }}
                      >
                        <Pencil
                          size={15}
                        />
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setRemoving(
                            assignment,
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />
                        Remove
                      </Button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>


      <ProfileMediaFormModal
        open={formOpen}
        assignment={editing}
        assets={
          editing
            ? imageAssets
            : availableAssets
        }
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />


      <ConfirmDialog
        open={!!removing}
        title="Remove profile media?"
        description={
          removing
            ? `"${removing.media_role}" will be removed from your profile. The original asset will remain in the Media Library.`
            : ""
        }
        loading={
          deleteMutation
            .isPending
        }
        onCancel={() =>
          setRemoving(null)
        }
        onConfirm={remove}
      />
    </>
  );
}