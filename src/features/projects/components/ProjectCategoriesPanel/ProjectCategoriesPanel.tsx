"use client";

import {
  Plus,
  Tags,
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
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProjectCategoryRelationMutations,
} from "../../hooks/project.mutations";

import type {
  ProjectCategory,
  ProjectCategoryRelation,
} from "../../types/project.types";

import {
  ProjectCategoryAssignmentModal,
} from "../ProjectCategoryAssignmentModal/ProjectCategoryAssignmentModal";

import styles from "../ProjectAdmin.module.css";


type Props = {
  projectId: number;

  relations:
    ProjectCategoryRelation[];

  categories:
    ProjectCategory[];
};


export function ProjectCategoriesPanel({
  projectId,
  relations,
  categories,
}: Props) {
  const [formOpen, setFormOpen] =
    useState(false);

  const [removing, setRemoving] =
    useState<
      ProjectCategory | null
    >(null);


  const {
    removeMutation,
  } =
    useProjectCategoryRelationMutations(
      projectId,
    );

  const {
    showToast,
  } = useToast();


  const available =
    useMemo(
      () =>
        categories.filter(
          (category) =>
            !relations.some(
              (relation) =>
                relation
                  .category.id ===
                category.id,
            ),
        ),
      [
        categories,
        relations,
      ],
    );


  const remove = async () => {
    if (!removing) {
      return;
    }

    try {
      await removeMutation
        .mutateAsync(
          removing.id,
        );

      showToast({
        title:
          "Category removed",
      });

      setRemoving(null);
    } catch (error) {
      showToast({
        title:
          "Unable to remove category",

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
              Categories
            </h2>

            <p>
              Classify this project
              using the category
              catalog.
            </p>
          </div>

          <Button
            size="sm"
            disabled={
              available.length ===
              0
            }
            onClick={() =>
              setFormOpen(true)
            }
          >
            <Plus size={16} />
            Add category
          </Button>
        </header>

        {relations.length === 0 ? (
          <EmptyState
            icon={
              <Tags size={32} />
            }
            title="No categories assigned"
          />
        ) : (
          <div
            className={
              styles.grid
            }
          >
            {relations.map(
              (relation) => (
                <article
                  key={
                    relation
                      .category.id
                  }
                  className={
                    styles.card
                  }
                >
                  <strong>
                    {
                      relation
                        .category.name
                    }
                  </strong>

                  <span
                    className={
                      styles.muted
                    }
                  >
                    /
                    {
                      relation
                        .category.slug
                    }
                  </span>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      setRemoving(
                        relation.category,
                      )
                    }
                  >
                    <Trash2
                      size={15}
                    />
                    Remove
                  </Button>
                </article>
              ),
            )}
          </div>
        )}
      </section>

      <ProjectCategoryAssignmentModal
        open={formOpen}
        projectId={projectId}
        categories={available}
        onClose={() =>
          setFormOpen(false)
        }
      />

      <ConfirmDialog
        open={!!removing}
        title="Remove category?"
        description={
          removing
            ? `"${removing.name}" will only be detached from this project.`
            : ""
        }
        loading={
          removeMutation
            .isPending
        }
        onCancel={() =>
          setRemoving(null)
        }
        onConfirm={remove}
      />
    </>
  );
}