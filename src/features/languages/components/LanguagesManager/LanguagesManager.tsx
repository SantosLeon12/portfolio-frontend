"use client";

import {
  BarChart3,
  BookOpenText,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  PageHeader,
} from "@/shared/components/admin/PageHeader/PageHeader";

import {
  useLanguages,
  useProfileLanguages,
  useProficiencyLevels,
} from "../../hooks/language.queries";

import {
  LanguagesPanel,
} from "../LanguagesPanel/LanguagesPanel";

import {
  ProfileLanguagesPanel,
} from "../ProfileLanguagesPanel/ProfileLanguagesPanel";

import {
  ProficiencyLevelsPanel,
} from "../ProficiencyLevelsPanel/ProficiencyLevelsPanel";

import styles from "./LanguagesManager.module.css";


type Tab =
  | "profile"
  | "languages"
  | "levels";


export function LanguagesManager() {
  const [tab, setTab] =
    useState<Tab>("profile");


  const languagesQuery =
    useLanguages();

  const levelsQuery =
    useProficiencyLevels();

  const profileQuery =
    useProfileLanguages();


  const loading =
    languagesQuery.isLoading ||
    levelsQuery.isLoading ||
    profileQuery.isLoading;


  if (loading) {
    return (
      <div
        className={styles.state}
      >
        <div
          className={styles.spinner}
        />

        <p>
          Loading languages...
        </p>
      </div>
    );
  }


  const queryError =
    languagesQuery.error ||
    levelsQuery.error ||
    profileQuery.error;


  if (
    languagesQuery.isError ||
    levelsQuery.isError ||
    profileQuery.isError ||
    !languagesQuery.data ||
    !levelsQuery.data ||
    !profileQuery.data
  ) {
    return (
      <div
        className={
          styles.errorState
        }
      >
        <strong>
          Unable to load languages
        </strong>

        <p>
          {queryError instanceof Error
            ? queryError.message
            : "Language data could not be loaded."}
        </p>
      </div>
    );
  }


  const languages =
    languagesQuery.data;

  const levels =
    levelsQuery.data;

  const profileLanguages =
    profileQuery.data;


  return (
    <div
      className={styles.page}
    >
      <PageHeader
        eyebrow="Portfolio data"
        title="Languages"
        description="
          Manage your language catalog,
          proficiency scale and the
          languages displayed in your
          professional profile.
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

          My languages

          <span>
            {
              profileLanguages.length
            }
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={
            tab === "languages"
          }
          className={
            tab === "languages"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab("languages")
          }
        >
          <BookOpenText
            size={17}
          />

          Languages

          <span>
            {languages.length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={
            tab === "levels"
          }
          className={
            tab === "levels"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab("levels")
          }
        >
          <BarChart3 size={17} />

          Levels

          <span>
            {levels.length}
          </span>
        </button>
      </div>

      {tab === "profile" && (
        <ProfileLanguagesPanel
          assignments={
            profileLanguages
          }
          languages={
            languages
          }
          levels={levels}
        />
      )}

      {tab ===
        "languages" && (
        <LanguagesPanel
          languages={
            languages
          }
        />
      )}

      {tab === "levels" && (
        <ProficiencyLevelsPanel
          levels={levels}
        />
      )}
    </div>
  );
}