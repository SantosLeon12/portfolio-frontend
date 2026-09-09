"use client";

import {
  Building2,
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
  PageHeader,
} from "@/shared/components/admin/PageHeader/PageHeader";

import {
  SearchInput,
} from "@/shared/components/admin/SearchInput/SearchInput";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useOrganizationMutations,
} from "../../hooks/useOrganizationMutations";

import {
  useOrganizations,
} from "../../hooks/useOrganizations";

import type {
  Organization,
} from "../../types/organization.types";

import {
  OrganizationFormModal,
} from "../OrganizationFormModal/OrganizationFormModal";

import styles from "./OrganizationsManager.module.css";


function formatType(
  value: string,
) {
  return value
    .toLowerCase()
    .replace(
      /^./,
      (character) =>
        character.toUpperCase(),
    );
}


export function OrganizationsManager() {
  const {
    data: organizations,
    isLoading,
    isError,
    error,
  } = useOrganizations();

  const {
    deleteMutation,
  } =
    useOrganizationMutations();

  const {
    showToast,
  } = useToast();


  const [
    search,
    setSearch,
  ] = useState("");

  const [
    formOpen,
    setFormOpen,
  ] = useState(false);

  const [
    editing,
    setEditing,
  ] =
    useState<
      Organization | null
    >(null);

  const [
    deleting,
    setDeleting,
  ] =
    useState<
      Organization | null
    >(null);


  const filtered =
    useMemo(() => {
      if (!organizations) {
        return [];
      }

      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return organizations;
      }

      return organizations.filter(
        (organization) =>
          organization.name
            .toLowerCase()
            .includes(term) ||
          organization.slug
            .toLowerCase()
            .includes(term) ||
          organization
            .organization_type
            .toLowerCase()
            .includes(term),
      );
    }, [
      organizations,
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
            "Organization deleted",

          message:
            `${deleting.name} was removed.`,
        });

        setDeleting(null);
      } catch (error) {
        showToast({
          title:
            "Unable to delete organization",

          message:
            error instanceof Error
              ? error.message
              : undefined,

          variant:
            "error",
        });
      }
    };


  if (isLoading) {
    return (
      <div
        className={
          styles.state
        }
      >
        <div
          className={
            styles.spinner
          }
        />

        <p>
          Loading organizations...
        </p>
      </div>
    );
  }


  if (
    isError ||
    !organizations
  ) {
    return (
      <div
        className={
          styles.errorState
        }
      >
        <strong>
          Unable to load
          organizations
        </strong>

        <p>
          {error instanceof Error
            ? error.message
            : "Organizations could not be loaded."}
        </p>
      </div>
    );
  }


  return (
    <div
      className={styles.page}
    >
      <PageHeader
        eyebrow="Portfolio data"
        title="Organizations"
        description="
          Manage companies,
          universities, schools and
          clients referenced by your
          experience, education and
          projects.
        "
        actions={
          <Button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus size={17} />
            Add organization
          </Button>
        }
      />


      <section
        className={
          styles.panel
        }
      >
        <div
          className={
            styles.toolbar
          }
        >
          <SearchInput
            value={search}
            placeholder="
              Search organizations...
            "
            onChange={setSearch}
          />

          <span
            className={
              styles.count
            }
          >
            {filtered.length}
            {" "}
            {filtered.length === 1
              ? "organization"
              : "organizations"}
          </span>
        </div>


        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <Building2
                size={32}
              />
            }
            title={
              search
                ? "No matching organizations"
                : "No organizations yet"
            }
            description={
              search
                ? "Try changing your search."
                : "Create your first organization to use it in experience, education or projects."
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
                    <th>
                      Organization
                    </th>

                    <th>
                      Type
                    </th>

                    <th>
                      Website
                    </th>

                    <th
                      className={
                        styles.actionsColumn
                      }
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map(
                    (item) => (
                      <tr
                        key={
                          item.id
                        }
                      >
                        <td>
                          <strong>
                            {
                              item.name
                            }
                          </strong>

                          <span
                            className={
                              styles.slug
                            }
                          >
                            {
                              item.slug
                            }
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              styles.badge
                            }
                          >
                            {formatType(
                              item.organization_type,
                            )}
                          </span>
                        </td>

                        <td>
                          {item.website_url ? (
                            <a
                              href={
                                item.website_url
                              }
                              target="_blank"
                              rel="noreferrer"
                              className={
                                styles.website
                              }
                            >
                              Visit

                              <ExternalLink
                                size={
                                  14
                                }
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
                                  item,
                                );

                                setFormOpen(
                                  true,
                                );
                              }}
                            >
                              <Pencil
                                size={
                                  15
                                }
                              />
                            </Button>

                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setDeleting(
                                  item,
                                )
                              }
                            >
                              <Trash2
                                size={
                                  15
                                }
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
                (item) => (
                  <article
                    key={item.id}
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
                            item.name
                          }
                        </strong>

                        <span
                          className={
                            styles.slug
                          }
                        >
                          {item.slug}
                        </span>
                      </div>

                      <span
                        className={
                          styles.badge
                        }
                      >
                        {formatType(
                          item.organization_type,
                        )}
                      </span>
                    </div>

                    {item.website_url && (
                      <a
                        href={
                          item.website_url
                        }
                        target="_blank"
                        rel="noreferrer"
                        className={
                          styles.website
                        }
                      >
                        Website
                        <ExternalLink
                          size={14}
                        />
                      </a>
                    )}

                    <div
                      className={
                        styles.cardActions
                      }
                    >
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditing(
                            item,
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
                            item,
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


      <OrganizationFormModal
        open={formOpen}
        organization={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />


      <ConfirmDialog
        open={!!deleting}
        title="Delete organization?"
        description={
          deleting
            ? `"${deleting.name}" will be permanently deleted. Organizations currently used by experience, education or projects cannot be removed.`
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