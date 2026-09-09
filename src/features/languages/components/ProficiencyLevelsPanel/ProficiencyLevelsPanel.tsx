"use client";

import {
  BarChart3,
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
  useProficiencyLevelMutations,
} from "../../hooks/language.mutations";

import type {
  ProficiencyLevel,
} from "../../types/language.types";

import {
  ProficiencyLevelFormModal,
} from "../ProficiencyLevelFormModal/ProficiencyLevelFormModal";

import styles from "../LanguageAdmin.module.css";


type Props = {
  levels:
    ProficiencyLevel[];
};


export function ProficiencyLevelsPanel({
  levels,
}: Props) {
  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      ProficiencyLevel | null
    >(null);

  const [deleting, setDeleting] =
    useState<
      ProficiencyLevel | null
    >(null);


  const {
    deleteMutation,
  } =
    useProficiencyLevelMutations();

  const {
    showToast,
  } = useToast();


  const orderedLevels =
    [...levels].sort(
      (a, b) =>
        a.rank - b.rank,
    );


  const remove =
    async () => {
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
            "Proficiency level deleted",
        });

        setDeleting(null);
      } catch (error) {
        showToast({
          title:
            "Unable to delete proficiency level",

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
            Proficiency levels
          </h2>

          <p>
            Define the scale used
            when assigning language
            proficiency.
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
          Add level
        </Button>
      </header>

      {orderedLevels.length ===
      0 ? (
        <EmptyState
          icon={
            <BarChart3
              size={32}
            />
          }
          title="No proficiency levels"
        />
      ) : (
        <>
          <div
            className={
              styles.desktopTable
            }
          >
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Rank</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {orderedLevels.map(
                  (level) => (
                    <tr
                      key={level.id}
                    >
                      <td>
                        <span
                          className={`${styles.badge} ${styles.code}`}
                        >
                          {
                            level.code
                          }
                        </span>
                      </td>

                      <td>
                        <strong>
                          {level.name}
                        </strong>
                      </td>

                      <td>
                        {level.rank}
                      </td>

                      <td>
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
                                level,
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
                                level,
                              )
                            }
                          >
                            <Trash2
                              size={15}
                            />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>

          <div
            className={
              styles.mobileCards
            }
          >
            {orderedLevels.map(
              (level) => (
                <article
                  key={level.id}
                  className={
                    styles.card
                  }
                >
                  <div
                    className={
                      styles.cardHeader
                    }
                  >
                    <div>
                      <strong>
                        {level.name}
                      </strong>

                      <div
                        className={
                          styles.meta
                        }
                      >
                        <span
                          className={`${styles.badge} ${styles.code}`}
                        >
                          {
                            level.code
                          }
                        </span>

                        <span
                          className={
                            styles.badge
                          }
                        >
                          Rank{" "}
                          {level.rank}
                        </span>
                      </div>
                    </div>
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
                          level,
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
                          level,
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
        </>
      )}

      <ProficiencyLevelFormModal
        open={formOpen}
        level={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete proficiency level?"
        description={
          deleting
            ? `"${deleting.code} — ${deleting.name}" will be permanently deleted. Levels currently assigned to a language cannot be removed.`
            : ""
        }
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