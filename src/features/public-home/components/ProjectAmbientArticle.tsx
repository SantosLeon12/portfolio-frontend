"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

import {
  setProjectStackFocus,
} from "../state/projectStackFocus.store";

import styles from "./ProjectsSection.module.css";


type ProjectAmbientArticleProps = {
  children: ReactNode;

  className: string;

  projectSlug: string;

  projectTitle: string;

  technologyIds: number[];

  projectIndex: number;

  reverse?: boolean;
};


/* =========================================================
   AMBIENT TONE
   ========================================================= */

function getAmbientToneClass(
  projectSlug: string,
  projectIndex: number,
) {
  switch (projectSlug) {
    case "hisoft":
      return styles.ambientIndigoCyan;

    case "hisoft-analytics":
      return styles.ambientCyan;

    case "hirewards":
      return styles.ambientIndigoCoral;

    case "check-app":
      return styles.ambientCyanIndigo;

    case "portfolio-web":
      return styles.ambientIndigo;

    default: {
      const fallbackTones = [
        styles.ambientIndigoCyan,
        styles.ambientCyan,
        styles.ambientIndigoCoral,
        styles.ambientCyanIndigo,
        styles.ambientIndigo,
      ];

      return (
        fallbackTones[
          projectIndex %
            fallbackTones.length
        ] ??
        styles.ambientIndigoCyan
      );
    }
  }
}


/* =========================================================
   COMPONENT
   ========================================================= */

export function ProjectAmbientArticle({
  children,
  className,
  projectSlug,
  projectTitle,
  technologyIds,
  projectIndex,
  reverse = false,
}: ProjectAmbientArticleProps) {
  const articleRef =
    useRef<HTMLElement | null>(
      null,
    );

  const [
    desktopFocused,
    setDesktopFocused,
  ] = useState(false);

  const [
    mobileFocused,
    setMobileFocused,
  ] = useState(false);

  const ambientToneClass =
    getAmbientToneClass(
      projectSlug,
      projectIndex,
    );

  const active =
    desktopFocused ||
    mobileFocused;


  /* =======================================================
     PROJECT -> STACK RELATIONSHIP
     ======================================================= */

  /*
   * We only SET the relationship when a project becomes
   * active.
   *
   * We intentionally do NOT erase it when the project loses
   * focus. This allows the user to leave Projects, continue
   * scrolling and arrive at Stack while retaining the
   * context of the last project they were exploring.
   */

  useEffect(() => {
    if (!active) {
      return;
    }

    setProjectStackFocus({
      projectSlug,
      projectTitle,
      technologyIds,
    });
  }, [
    active,
    projectSlug,
    projectTitle,
    technologyIds,
  ]);


  /* =======================================================
     MOBILE VIEWPORT FOCUS
     ======================================================= */

  useEffect(() => {
    const node =
      articleRef.current;

    if (!node) {
      return;
    }

    const touchLikeDevice =
      window.matchMedia(
        "(hover: none) and (pointer: coarse)",
      );

    if (
      !touchLikeDevice.matches ||
      !(
        "IntersectionObserver" in
        window
      )
    ) {
      return;
    }

    /*
     * We shrink the observer root to a band around the
     * center of the viewport.
     *
     * This makes the project passing through that band
     * the visual protagonist.
     */

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          setMobileFocused(
            entry.isIntersecting,
          );
        },
        {
          threshold: 0,

          rootMargin:
            "-34% 0px -34% 0px",
        },
      );

    observer.observe(
      node,
    );

    return () => {
      observer.disconnect();

      setMobileFocused(
        false,
      );
    };
  }, []);


  /* =======================================================
     POINTER FOCUS
     ======================================================= */

  const handlePointerEnter = (
    event: PointerEvent<HTMLElement>,
  ) => {
    if (
      event.pointerType ===
      "mouse"
    ) {
      setDesktopFocused(
        true,
      );
    }
  };


  const handlePointerLeave = (
    event: PointerEvent<HTMLElement>,
  ) => {
    if (
      event.pointerType ===
      "mouse"
    ) {
      setDesktopFocused(
        false,
      );
    }
  };


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <article
      ref={articleRef}
      className={[
        className,

        ambientToneClass,

        reverse
          ? styles.ambientFromRight
          : styles.ambientFromLeft,

        active
          ? styles.ambientActive
          : "",
      ].join(" ")}
      onPointerEnter={
        handlePointerEnter
      }
      onPointerLeave={
        handlePointerLeave
      }
    >
      {/* ===================================================
          PROJECT AMBIENT
          =================================================== */}

      <div
        className={
          styles.projectAmbient
        }
        aria-hidden="true"
      >
        <span
          className={
            styles.ambientPrimary
          }
        />

        <span
          className={
            styles.ambientSecondary
          }
        />
      </div>

      {children}
    </article>
  );
}