"use client";

import {
  Layers3,
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
  EmptyState,
} from "@/shared/components/admin/EmptyState/EmptyState";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProjectSectionMutations,
} from "../../hooks/project.mutations";

import type {
  ProjectSection,
} from "../../types/project.types";

import {
  ProjectSectionFormModal,
} from "../ProjectSectionFormModal/ProjectSectionFormModal";

import {
  ProjectSectionItemsPanel,
} from "../ProjectSectionItemsPanel/ProjectSectionItemsPanel";

import styles from "../ProjectAdmin.module.css";


type Props = {
  projectId: number;

  sections:
    ProjectSection[];
};


export function ProjectSectionsPanel({
  projectId,
  sections,
}: Props) {
  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      ProjectSection | null
    >(null);

  const [deleting, setDeleting] =
    useState<
      ProjectSection | null
    >(null);


  const {
    deleteMutation,
  } =
    useProjectSectionMutations(
      projectId,
    );

  const {
    showToast,
  } = useToast();


  const ordered =
    [...sections].sort(
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
          "Section deleted",
      });

      setDeleting(null);
    } catch {
      showToast({
        title:
          "Unable to delete section",

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
              Case study sections
            </h2>

            <p>
              Build the detailed
              content of this project.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus size={16} />
            Add section
          </Button>
        </header>

        {ordered.length === 0 ? (
          <EmptyState
            icon={
              <Layers3
                size={32}
              />
            }
            title="No sections yet"
          />
        ) : (
          ordered.map(
            (section) => (
              <article
                key={section.id}
                className={
                  styles.section
                }
              >
                <div
                  className={
                    styles.cardHeader
                  }
                >
                  <div>
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
                          section.section_type
                        }
                      </span>

                      <span
                        className={
                          styles.badge
                        }
                      >
                        Order{" "}
                        {
                          section.display_order
                        }
                      </span>
                    </div>

                    <h3>
                      {section.title ??
                        section.section_type}
                    </h3>
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
                          section,
                        );

                        setFormOpen(
                          true,
                        );
                      }}
                    >
                      <Pencil
                        size={15}
                      />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setDeleting(
                          section,
                        )
                      }
                    >
                      <Trash2
                        size={15}
                      />
                    </Button>
                  </div>
                </div>

                {section.body && (
                  <div
                    className={
                      styles.sectionBody
                    }
                  >
                    {
                      section.body
                    }
                  </div>
                )}

                <ProjectSectionItemsPanel
                  projectId={
                    projectId
                  }
                  sectionId={
                    section.id
                  }
                  items={
                    section.items ??
                    []
                  }
                />
              </article>
            ),
          )
        )}
      </section>

      <ProjectSectionFormModal
        open={formOpen}
        projectId={projectId}
        section={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete section?"
        description="
          The section and its
          associated items will
          be removed.
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