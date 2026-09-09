"use client";

import {
  Inbox,
  MessagesSquare,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  EmptyState,
} from "@/shared/components/admin/EmptyState/EmptyState";

import {
  SearchInput,
} from "@/shared/components/admin/SearchInput/SearchInput";

import {
  useMessages,
} from "../../hooks/message.queries";

import type {
  ContactMessage,
  MessageStatus,
} from "../../types/message.types";

import {
  MessageDetailsModal,
} from "../MessageDetailsModal/MessageDetailsModal";

import adminStyles from "../MessageAdmin.module.css";

import styles from "./MessagesManager.module.css";


type StatusFilter =
  | "ALL"
  | MessageStatus;


const FILTERS: {
  value: StatusFilter;
  label: string;
}[] = [
  {
    value: "ALL",
    label: "All",
  },
  {
    value: "NEW",
    label: "New",
  },
  {
    value: "READ",
    label: "Read",
  },
  {
    value: "ARCHIVED",
    label: "Archived",
  },
];


function getStatusClass(
  status: MessageStatus,
) {
  switch (status) {
    case "NEW":
      return adminStyles.statusNew;

    case "READ":
      return adminStyles.statusRead;

    case "ARCHIVED":
      return adminStyles
        .statusArchived;
  }
}


function formatDate(
  value: string,
) {
  const date =
    new Date(value);

  const now =
    new Date();

  const sameDay =
    date.toDateString() ===
    now.toDateString();

  if (sameDay) {
    return new Intl.DateTimeFormat(
      "en",
      {
        hour: "numeric",
        minute: "2-digit",
      },
    ).format(date);
  }

  return new Intl.DateTimeFormat(
    "en",
    {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !==
        now.getFullYear()
          ? "numeric"
          : undefined,
    },
  ).format(date);
}


export function MessagesManager() {
  const [
    search,
    setSearch,
  ] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] =
    useState<StatusFilter>(
      "ALL",
    );

  const [
    selectedId,
    setSelectedId,
  ] =
    useState<
      number | null
    >(null);


  const {
    data,
    isLoading,
    isError,
  } =
    useMessages(
      statusFilter === "ALL"
        ? undefined
        : statusFilter,
    );


  const messages =
    data?.items ?? [];


  const filtered =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return messages;
      }

      return messages.filter(
        (
          item:
            ContactMessage,
        ) =>
          item.name
            .toLowerCase()
            .includes(term) ||
          item.email
            .toLowerCase()
            .includes(term) ||
          item.subject
            .toLowerCase()
            .includes(term) ||
          item.message
            .toLowerCase()
            .includes(term),
      );
    }, [
      messages,
      search,
    ]);


  return (
    <div
      className={
        styles.manager
      }
    >
      <header
        className={
          styles.pageHeader
        }
      >
        <div
          className={
            styles.heading
          }
        >
          <h1>
            Messages
          </h1>

          <p>
            Review messages
            received through your
            public portfolio contact
            form.
          </p>
        </div>

        <div
          className={
            styles.totalBadge
          }
        >
          <MessagesSquare
            size={15}
          />

          {data?.total ?? 0}
          {" "}
          messages
        </div>
      </header>


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
          <div
            className={
              styles.search
            }
          >
            <SearchInput
              value={search}
              placeholder="Search messages..."
              onChange={
                setSearch
              }
            />
          </div>

          <div
            className={
              styles.filters
            }
          >
            {FILTERS.map(
              (filter) => (
                <button
                  key={
                    filter.value
                  }
                  type="button"
                  className={`${styles.filterButton} ${
                    statusFilter ===
                    filter.value
                      ? styles.filterActive
                      : ""
                  }`}
                  onClick={() =>
                    setStatusFilter(
                      filter.value,
                    )
                  }
                >
                  {filter.label}
                </button>
              ),
            )}
          </div>
        </div>


        {isLoading && (
          <div
            className={
              styles.state
            }
          >
            Loading messages...
          </div>
        )}


        {isError && (
          <div
            className={
              styles.error
            }
          >
            Unable to load contact
            messages.
          </div>
        )}


        {!isLoading &&
          !isError &&
          filtered.length ===
            0 && (
            <EmptyState
              icon={
                <Inbox
                  size={32}
                />
              }
              title={
                search
                  ? "No matching messages"
                  : statusFilter ===
                      "ALL"
                    ? "No messages yet"
                    : `No ${statusFilter.toLowerCase()} messages`
              }
              description={
                !search &&
                statusFilter ===
                  "ALL"
                  ? "Messages sent from your public contact form will appear here."
                  : undefined
              }
            />
          )}


        {!isLoading &&
          !isError &&
          filtered.length >
            0 && (
            <div
              className={
                styles.messageList
              }
            >
              {filtered.map(
                (message) => (
                  <button
                    key={
                      message.id
                    }
                    type="button"
                    className={`${styles.messageRow} ${
                      message.status ===
                      "NEW"
                        ? styles.unread
                        : ""
                    }`}
                    onClick={() =>
                      setSelectedId(
                        message.id,
                      )
                    }
                  >
                    <div
                      className={
                        styles.sender
                      }
                    >
                      {message.status ===
                      "NEW" ? (
                        <span
                          className={
                            styles
                              .unreadDot
                          }
                        />
                      ) : (
                        <span
                          className={
                            styles
                              .readPlaceholder
                          }
                        />
                      )}

                      <div
                        className={
                          styles
                            .senderText
                        }
                      >
                        <strong>
                          {
                            message.name
                          }
                        </strong>

                        <span>
                          {
                            message.email
                          }
                        </span>
                      </div>
                    </div>


                    <div
                      className={
                        styles.content
                      }
                    >
                      <span
                        className={
                          styles.subject
                        }
                      >
                        {
                          message.subject
                        }
                      </span>

                      <span
                        className={
                          styles.preview
                        }
                      >
                        {
                          message.message
                        }
                      </span>
                    </div>


                    <span
                      className={
                        styles.date
                      }
                    >
                      {formatDate(
                        message
                          .created_at,
                      )}
                    </span>


                    <div
                      className={
                        styles.statusColumn
                      }
                    >
                      <span
                        className={`${adminStyles.statusBadge} ${getStatusClass(
                          message.status,
                        )}`}
                      >
                        {
                          message.status
                        }
                      </span>
                    </div>
                  </button>
                ),
              )}
            </div>
          )}
      </section>


      <MessageDetailsModal
        open={
          selectedId !==
          null
        }
        messageId={
          selectedId
        }
        onClose={() =>
          setSelectedId(
            null,
          )
        }
      />
    </div>
  );
}