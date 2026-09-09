"use client";

import {
  Code2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import type {
  Technology,
} from "@/features/technologies/types/technology.types";

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
  useProjectTechnologyMutations,
} from "../../hooks/project.mutations";

import type {
  ProjectTechnology,
} from "../../types/project.types";

import {
  ProjectTechnologyFormModal,
} from "../ProjectTechnologyFormModal/ProjectTechnologyFormModal";

import styles from "../ProjectAdmin.module.css";


type Props = {
  projectId: number;

  assignments:
    ProjectTechnology[];

  technologies:
    Technology[];
};


export function ProjectTechnologiesPanel({
  projectId,
  assignments,
  technologies,
}: Props) {
  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      ProjectTechnology | null
    >(null);

  const [removing, setRemoving] =
    useState<
      ProjectTechnology | null
    >(null);


  const {
    deleteMutation,
  } =
    useProjectTechnologyMutations(
      projectId,
    );

  const {
    showToast,
  } = useToast();


  const available =
    useMemo(
      () =>
        technologies.filter(
          (technology) =>
            !assignments.some(
              (assignment) =>
                assignment
                  .technology.id ===
                technology.id,
            ),
        ),
      [
        technologies,
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
          removing
            .technology.id,
        );

      showToast({
        title:
          "Technology removed",
      });

      setRemoving(null);
    } catch (error) {
      showToast({
        title:
          "Unable to remove technology",

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
              Technologies
            </h2>

            <p>
              Technologies used
              to build this project.
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
            Add technology
          </Button>
        </header>

        {assignments.length ===
        0 ? (
          <EmptyState
            icon={
              <Code2 size={32} />
            }
            title="No technologies assigned"
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
                    assignment
                      .technology.id
                  }
                  className={
                    styles.card
                  }
                >
                  <strong>
                    {
                      assignment
                        .technology.name
                    }
                  </strong>

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

      <ProjectTechnologyFormModal
        open={formOpen}
        projectId={projectId}
        assignment={editing}
        technologies={
          editing
            ? technologies
            : available
        }
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!removing}
        title="Remove technology?"
        description={
          removing
            ? `"${removing.technology.name}" will be detached from the project.`
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