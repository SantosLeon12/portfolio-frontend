"use client";

import {
  Plus,
  ContactRound,
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
  useContactMutations,
} from "../../hooks/useContactMutations";

import type {
  ProfileContact,
} from "../../types/profile.types";

import {
  ContactFormModal,
} from "../ContactFormModal/ContactFormModal";

import {
  ProfileCollectionCard,
} from "../ProfileCollectionCard/ProfileCollectionCard";

import styles from "../ProfileCollectionSection.module.css";


type Props = {
  contacts: ProfileContact[];
};


export function ContactsSection({
  contacts,
}: Props) {
  const [editing, setEditing] =
    useState<
      ProfileContact | null
    >(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [
    deleting,
    setDeleting,
  ] =
    useState<
      ProfileContact | null
    >(null);

  const {
    deleteMutation,
  } = useContactMutations();

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
          "Contact deleted",
      });

      setDeleting(null);
    } catch (error) {
      showToast({
        title:
          "Unable to delete contact",

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
          <h2>Contacts</h2>

          <p>
            Email, phone, WhatsApp
            and other ways visitors
            can contact you.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          <Plus size={16} />
          Add contact
        </Button>
      </header>

      <div
        className={styles.content}
      >
        {contacts.length === 0 ? (
          <EmptyState
            icon={
              <ContactRound
                size={30}
              />
            }
            title="No contacts yet"
            description="
              Add at least one way
              for visitors to contact
              you.
            "
          />
        ) : (
          contacts.map(
            (contact) => (
              <ProfileCollectionCard
                key={contact.id}
                title={
                  contact.label ||
                  contact.contact_type
                }
                subtitle={
                  contact.value
                }
                visible={
                  contact.is_visible
                }
                badges={[
                  contact.contact_type,
                  ...(contact.is_primary
                    ? ["Primary"]
                    : []),
                ]}
                onEdit={() => {
                  setEditing(
                    contact,
                  );

                  setModalOpen(
                    true,
                  );
                }}
                onDelete={() =>
                  setDeleting(
                    contact,
                  )
                }
              />
            ),
          )
        )}
      </div>

      <ContactFormModal
        open={modalOpen}
        contact={editing}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="Delete contact?"
        description={
          deleting
            ? `The contact "${deleting.value}" will be permanently deleted.`
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