"use client";

import {
  Eye,
  EyeOff,
  GraduationCap,
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
  PageHeader,
} from "@/shared/components/admin/PageHeader/PageHeader";
import {
  SearchInput,
} from "@/shared/components/admin/SearchInput/SearchInput";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useOrganizations,
} from "@/features/organizations/hooks/useOrganizations";

import {
  useEducationMutations,
} from "../../hooks/professional.mutations";

import {
  useEducations,
} from "../../hooks/professional.queries";

import type {
  Education,
} from "../../types/professional.types";

import {
  EducationFormModal,
} from "../EducationFormModal/EducationFormModal";

import styles from "../ProfessionalAdmin.module.css";

import managerStyles from "./EducationManager.module.css";


export function EducationManager() {
  const educationQuery =
    useEducations();

  const organizationsQuery =
    useOrganizations();

  const {
    deleteMutation,
  } =
    useEducationMutations();

  const {
    showToast,
  } = useToast();


  const [search, setSearch] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<Education | null>(
      null,
    );

  const [deleting, setDeleting] =
    useState<Education | null>(
      null,
    );


  const educations =
    educationQuery.data ?? [];

  const organizations =
    organizationsQuery.data ?? [];


  const getOrganizationName = (
    education: Education,
  ) =>
    education.organization?.name ??
    organizations.find(
      (organization) =>
        organization.id ===
        education.organization_id,
    )?.name ??
    "Unknown institution";


  const filtered =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return educations;
      }

      return educations.filter(
        (education) =>
          education.degree
            .toLowerCase()
            .includes(term) ||
          education.field_of_study
            .toLowerCase()
            .includes(term) ||
          getOrganizationName(
            education,
          )
            .toLowerCase()
            .includes(term),
      );
    }, [
      educations,
      organizations,
      search,
    ]);


  if (
    educationQuery.isLoading ||
    organizationsQuery.isLoading
  ) {
    return (
      <div
        className={
          managerStyles.state
        }
      >
        <div
          className={
            managerStyles.spinner
          }
        />

        <p>
          Loading education...
        </p>
      </div>
    );
  }


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
          "Education deleted",
      });

      setDeleting(null);
    } catch (error) {
      showToast({
        title:
          "Unable to delete education",

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
    <div
      className={
        managerStyles.page
      }
    >
      <PageHeader
        eyebrow="Professional"
        title="Education"
        description="
          Manage your academic
          background and professional
          training.
        "
        actions={
          <Button
            disabled={
              organizations.length ===
              0
            }
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus size={17} />
            Add education
          </Button>
        }
      />

      <section
        className={styles.panel}
      >
        <div
          className={styles.toolbar}
        >
          <SearchInput
            value={search}
            placeholder="Search education..."
            onChange={setSearch}
          />

          <span
            className={styles.count}
          >
            {filtered.length}
            {" "}
            records
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <GraduationCap
                size={32}
              />
            }
            title={
              search
                ? "No matching education"
                : "No education yet"
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
                    <th>Degree</th>
                    <th>Institution</th>
                    <th>Dates</th>
                    <th>Visibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map(
                    (education) => (
                      <tr
                        key={
                          education.id
                        }
                      >
                        <td>
                          <strong>
                            {
                              education.degree
                            }
                          </strong>

                          <span
                            className={
                              styles.muted
                            }
                          >
                            {
                              education.field_of_study
                            }
                          </span>
                        </td>

                        <td>
                          {getOrganizationName(
                            education,
                          )}
                        </td>

                        <td>
                          {
                            education.start_date
                          }
                          {" → "}
                          {
                            education.end_date ??
                            "Present"
                          }
                        </td>

                        <td>
                          <span
                            className={`${styles.badge} ${
                              education.is_visible
                                ? styles.visible
                                : styles.hidden
                            }`}
                          >
                            {education.is_visible ? (
                              <Eye
                                size={13}
                              />
                            ) : (
                              <EyeOff
                                size={13}
                              />
                            )}

                            {education.is_visible
                              ? "Visible"
                              : "Hidden"}
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
                                  education,
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
                                  education,
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
                (education) => (
                  <article
                    key={
                      education.id
                    }
                    className={
                      styles.card
                    }
                  >
                    <div>
                      <strong>
                        {
                          education.degree
                        }
                      </strong>

                      <span
                        className={
                          styles.muted
                        }
                      >
                        {getOrganizationName(
                          education,
                        )}
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
                          education.field_of_study
                        }
                      </span>

                      <span
                        className={
                          styles.badge
                        }
                      >
                        {
                          education.start_date
                        }
                        {" → "}
                        {
                          education.end_date ??
                          "Present"
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
                            education,
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
                            education,
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
      </section>

      <EducationFormModal
        open={formOpen}
        education={editing}
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
        title="Delete education?"
        description={
          deleting
            ? `"${deleting.degree}" will be permanently deleted.`
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
    </div>
  );
}