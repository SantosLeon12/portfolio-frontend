"use client";

import {
  FolderKanban,
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
  useProjectCategoryCatalogMutations,
} from "../../hooks/project.mutations";

import type {
  ProjectCategory,
} from "../../types/project.types";

import {
  ProjectCategoryFormModal,
} from "../ProjectCategoryFormModal/ProjectCategoryFormModal";

import styles from "../ProjectAdmin.module.css";


type Props = {
  categories:
    ProjectCategory[];
};


export function ProjectCategoryCatalogPanel({
  categories,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      ProjectCategory | null
    >(null);

  const [deleting, setDeleting] =
    useState<
      ProjectCategory | null
    >(null);


  const {
    deleteMutation,
  } =
    useProjectCategoryCatalogMutations();

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
              Project categories
            </h2>

            <p>
              Manage the reusable
              category catalog.
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
          className={
            styles.toolbar
          }
        >
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search categories..."
          />

          <span
            className={
              styles.count
            }
          >
            {filtered.length}
            {" "}
            categories
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <FolderKanban
                size={32}
              />
            }
            title="No categories"
          />
        ) : (
          <div
            className={
              styles.grid
            }
          >
            {filtered.map(
              (category) => (
                <article
                  key={
                    category.id
                  }
                  className={
                    styles.card
                  }
                >
                  <div>
                    <strong>
                      {
                        category.name
                      }
                    </strong>

                    <p
                      className={
                        styles.muted
                      }
                    >
                      /
                      {
                        category.slug
                      }
                    </p>
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
        )}
      </section>

      <ProjectCategoryFormModal
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
            ? `"${deleting.name}" can only be deleted if no project is using it.`
            : ""
        }
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