"use client";

import {
  MapPin,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type {
  PublicExperience,
} from "../types/publicHome.types";

import styles from "./ProfessionalSection.module.css";


type ExperienceTimelineProps = {
  experiences:
    PublicExperience[];
};


/* =========================================================
   DATE HELPERS
   ========================================================= */

function formatMonthYear(
  value: string,
) {
  const [
    year,
    month,
  ] =
    value.split("-");

  const date =
    new Date(
      Number(year),
      Number(month) - 1,
      1,
    );

  return new Intl.DateTimeFormat(
    "en",
    {
      month: "short",
      year: "numeric",
    },
  ).format(date);
}


function formatPeriod(
  startDate: string,
  endDate: string | null,
) {
  return `${formatMonthYear(
    startDate,
  )} — ${
    endDate
      ? formatMonthYear(
          endDate,
        )
      : "Present"
  }`;
}


/* =========================================================
   HELPERS
   ========================================================= */

function clamp(
  value: number,
  min: number,
  max: number,
) {
  return Math.min(
    Math.max(
      value,
      min,
    ),
    max,
  );
}


/* =========================================================
   COMPONENT
   ========================================================= */

export function ExperienceTimeline({
  experiences,
}: ExperienceTimelineProps) {
  const timelineRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const progressRef =
    useRef<HTMLSpanElement | null>(
      null,
    );

  const experienceRefs =
    useRef<
      Array<
        HTMLElement | null
      >
    >([]);

  const animationFrameRef =
    useRef<number | null>(
      null,
    );

  const [
    scrollActiveIndex,
    setScrollActiveIndex,
  ] =
    useState<number | null>(
      null,
    );

  const [
    hoveredIndex,
    setHoveredIndex,
  ] =
    useState<number | null>(
      null,
    );

  const activeIndex =
    hoveredIndex ??
    scrollActiveIndex;


  /* =======================================================
     SCROLL PROGRESS + ACTIVE EXPERIENCE
     ======================================================= */

  useEffect(() => {
    const timeline =
      timelineRef.current;

    if (
      !timeline ||
      experiences.length === 0
    ) {
      return;
    }


    const updateTimeline =
      () => {
        animationFrameRef.current =
          null;

        const timelineNode =
          timelineRef.current;

        if (!timelineNode) {
          return;
        }

        const viewportHeight =
          window.innerHeight;

        /*
         * This is the visual focus point.
         *
         * Slightly above the exact center feels more natural
         * while reading because the eye tends to follow
         * content entering from below.
         */

        const focusY =
          viewportHeight *
          0.46;

        const bandTop =
          viewportHeight *
          0.2;

        const bandBottom =
          viewportHeight *
          0.8;

        const timelineRect =
          timelineNode
            .getBoundingClientRect();


        /* =================================================
           PROGRESS LINE
           ================================================= */

        const rawProgress =
          (
            focusY -
            timelineRect.top
          ) /
          Math.max(
            timelineRect.height,
            1,
          );

        const progress =
          clamp(
            rawProgress,
            0,
            1,
          );

        if (
          progressRef.current
        ) {
          progressRef.current
            .style
            .transform =
            `scaleY(${progress})`;
        }


        /* =================================================
           ACTIVE EXPERIENCE
           ================================================= */

        const timelineVisible =
          timelineRect.bottom >=
            bandTop &&
          timelineRect.top <=
            bandBottom;

        if (!timelineVisible) {
          setScrollActiveIndex(
            null,
          );

          return;
        }

        let closestIndex:
          number | null =
          null;

        let closestDistance =
          Number.POSITIVE_INFINITY;

        experienceRefs.current
          .forEach(
            (
              experienceNode,
              index,
            ) => {
              if (
                !experienceNode
              ) {
                return;
              }

              const rect =
                experienceNode
                  .getBoundingClientRect();

              /*
               * Ignore experiences that are completely
               * outside the useful reading area.
               */

              const intersectsBand =
                rect.bottom >=
                  bandTop &&
                rect.top <=
                  bandBottom;

              if (
                !intersectsBand
              ) {
                return;
              }

              const center =
                rect.top +
                rect.height / 2;

              const distance =
                Math.abs(
                  center -
                    focusY,
                );

              if (
                distance <
                closestDistance
              ) {
                closestDistance =
                  distance;

                closestIndex =
                  index;
              }
            },
          );

        setScrollActiveIndex(
          (current) =>
            current ===
            closestIndex
              ? current
              : closestIndex,
        );
      };


    const scheduleUpdate =
      () => {
        if (
          animationFrameRef.current !==
          null
        ) {
          return;
        }

        animationFrameRef.current =
          window.requestAnimationFrame(
            updateTimeline,
          );
      };


    scheduleUpdate();

    window.addEventListener(
      "scroll",
      scheduleUpdate,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      scheduleUpdate,
    );


    return () => {
      window.removeEventListener(
        "scroll",
        scheduleUpdate,
      );

      window.removeEventListener(
        "resize",
        scheduleUpdate,
      );

      if (
        animationFrameRef.current !==
        null
      ) {
        window.cancelAnimationFrame(
          animationFrameRef.current,
        );
      }
    };
  }, [
    experiences.length,
  ]);


  /* =======================================================
     POINTER FOCUS
     ======================================================= */

  const handlePointerEnter = (
    event:
      ReactPointerEvent<HTMLElement>,
    index: number,
  ) => {
    if (
      event.pointerType ===
      "mouse"
    ) {
      setHoveredIndex(
        index,
      );
    }
  };


  const handlePointerLeave = (
    event:
      ReactPointerEvent<HTMLElement>,
    index: number,
  ) => {
    if (
      event.pointerType !==
      "mouse"
    ) {
      return;
    }

    setHoveredIndex(
      (current) =>
        current === index
          ? null
          : current,
    );
  };


  /* =======================================================
     EMPTY
     ======================================================= */

  if (
    experiences.length === 0
  ) {
    return null;
  }


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div
      ref={timelineRef}
      className={
        styles.timeline
      }
    >
      {/* ===================================================
          TIMELINE TRACK
          =================================================== */}

      <div
        className={
          styles.timelineTrack
        }
        aria-hidden="true"
      >
        <span
          ref={progressRef}
          className={
            styles.timelineProgress
          }
        />
      </div>


      {/* ===================================================
          EXPERIENCES
          =================================================== */}

      {experiences.map(
        (
          experience,
          index,
        ) => {
          const highlights =
            [
              ...experience
                .highlights,
            ]
              .filter(
                (item) =>
                  item.is_visible,
              )
              .sort(
                (a, b) =>
                  a.display_order -
                  b.display_order,
              );

          const technologies =
            [
              ...experience
                .technologies,
            ]
              .sort(
                (a, b) =>
                  a.display_order -
                  b.display_order,
              )
              .slice(
                0,
                8,
              );

          const active =
            activeIndex ===
            index;

          const completed =
            activeIndex !==
              null &&
            index <
              activeIndex;


          return (
            <article
              key={
                experience.id
              }
              ref={(
                node,
              ) => {
                experienceRefs
                  .current[
                    index
                  ] =
                  node;
              }}
              className={[
                styles.experience,

                active
                  ? styles.experienceActive
                  : "",

                completed
                  ? styles.experienceCompleted
                  : "",
              ].join(" ")}
              onPointerEnter={(
                event,
              ) =>
                handlePointerEnter(
                  event,
                  index,
                )
              }
              onPointerLeave={(
                event,
              ) =>
                handlePointerLeave(
                  event,
                  index,
                )
              }
            >
              {/* ===========================================
                  MARKER
                  =========================================== */}

              <div
                className={
                  styles.timelineMarker
                }
                aria-hidden="true"
              />


              {/* ===========================================
                  BODY
                  =========================================== */}

              <div
                className={
                  styles.experienceBody
                }
              >
                <div
                  className={
                    styles.period
                  }
                >
                  {formatPeriod(
                    experience.start_date,
                    experience.end_date,
                  )}
                </div>

                <h3
                  className={
                    styles.role
                  }
                >
                  {
                    experience.role_title
                  }
                </h3>

                <p
                  className={
                    styles.organization
                  }
                >
                  {
                    experience
                      .organization
                      .name
                  }
                </p>

                {experience.location ? (
                  <div
                    className={
                      styles.location
                    }
                  >
                    <MapPin
                      size={14}
                      strokeWidth={
                        1.7
                      }
                    />

                    <span>
                      {
                        experience.location
                      }
                    </span>
                  </div>
                ) : null}

                {experience.summary ? (
                  <p
                    className={
                      styles.summary
                    }
                  >
                    {
                      experience.summary
                    }
                  </p>
                ) : null}

                {highlights.length >
                0 ? (
                  <ul
                    className={
                      styles.highlights
                    }
                  >
                    {highlights.map(
                      (
                        highlight,
                      ) => (
                        <li
                          key={
                            highlight.id
                          }
                        >
                          <span
                            className={
                              styles.highlightDot
                            }
                          />

                          <span>
                            {
                              highlight.content
                            }
                          </span>
                        </li>
                      ),
                    )}
                  </ul>
                ) : null}

                {technologies.length >
                0 ? (
                  <div
                    className={
                      styles.experienceTechnologies
                    }
                  >
                    {technologies.map(
                      ({
                        technology,
                      }) => (
                        <span
                          key={
                            technology.id
                          }
                        >
                          {
                            technology.name
                          }
                        </span>
                      ),
                    )}
                  </div>
                ) : null}
              </div>
            </article>
          );
        },
      )}
    </div>
  );
}