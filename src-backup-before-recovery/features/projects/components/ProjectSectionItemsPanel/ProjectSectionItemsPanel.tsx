"use client";

import {
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  Button,
} from "@/shared/components/admin/Button/Button";
import {
  ConfirmDialog,
} from "@/shared/components/admin/ConfirmDialog/ConfirmDialog";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProjectSectionItemMutations,
} from "../../hooks/project.mutations";

import type {
  ProjectSectionItem,
} from "../../types/project.types";

import {
  ProjectSectionItemFormModal,
} from "../ProjectSectionItemFormModal/ProjectSectionItemFormModal";

import styles from "../ProjectAdmin.module.css";


type Props = {
  projectId: number;
  sectionId: number;

  items:
    ProjectSectionItem[];
};


export function ProjectSectionItemsPanel({
  projectId,
  sectionId,
  items,
}: Props) {
  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      ProjectSectionItem | null
    >(null);

  const [deleting, setDeleting] =
    useState<
      ProjectSectionItem | null
    >(null);


  const {
    deleteMutation,
  } =
    useProjectSectionItemMutations(
      projectId,
      sectionId,
    );

  const {
    showToast,
  } = useToast();


  const ordered =
    [...items].sort(
      (a, b) =>
        a.display_order -
        b.display_order,
    );


  const remove = async () => {
    if (!deleting) {
      return;
    }

    try {
      await deleteMutation
        .mutateAsync(
          deleting.id,
        );

      showToast({
        title:
          "Section item deleted",
      });

      setDeleting(null);
    } catch {
      showToast({
        title:
          "Unable to delete item",

        variant:
          "error",
      });
    }
  };


  return (
    <>
      <div
        className={
          styles.items
        }
      >
        <div
          className={
            styles.cardHeader
          }
        >
          <strong>
            Items
          </strong>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus size={14} />
            Add item
          </Button>
        </div>

        {ordered.length === 0 ? (
          <p
            className={
              styles.muted
            }
          >
            No items in this
            section.
          </p>
        ) : (
          ordered.map(
            (item) => (
              <div
                key={item.id}
                className={
                  styles.item
                }
              >
                <div>
                  <p>
                    {
                      item.content
                    }
                  </p>

                  <span
                    className={
                      styles.muted
                    }
                  >
                    Order{" "}
                    {
                      item.display_order
                    }
                    {" · "}
                    {item.is_visible
                      ? "Visible"
                      : "Hidden"}
                  </span>
                </div>

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
                        item,
                      );

                      setFormOpen(
                        true,
                      );
                    }}
                  >
                    <Pencil
                      size={14}
                    />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setDeleting(
                        item,
                      )
                    }
                  >
                    <Trash2
                      size={14}
                    />
                  </Button>
                </div>
              </div>
            ),
          )
        )}
      </div>

      <ProjectSectionItemFormModal
        open={formOpen}
        projectId={projectId}
        sectionId={sectionId}
        item={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete item?"
        description="
          This section item will
          be permanently deleted.
        "
        loading={
          deleteMutation
            .isPending
        }
        onCancel={() =>
          setDeleting(null)
        }
        onConfirm={remove}
      />
    </>
  );
}