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
  useLanguageMutations,
} from "../../hooks/language.mutations";

import type {
  Language,
} from "../../types/language.types";

import {
  LanguageFormModal,
} from "../LanguageFormModal/LanguageFormModal";

import styles from "../LanguageAdmin.module.css";


type Props = {
  languages:
    Language[];
};


export function LanguagesPanel({
  languages,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<Language | null>(
      null,
    );

  const [deleting, setDeleting] =
    useState<Language | null>(
      null,
    );


  const {
    deleteMutation,
  } =
    useLanguageMutations();

  const {
    showToast,
  } = useToast();


  const filtered =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return languages;
      }

      return languages.filter(
        (language) =>
          language.name
            .toLowerCase()
            .includes(term) ||
          language.iso_code
            .toLowerCase()
            .includes(term),
      );
    }, [
      languages,
      search,
    ]);


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
            "Language deleted",
        });

        setDeleting(null);
      } catch (error) {
        showToast({
          title:
            "Unable to delete language",

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
            Language catalog
          </h2>

          <p>
            Languages available for
            use in your professional
            profile.
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
          Add language
        </Button>
      </header>

      <div
        className={styles.toolbar}
      >
        <SearchInput
          value={search}
          placeholder="Search languages..."
          onChange={setSearch}
        />

        <span
          className={styles.count}
        >
          {filtered.length}
          {" "}
          {filtered.length === 1
            ? "language"
            : "languages"}
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
              : "No languages yet"
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
                  <th>ISO code</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (language) => (
                    <tr
                      key={
                        language.id
                      }
                    >
                      <td>
                        <strong>
                          {
                            language.name
                          }
                        </strong>
                      </td>

                      <td>
                        <span
                          className={`${styles.badge} ${styles.code}`}
                        >
                          {
                            language.iso_code
                          }
                        </span>
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
                                language,
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
                                language,
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
              (language) => (
                <article
                  key={language.id}
                  className={
                    styles.card
                  }
                >
                  <div
                    className={
                      styles.cardHeader
                    }
                  >
                    <strong>
                      {language.name}
                    </strong>

                    <span
                      className={`${styles.badge} ${styles.code}`}
                    >
                      {
                        language.iso_code
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
                          language,
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
                          language,
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

      <LanguageFormModal
        open={formOpen}
        language={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete language?"
        description={
          deleting
            ? `"${deleting.name}" will be permanently deleted. Languages currently assigned to your profile cannot be removed.`
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