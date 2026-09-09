"use client";

import {
  ArrowLeft,
  Code2,
  Images,
  Layers3,
  Link2,
  Tags,
} from "lucide-react";

import Link from "next/link";

import {
  useState,
} from "react";

import {
  useMediaAssets,
} from "@/features/media/hooks/media.queries";

import {
  useTechnologies,
} from "@/features/technologies/hooks/technology.queries";

import {
  PageHeader,
} from "@/shared/components/admin/PageHeader/PageHeader";

import {
  useProject,
  useProjectCategories,
} from "../../hooks/project.queries";

import {
  ProjectCategoriesPanel,
} from "../ProjectCategoriesPanel/ProjectCategoriesPanel";

import {
  ProjectLinksPanel,
} from "../ProjectLinksPanel/ProjectLinksPanel";

import {
  ProjectMediaPanel,
} from "../ProjectMediaPanel/ProjectMediaPanel";

import {
  ProjectSectionsPanel,
} from "../ProjectSectionsPanel/ProjectSectionsPanel";

import {
  ProjectTechnologiesPanel,
} from "../ProjectTechnologiesPanel/ProjectTechnologiesPanel";

import styles from "./ProjectDetailsManager.module.css";


type Props = {
  projectId: number;
};


type Tab =
  | "categories"
  | "technologies"
  | "links"
  | "media"
  | "sections";


export function ProjectDetailsManager({
  projectId,
}: Props) {
  const [tab, setTab] =
    useState<Tab>(
      "categories",
    );


  const projectQuery =
    useProject(
      projectId,
    );

  const categoriesQuery =
    useProjectCategories();

  const technologiesQuery =
    useTechnologies();

  const mediaQuery =
    useMediaAssets();


  if (
    projectQuery.isLoading ||
    categoriesQuery.isLoading ||
    technologiesQuery.isLoading ||
    mediaQuery.isLoading
  ) {
    return (
      <div
        className={
          styles.state
        }
      >
        Loading project...
      </div>
    );
  }


  if (
    !projectQuery.data ||
    !categoriesQuery.data ||
    !technologiesQuery.data ||
    !mediaQuery.data
  ) {
    return (
      <div
        className={
          styles.errorState
        }
      >
        Unable to load project.
      </div>
    );
  }


  const project =
    projectQuery.data;


  return (
    <div
      className={
        styles.page
      }
    >
      <Link
        href="/admin/projects"
        className={
          styles.back
        }
      >
        <ArrowLeft
          size={16}
        />
        Back to projects
      </Link>

      <PageHeader
        eyebrow={
          project.status
        }
        title={
          project.title
        }
        description={
          project.short_description ??
          "Manage all content associated with this project."
        }
      />

      <div
        className={
          styles.summary
        }
      >
        <span>
          Categories:{" "}
          {
            project.categories
              .length
          }
        </span>

        <span>
          Technologies:{" "}
          {
            project.technologies
              .length
          }
        </span>

        <span>
          Links:{" "}
          {
            project.links.length
          }
        </span>

        <span>
          Media:{" "}
          {
            project.media.length
          }
        </span>

        <span>
          Sections:{" "}
          {
            project.sections
              .length
          }
        </span>
      </div>


      <div
        className={
          styles.tabs
        }
      >
        <button
          type="button"
          className={
            tab === "categories"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab(
              "categories",
            )
          }
        >
          <Tags size={16} />
          Categories
        </button>

        <button
          type="button"
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
          <Code2 size={16} />
          Technologies
        </button>

        <button
          type="button"
          className={
            tab === "links"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab("links")
          }
        >
          <Link2 size={16} />
          Links
        </button>

        <button
          type="button"
          className={
            tab === "media"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab("media")
          }
        >
          <Images size={16} />
          Media
        </button>

        <button
          type="button"
          className={
            tab === "sections"
              ? styles.activeTab
              : ""
          }
          onClick={() =>
            setTab(
              "sections",
            )
          }
        >
          <Layers3
            size={16}
          />
          Sections
        </button>
      </div>


      {tab === "categories" && (
        <ProjectCategoriesPanel
          projectId={
            project.id
          }
          relations={
            project.categories
          }
          categories={
            categoriesQuery.data
          }
        />
      )}

      {tab === "technologies" && (
        <ProjectTechnologiesPanel
          projectId={
            project.id
          }
          assignments={
            project.technologies
          }
          technologies={
            technologiesQuery.data
          }
        />
      )}

      {tab === "links" && (
        <ProjectLinksPanel
          projectId={
            project.id
          }
          links={
            project.links
          }
        />
      )}

      {tab === "media" && (
        <ProjectMediaPanel
          projectId={
            project.id
          }
          assignments={
            project.media
          }
          assets={
            mediaQuery.data
          }
        />
      )}

      {tab === "sections" && (
        <ProjectSectionsPanel
          projectId={
            project.id
          }
          sections={
            project.sections
          }
        />
      )}
    </div>
  );
}