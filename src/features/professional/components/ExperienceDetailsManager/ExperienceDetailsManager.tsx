"use client";

import {
  ArrowLeft,
} from "lucide-react";

import Link from "next/link";

import {
  PageHeader,
} from "@/shared/components/admin/PageHeader/PageHeader";

import {
  useTechnologies,
} from "@/features/technologies/hooks/technology.queries";

import {
  useExperience,
} from "../../hooks/professional.queries";

import {
  ExperienceHighlightsPanel,
} from "../ExperienceHighlightsPanel/ExperienceHighlightsPanel";

import {
  ExperienceTechnologiesPanel,
} from "../ExperienceTechnologiesPanel/ExperienceTechnologiesPanel";

import styles from "./ExperienceDetailsManager.module.css";


type Props = {
  experienceId:
    number;
};


export function ExperienceDetailsManager({
  experienceId,
}: Props) {
  const experienceQuery =
    useExperience(
      experienceId,
    );

  const technologiesQuery =
    useTechnologies();


  if (
    experienceQuery.isLoading ||
    technologiesQuery.isLoading
  ) {
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
          Loading experience...
        </p>
      </div>
    );
  }


  if (
    experienceQuery.isError ||
    technologiesQuery.isError ||
    !experienceQuery.data ||
    !technologiesQuery.data
  ) {
    return (
      <div
        className={
          styles.errorState
        }
      >
        Unable to load experience.
      </div>
    );
  }


  const experience =
    experienceQuery.data;


  return (
    <div
      className={styles.page}
    >
      <Link
        href="/admin/experience"
        className={
          styles.back
        }
      >
        <ArrowLeft size={16} />

        Back to experience
      </Link>

      <PageHeader
        eyebrow="Experience"
        title={
          experience.role_title
        }
        description="
          Manage achievements and
          technologies associated
          with this professional role.
        "
      />

      <ExperienceHighlightsPanel
        experienceId={
          experience.id
        }
        highlights={
          experience.highlights ??
          []
        }
      />

      <ExperienceTechnologiesPanel
        experienceId={
          experience.id
        }
        assignments={
          experience.technologies ??
          []
        }
        technologies={
          technologiesQuery.data
        }
      />
    </div>
  );
}