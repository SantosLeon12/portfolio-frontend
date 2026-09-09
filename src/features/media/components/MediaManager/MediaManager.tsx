"use client";

import {
  FileText,
  Images,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  PageHeader,
} from "@/shared/components/admin/PageHeader/PageHeader";

import {
  MediaLibraryPanel,
} from "../MediaLibraryPanel/MediaLibraryPanel";

import {
  ProfileDocumentsPanel,
} from "../ProfileDocumentsPanel/ProfileDocumentsPanel";

import {
  ProfileMediaPanel,
} from "../ProfileMediaPanel/ProfileMediaPanel";

import styles from "./MediaManager.module.css";


type Tab =
  | "library"
  | "profile"
  | "documents";


export function MediaManager() {
  const [tab, setTab] =
    useState<Tab>(
      "library",
    );


  return (
    <div
      className={styles.page}
    >
      <PageHeader
        eyebrow="Content"
        title="Media"
        description="
          Manage reusable assets,
          profile imagery and public
          documents stored through
          your portfolio.
        "
      />

      <div
        className={styles.tabs}
        role="tablist"
      >
        <button
          type="button"
          role="tab"
          aria-selected={
            tab === "library"
          }
          className={
            tab === "library"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab("library")
          }
        >
          <Images size={17} />

          Media Library
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={
            tab === "profile"
          }
          className={
            tab === "profile"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab("profile")
          }
        >
          <UserRound size={17} />

          Profile Media
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={
            tab === "documents"
          }
          className={
            tab === "documents"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab(
              "documents",
            )
          }
        >
          <FileText size={17} />

          Documents
        </button>
      </div>


      {tab === "library" && (
        <MediaLibraryPanel />
      )}

      {tab === "profile" && (
        <ProfileMediaPanel />
      )}

      {tab ===
        "documents" && (
        <ProfileDocumentsPanel />
      )}
    </div>
  );
}