"use client";

import {
  Images,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import type {
  MediaAsset,
} from "@/features/media/types/media.types";

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
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProjectMediaMutations,
} from "../../hooks/project.mutations";

import type {
  ProjectMedia,
} from "../../types/project.types";

import {
  ProjectMediaFormModal,
} from "../ProjectMediaFormModal/ProjectMediaFormModal";

import styles from "../ProjectAdmin.module.css";


type Props = {
  projectId: number;

  assignments:
    ProjectMedia[];

  assets:
    MediaAsset[];
};


export function ProjectMediaPanel({
  projectId,
  assignments,
  assets,
}: Props) {
  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      ProjectMedia | null
    >(null);

  const [removing, setRemoving] =
    useState<
      ProjectMedia | null
    >(null);


  const {
    deleteMutation,
  } =
    useProjectMediaMutations(
      projectId,
    );

  const {
    showToast,
  } = useToast();


  const imageAssets =
    useMemo(
      () =>
        assets.filter(
          (asset) =>
            asset.mime_type
              ?.startsWith(
                "image/",
              ),
        ),
      [assets],
    );


  const available =
    useMemo(
      () =>
        imageAssets.filter(
          (asset) =>
            !assignments.some(
              (assignment) =>
                assignment
                  .media_asset.id ===
                asset.id,
            ),
        ),
      [
        imageAssets,
        assignments,
      ],
    );


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
          "Media removed",
      });

      setRemoving(null);
    } catch {
      showToast({
        title:
          "Unable to remove media",

        variant:
          "error",
      });
    }
  };


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
              Project media
            </h2>

            <p>
              Covers, screenshots,
              galleries and diagrams.
            </p>
          </div>

          <Button
            size="sm"
            disabled={
              available.length ===
              0
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

        {assignments.length ===
        0 ? (
          <EmptyState
            icon={
              <Images size={32} />
            }
            title="No project media"
          />
        ) : (
          <div
            className={
              styles.grid
            }
          >
            {assignments.map(
              (assignment) => (
                <article
                  key={
                    assignment.id
                  }
                  className={
                    styles.card
                  }
                >
                  <div
                    className={
                      styles.mediaPreview
                    }
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        assignment
                          .media_asset.url
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

                  {assignment.caption && (
                    <p
                      className={
                        styles.muted
                      }
                    >
                      {
                        assignment.caption
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
                </article>
              ),
            )}
          </div>
        )}
      </section>

      <ProjectMediaFormModal
        open={formOpen}
        projectId={projectId}
        assignment={editing}
        assets={
          editing
            ? imageAssets
            : available
        }
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!removing}
        title="Remove project media?"
        description="
          The media relation will be
          removed. The original asset
          remains in Media Library.
        "
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