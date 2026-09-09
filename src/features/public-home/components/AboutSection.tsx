import type {
  PublicProfile,
} from "../types/publicHome.types";

import styles from "./AboutSection.module.css";

type AboutSectionProps = {
  profile: PublicProfile;
};

export function AboutSection({
  profile,
}: AboutSectionProps) {
  const strengths =
    profile.strengths
      .filter(
        (strength) =>
          strength.is_visible,
      )
      .sort(
        (a, b) =>
          a.display_order -
          b.display_order,
      );

  const interests =
    profile.interests
      .filter(
        (interest) =>
          interest.is_visible,
      )
      .sort(
        (a, b) =>
          a.display_order -
          b.display_order,
      );

  return (
    <section
      id="about"
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
              01
            </span>

            <span
              className={
                styles.sectionLine
              }
            />

            <span>
              About me
            </span>
          </div>

          <h2
            className={
              styles.sectionTitle
            }
          >
            Building software
            around{" "}
            <span className="public-gradient-text">
              real needs.
            </span>
          </h2>
        </header>

        <div
          className={
            styles.aboutGrid
          }
        >
          <div
            className={
              styles.aboutMain
            }
          >
            {profile.short_bio ? (
              <p
                className={
                  styles.lead
                }
              >
                {
                  profile.short_bio
                }
              </p>
            ) : null}

            {profile.about ? (
              <p
                className={
                  styles.aboutText
                }
              >
                {profile.about}
              </p>
            ) : null}
          </div>

          {profile.mission ? (
            <aside
              className={
                styles.mission
              }
            >
              <span
                className={
                  styles.missionLabel
                }
              >
                My mission
              </span>

              <p>
                {profile.mission}
              </p>
            </aside>
          ) : null}
        </div>

        {strengths.length > 0 ? (
          <div
            className={
              styles.strengthsSection
            }
          >
            <div
              className={
                styles.subsectionHeader
              }
            >
              <span>
                How I work
              </span>

              <h3>
                Strengths behind
                the work.
              </h3>
            </div>

            <div
              className={
                styles.strengths
              }
            >
              {strengths.map(
                (
                  strength,
                  index,
                ) => (
                  <article
                    key={
                      strength.id
                    }
                    className={
                      styles.strength
                    }
                  >
                    <span
                      className={
                        styles.strengthIndex
                      }
                    >
                      {String(
                        index + 1,
                      ).padStart(
                        2,
                        "0",
                      )}
                    </span>

                    <div>
                      <h4>
                        {
                          strength.title
                        }
                      </h4>

                      {strength.description ? (
                        <p>
                          {
                            strength.description
                          }
                        </p>
                      ) : null}
                    </div>
                  </article>
                ),
              )}
            </div>
          </div>
        ) : null}

        {interests.length > 0 ? (
          <div
            className={
              styles.interestsSection
            }
          >
            <div
              className={
                styles.interestsHeader
              }
            >
              <span>
                Areas I enjoy
              </span>

              <p>
                Explore horizontally
              </p>
            </div>

            <div
              className={
                styles.interestsScroller
              }
            >
              {interests.map(
                (interest) => (
                  <div
                    key={
                      interest.id
                    }
                    className={
                      styles.interest
                    }
                    title={
                      interest.description ??
                      undefined
                    }
                  >
                    <span
                      className={
                        styles.interestDot
                      }
                    />

                    {
                      interest.name
                    }
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}