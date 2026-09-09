"use client";

import {
  Code2,
  ExternalLink,
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
  Select,
} from "@/shared/components/admin/Select/Select";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useTechnologyMutations,
} from "../../hooks/technology.mutations";

import type {
  Technology,
  TechnologyCategory,
} from "../../types/technology.types";

import {
  TechnologyFormModal,
} from "../TechnologyFormModal/TechnologyFormModal";

import styles from "../TechnologyAdmin.module.css";


type Props = {
  technologies:
    Technology[];

  categories:
    TechnologyCategory[];
};


export function TechnologiesPanel({
  technologies,
  categories,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [
    categoryFilter,
    setCategoryFilter,
  ] =
    useState("all");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<Technology | null>(
      null,
    );

  const [deleting, setDeleting] =
    useState<Technology | null>(
      null,
    );


  const {
    deleteMutation,
  } = useTechnologyMutations();

  const {
    showToast,
  } = useToast();


  const getCategoryName = (
    technology: Technology,
  ) =>
    technology.category?.name ??
    categories.find(
      (category) =>
        category.id ===
        technology.technology_category_id,
    )?.name ??
    "Unknown";


  const filtered =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      return technologies.filter(
        (technology) => {
          const matchesSearch =
            !term ||
            technology.name
              .toLowerCase()
              .includes(term) ||
            technology.slug
              .toLowerCase()
              .includes(term);

          const matchesCategory =
            categoryFilter ===
              "all" ||
            technology.technology_category_id ===
              Number(
                categoryFilter,
              );

          return (
            matchesSearch &&
            matchesCategory
          );
        },
      );
    }, [
      technologies,
      search,
      categoryFilter,
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
          "Technology deleted",
      });

      setDeleting(null);
    } catch (error) {
      showToast({
        title:
          "Unable to delete technology",

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
            Technology catalog
          </h2>

          <p>
            Technologies available
            throughout your portfolio.
          </p>
        </div>

        <Button
          size="sm"
          disabled={
            categories.length === 0
          }
          title={
            categories.length === 0
              ? "Create a category first"
              : undefined
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

      <div
        className={styles.toolbar}
      >
        <div
          className={
            styles.filters
          }
        >
          <SearchInput
            value={search}
            placeholder="Search technologies..."
            onChange={setSearch}
          />

          <Select
            value={categoryFilter}
            onChange={(event) =>
              setCategoryFilter(
                event.target.value,
              )
            }
          >
            <option value="all">
              All categories
            </option>

            {categories.map(
              (category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ),
            )}
          </Select>
        </div>

        <span
          className={styles.count}
        >
          {filtered.length}
          {" "}
          {filtered.length === 1
            ? "technology"
            : "technologies"}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Code2 size={32} />}
          title={
            search ||
            categoryFilter !== "all"
              ? "No matching technologies"
              : "No technologies yet"
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
                  <th>Technology</th>
                  <th>Category</th>
                  <th>Official site</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map(
                  (technology) => (
                    <tr
                      key={
                        technology.id
                      }
                    >
                      <td>
                        <strong>
                          {
                            technology.name
                          }
                        </strong>

                        <span
                          className={
                            styles.slug
                          }
                        >
                          {
                            technology.slug
                          }
                        </span>
                      </td>

                      <td>
                        <span
                          className={
                            styles.badge
                          }
                        >
                          {getCategoryName(
                            technology,
                          )}
                        </span>
                      </td>

                      <td>
                        {technology.official_url ? (
                          <a
                            href={
                              technology.official_url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className={
                              styles.link
                            }
                          >
                            Visit

                            <ExternalLink
                              size={14}
                            />
                          </a>
                        ) : (
                          <span
                            className={
                              styles.muted
                            }
                          >
                            —
                          </span>
                        )}
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
                                technology,
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
                                technology,
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
              (technology) => (
                <article
                  key={technology.id}
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
                          technology.name
                        }
                      </strong>

                      <span
                        className={
                          styles.slug
                        }
                      >
                        {
                          technology.slug
                        }
                      </span>
                    </div>

                    <span
                      className={
                        styles.badge
                      }
                    >
                      {getCategoryName(
                        technology,
                      )}
                    </span>
                  </div>

                  {technology.official_url && (
                    <a
                      href={
                        technology.official_url
                      }
                      target="_blank"
                      rel="noreferrer"
                      className={
                        styles.link
                      }
                    >
                      Official website

                      <ExternalLink
                        size={14}
                      />
                    </a>
                  )}

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
                          technology,
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
                          technology,
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

      <TechnologyFormModal
        open={formOpen}
        technology={editing}
        categories={categories}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete technology?"
        description={
          deleting
            ? `"${deleting.name}" will be permanently deleted. Technologies currently used by your profile, experience or projects cannot be removed.`
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