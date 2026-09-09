import {
  ArrowUpRight,
} from "lucide-react";

import {
  ProjectAmbientArticle,
} from "./ProjectAmbientArticle";

import {
  ProjectMediaViewer,
} from "./ProjectMediaViewer";

import type {
  PublicProjectWithMedia,
} from "../types/publicHome.types";

import styles from "./ProjectsSection.module.css";


type ProjectsSectionProps = {
  projects:
    PublicProjectWithMedia[];
};


export function ProjectsSection({
  projects,
}: ProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      id="projects"
      className={[
        "public-section",
        styles.section,
      ].join(" ")}
    >
      <div
        className={
          styles.sectionGlow
        }
        aria-hidden="true"
      />

      <div
        className={[
          "public-container",
          styles.container,
        ].join(" ")}
      >
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
              02
            </span>

            <span
              className={
                styles.sectionLine
              }
            />

            <span>
              Selected work
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
              Projects that show{" "}
              <span className="public-gradient-text">
                how I build.
              </span>
            </h2>

            <p
              className={
                styles.sectionDescription
              }
            >
              Real systems,
              applications and
              integrations built
              around actual business
              needs.
            </p>
          </div>
        </header>

        <div
          className={
            styles.projects
          }
        >
          {projects.map(
            (
              item,
              index,
            ) => {
              const {
                project,
                media,
              } = item;

              const categories =
                [
                  ...project.categories,
                ].sort(
                  (a, b) =>
                    a.category
                      .display_order -
                    b.category
                      .display_order,
                );

              const sortedTechnologies =
                [
                  ...project.technologies,
                ].sort(
                  (a, b) =>
                    a.display_order -
                    b.display_order,
                );

              const technologies =
                sortedTechnologies.slice(
                  0,
                  7,
                );

              const projectTechnologyIds =
                sortedTechnologies.map(
                  ({
                    technology,
                  }) =>
                    technology.id,
                );

              const projectLink =
                [...project.links]
                  .filter(
                    (link) =>
                      link.is_visible,
                  )
                  .sort(
                    (a, b) =>
                      a.display_order -
                      b.display_order,
                  )[0] ??
                null;

              const reverse =
                index % 2 !== 0;

              return (
                <ProjectAmbientArticle
                  key={
                    project.id
                  }
                  projectSlug={
                    project.slug
                  }
                  projectTitle={
                    project.title
                  }
                  technologyIds={
                    projectTechnologyIds
                  }
                  projectIndex={
                    index
                  }
                  reverse={
                    reverse
                  }
                  className={[
                    styles.project,

                    index === 0
                      ? styles.spotlight
                      : "",

                    reverse
                      ? styles.reverse
                      : "",
                  ].join(" ")}
                >
                  <div
                    className={
                      styles.visualColumn
                    }
                  >
                    <div
                      className={
                        styles.visualHeader
                      }
                    >
                      <span
                        className={
                          styles.projectNumber
                        }
                      >
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      {media.length >
                      0 ? (
                        <span
                          className={
                            styles.mediaHint
                          }
                        >
                          Click image
                          to explore
                        </span>
                      ) : null}
                    </div>

                    <ProjectMediaViewer
                      projectTitle={
                        project.title
                      }
                      projectSlug={
                        project.slug
                      }
                      media={media}
                    />
                  </div>

                  <div
                    className={
                      styles.projectContent
                    }
                  >
                    <div
                      className={
                        styles.projectMeta
                      }
                    >
                      <span>
                        Project{" "}
                        {String(
                          index + 1,
                        ).padStart(
                          2,
                          "0",
                        )}
                      </span>

                      {project.featured ? (
                        <span
                          className={
                            styles.featuredLabel
                          }
                        >
                          Selected work
                        </span>
                      ) : null}
                    </div>

                    {categories.length >
                    0 ? (
                      <div
                        className={
                          styles.categories
                        }
                      >
                        {categories.map(
                          ({
                            category,
                          }) => (
                            <span
                              key={
                                category.id
                              }
                            >
                              {
                                category.name
                              }
                            </span>
                          ),
                        )}
                      </div>
                    ) : null}

                    <h3
                      className={
                        styles.projectTitle
                      }
                    >
                      {project.title}
                    </h3>

                    {project.short_description ? (
                      <p
                        className={
                          styles.projectDescription
                        }
                      >
                        {
                          project.short_description
                        }
                      </p>
                    ) : null}

                    {project.role_summary ? (
                      <div
                        className={
                          styles.roleBlock
                        }
                      >
                        <span>
                          My contribution
                        </span>

                        <p>
                          {
                            project.role_summary
                          }
                        </p>
                      </div>
                    ) : null}

                    {technologies.length >
                    0 ? (
                      <div
                        className={
                          styles.technologies
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

                    {projectLink ? (
                      <a
                        href={
                          projectLink.url
                        }
                        target="_blank"
                        rel="noreferrer"
                        className={
                          styles.projectLink
                        }
                        data-context-cursor="open"
                      >
                        <span>
                          {projectLink.label ??
                            "Open project"}
                        </span>

                        <ArrowUpRight
                          size={17}
                          strokeWidth={
                            1.7
                          }
                        />
                      </a>
                    ) : null}

                    {project.slug ===
                    "portfolio-web" ? (
                      <div
                        className={
                          styles.livingProject
                        }
                      >
                        <span
                          aria-hidden="true"
                        />

                        Continuously
                        evolving project
                      </div>
                    ) : null}
                  </div>
                </ProjectAmbientArticle>
              );
            },
          )}
        </div>
      </div>
    </section>
  );
}