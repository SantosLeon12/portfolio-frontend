"use client";

import {
  Link2,
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
  useSocialLinkMutations,
} from "../../hooks/useSocialLinkMutations";

import type {
  SocialLink,
} from "../../types/profile.types";

import {
  ProfileCollectionCard,
} from "../ProfileCollectionCard/ProfileCollectionCard";

import {
  SocialLinkFormModal,
} from "../SocialLinkFormModal/SocialLinkFormModal";

import styles from "../ProfileCollectionSection.module.css";


type Props = {
  socialLinks: SocialLink[];
};


export function SocialLinksSection({
  socialLinks,
}: Props) {
  const [editing, setEditing] =
    useState<SocialLink | null>(
      null,
    );

  const [open, setOpen] =
    useState(false);

  const [deleting, setDeleting] =
    useState<SocialLink | null>(
      null,
    );

  const {
    deleteMutation,
  } =
    useSocialLinkMutations();

  const { showToast } =
    useToast();


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
          "Social link deleted",
      });

      setDeleting(null);
    } catch (error) {
      showToast({
        title:
          "Unable to delete link",

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
          <h2>Social links</h2>

          <p>
            GitHub, LinkedIn and
            other professional
            profiles.
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
          Add link
        </Button>
      </header>

      <div
        className={styles.content}
      >
        {socialLinks.length ===
        0 ? (
          <EmptyState
            icon={<Link2 size={30} />}
            title="No social links"
          />
        ) : (
          socialLinks.map(
            (item) => (
              <ProfileCollectionCard
                key={item.id}
                title={
                  item.platform
                }
                subtitle={item.url}
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

      <SocialLinkFormModal
        open={open}
        socialLink={editing}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete social link?"
        description={
          deleting
            ? `${deleting.platform} will be permanently removed.`
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