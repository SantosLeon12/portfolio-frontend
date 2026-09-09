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

import type {
  Technology,
} from "@/features/technologies/types/technology.types";

import {
  useExperienceTechnologyMutations,
} from "../../hooks/professional.mutations";

import type {
  ExperienceTechnology,
} from "../../types/professional.types";

import {
  ExperienceTechnologyFormModal,
} from "../ExperienceTechnologyFormModal/ExperienceTechnologyFormModal";

import styles from "../ProfessionalAdmin.module.css";


type Props = {
  experienceId:
    number;

  assignments:
    ExperienceTechnology[];

  technologies:
    Technology[];
};


export function ExperienceTechnologiesPanel({
  experienceId,
  assignments,
  technologies,
}: Props) {
  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      ExperienceTechnology | null
    >(null);

  const [removing, setRemoving] =
    useState<
      ExperienceTechnology | null
    >(null);


  const {
    deleteMutation,
  } =
    useExperienceTechnologyMutations(
      experienceId,
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
                  .technology
                  .id ===
                technology.id,
            ),
        ),
      [
        technologies,
        assignments,
      ],
    );


  const ordered =
    [...assignments].sort(
      (a, b) =>
        a.display_order -
        b.display_order,
    );


  const remove = async () => {
    if (!removing) {
      return;
    }

    try {
      await deleteMutation
        .mutateAsync(
          removing
            .technology
            .id,
        );

      showToast({
        title:
          "Technology removed from experience",
      });

      setRemoving(null);
    } catch (error) {
      showToast({
        title:
          "Unable to remove technology",

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
    <section
      className={styles.panel}
    >
      <header
        className={styles.header}
      >
        <div
          className={styles.heading}
        >
          <h2>
            Technologies used
          </h2>

          <p>
            Associate technologies
            that were used during
            this professional role.
          </p>
        </div>

        <Button
          size="sm"
          disabled={
            available.length === 0
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

      {ordered.length === 0 ? (
        <EmptyState
          icon={
            <Code2 size={32} />
          }
          title="No technologies assigned"
        />
      ) : (
        <div
          className={
            styles.mobileCards
          }
          style={{
            display: "grid",
          }}
        >
          {ordered.map(
            (assignment) => (
              <article
                key={
                  assignment
                    .technology
                    .id
                }
                className={
                  styles.card
                }
              >
                <strong>
                  {
                    assignment
                      .technology
                      .name
                  }
                </strong>

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
                    Order{" "}
                    {
                      assignment.display_order
                    }
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

      <ExperienceTechnologyFormModal
        open={formOpen}
        experienceId={
          experienceId
        }
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
            ? `"${removing.technology.name}" will be removed from this experience.`
            : ""
        }
        loading={
          deleteMutation.isPending
        }
        onCancel={() =>
          setRemoving(null)
        }
        onConfirm={remove}
      />
    </section>
  );
}