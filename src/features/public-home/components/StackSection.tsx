"use client";

import {
  useSyncExternalStore,
} from "react";

import {
  getProjectStackFocus,
  getProjectStackFocusServerSnapshot,
  subscribeProjectStackFocus,
} from "../state/projectStackFocus.store";

import type {
  PublicProfileTechnology,
  PublicTechnologyCategory,
} from "../types/publicHome.types";

import styles from "./StackSection.module.css";


type StackSectionProps = {
  technologies:
    PublicProfileTechnology[];
};


type TechnologyGroup = {
  category:
    PublicTechnologyCategory;

  technologies:
    PublicProfileTechnology[];
};


/* =========================================================
   HELPERS
   ========================================================= */

function sortTechnologies(
  technologies:
    PublicProfileTechnology[],
) {
  return [...technologies].sort(
    (a, b) =>
      a.display_order -
      b.display_order,
  );
}


function groupTechnologies(
  technologies:
    PublicProfileTechnology[],
): TechnologyGroup[] {
  const groups =
    new Map<
      number,
      TechnologyGroup
    >();

  technologies.forEach(
    (item) => {
      const category =
        item.technology.category;

      const existing =
        groups.get(
          category.id,
        );

      if (existing) {
        existing.technologies.push(
          item,
        );

        return;
      }

      groups.set(
        category.id,
        {
          category,

          technologies: [
            item,
          ],
        },
      );
    },
  );

  return Array.from(
    groups.values(),
  )
    .map(
      (group) => ({
        ...group,

        technologies:
          sortTechnologies(
            group.technologies,
          ),
      }),
    )
    .sort(
      (a, b) =>
        a.category
          .display_order -
        b.category
          .display_order,
    );
}


/* =========================================================
   COMPONENT
   ========================================================= */

export function StackSection({
  technologies,
}: StackSectionProps) {
  const activeProject =
    useSyncExternalStore(
      subscribeProjectStackFocus,
      getProjectStackFocus,
      getProjectStackFocusServerSnapshot,
    );

  const visible =
    sortTechnologies(
      technologies.filter(
        (item) =>
          item.is_visible,
      ),
    );

  const featured =
    visible.filter(
      (item) =>
        item.featured,
    );

  const extended =
    visible.filter(
      (item) =>
        !item.featured,
    );

  const groups =
    groupTechnologies(
      extended,
    );

  const relatedTechnologyIds =
    new Set(
      activeProject
        ?.technologyIds ??
        [],
    );

  const relatedCount =
    visible.filter(
      (item) =>
        relatedTechnologyIds.has(
          item.technology.id,
        ),
    ).length;

  /*
   * If the focused project shares no technologies with the
   * profile stack, Stack simply stays in its normal state.
   */

  const projectConnection =
    activeProject &&
    relatedCount > 0
      ? activeProject
      : null;


  if (visible.length === 0) {
    return null;
  }


  return (
    <section
      id="stack"
      className={[
        "public-section",
        styles.section,

        projectConnection
          ? styles.connectionActive
          : "",
      ].join(" ")}
    >
      <div
        className={[
          "public-container",
          styles.container,
        ].join(" ")}
      >
        {/* ===================================================
            SECTION HEADER
            =================================================== */}

        <header
          className={
            styles.sectionHeader
          }
        >
          <div
            className={
              styles.sectionLabel
            }
          >
            <span
              className={
                styles.sectionNumber
              }
            >
              03
            </span>

            <span
              className={
                styles.sectionLine
              }
            />

            <span>
              Technology stack
            </span>
          </div>

          <div
            className={
              styles.headingGrid
            }
          >
            <h2
              className={
                styles.sectionTitle
              }
            >
              The tools behind{" "}
              <span className="public-gradient-text">
                the work.
              </span>
            </h2>

            <p
              className={
                styles.sectionDescription
              }
            >
              Technologies I use
              across frontend,
              backend, databases,
              integrations and
              mobile development.
            </p>
          </div>
        </header>


        {/* ===================================================
            CORE STACK
            =================================================== */}

        {featured.length >
        0 ? (
          <div
            className={
              styles.coreSection
            }
          >
            <div
              className={
                styles.subsectionHeader
              }
            >
              <div>
                <span>
                  Core stack
                </span>

                <h3>
                  Technologies I use
                  most.
                </h3>
              </div>

              {projectConnection ? (
                <div
                  className={
                    styles.projectConnection
                  }
                  aria-live="polite"
                >
                  <span
                    className={
                      styles.connectionPulse
                    }
                    aria-hidden="true"
                  />

                  <span
                    className={
                      styles.connectionText
                    }
                  >
                    Used in
                  </span>

                  <strong>
                    {
                      projectConnection
                        .projectTitle
                    }
                  </strong>
                </div>
              ) : null}
            </div>

            <div
              className={
                styles.coreGrid
              }
            >
              {featured.map(
                (item) => {
                  const related =
                    projectConnection
                      ? relatedTechnologyIds.has(
                          item
                            .technology
                            .id,
                        )
                      : false;

                  return (
                    <article
                      key={
                        item
                          .technology
                          .id
                      }
                      className={[
                        styles.coreTechnology,

                        related
                          ? styles.relatedCoreTechnology
                          : "",
                      ].join(" ")}
                    >
                      {related ? (
                        <span
                          className={
                            styles.relatedMark
                          }
                          aria-hidden="true"
                        />
                      ) : null}

                      <span
                        className={
                          styles.coreDot
                        }
                      />

                      <div>
                        <h4>
                          {
                            item
                              .technology
                              .name
                          }
                        </h4>

                        <p>
                          {
                            item
                              .technology
                              .category
                              .name
                          }
                        </p>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          </div>
        ) : null}


        {/* ===================================================
            EXTENDED TOOLKIT
            =================================================== */}

        {groups.length > 0 ? (
          <div
            className={
              styles.extendedSection
            }
          >
            <div
              className={
                styles.extendedHeader
              }
            >
              <span>
                Extended toolkit
              </span>

              <p>
                Additional
                technologies used
                across different
                projects.
              </p>
            </div>

            <div
              className={
                styles.groups
              }
            >
              {groups.map(
                (group) => {
                  const groupRelated =
                    projectConnection
                      ? group
                          .technologies
                          .some(
                            (
                              item,
                            ) =>
                              relatedTechnologyIds.has(
                                item
                                  .technology
                                  .id,
                              ),
                          )
                      : false;

                  return (
                    <article
                      key={
                        group.category.id
                      }
                      className={[
                        styles.group,

                        groupRelated
                          ? styles.relatedGroup
                          : "",
                      ].join(" ")}
                    >
                      <div
                        className={
                          styles.groupHeader
                        }
                      >
                        <h3>
                          {
                            group
                              .category
                              .name
                          }
                        </h3>

                        <span>
                          {
                            group
                              .technologies
                              .length
                          }
                        </span>
                      </div>

                      <div
                        className={
                          styles.technologyList
                        }
                      >
                        {group.technologies.map(
                          (item) => {
                            const related =
                              projectConnection
                                ? relatedTechnologyIds.has(
                                    item
                                      .technology
                                      .id,
                                  )
                                : false;

                            return (
                              <span
                                key={
                                  item
                                    .technology
                                    .id
                                }
                                className={[
                                  styles.technology,

                                  related
                                    ? styles.relatedTechnology
                                    : "",
                                ].join(" ")}
                              >
                                {
                                  item
                                    .technology
                                    .name
                                }
                              </span>
                            );
                          },
                        )}
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}