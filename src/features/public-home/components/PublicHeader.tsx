"use client";

import Image from "next/image";

import {
  Download,
  Menu,
  X,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import styles from "./PublicHeader.module.css";


type PublicHeaderProps = {
  resumeUrl?:
    | string
    | null;

  profileImageUrl?:
    | string
    | null;

  profileImageAlt?:
    | string
    | null;
};


const navigationItems = [
  {
    id: "about",
    label: "About",
    href: "#about",
  },
  {
    id: "projects",
    label: "Projects",
    href: "#projects",
  },
  {
    id: "stack",
    label: "Stack",
    href: "#stack",
  },
  {
    id: "experience",
    label: "Experience",
    href: "#experience",
  },
  {
    id: "contact",
    label: "Contact",
    href: "#contact",
  },
] as const;


type NavigationSectionId =
  (
    typeof navigationItems
  )[number]["id"];


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


export function PublicHeader({
  resumeUrl,
  profileImageUrl,
  profileImageAlt,
}: PublicHeaderProps) {
  const [
    mounted,
    setMounted,
  ] = useState(false);

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const [
    profileImageFailed,
    setProfileImageFailed,
  ] = useState(false);

  const [
    activeSection,
    setActiveSection,
  ] =
    useState<
      NavigationSectionId | null
    >(null);

  const [
    scrollProgress,
    setScrollProgress,
  ] = useState(0);


  const activeNavigationItem =
    navigationItems.find(
      (item) =>
        item.id ===
        activeSection,
    ) ??
    null;


  const showProfileAvatar =
    Boolean(
      profileImageUrl,
    ) &&
    !profileImageFailed;


  /* =======================================================
     MOUNT
     ======================================================= */

  useEffect(() => {
    setMounted(true);
  }, []);


  /* =======================================================
     RESET IMAGE FALLBACK
     ======================================================= */

  useEffect(() => {
    setProfileImageFailed(
      false,
    );
  }, [
    profileImageUrl,
  ]);


  /* =======================================================
     SECTION + SCROLL PROGRESS
     ======================================================= */

  useEffect(() => {
    let animationFrame:
      number | null =
      null;


    const updateNavigationState =
      () => {
        animationFrame =
          null;


        const sections =
          navigationItems
            .map(
              (item) => ({
                item,

                element:
                  document.getElementById(
                    item.id,
                  ),
              }),
            )
            .filter(
              (
                entry,
              ): entry is {
                item:
                  (typeof navigationItems)[number];

                element:
                  HTMLElement;
              } =>
                entry.element !==
                null,
            );


        if (
          sections.length === 0
        ) {
          return;
        }


        const scrollY =
          window.scrollY;

        const viewportHeight =
          window.innerHeight;

        const documentHeight =
          document.documentElement
            .scrollHeight;


        const rootStyles =
          window.getComputedStyle(
            document.documentElement,
          );


        const headerHeightValue =
          Number.parseFloat(
            rootStyles
              .getPropertyValue(
                "--header-height",
              )
              .trim(),
          );


        const headerHeight =
          Number.isFinite(
            headerHeightValue,
          )
            ? headerHeightValue
            : 72;


        const readingFocus =
          scrollY +
          headerHeight +
          Math.min(
            viewportHeight *
              0.28,
            250,
          );


        let nextActiveSection:
          NavigationSectionId | null =
          null;


        sections.forEach(
          ({
            item,
            element,
          }) => {
            const rect =
              element
                .getBoundingClientRect();


            const sectionTop =
              rect.top +
              scrollY;


            if (
              readingFocus >=
              sectionTop
            ) {
              nextActiveSection =
                item.id;
            }
          },
        );


        const nearPageBottom =
          scrollY +
            viewportHeight >=
          documentHeight -
            8;


        if (
          nearPageBottom
        ) {
          nextActiveSection =
            "contact";
        }


        setActiveSection(
          (current) =>
            current ===
            nextActiveSection
              ? current
              : nextActiveSection,
        );


        /* ===============================================
           CONTINUOUS PROGRESS
           =============================================== */

        const firstSection =
          sections[0]
            .element;

        const lastSection =
          sections[
            sections.length - 1
          ].element;


        const firstRect =
          firstSection
            .getBoundingClientRect();

        const lastRect =
          lastSection
            .getBoundingClientRect();


        const progressStart =
          firstRect.top +
          scrollY -
          headerHeight;


        const lastSectionBottom =
          lastRect.bottom +
          scrollY;


        const progressEnd =
          Math.max(
            progressStart + 1,

            lastSectionBottom -
              viewportHeight *
                0.52,
          );


        const rawProgress =
          (
            scrollY -
            progressStart
          ) /
          (
            progressEnd -
            progressStart
          );


        const nextProgress =
          nearPageBottom
            ? 1
            : clamp(
                rawProgress,
                0,
                1,
              );


        setScrollProgress(
          (current) =>
            Math.abs(
              current -
                nextProgress,
            ) <
            0.001
              ? current
              : nextProgress,
        );
      };


    const scheduleUpdate =
      () => {
        if (
          animationFrame !==
          null
        ) {
          return;
        }

        animationFrame =
          window.requestAnimationFrame(
            updateNavigationState,
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

    window.addEventListener(
      "load",
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

      window.removeEventListener(
        "load",
        scheduleUpdate,
      );


      if (
        animationFrame !==
        null
      ) {
        window.cancelAnimationFrame(
          animationFrame,
        );
      }
    };
  }, []);


  /* =======================================================
     MOBILE MENU
     ======================================================= */

  useEffect(() => {
    if (!menuOpen) {
      return;
    }


    const previousOverflow =
      document.body.style
        .overflow;


    document.body.style.overflow =
      "hidden";


    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key ===
        "Escape"
      ) {
        setMenuOpen(
          false,
        );
      }
    };


    window.addEventListener(
      "keydown",
      handleKeyDown,
    );


    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    menuOpen,
  ]);


  const closeMenu =
    () => {
      setMenuOpen(
        false,
      );
    };


  const toggleMenu =
    () => {
      setMenuOpen(
        (current) =>
          !current,
      );
    };


  return (
    <>
      <header
        className={
          styles.header
        }
      >
        <div
          className={[
            "public-container",
            styles.inner,
          ].join(" ")}
        >
          {/* ===============================================
              BRAND / COMPACT AVATAR
              =============================================== */}

          <a
            href="#home"
            className={
              styles.brand
            }
            aria-label="Go to home"
            onClick={
              closeMenu
            }
          >
            {showProfileAvatar &&
            profileImageUrl ? (
              <span
                className={
                  styles.compactAvatar
                }
              >
                <Image
                  src={
                    profileImageUrl
                  }
                  alt={
                    profileImageAlt ??
                    "Profile photo"
                  }
                  fill
                  sizes="42px"
                  className={
                    styles.compactAvatarImage
                  }
                  onError={() =>
                    setProfileImageFailed(
                      true,
                    )
                  }
                />
              </span>
            ) : null}


            <span
              className={[
                styles.brandWordmark,

                showProfileAvatar
                  ? styles.brandWordmarkHiddenCompact
                  : "",
              ].join(" ")}
            >
              <span
                className={
                  styles.brandPrimary
                }
              >
                Jorge
              </span>

              <span
                className={
                  styles.brandAccent
                }
                aria-hidden="true"
              >
                .
              </span>
            </span>
          </a>


          {/* ===============================================
              MOBILE CURRENT SECTION
              =============================================== */}

          <div
            className={
              styles.mobileSectionStatus
            }
            aria-hidden="true"
          >
            <span
              key={
                activeNavigationItem
                  ?.id ??
                "overview"
              }
              className={
                styles.mobileSectionName
              }
            >
              {activeNavigationItem
                ?.label ??
                "Overview"}
            </span>
          </div>


          {/* ===============================================
              DESKTOP NAVIGATION
              =============================================== */}

          <nav
            className={
              styles.desktopNavigation
            }
            aria-label="Main navigation"
          >
            {navigationItems.map(
              (item) => {
                const active =
                  activeSection ===
                  item.id;


                return (
                  <a
                    key={
                      item.href
                    }
                    href={
                      item.href
                    }
                    className={[
                      styles.navigationLink,

                      active
                        ? styles.activeNavigationLink
                        : "",
                    ].join(" ")}
                    aria-current={
                      active
                        ? "location"
                        : undefined
                    }
                  >
                    {
                      item.label
                    }
                  </a>
                );
              },
            )}
          </nav>


          {/* ===============================================
              ACTIONS
              =============================================== */}

          <div
            className={
              styles.actions
            }
          >
            {resumeUrl ? (
              <a
                href={
                  resumeUrl
                }
                target="_blank"
                rel="noreferrer"
                className={
                  styles.resumeButton
                }
                data-context-cursor="view"
              >
                <span>
                  Resume
                </span>

                <Download
                  size={16}
                  strokeWidth={
                    1.8
                  }
                />
              </a>
            ) : null}


            <button
              type="button"
              className={
                styles.menuButton
              }
              aria-label={
                menuOpen
                  ? "Close navigation"
                  : "Open navigation"
              }
              aria-expanded={
                menuOpen
              }
              aria-controls="public-mobile-navigation"
              onClick={
                toggleMenu
              }
            >
              {menuOpen ? (
                <X
                  size={22}
                  strokeWidth={
                    1.8
                  }
                />
              ) : (
                <Menu
                  size={22}
                  strokeWidth={
                    1.8
                  }
                />
              )}
            </button>
          </div>
        </div>


        {/* ===============================================
            GLOBAL PROGRESS
            =============================================== */}

        <div
          className={
            styles.headerProgress
          }
          aria-hidden="true"
        >
          <span
            className={
              styles.headerProgressFill
            }
            style={{
              transform:
                `scaleX(${scrollProgress})`,
            }}
          />
        </div>
      </header>


      {/* ====================================================
          MOBILE MENU
          ==================================================== */}

      {mounted &&
      menuOpen
        ? createPortal(
            <div
              className={[
                "public-portal-theme",
                styles.mobilePortal,
              ].join(" ")}
            >
              <button
                type="button"
                className={
                  styles.mobileBackdrop
                }
                onClick={
                  closeMenu
                }
                aria-label="Close navigation"
              />


              <aside
                id="public-mobile-navigation"
                className={
                  styles.mobilePanel
                }
                aria-label="Mobile navigation"
              >
                <nav
                  className={
                    styles.mobileNavigation
                  }
                >
                  <div
                    className={
                      styles.mobileHeader
                    }
                  >
                    <div
                      className={
                        styles.mobileHeaderStatus
                      }
                    >
                      <span>
                        Navigation
                      </span>

                      {activeNavigationItem ? (
                        <strong>
                          {
                            activeNavigationItem
                              .label
                          }
                        </strong>
                      ) : null}
                    </div>


                    <button
                      type="button"
                      className={
                        styles.mobileCloseButton
                      }
                      onClick={
                        closeMenu
                      }
                      aria-label="Close navigation"
                    >
                      <X
                        size={20}
                        strokeWidth={
                          1.8
                        }
                      />
                    </button>
                  </div>


                  <div
                    className={
                      styles.mobileLinks
                    }
                  >
                    {navigationItems.map(
                      (
                        item,
                        index,
                      ) => {
                        const active =
                          activeSection ===
                          item.id;


                        return (
                          <a
                            key={
                              item.href
                            }
                            href={
                              item.href
                            }
                            className={[
                              styles.mobileLink,

                              active
                                ? styles.activeMobileLink
                                : "",
                            ].join(" ")}
                            onClick={
                              closeMenu
                            }
                            aria-current={
                              active
                                ? "location"
                                : undefined
                            }
                          >
                            <span
                              className={
                                styles.mobileLinkIndex
                              }
                            >
                              {String(
                                index +
                                  1,
                              ).padStart(
                                2,
                                "0",
                              )}
                            </span>

                            <strong>
                              {
                                item.label
                              }
                            </strong>

                            <span
                              className={
                                styles.mobileLinkDot
                              }
                              aria-hidden="true"
                            />
                          </a>
                        );
                      },
                    )}
                  </div>


                  {resumeUrl ? (
                    <a
                      href={
                        resumeUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className={
                        styles.mobileResume
                      }
                      onClick={
                        closeMenu
                      }
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
                </nav>
              </aside>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}