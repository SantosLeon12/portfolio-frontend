"use client";

import {
  Heart,
  Plus,
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
  useInterestMutations,
} from "../../hooks/useInterestMutations";

import type {
  Interest,
} from "../../types/profile.types";

import {
  InterestFormModal,
} from "../InterestFormModal/InterestFormModal";

import {
  ProfileCollectionCard,
} from "../ProfileCollectionCard/ProfileCollectionCard";

import styles from "../ProfileCollectionSection.module.css";


export function InterestsSection({
  interests,
}: {
  interests: Interest[];
}) {
  const [editing, setEditing] =
    useState<Interest | null>(
      null,
    );

  const [open, setOpen] =
    useState(false);

  const [deleting, setDeleting] =
    useState<Interest | null>(
      null,
    );

  const {
    deleteMutation,
  } =
    useInterestMutations();

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
          "Interest deleted",
      });

      setDeleting(null);
    } catch (error) {
      showToast({
        title:
          "Unable to delete interest",

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
          <h2>Interests</h2>

          <p>
            Technologies, areas or
            topics that interest you.
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
          Add interest
        </Button>
      </header>

      <div
        className={styles.content}
      >
        {interests.length === 0 ? (
          <EmptyState
            icon={<Heart size={30} />}
            title="No interests"
          />
        ) : (
          interests.map(
            (item) => (
              <ProfileCollectionCard
                key={item.id}
                title={item.name}
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

      <InterestFormModal
        open={open}
        interest={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete interest?"
        description={
          deleting
            ? `"${deleting.name}" will be permanently deleted.`
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