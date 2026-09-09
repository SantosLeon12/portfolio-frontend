"use client";

import {
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Star,
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
  useProfileTechnologyMutations,
} from "../../hooks/technology.mutations";

import type {
  ProfileTechnology,
  Technology,
  TechnologyCategory,
} from "../../types/technology.types";

import {
  ProfileTechnologyFormModal,
} from "../ProfileTechnologyFormModal/ProfileTechnologyFormModal";

import styles from "../TechnologyAdmin.module.css";


type Props = {
  assignments: ProfileTechnology[];
  technologies: Technology[];
  categories: TechnologyCategory[];
};


export function ProfileTechnologiesPanel({
  assignments,
  technologies,
  categories,
}: Props) {
  const [search, setSearch] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<ProfileTechnology | null>(
      null,
    );

  const [removing, setRemoving] =
    useState<ProfileTechnology | null>(
      null,
    );


  const {
    deleteMutation,
  } =
    useProfileTechnologyMutations();

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


  const availableTechnologies =
    useMemo(
      () =>
        technologies.filter(
          (technology) =>
            !assignments.some(
              (assignment) =>
                assignment.technology.id ===
                technology.id,
            ),
        ),
      [
        technologies,
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
          assignment.technology.name
            .toLowerCase()
            .includes(term) ||
          assignment.technology.slug
            .toLowerCase()
            .includes(term),
      );
    }, [
      assignments,
      search,
    ]);


  const remove = async () => {
    if (!removing) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(
        removing.technology.id,
      );

      showToast({
        title:
          "Technology removed from profile",
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
            Profile technologies
          </h2>

          <p>
            Select which technologies
            belong to your personal
            stack and how they appear
            publicly.
          </p>
        </div>

        <Button
          size="sm"
          disabled={
            availableTechnologies
              .length === 0
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
          placeholder="Search your stack..."
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
            <Star size={32} />
          }
          title={
            search
              ? "No matching technologies"
              : "No technologies assigned to your profile"
          }
          description={
            !search
              ? "Add technologies from the catalog to build your public stack."
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
                  <th>Technology</th>
                  <th>Category</th>
                  <th>Featured</th>
                  <th>Visibility</th>
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
                          .technology
                          .id
                      }
                    >
                      <td>
                        <strong>
                          {
                            assignment
                              .technology
                              .name
                          }
                        </strong>
                      </td>

                      <td>
                        {getCategoryName(
                          assignment
                            .technology,
                        )}
                      </td>

                      <td>
                        {assignment.featured ? (
                          <span
                            className={`${styles.badge} ${styles.featured}`}
                          >
                            <Star
                              size={13}
                            />
                            Featured
                          </span>
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
                        <span
                          className={`${styles.badge} ${
                            assignment.is_visible
                              ? styles.visible
                              : styles.hidden
                          }`}
                        >
                          {assignment.is_visible ? (
                            <Eye
                              size={13}
                            />
                          ) : (
                            <EyeOff
                              size={13}
                            />
                          )}

                          {assignment.is_visible
                            ? "Visible"
                            : "Hidden"}
                        </span>
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
                      .technology
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
                            .technology
                            .name
                        }
                      </strong>

                      <span
                        className={
                          styles.slug
                        }
                      >
                        {getCategoryName(
                          assignment
                            .technology,
                        )}
                      </span>
                    </div>
                  </div>

                  <div
                    className={
                      styles.meta
                    }
                  >
                    {assignment.featured && (
                      <span
                        className={`${styles.badge} ${styles.featured}`}
                      >
                        <Star
                          size={13}
                        />
                        Featured
                      </span>
                    )}

                    <span
                      className={`${styles.badge} ${
                        assignment.is_visible
                          ? styles.visible
                          : styles.hidden
                      }`}
                    >
                      {assignment.is_visible ? (
                        <Eye
                          size={13}
                        />
                      ) : (
                        <EyeOff
                          size={13}
                        />
                      )}

                      {assignment.is_visible
                        ? "Visible"
                        : "Hidden"}
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


      <ProfileTechnologyFormModal
        open={formOpen}
        assignment={editing}
        technologies={
          editing
            ? technologies
            : availableTechnologies
        }
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />


      <ConfirmDialog
        open={!!removing}
        title="Remove from profile?"
        description={
          removing
            ? `"${removing.technology.name}" will be removed from your profile stack. The technology itself will remain in the catalog.`
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