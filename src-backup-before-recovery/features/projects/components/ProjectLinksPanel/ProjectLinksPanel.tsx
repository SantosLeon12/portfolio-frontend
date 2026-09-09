"use client";

import {
  ExternalLink,
  Link2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import {
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
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProjectLinkMutations,
} from "../../hooks/project.mutations";

import type {
  ProjectLink,
} from "../../types/project.types";

import {
  ProjectLinkFormModal,
} from "../ProjectLinkFormModal/ProjectLinkFormModal";

import styles from "../ProjectAdmin.module.css";


type Props = {
  projectId: number;
  links: ProjectLink[];
};


export function ProjectLinksPanel({
  projectId,
  links,
}: Props) {
  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      ProjectLink | null
    >(null);

  const [deleting, setDeleting] =
    useState<
      ProjectLink | null
    >(null);


  const {
    deleteMutation,
  } =
    useProjectLinkMutations(
      projectId,
    );

  const {
    showToast,
  } = useToast();


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
          "Link deleted",
      });

      setDeleting(null);
    } catch {
      showToast({
        title:
          "Unable to delete link",

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
            <h2>Links</h2>

            <p>
              Repository, live demo,
              documentation and
              external references.
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
            Add link
          </Button>
        </header>

        {links.length === 0 ? (
          <EmptyState
            icon={
              <Link2 size={32} />
            }
            title="No project links"
          />
        ) : (
          <div
            className={
              styles.grid
            }
          >
            {links.map(
              (link) => (
                <article
                  key={link.id}
                  className={
                    styles.card
                  }
                >
                  <div>
                    <strong>
                      {link.label ??
                        link.link_type}
                    </strong>

                    <p
                      className={
                        styles.muted
                      }
                    >
                      {
                        link.link_type
                      }
                    </p>
                  </div>

                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className={
                      styles.openLink
                    }
                  >
                    <ExternalLink
                      size={15}
                    />
                    Open
                  </a>

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
                          link,
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
                          link,
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

      <ProjectLinkFormModal
        open={formOpen}
        projectId={projectId}
        link={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete link?"
        description="
          This project link will
          be permanently removed.
        "
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