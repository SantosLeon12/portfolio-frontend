"use client";

import {
  Plus,
  Sparkles,
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
  useStrengthMutations,
} from "../../hooks/useStrengthMutations";

import type {
  Strength,
} from "../../types/profile.types";

import {
  ProfileCollectionCard,
} from "../ProfileCollectionCard/ProfileCollectionCard";

import {
  StrengthFormModal,
} from "../StrengthFormModal/StrengthFormModal";

import styles from "../ProfileCollectionSection.module.css";


export function StrengthsSection({
  strengths,
}: {
  strengths: Strength[];
}) {
  const [editing, setEditing] =
    useState<Strength | null>(
      null,
    );

  const [open, setOpen] =
    useState(false);

  const [deleting, setDeleting] =
    useState<Strength | null>(
      null,
    );

  const {
    deleteMutation,
  } =
    useStrengthMutations();

  const { showToast } =
    useToast();


  const remove = async () => {
    if (!deleting) return;

    try {
      await deleteMutation
        .mutateAsync(
          deleting.id,
        );

      showToast({
        title:
          "Strength deleted",
      });

      setDeleting(null);
    } catch (error) {
      showToast({
        title:
          "Unable to delete strength",

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
      className={styles.section}
    >
      <header
        className={styles.header}
      >
        <div
          className={styles.heading}
        >
          <h2>Strengths</h2>

          <p>
            Professional qualities
            you want to highlight.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus size={16} />
          Add strength
        </Button>
      </header>

      <div
        className={styles.content}
      >
        {strengths.length === 0 ? (
          <EmptyState
            icon={
              <Sparkles size={30} />
            }
            title="No strengths"
          />
        ) : (
          strengths.map(
            (item) => (
              <ProfileCollectionCard
                key={item.id}
                title={item.title}
                subtitle={
                  item.description
                }
                visible={
                  item.is_visible
                }
                onEdit={() => {
                  setEditing(item);
                  setOpen(true);
                }}
                onDelete={() =>
                  setDeleting(item)
                }
              />
            ),
          )
        )}
      </div>

      <StrengthFormModal
        open={open}
        strength={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete strength?"
        description={
          deleting
            ? `"${deleting.title}" will be permanently deleted.`
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