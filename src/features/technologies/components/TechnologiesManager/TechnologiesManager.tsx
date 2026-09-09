"use client";

import {
  Code2,
  FolderTree,
  UserRound,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  PageHeader,
} from "@/shared/components/admin/PageHeader/PageHeader";

import {
  useProfileTechnologies,
  useTechnologies,
  useTechnologyCategories,
} from "../../hooks/technology.queries";

import {
  ProfileTechnologiesPanel,
} from "../ProfileTechnologiesPanel/ProfileTechnologiesPanel";

import {
  TechnologiesPanel,
} from "../TechnologiesPanel/TechnologiesPanel";

import {
  TechnologyCategoriesPanel,
} from "../TechnologyCategoriesPanel/TechnologyCategoriesPanel";

import styles from "./TechnologiesManager.module.css";


type Tab =
  | "profile"
  | "technologies"
  | "categories";


export function TechnologiesManager() {
  const [tab, setTab] =
    useState<Tab>("profile");


  const categoriesQuery =
    useTechnologyCategories();

  const technologiesQuery =
    useTechnologies();

  const profileQuery =
    useProfileTechnologies();


  const loading =
    categoriesQuery.isLoading ||
    technologiesQuery.isLoading ||
    profileQuery.isLoading;


  if (loading) {
    return (
      <div
        className={styles.state}
      >
        <div
          className={
            styles.spinner
          }
        />

        <p>
          Loading technologies...
        </p>
      </div>
    );
  }


  const queryError =
    categoriesQuery.error ||
    technologiesQuery.error ||
    profileQuery.error;


  if (
    categoriesQuery.isError ||
    technologiesQuery.isError ||
    profileQuery.isError ||
    !categoriesQuery.data ||
    !technologiesQuery.data ||
    !profileQuery.data
  ) {
    return (
      <div
        className={
          styles.errorState
        }
      >
        <strong>
          Unable to load
          technologies
        </strong>

        <p>
          {queryError instanceof Error
            ? queryError.message
            : "Technology data could not be loaded."}
        </p>
      </div>
    );
  }


  const categories =
    categoriesQuery.data;

  const technologies =
    technologiesQuery.data;

  const profileTechnologies =
    profileQuery.data;


  return (
    <div
      className={styles.page}
    >
      <PageHeader
        eyebrow="Portfolio data"
        title="Technologies"
        description="
          Manage your technology
          catalog, categories and the
          technologies displayed in
          your personal stack.
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
          <UserRound
            size={17}
          />

          My stack

          <span>
            {
              profileTechnologies.length
            }
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={
            tab === "technologies"
          }
          className={
            tab === "technologies"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab(
              "technologies",
            )
          }
        >
          <Code2 size={17} />

          Technologies

          <span>
            {technologies.length}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={
            tab === "categories"
          }
          className={
            tab === "categories"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab("categories")
          }
        >
          <FolderTree
            size={17}
          />

          Categories

          <span>
            {categories.length}
          </span>
        </button>
      </div>

      {tab === "profile" && (
        <ProfileTechnologiesPanel
          assignments={
            profileTechnologies
          }
          technologies={
            technologies
          }
          categories={
            categories
          }
        />
      )}

      {tab ===
        "technologies" && (
        <TechnologiesPanel
          technologies={
            technologies
          }
          categories={
            categories
          }
        />
      )}

      {tab ===
        "categories" && (
        <TechnologyCategoriesPanel
          categories={
            categories
          }
        />
      )}
    </div>
  );
}