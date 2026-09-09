"use client";

import {
  ExternalLink,
  FileText,
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
  SearchInput,
} from "@/shared/components/admin/SearchInput/SearchInput";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useProfileDocumentMutations,
} from "../../hooks/media.mutations";

import {
  useMediaAssets,
  useProfileDocuments,
} from "../../hooks/media.queries";

import type {
  ProfileDocument,
} from "../../types/media.types";

import {
  ProfileDocumentFormModal,
} from "../ProfileDocumentFormModal/ProfileDocumentFormModal";

import styles from "../MediaAdmin.module.css";


export function ProfileDocumentsPanel() {
  const documentsQuery =
    useProfileDocuments();

  const assetsQuery =
    useMediaAssets();

  const {
    deleteMutation,
  } =
    useProfileDocumentMutations();

  const {
    showToast,
  } = useToast();


  const [search, setSearch] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editing, setEditing] =
    useState<
      ProfileDocument | null
    >(null);

  const [removing, setRemoving] =
    useState<
      ProfileDocument | null
    >(null);


  const documents =
    documentsQuery.data ?? [];

  const assets =
    assetsQuery.data ?? [];


  const availableAssets =
    useMemo(
      () =>
        assets.filter(
          (asset) =>
            !documents.some(
              (document) =>
                document
                  .media_asset
                  .id ===
                asset.id,
            ),
        ),
      [
        assets,
        documents,
      ],
    );


  const filtered =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return documents;
      }

      return documents.filter(
        (document) =>
          document.title
            .toLowerCase()
            .includes(term) ||
          document.document_type
            .toLowerCase()
            .includes(term) ||
          document.version
            ?.toLowerCase()
            .includes(term),
      );
    }, [
      documents,
      search,
    ]);


  const remove = async () => {
    if (!removing) {
      return;
    }

    try {
      await deleteMutation
        .mutateAsync(
          removing.id,
        );

      showToast({
        title:
          "Document removed",

        message:
          "The original file remains in the Media Library.",
      });

      setRemoving(null);
    } catch (error) {
      showToast({
        title:
          "Unable to remove document",

        message:
          error instanceof Error
            ? error.message
            : undefined,

        variant:
          "error",
      });
    }
  };


  if (
    documentsQuery.isLoading ||
    assetsQuery.isLoading
  ) {
    return (
      <div
        className={
          styles.state
        }
      >
        Loading documents...
      </div>
    );
  }


  if (
    documentsQuery.isError ||
    assetsQuery.isError
  ) {
    return (
      <div
        className={
          styles.errorState
        }
      >
        Unable to load documents.
      </div>
    );
  }


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
              Profile documents
            </h2>

            <p>
              Manage your CV,
              résumé, certificates
              and other public files.
            </p>
          </div>

          <Button
            size="sm"
            disabled={
              availableAssets
                .length === 0
            }
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus size={16} />
            Add document
          </Button>
        </header>


        <div
          className={
            styles.toolbar
          }
        >
          <SearchInput
            value={search}
            placeholder="Search documents..."
            onChange={setSearch}
          />

          <span
            className={
              styles.count
            }
          >
            {filtered.length}
            {" "}
            documents
          </span>
        </div>


        {filtered.length === 0 ? (
          <EmptyState
            icon={
              <FileText
                size={32}
              />
            }
            title={
              search
                ? "No matching documents"
                : "No profile documents"
            }
          />
        ) : (
          <div
            className={
              styles.documentList
            }
          >
            {filtered.map(
              (document) => (
                <article
                  key={
                    document.id
                  }
                  className={
                    styles.documentCard
                  }
                >
                  <div
                    className={
                      styles.documentIcon
                    }
                  >
                    <FileText
                      size={26}
                    />
                  </div>

                  <div
                    className={
                      styles.documentMain
                    }
                  >
                    <div
                      className={
                        styles.documentTitle
                      }
                    >
                      <strong>
                        {
                          document.title
                        }
                      </strong>

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
                            document.document_type
                          }
                        </span>

                        {document.version && (
                          <span
                            className={
                              styles.badge
                            }
                          >
                            Version{" "}
                            {
                              document.version
                            }
                          </span>
                        )}

                        {document.is_current && (
                          <span
                            className={`${styles.badge} ${styles.current}`}
                          >
                            Current
                          </span>
                        )}
                      </div>
                    </div>

                    <div
                      className={
                        styles.actions
                      }
                    >
                      <a
                        href={
                          document
                            .media_asset
                            .url
                        }
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

                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setEditing(
                            document,
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
                            document,
                          )
                        }
                      >
                        <Trash2
                          size={15}
                        />
                        Remove
                      </Button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>


      <ProfileDocumentFormModal
        open={formOpen}
        document={editing}
        assets={
          editing
            ? assets
            : availableAssets
        }
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
      />


      <ConfirmDialog
        open={!!removing}
        title="Remove document?"
        description={
          removing
            ? `"${removing.title}" will be removed from your profile. The original file will remain in the Media Library.`
            : ""
        }
        loading={
          deleteMutation
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