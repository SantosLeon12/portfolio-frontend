"use client";

import {
  ListChecks,
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
  useExperienceHighlightMutations,
} from "../../hooks/professional.mutations";

import type {
  ExperienceHighlight,
} from "../../types/professional.types";

import {
  ExperienceHighlightFormModal,
} from "../ExperienceHighlightFormModal/ExperienceHighlightFormModal";

import styles from "../ProfessionalAdmin.module.css";


type Props = {
  experienceId:
    number;

  highlights:
    ExperienceHighlight[];
};


export function ExperienceHighlightsPanel({
  experienceId,
  highlights,
}: Props) {
  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      ExperienceHighlight | null
    >(null);

  const [deleting, setDeleting] =
    useState<
      ExperienceHighlight | null
    >(null);


  const {
    deleteMutation,
  } =
    useExperienceHighlightMutations(
      experienceId,
    );

  const {
    showToast,
  } = useToast();


  const ordered =
    [...highlights].sort(
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
          "Highlight deleted",
      });

      setDeleting(null);
    } catch (error) {
      showToast({
        title:
          "Unable to delete highlight",

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
          <h2>Highlights</h2>

          <p>
            Important achievements,
            responsibilities and
            contributions from this role.
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
          Add highlight
        </Button>
      </header>

      {ordered.length === 0 ? (
        <EmptyState
          icon={
            <ListChecks
              size={32}
            />
          }
          title="No highlights yet"
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
            (highlight) => (
              <article
                key={
                  highlight.id
                }
                className={
                  styles.card
                }
              >
                <p>
                  {
                    highlight.content
                  }
                </p>

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
                      highlight.display_order
                    }
                  </span>

                  <span
                    className={`${styles.badge} ${
                      highlight.is_visible
                        ? styles.visible
                        : styles.hidden
                    }`}
                  >
                    {highlight.is_visible
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
                        highlight,
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
                      setDeleting(
                        highlight,
                      )
                    }
                  >
                    <Trash2
                      size={15}
                    />
                    Delete
                  </Button>
                </div>
              </article>
            ),
          )}
        </div>
      )}

      <ExperienceHighlightFormModal
        open={formOpen}
        experienceId={
          experienceId
        }
        highlight={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete highlight?"
        description="
          This highlight will be
          permanently removed.
        "
        loading={
          deleteMutation.isPending
        }
        onCancel={() =>
          setDeleting(null)
        }
        onConfirm={remove}
      />
    </section>
  );
}