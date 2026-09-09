"use client";

import {
  FolderKanban,
  Pencil,
  Plus,
  Settings2,
  Star,
  Trash2,
} from "lucide-react";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import {
  useOrganizations,
} from "@/features/organizations/hooks/useOrganizations";

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
  PageHeader,
} from "@/shared/components/admin/PageHeader/PageHeader";
import {
  SearchInput,
} from "@/shared/components/admin/SearchInput/SearchInput";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProjectMutations,
} from "../../hooks/project.mutations";

import {
  useProjectCategories,
  useProjects,
} from "../../hooks/project.queries";

import type {
  Project,
} from "../../types/project.types";

import {
  ProjectCategoryCatalogPanel,
} from "../ProjectCategoryCatalogPanel/ProjectCategoryCatalogPanel";

import {
  ProjectFormModal,
} from "../ProjectFormModal/ProjectFormModal";

import styles from "../ProjectAdmin.module.css";

import managerStyles from "./ProjectsManager.module.css";


type Tab =
  | "projects"
  | "categories";


export function ProjectsManager() {
  const [tab, setTab] =
    useState<Tab>(
      "projects",
    );

  const projectsQuery =
    useProjects();

  const categoriesQuery =
    useProjectCategories();

  const organizationsQuery =
    useOrganizations();

  const {
    deleteMutation,
  } =
    useProjectMutations();

  const {
    showToast,
  } = useToast();


  const [search, setSearch] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<Project | null>(
      null,
    );

  const [deleting, setDeleting] =
    useState<Project | null>(
      null,
    );


  const projects =
    projectsQuery.data ?? [];

  const organizations =
    organizationsQuery.data ??
    [];

  const categories =
    categoriesQuery.data ??
    [];


  const filtered =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return projects;
      }

      return projects.filter(
        (project) =>
          project.title
            .toLowerCase()
            .includes(term) ||
          project.slug
            .toLowerCase()
            .includes(term),
      );
    }, [
      projects,
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
          "Project deleted",
      });

      setDeleting(null);
    } catch (error) {
      showToast({
        title:
          "Unable to delete project",

        message:
          error instanceof Error
            ? error.message
            : undefined,

        variant:
          "error",
      });
    }
  };


  if (
    projectsQuery.isLoading ||
    categoriesQuery.isLoading ||
    organizationsQuery.isLoading
  ) {
    return (
      <div
        className={
          managerStyles.state
        }
      >
        Loading projects...
      </div>
    );
  }


  return (
    <div
      className={
        managerStyles.page
      }
    >
      <PageHeader
        eyebrow="Portfolio"
        title="Projects"
        description="
          Manage your projects,
          case studies and their
          related portfolio content.
        "
      />

      <div
        className={
          managerStyles.tabs
        }
      >
        <button
          type="button"
          className={
            tab === "projects"
              ? managerStyles.activeTab
              : ""
          }
          onClick={() =>
            setTab(
              "projects",
            )
          }
        >
          Projects
          <span>
            {projects.length}
          </span>
        </button>

        <button
          type="button"
          className={
            tab === "categories"
              ? managerStyles.activeTab
              : ""
          }
          onClick={() =>
            setTab(
              "categories",
            )
          }
        >
          Categories
          <span>
            {categories.length}
          </span>
        </button>
      </div>


      {tab === "categories" ? (
        <ProjectCategoryCatalogPanel
          categories={
            categories
          }
        />
      ) : (
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
                  Portfolio projects
                </h2>

                <p>
                  Projects displayed
                  and managed through
                  your portfolio.
                </p>
              </div>

              <Button
                onClick={() => {
                  setEditing(null);
                  setFormOpen(
                    true,
                  );
                }}
              >
                <Plus
                  size={16}
                />
                Add project
              </Button>
            </header>

            <div
              className={
                styles.toolbar
              }
            >
              <SearchInput
                value={search}
                onChange={
                  setSearch
                }
                placeholder="Search projects..."
              />

              <span
                className={
                  styles.count
                }
              >
                {
                  filtered.length
                }
                {" "}
                projects
              </span>
            </div>

            {filtered.length ===
            0 ? (
              <EmptyState
                icon={
                  <FolderKanban
                    size={32}
                  />
                }
                title="No projects"
              />
            ) : (
              <div
                className={
                  styles.grid
                }
              >
                {filtered.map(
                  (project) => (
                    <article
                      key={
                        project.id
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
                              project.title
                            }
                          </strong>

                          <p
                            className={
                              styles.muted
                            }
                          >
                            /
                            {
                              project.slug
                            }
                          </p>
                        </div>

                        {project.featured && (
                          <Star
                            size={17}
                          />
                        )}
                      </div>

                      {project.short_description && (
                        <p
                          className={
                            styles.muted
                          }
                        >
                          {
                            project.short_description
                          }
                        </p>
                      )}

                      <div
                        className={
                          styles.meta
                        }
                      >
                        <span
                          className={`${styles.badge} ${
                            project.status ===
                            "PUBLISHED"
                              ? styles.success
                              : ""
                          }`}
                        >
                          {
                            project.status
                          }
                        </span>

                        <span
                          className={
                            styles.badge
                          }
                        >
                          {
                            project.categories
                              .length
                          }
                          {" "}
                          categories
                        </span>

                        <span
                          className={
                            styles.badge
                          }
                        >
                          {
                            project.technologies
                              .length
                          }
                          {" "}
                          technologies
                        </span>
                      </div>

                      <div
                        className={
                          styles.actions
                        }
                      >
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className={
                            styles.manageLink
                          }
                        >
                          <Settings2
                            size={15}
                          />
                          Manage
                        </Link>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setEditing(
                              project,
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
                              project,
                            )
                          }
                        >
                          <Trash2
                            size={15}
                          />
                        </Button>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>

          <ProjectFormModal
            open={formOpen}
            project={editing}
            organizations={
              organizations
            }
            onClose={() => {
              setFormOpen(false);
              setEditing(null);
            }}
          />

          <ConfirmDialog
            open={!!deleting}
            title="Delete project?"
            description={
              deleting
                ? `"${deleting.title}" and its related project content will be permanently removed.`
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
      )}
    </div>
  );
}