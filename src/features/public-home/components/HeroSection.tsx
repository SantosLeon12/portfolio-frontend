import Image from "next/image";

import {
  ArrowDown,
  ArrowRight,
  Download,
  Mail,
  MapPin,
} from "lucide-react";

import {
  FaLinkedin,
} from "react-icons/fa";

import type {
  PublicProfile,
  PublicProfileDocument,
  PublicProfileMedia,
} from "../types/publicHome.types";

import styles from "./HeroSection.module.css";


type HeroSectionProps = {
  profile: PublicProfile;

  profileMedia:
    PublicProfileMedia[];

  documents:
    PublicProfileDocument[];
};


function getHeroImage(
  media: PublicProfileMedia[],
) {
  return (
    media.find(
      (item) =>
        item.media_role ===
        "HERO",
    ) ??
    media.find(
      (item) =>
        item.media_role ===
        "AVATAR",
    ) ??
    media[0] ??
    null
  );
}


function getResume(
  documents:
    PublicProfileDocument[],
) {
  return (
    documents.find(
      (document) =>
        document.document_type ===
        "CV",
    ) ??
    documents.find(
      (document) =>
        document.document_type ===
        "RESUME",
    ) ??
    null
  );
}


export function HeroSection({
  profile,
  profileMedia,
  documents,
}: HeroSectionProps) {
  const heroImage =
    getHeroImage(
      profileMedia,
    );

  const resume =
    getResume(
      documents,
    );

  const email =
    profile.contacts.find(
      (contact) =>
        contact.contact_type ===
          "EMAIL" &&
        contact.is_visible,
    );

  const linkedin =
    profile.social_links.find(
      (link) =>
        link.platform
          .toLowerCase() ===
          "linkedin" &&
        link.is_visible,
    );


  return (
    <section
      id="home"
      className={
        styles.hero
      }
    >
      <div
        className={
          styles.backgroundGlow
        }
        aria-hidden="true"
      />

      <div
        className={[
          "public-container",
          styles.container,
        ].join(" ")}
      >
        {/* ===================================================
            CONTENT
            =================================================== */}

        <div
          className={
            styles.content
          }
        >
          {profile.availability_text ? (
            <div
              className={
                styles.availability
              }
            >
              <span
                className={
                  styles.availabilityDot
                }
                aria-hidden="true"
              />

              <span>
                {
                  profile.availability_text
                }
              </span>
            </div>
          ) : null}


          <p
            className={
              styles.introduction
            }
          >
            Hello, I&apos;m
          </p>


          <h1
            className={
              styles.name
            }
          >
            {profile.full_name}
          </h1>


          <p
            className={
              styles.professionalTitle
            }
          >
            {
              profile.professional_title
            }
          </p>


          {profile.headline ? (
            <p
              className={
                styles.headline
              }
            >
              {
                profile.headline
              }
            </p>
          ) : null}


          {/* =================================================
              PRIMARY ACTIONS
              ================================================= */}

          <div
            className={
              styles.primaryActions
            }
          >
            <a
              href="#projects"
              className={
                styles.primaryButton
              }
            >
              <span>
                View Projects
              </span>

              <ArrowRight
                size={18}
                strokeWidth={
                  1.8
                }
              />
            </a>


            {resume ? (
              <a
                href={
                  resume
                    .media_asset
                    .url
                }
                target="_blank"
                rel="noreferrer"
                className={
                  styles.secondaryButton
                }
                data-context-cursor="view"
              >
                <span>
                  View Resume
                </span>

                <Download
                  size={18}
                  strokeWidth={
                    1.8
                  }
                />
              </a>
            ) : null}
          </div>


          {/* =================================================
              SECONDARY INFO
              ================================================= */}

          <div
            className={
              styles.secondaryInfo
            }
          >
            {profile.location ? (
              <div
                className={
                  styles.infoItem
                }
              >
                <MapPin
                  size={17}
                  strokeWidth={
                    1.7
                  }
                />

                <span>
                  {
                    profile.location
                  }
                </span>
              </div>
            ) : null}


            {email ? (
              <a
                href={`mailto:${email.value}`}
                className={
                  styles.infoItem
                }
                data-context-cursor="email"
              >
                <Mail
                  size={17}
                  strokeWidth={
                    1.7
                  }
                />

                <span>
                  {
                    email.value
                  }
                </span>
              </a>
            ) : null}


            {linkedin ? (
              <a
                href={
                  linkedin.url
                }
                target="_blank"
                rel="noreferrer"
                className={
                  styles.socialButton
                }
                aria-label="LinkedIn profile"
                data-context-cursor="open"
              >
                <FaLinkedin
                  size={18}
                />
              </a>
            ) : null}
          </div>
        </div>


        {/* ===================================================
            LARGE SCREEN PORTRAIT
            =================================================== */}

        <div
          className={
            styles.visual
          }
        >
          <div
            className={
              styles.visualGlow
            }
            aria-hidden="true"
          />

          <div
            className={
              styles.imageFrame
            }
          >
            <div
              className={
                styles.imageBorder
              }
              aria-hidden="true"
            />


            {heroImage ? (
              <div
                className={
                  styles.imageWrapper
                }
              >
                <Image
                  src={
                    heroImage
                      .media_asset
                      .url
                  }
                  alt={
                    heroImage.alt_text ??
                    profile.full_name
                  }
                  fill
                  priority
                  sizes="(min-width: 1100px) 470px, 42px"
                  className={
                    styles.image
                  }
                />
              </div>
            ) : (
              <div
                className={
                  styles.imageFallback
                }
              >
                <span>
                  {profile.full_name
                    .split(" ")
                    .slice(
                      0,
                      2,
                    )
                    .map(
                      (part) =>
                        part[0],
                    )
                    .join("")}
                </span>
              </div>
            )}


            <div
              className={
                styles.techBadge
              }
            >
              <span
                className={
                  styles.techBadgeDot
                }
              />

              <span>
                Full Stack
              </span>
            </div>
          </div>
        </div>
      </div>


      {/* =====================================================
          LARGE SCREEN SCROLL INDICATOR
          ===================================================== */}

      <a
        href="#about"
        className={
          styles.scrollIndicator
        }
        aria-label="Scroll to about section"
      >
        <span>
          Scroll
        </span>

        <ArrowDown
          size={15}
          strokeWidth={
            1.7
          }
        />
      </a>
    </section>
  );
}