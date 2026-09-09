"use client";

import {
  Archive,
  Mail,
  MailOpen,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Button,
} from "@/shared/components/admin/Button/Button";

import {
  ConfirmDialog,
} from "@/shared/components/admin/ConfirmDialog/ConfirmDialog";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useMessage,
} from "../../hooks/message.queries";

import {
  useMessageMutations,
} from "../../hooks/message.mutations";

import type {
  MessageStatus,
} from "../../types/message.types";

import styles from "../MessageAdmin.module.css";


type Props = {
  open: boolean;

  messageId:
    | number
    | null;

  onClose: () => void;
};


function formatDate(
  value: string | null,
) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(
    new Date(value),
  );
}


function getStatusClass(
  status: MessageStatus,
) {
  switch (status) {
    case "NEW":
      return styles.statusNew;

    case "READ":
      return styles.statusRead;

    case "ARCHIVED":
      return styles.statusArchived;
  }
}


export function MessageDetailsModal({
  open,
  messageId,
  onClose,
}: Props) {
  const [
    deleteOpen,
    setDeleteOpen,
  ] =
    useState(false);

  const autoMarkedRef =
    useRef<number | null>(
      null,
    );


  const {
    data: message,
    isLoading,
    isError,
  } =
    useMessage(
      messageId,
      open,
    );


  const {
    updateStatusMutation,
    deleteMutation,
  } =
    useMessageMutations();


  const {
    showToast,
  } =
    useToast();


  useEffect(() => {
    if (!open) {
      autoMarkedRef.current =
        null;

      return;
    }

    if (
      !message ||
      message.status !==
        "NEW"
    ) {
      return;
    }

    if (
      autoMarkedRef.current ===
      message.id
    ) {
      return;
    }

    autoMarkedRef.current =
      message.id;

    void updateStatusMutation
      .mutateAsync({
        messageId:
          message.id,

        status: "READ",
      })
      .catch(() => {
        autoMarkedRef.current =
          null;
      });
  }, [
    open,
    message,
    updateStatusMutation,
  ]);


  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    onClose,
  ]);


  if (!open) {
    return null;
  }


  const updateStatus =
    async (
      status:
        MessageStatus,
    ) => {
      if (!message) {
        return;
      }

      try {
        await updateStatusMutation
          .mutateAsync({
            messageId:
              message.id,

            status,
          });

        showToast({
          title:
            status === "NEW"
              ? "Message marked as new"
              : status === "READ"
                ? "Message marked as read"
                : "Message archived",
        });
      } catch (error) {
        showToast({
          title:
            "Unable to update message",

          message:
            error instanceof Error
              ? error.message
              : undefined,

          variant: "error",
        });
      }
    };


  const remove =
    async () => {
      if (!message) {
        return;
      }

      try {
        await deleteMutation
          .mutateAsync(
            message.id,
          );

        showToast({
          title:
            "Message deleted",
        });

        setDeleteOpen(
          false,
        );

        onClose();
      } catch (error) {
        showToast({
          title:
            "Unable to delete message",

          message:
            error instanceof Error
              ? error.message
              : undefined,

          variant: "error",
        });
      }
    };


  return (
    <>
      <div
        className={
          styles.modalOverlay
        }
        onMouseDown={(
          event,
        ) => {
          if (
            event.target ===
            event.currentTarget
          ) {
            onClose();
          }
        }}
      >
        <section
          className={
            styles.modal
          }
          role="dialog"
          aria-modal="true"
          aria-labelledby="message-details-title"
        >
          <header
            className={
              styles.modalHeader
            }
          >
            <div
              className={
                styles.modalTitleGroup
              }
            >
              <h2
                id="message-details-title"
              >
                {message?.subject ??
                  "Message details"}
              </h2>

              {message && (
                <p>
                  Message from{" "}
                  {message.name}
                </p>
              )}
            </div>

            <button
              type="button"
              className={
                styles.closeButton
              }
              aria-label="Close message"
              onClick={
                onClose
              }
            >
              <X size={18} />
            </button>
          </header>


          <div
            className={
              styles.modalBody
            }
          >
            {isLoading && (
              <div
                className={
                  styles.loading
                }
              >
                Loading message...
              </div>
            )}

            {isError && (
              <div
                className={
                  styles.error
                }
              >
                Unable to load
                this message.
              </div>
            )}

            {message && (
              <>
                <div
                  className={
                    styles
                      .modalMetaGrid
                  }
                >
                  <div
                    className={
                      styles.metaItem
                    }
                  >
                    <span
                      className={
                        styles.metaLabel
                      }
                    >
                      Sender
                    </span>

                    <span
                      className={
                        styles.metaValue
                      }
                    >
                      {message.name}
                    </span>
                  </div>

                  <div
                    className={
                      styles.metaItem
                    }
                  >
                    <span
                      className={
                        styles.metaLabel
                      }
                    >
                      Email
                    </span>

                    <span
                      className={
                        styles.metaValue
                      }
                    >
                      {message.email}
                    </span>
                  </div>

                  <div
                    className={
                      styles.metaItem
                    }
                  >
                    <span
                      className={
                        styles.metaLabel
                      }
                    >
                      Received
                    </span>

                    <span
                      className={
                        styles.metaValue
                      }
                    >
                      {formatDate(
                        message
                          .created_at,
                      )}
                    </span>
                  </div>

                  <div
                    className={
                      styles.metaItem
                    }
                  >
                    <span
                      className={
                        styles.metaLabel
                      }
                    >
                      Read
                    </span>

                    <span
                      className={
                        styles.metaValue
                      }
                    >
                      {formatDate(
                        message
                          .read_at,
                      )}
                    </span>
                  </div>

                  <div
                    className={
                      styles.metaItem
                    }
                  >
                    <span
                      className={
                        styles.metaLabel
                      }
                    >
                      Status
                    </span>

                    <span
                      className={`${styles.statusBadge} ${getStatusClass(
                        message.status,
                      )}`}
                    >
                      {
                        message.status
                      }
                    </span>
                  </div>
                </div>

                <div
                  className={
                    styles
                      .messageContent
                  }
                >
                  {
                    message.message
                  }
                </div>
              </>
            )}
          </div>


          {message && (
            <footer
              className={
                styles.modalActions
              }
            >
              <div
                className={
                  styles.statusActions
                }
              >
                {message.status !==
                  "NEW" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={
                      updateStatusMutation
                        .isPending
                    }
                    onClick={() =>
                      updateStatus(
                        "NEW",
                      )
                    }
                  >
                    <RotateCcw
                      size={15}
                    />
                    Mark new
                  </Button>
                )}

                {message.status !==
                  "READ" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={
                      updateStatusMutation
                        .isPending
                    }
                    onClick={() =>
                      updateStatus(
                        "READ",
                      )
                    }
                  >
                    <MailOpen
                      size={15}
                    />
                    Mark read
                  </Button>
                )}

                {message.status !==
                  "ARCHIVED" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={
                      updateStatusMutation
                        .isPending
                    }
                    onClick={() =>
                      updateStatus(
                        "ARCHIVED",
                      )
                    }
                  >
                    <Archive
                      size={15}
                    />
                    Archive
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setDeleteOpen(
                      true,
                    )
                  }
                >
                  <Trash2
                    size={15}
                  />
                  Delete
                </Button>
              </div>

              <a
                className={
                  styles.replyLink
                }
                href={`mailto:${message.email}?subject=${encodeURIComponent(
                  `Re: ${message.subject}`,
                )}`}
              >
                <Mail size={15} />
                Reply by email
              </a>
            </footer>
          )}
        </section>
      </div>


      <ConfirmDialog
        open={deleteOpen}
        title="Delete message?"
        description={
          message
            ? `The message from "${message.name}" will be permanently deleted.`
            : ""
        }
        loading={
          deleteMutation
            .isPending
        }
        onCancel={() =>
          setDeleteOpen(
            false,
          )
        }
        onConfirm={
          remove
        }
      />
    </>
  );
}