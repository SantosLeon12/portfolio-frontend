"use client";

import {
  FolderTree,
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
  useTechnologyCategoryMutations,
} from "../../hooks/technology.mutations";

import type {
  TechnologyCategory,
} from "../../types/technology.types";

import {
  TechnologyCategoryFormModal,
} from "../TechnologyCategoryFormModal/TechnologyCategoryFormModal";

import styles from "../TechnologyAdmin.module.css";


type Props = {
  categories:
    TechnologyCategory[];
};


export function TechnologyCategoriesPanel({
  categories,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      TechnologyCategory | null
    >(null);

  const [deleting, setDeleting] =
    useState<
      TechnologyCategory | null
    >(null);


  const {
    deleteMutation,
  } =
    useTechnologyCategoryMutations();

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
        return categories;
      }

      return categories.filter(
        (category) =>
          category.name
            .toLowerCase()
            .includes(term) ||
          category.slug
            .toLowerCase()
            .includes(term),
      );
    }, [
      categories,
      search,
    ]);


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
          "Category deleted",
      });

      setDeleting(null);
    } catch (error) {
      showToast({
        title:
          "Unable to delete category",

        message:
          error instanceof Error
            ? error.message
            : undefined,

        variant: "error",
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
            Technology categories
          </h2>

          <p>
            Organize technologies
            into areas such as
            Backend, Frontend or
            Databases.
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
          Add category
        </Button>
      </header>

      <div
        className={styles.toolbar}
      >
        <SearchInput
          value={search}
          placeholder="Search categories..."
          onChange={setSearch}
        />

        <span
          className={styles.count}
        >
          {filtered.length}
          {" "}
          {filtered.length === 1
            ? "category"
            : "categories"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={
            <FolderTree
              size={32}
            />
          }
          title={
            search
              ? "No matching categories"
              : "No categories yet"
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
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (category) => (
                    <tr
                      key={
                        category.id
                      }
                    >
                      <td>
                        <strong>
                          {
                            category.name
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          category.slug
                        }
                      </td>

                      <td>
                        {
                          category.display_order
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
                                category,
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
                                category,
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
              (category) => (
                <article
                  key={category.id}
                  className={
                    styles.card
                  }
                >
                  <div>
                    <strong>
                      {category.name}
                    </strong>

                    <span
                      className={
                        styles.slug
                      }
                    >
                      {category.slug}
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
                      Order{" "}
                      {
                        category.display_order
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
                          category,
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
                          category,
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

      <TechnologyCategoryFormModal
        open={formOpen}
        category={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete category?"
        description={
          deleting
            ? `"${deleting.name}" will be permanently deleted. Categories currently used by technologies cannot be removed.`
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