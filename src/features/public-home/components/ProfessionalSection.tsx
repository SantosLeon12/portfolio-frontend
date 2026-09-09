import {
  BriefcaseBusiness,
  GraduationCap,
  Languages,
} from "lucide-react";

import {
  ExperienceTimeline,
} from "./ExperienceTimeline";

import type {
  PublicEducation,
  PublicExperience,
  PublicProfileLanguage,
} from "../types/publicHome.types";

import styles from "./ProfessionalSection.module.css";


type ProfessionalSectionProps = {
  experiences:
    PublicExperience[];

  educations:
    PublicEducation[];

  languages:
    PublicProfileLanguage[];
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
   COMPONENT
   ========================================================= */

export function ProfessionalSection({
  experiences,
  educations,
  languages,
}: ProfessionalSectionProps) {
  return (
    <section
      id="experience"
      className={[
        "public-section",
        styles.section,
      ].join(" ")}
    >
      <div
        className={[
          "public-container",
          styles.container,
        ].join(" ")}
      >
        {/* ===================================================
            HEADER
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
              04
            </span>

            <span
              className={
                styles.sectionLine
              }
            />

            <span>
              Professional journey
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
              Experience that turns
              code into{" "}
              <span className="public-gradient-text">
                real operations.
              </span>
            </h2>

            <p
              className={
                styles.sectionDescription
              }
            >
              Professional experience,
              education and continuous
              learning that support the
              way I approach software
              development.
            </p>
          </div>
        </header>


        {/* ===================================================
            CONTENT
            =================================================== */}

        <div
          className={
            styles.contentGrid
          }
        >
          {/* ===============================================
              EXPERIENCE
              =============================================== */}

          <div>
            <div
              className={
                styles.blockHeader
              }
            >
              <BriefcaseBusiness
                size={18}
                strokeWidth={
                  1.7
                }
              />

              <span>
                Experience
              </span>
            </div>

            <ExperienceTimeline
              experiences={
                experiences
              }
            />
          </div>


          {/* ===============================================
              EDUCATION + LANGUAGES
              =============================================== */}

          <aside
            className={
              styles.sideColumn
            }
          >
            <div
              className={
                styles.sideBlock
              }
            >
              <div
                className={
                  styles.blockHeader
                }
              >
                <GraduationCap
                  size={18}
                  strokeWidth={
                    1.7
                  }
                />

                <span>
                  Education
                </span>
              </div>

              <div
                className={
                  styles.educationList
                }
              >
                {educations.map(
                  (
                    education,
                  ) => (
                    <article
                      key={
                        education.id
                      }
                      className={
                        styles.educationCard
                      }
                    >
                      <span
                        className={
                          styles.educationPeriod
                        }
                      >
                        {formatPeriod(
                          education.start_date,
                          education.end_date,
                        )}
                      </span>

                      <h3>
                        {
                          education.degree
                        }
                      </h3>

                      <p>
                        {
                          education
                            .organization
                            .name
                        }
                      </p>

                      {education.location ? (
                        <span
                          className={
                            styles.educationLocation
                          }
                        >
                          {
                            education.location
                          }
                        </span>
                      ) : null}
                    </article>
                  ),
                )}
              </div>
            </div>


            {/* =============================================
                LANGUAGES
                ============================================= */}

            {languages.length >
            0 ? (
              <div
                className={
                  styles.sideBlock
                }
              >
                <div
                  className={
                    styles.blockHeader
                  }
                >
                  <Languages
                    size={18}
                    strokeWidth={
                      1.7
                    }
                  />

                  <span>
                    Languages
                  </span>
                </div>

                <div
                  className={
                    styles.languageList
                  }
                >
                  {languages.map(
                    (item) => (
                      <div
                        key={
                          item.language.id
                        }
                        className={
                          styles.languageItem
                        }
                      >
                        <div>
                          <strong>
                            {
                              item
                                .language
                                .name
                            }
                          </strong>

                          <span>
                            {
                              item
                                .proficiency_level
                                .code
                            }
                          </span>
                        </div>

                        <p>
                          {
                            item
                              .proficiency_level
                              .name
                          }
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}