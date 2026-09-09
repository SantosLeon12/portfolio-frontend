"use client";

import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";

import Link from "next/link";

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
  useExperienceMutations,
} from "../../hooks/professional.mutations";

import {
  useExperiences,
} from "../../hooks/professional.queries";

import type {
  Experience,
} from "../../types/professional.types";

import {
  ExperienceFormModal,
} from "../ExperienceFormModal/ExperienceFormModal";

import styles from "../ProfessionalAdmin.module.css";

import managerStyles from "./ExperiencesManager.module.css";


export function ExperiencesManager() {
  const experiencesQuery =
    useExperiences();

  const organizationsQuery =
    useOrganizations();

  const {
    deleteMutation,
  } =
    useExperienceMutations();

  const {
    showToast,
  } = useToast();


  const [search, setSearch] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      Experience | null
    >(null);

  const [deleting, setDeleting] =
    useState<
      Experience | null
    >(null);


  const experiences =
    experiencesQuery.data ?? [];

  const organizations =
    organizationsQuery.data ?? [];


  const getOrganizationName = (
    experience: Experience,
  ) =>
    experience.organization?.name ??
    organizations.find(
      (organization) =>
        organization.id ===
        experience.organization_id,
    )?.name ??
    "Unknown organization";


  const filtered =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return experiences;
      }

      return experiences.filter(
        (experience) =>
          experience.role_title
            .toLowerCase()
            .includes(term) ||
          getOrganizationName(
            experience,
          )
            .toLowerCase()
            .includes(term),
      );
    }, [
      experiences,
      search,
      organizations,
    ]);


  if (
    experiencesQuery.isLoading ||
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
          Loading experience...
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
          "Experience deleted",
      });

      setDeleting(null);
    } catch (error) {
      showToast({
        title:
          "Unable to delete experience",

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
        title="Experience"
        description="
          Manage your professional
          experience, achievements
          and technologies used in
          each role.
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
            Add experience
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
            placeholder="Search experience..."
            onChange={setSearch}
          />

          <span
            className={styles.count}
          >
            {filtered.length}
            {" "}
            positions
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <BriefcaseBusiness
                size={32}
              />
            }
            title={
              search
                ? "No matching experience"
                : "No experience yet"
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
                    <th>Role</th>
                    <th>Organization</th>
                    <th>Dates</th>
                    <th>Visibility</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map(
                    (experience) => (
                      <tr
                        key={
                          experience.id
                        }
                      >
                        <td>
                          <strong>
                            {
                              experience.role_title
                            }
                          </strong>

                          {experience.employment_type && (
                            <span
                              className={
                                styles.muted
                              }
                            >
                              {
                                experience.employment_type
                              }
                            </span>
                          )}
                        </td>

                        <td>
                          {getOrganizationName(
                            experience,
                          )}
                        </td>

                        <td>
                          {
                            experience.start_date
                          }
                          {" → "}
                          {
                            experience.end_date ??
                            "Present"
                          }
                        </td>

                        <td>
                          <span
                            className={`${styles.badge} ${
                              experience.is_visible
                                ? styles.visible
                                : styles.hidden
                            }`}
                          >
                            {experience.is_visible ? (
                              <Eye
                                size={13}
                              />
                            ) : (
                              <EyeOff
                                size={13}
                              />
                            )}

                            {experience.is_visible
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
                            <Link
                              href={`/admin/experience/${experience.id}`}
                              className={
                                styles.manageLink
                              }
                            >
                              <Settings2
                                size={15}
                              />
                            </Link>

                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => {
                                setEditing(
                                  experience,
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
                                  experience,
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
                (experience) => (
                  <article
                    key={
                      experience.id
                    }
                    className={
                      styles.card
                    }
                  >
                    <div>
                      <strong>
                        {
                          experience.role_title
                        }
                      </strong>

                      <span
                        className={
                          styles.muted
                        }
                      >
                        {getOrganizationName(
                          experience,
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
                          experience.start_date
                        }
                        {" → "}
                        {
                          experience.end_date ??
                          "Present"
                        }
                      </span>

                      <span
                        className={`${styles.badge} ${
                          experience.is_visible
                            ? styles.visible
                            : styles.hidden
                        }`}
                      >
                        {experience.is_visible
                          ? "Visible"
                          : "Hidden"}
                      </span>
                    </div>

                    <div
                      className={
                        styles.actions
                      }
                    >
                      <Link
                        href={`/admin/experience/${experience.id}`}
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
                            experience,
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
                            experience,
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

      <ExperienceFormModal
        open={formOpen}
        experience={editing}
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
        title="Delete experience?"
        description={
          deleting
            ? `"${deleting.role_title}" and its related highlights and technology assignments will be removed.`
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