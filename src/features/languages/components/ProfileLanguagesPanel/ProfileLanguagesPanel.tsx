"use client";

import {
  Languages,
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
  useProfileLanguageMutations,
} from "../../hooks/language.mutations";

import type {
  Language,
  ProfileLanguage,
  ProficiencyLevel,
} from "../../types/language.types";

import {
  ProfileLanguageFormModal,
} from "../ProfileLanguageFormModal/ProfileLanguageFormModal";

import styles from "../LanguageAdmin.module.css";


type Props = {
  assignments:
    ProfileLanguage[];

  languages:
    Language[];

  levels:
    ProficiencyLevel[];
};


export function ProfileLanguagesPanel({
  assignments,
  languages,
  levels,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      ProfileLanguage | null
    >(null);

  const [removing, setRemoving] =
    useState<
      ProfileLanguage | null
    >(null);


  const {
    deleteMutation,
  } =
    useProfileLanguageMutations();

  const {
    showToast,
  } = useToast();


  const availableLanguages =
    useMemo(
      () =>
        languages.filter(
          (language) =>
            !assignments.some(
              (assignment) =>
                assignment
                  .language.id ===
                language.id,
            ),
        ),
      [
        languages,
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
          assignment.language.name
            .toLowerCase()
            .includes(term) ||
          assignment
            .proficiency_level
            .code
            .toLowerCase()
            .includes(term),
      );
    }, [
      assignments,
      search,
    ]);


  const remove =
    async () => {
      if (!removing) {
        return;
      }

      try {
        await deleteMutation
          .mutateAsync(
            removing.language.id,
          );

        showToast({
          title:
            "Language removed from profile",
        });

        setRemoving(null);
      } catch (error) {
        showToast({
          title:
            "Unable to remove language",

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
            My languages
          </h2>

          <p>
            Languages displayed as
            part of your professional
            profile.
          </p>
        </div>

        <Button
          size="sm"
          disabled={
            availableLanguages
              .length === 0 ||
            levels.length === 0
          }
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus size={16} />
          Add to profile
        </Button>
      </header>

      <div
        className={styles.toolbar}
      >
        <SearchInput
          value={search}
          placeholder="Search your languages..."
          onChange={setSearch}
        />

        <span
          className={styles.count}
        >
          {filtered.length}
          {" "}
          assigned
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={
            <Languages
              size={32}
            />
          }
          title={
            search
              ? "No matching languages"
              : "No languages assigned"
          }
          description={
            !search
              ? "Add languages from the catalog to your professional profile."
              : undefined
          }
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
                  <th>Language</th>
                  <th>ISO</th>
                  <th>Level</th>
                  <th>Rank</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (assignment) => (
                    <tr
                      key={
                        assignment
                          .language
                          .id
                      }
                    >
                      <td>
                        <strong>
                          {
                            assignment
                              .language
                              .name
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          assignment
                            .language
                            .iso_code
                        }
                      </td>

                      <td>
                        <span
                          className={`${styles.badge} ${styles.code}`}
                        >
                          {
                            assignment
                              .proficiency_level
                              .code
                          }
                        </span>

                        {" "}

                        {
                          assignment
                            .proficiency_level
                            .name
                        }
                      </td>

                      <td>
                        {
                          assignment
                            .proficiency_level
                            .rank
                        }
                      </td>

                      <td>
                        {
                          assignment
                            .display_order
                        }
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
            {filtered.map(
              (assignment) => (
                <article
                  key={
                    assignment
                      .language
                      .id
                  }
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
                        {
                          assignment
                            .language
                            .name
                        }
                      </strong>

                      <span
                        className={
                          styles.muted
                        }
                      >
                        {
                          assignment
                            .language
                            .iso_code
                        }
                      </span>
                    </div>

                    <span
                      className={`${styles.badge} ${styles.code}`}
                    >
                      {
                        assignment
                          .proficiency_level
                          .code
                      }
                    </span>
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
                        assignment
                          .proficiency_level
                          .name
                      }
                    </span>

                    <span
                      className={
                        styles.badge
                      }
                    >
                      Order{" "}
                      {
                        assignment
                          .display_order
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
        </>
      )}

      <ProfileLanguageFormModal
        open={formOpen}
        assignment={editing}
        languages={
          editing
            ? languages
            : availableLanguages
        }
        levels={levels}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!removing}
        title="Remove language?"
        description={
          removing
            ? `"${removing.language.name}" will be removed from your profile. The language itself will remain in the catalog.`
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