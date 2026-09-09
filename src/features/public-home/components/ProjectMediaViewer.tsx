"use client";

import Image from "next/image";

import {
  ChevronLeft,
  ChevronRight,
  Code2,
  Maximize2,
  X,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  createPortal,
} from "react-dom";

import type {
  PublicProjectMedia,
} from "../types/publicHome.types";

import styles from "./ProjectMediaViewer.module.css";


type ProjectMediaViewerProps = {
  projectTitle: string;
  projectSlug: string;
  media: PublicProjectMedia[];
};

type MediaOrientation =
  | "landscape"
  | "portrait"
  | "square"
  | "unknown";

type TransitionDirection =
  | "next"
  | "previous";

type PointerStart = {
  x: number;
  y: number;
};

type DeviceShellProps = {
  media: PublicProjectMedia;
  projectTitle: string;
};

type MediaPresentationProps = {
  media: PublicProjectMedia;
  projectTitle: string;
  nextMedia?: PublicProjectMedia | null;
};


/* =========================================================
   HELPERS
   ========================================================= */

function isImageMedia(
  item: PublicProjectMedia,
) {
  const mimeType =
    item.media_asset.mime_type;

  if (!mimeType) {
    return true;
  }

  return mimeType.startsWith(
    "image/",
  );
}


function getOrientation(
  item: PublicProjectMedia,
): MediaOrientation {
  const {
    width,
    height,
  } = item.media_asset;

  if (
    !width ||
    !height ||
    width <= 0 ||
    height <= 0
  ) {
    return "unknown";
  }

  const ratio =
    width / height;

  if (ratio >= 1.15) {
    return "landscape";
  }

  if (ratio <= 0.87) {
    return "portrait";
  }

  return "square";
}


function isPortraitMedia(
  item: PublicProjectMedia,
) {
  return (
    getOrientation(item) ===
    "portrait"
  );
}


function getInitialIndex(
  media: PublicProjectMedia[],
) {
  const coverIndex =
    media.findIndex(
      (item) =>
        item.media_role ===
        "COVER",
    );

  if (coverIndex >= 0) {
    return coverIndex;
  }

  const screenshotIndex =
    media.findIndex(
      (item) =>
        item.media_role ===
        "SCREENSHOT",
    );

  if (
    screenshotIndex >= 0
  ) {
    return screenshotIndex;
  }

  return 0;
}


/* =========================================================
   DEVICE SHELL
   ========================================================= */

function DeviceShell({
  media,
  projectTitle,
}: DeviceShellProps) {
  const portrait =
    isPortraitMedia(media);

  if (portrait) {
    return (
      <div
        className={
          styles.phoneFrame
        }
      >
        <div
          className={
            styles.phoneSpeaker
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.phoneScreen
          }
        >
          <Image
            src={
              media.media_asset.url
            }
            alt={
              media.alt_text ??
              projectTitle
            }
            fill
            sizes="(max-width: 699px) 78vw, 360px"
            className={
              styles.portraitImage
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        styles.desktopFrame
      }
    >
      <div
        className={
          styles.windowBar
        }
      >
        <div
          className={
            styles.windowDots
          }
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>

        <span
          className={
            styles.windowTitle
          }
        >
          {projectTitle}
        </span>
      </div>

      <div
        className={
          styles.desktopScreen
        }
      >
        <Image
          src={
            media.media_asset.url
          }
          alt={
            media.alt_text ??
            projectTitle
          }
          fill
          sizes="(max-width: 899px) 90vw, 55vw"
          className={
            styles.landscapeImage
          }
        />
      </div>
    </div>
  );
}


/* =========================================================
   MEDIA PRESENTATION
   ========================================================= */

function MediaPresentation({
  media,
  projectTitle,
  nextMedia = null,
}: MediaPresentationProps) {
  const activePortrait =
    isPortraitMedia(media);

  const nextPortrait =
    nextMedia
      ? isPortraitMedia(
          nextMedia,
        )
      : false;

  return (
    <div
      className={[
        styles.presentationStage,

        activePortrait
          ? styles.activePortraitStage
          : styles.activeLandscapeStage,
      ].join(" ")}
    >
      {nextMedia ? (
        <div
          className={[
            styles.deviceCard,
            styles.nextDeviceCard,

            nextPortrait
              ? styles.portraitDeviceCard
              : styles.landscapeDeviceCard,

            activePortrait &&
            nextPortrait
              ? styles.portraitToPortrait
              : "",

            activePortrait &&
            !nextPortrait
              ? styles.portraitToLandscape
              : "",

            !activePortrait &&
            nextPortrait
              ? styles.landscapeToPortrait
              : "",

            !activePortrait &&
            !nextPortrait
              ? styles.landscapeToLandscape
              : "",
          ].join(" ")}
          aria-hidden="true"
        >
          <DeviceShell
            media={
              nextMedia
            }
            projectTitle={
              projectTitle
            }
          />
        </div>
      ) : null}

      <div
        className={[
          styles.deviceCard,
          styles.currentDeviceCard,

          activePortrait
            ? styles.portraitDeviceCard
            : styles.landscapeDeviceCard,
        ].join(" ")}
      >
        <DeviceShell
          media={
            media
          }
          projectTitle={
            projectTitle
          }
        />
      </div>
    </div>
  );
}


/* =========================================================
   COMPONENT
   ========================================================= */

export function ProjectMediaViewer({
  projectTitle,
  projectSlug,
  media,
}: ProjectMediaViewerProps) {
  const viewerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const pointerStartRef =
    useRef<PointerStart | null>(
      null,
    );

  const suppressClickRef =
    useRef(false);

  const transitionTimerRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  const [
    mounted,
    setMounted,
  ] = useState(false);

  const [
    viewerOpen,
    setViewerOpen,
  ] = useState(false);

  const [
    mobileFocused,
    setMobileFocused,
  ] = useState(false);

  const [
    desktopHovered,
    setDesktopHovered,
  ] = useState(false);

  const [
    outgoingMedia,
    setOutgoingMedia,
  ] =
    useState<PublicProjectMedia | null>(
      null,
    );

  const [
    transitionDirection,
    setTransitionDirection,
  ] =
    useState<TransitionDirection>(
      "next",
    );

  const images =
    useMemo(
      () =>
        [...media]
          .filter(
            isImageMedia,
          )
          .sort(
            (a, b) =>
              a.display_order -
              b.display_order,
          ),
      [media],
    );

  const initialIndex =
    getInitialIndex(images);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(initialIndex);

  const activeMedia =
    images[activeIndex] ??
    images[0] ??
    null;

  const activeOrientation =
    activeMedia
      ? getOrientation(
          activeMedia,
        )
      : "unknown";

  const hasMultipleImages =
    images.length > 1;

  const nextIndex =
    hasMultipleImages
      ? activeIndex ===
        images.length - 1
        ? 0
        : activeIndex + 1
      : activeIndex;

  const nextMedia =
    hasMultipleImages
      ? images[nextIndex]
      : null;

  const interactionFocused =
    hasMultipleImages &&
    (
      mobileFocused ||
      desktopHovered
    );


  /* =======================================================
     MOUNT
     ======================================================= */

  useEffect(() => {
    setMounted(true);
  }, []);


  /* =======================================================
     MOBILE FOCUS
     ======================================================= */

  useEffect(() => {
    const node =
      viewerRef.current;

    if (
      !node ||
      !hasMultipleImages
    ) {
      return;
    }

    const touchLikeDevice =
      window.matchMedia(
        "(hover: none), (pointer: coarse)",
      ).matches;

    if (
      !touchLikeDevice ||
      !(
        "IntersectionObserver" in
        window
      )
    ) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          const shouldFocus =
            entry.isIntersecting &&
            entry.intersectionRatio >=
              0.2;

          setMobileFocused(
            shouldFocus,
          );
        },
        {
          threshold: [
            0,
            0.1,
            0.2,
            0.35,
            0.5,
            0.7,
          ],

          rootMargin:
            "-20% 0px -20% 0px",
        },
      );

    observer.observe(node);

    return () => {
      observer.disconnect();

      setMobileFocused(
        false,
      );
    };
  }, [
    hasMultipleImages,
  ]);


  /* =======================================================
     INDEX SAFETY
     ======================================================= */

  useEffect(() => {
    if (
      images.length === 0
    ) {
      return;
    }

    if (
      activeIndex >=
      images.length
    ) {
      setActiveIndex(0);
    }
  }, [
    images.length,
    activeIndex,
  ]);


  /* =======================================================
     TRANSITION CLEANUP
     ======================================================= */

  useEffect(() => {
    return () => {
      if (
        transitionTimerRef.current
      ) {
        clearTimeout(
          transitionTimerRef.current,
        );
      }
    };
  }, []);


  /* =======================================================
     LIGHTBOX
     ======================================================= */

  useEffect(() => {
    if (!viewerOpen) {
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
        event.key === "Escape"
      ) {
        setViewerOpen(false);

        return;
      }

      if (
        images.length <= 1
      ) {
        return;
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        event.preventDefault();

        setActiveIndex(
          (current) =>
            current === 0
              ? images.length -
                1
              : current - 1,
        );
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        event.preventDefault();

        setActiveIndex(
          (current) =>
            current ===
            images.length - 1
              ? 0
              : current + 1,
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
    viewerOpen,
    images.length,
  ]);


  /* =======================================================
     PREVIEW TRANSITION
     ======================================================= */

  const changePreviewImage = (
    targetIndex: number,
    direction: TransitionDirection,
  ) => {
    if (
      !activeMedia ||
      targetIndex ===
        activeIndex ||
      targetIndex < 0 ||
      targetIndex >=
        images.length
    ) {
      return;
    }

    if (
      transitionTimerRef.current
    ) {
      clearTimeout(
        transitionTimerRef.current,
      );
    }

    setOutgoingMedia(
      activeMedia,
    );

    setTransitionDirection(
      direction,
    );

    setActiveIndex(
      targetIndex,
    );

    transitionTimerRef.current =
      setTimeout(() => {
        setOutgoingMedia(
          null,
        );

        transitionTimerRef.current =
          null;
      }, 420);
  };


  const showNextPreview =
    () => {
      if (
        images.length <= 1
      ) {
        return;
      }

      const targetIndex =
        activeIndex ===
        images.length - 1
          ? 0
          : activeIndex + 1;

      changePreviewImage(
        targetIndex,
        "next",
      );
    };


  const showPreviousPreview =
    () => {
      if (
        images.length <= 1
      ) {
        return;
      }

      const targetIndex =
        activeIndex === 0
          ? images.length - 1
          : activeIndex - 1;

      changePreviewImage(
        targetIndex,
        "previous",
      );
    };


  /* =======================================================
     LIGHTBOX CONTROLS
     ======================================================= */

  const openViewer = () => {
    setViewerOpen(true);
  };


  const closeViewer = () => {
    setViewerOpen(false);
  };


  const showPreviousLightbox =
    () => {
      if (
        images.length <= 1
      ) {
        return;
      }

      setActiveIndex(
        (current) =>
          current === 0
            ? images.length - 1
            : current - 1,
      );
    };


  const showNextLightbox =
    () => {
      if (
        images.length <= 1
      ) {
        return;
      }

      setActiveIndex(
        (current) =>
          current ===
          images.length - 1
            ? 0
            : current + 1,
      );
    };


  /* =======================================================
     POINTER INTERACTION
     ======================================================= */

  const handlePointerEnter = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    if (
      event.pointerType ===
        "mouse"
    ) {
      setDesktopHovered(
        true,
      );
    }
  };


  const handlePointerLeave = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    if (
      event.pointerType ===
        "mouse"
    ) {
      setDesktopHovered(
        false,
      );
    }

    pointerStartRef.current =
      null;
  };


  const handlePointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    if (
      !hasMultipleImages
    ) {
      return;
    }

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };


  const handlePointerUp = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    if (
      !hasMultipleImages ||
      !pointerStartRef.current
    ) {
      pointerStartRef.current =
        null;

      return;
    }

    const deltaX =
      event.clientX -
      pointerStartRef.current.x;

    const deltaY =
      event.clientY -
      pointerStartRef.current.y;

    pointerStartRef.current =
      null;

    const horizontalDistance =
      Math.abs(deltaX);

    const verticalDistance =
      Math.abs(deltaY);

    const isHorizontalGesture =
      horizontalDistance >= 42 &&
      horizontalDistance >
        verticalDistance;

    if (
      !isHorizontalGesture
    ) {
      return;
    }

    suppressClickRef.current =
      true;

    event.currentTarget.blur();

    if (deltaX < 0) {
      showNextPreview();
    } else {
      showPreviousPreview();
    }
  };


  const handlePointerCancel =
    () => {
      pointerStartRef.current =
        null;

      suppressClickRef.current =
        false;
    };


  const handlePreviewClick =
    () => {
      if (
        suppressClickRef.current
      ) {
        suppressClickRef.current =
          false;

        return;
      }

      openViewer();
    };


  const handlePreviewKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
  ) => {
    if (
      !hasMultipleImages
    ) {
      return;
    }

    if (
      event.key ===
      "ArrowLeft"
    ) {
      event.preventDefault();

      showPreviousPreview();
    }

    if (
      event.key ===
      "ArrowRight"
    ) {
      event.preventDefault();

      showNextPreview();
    }
  };


  /* =======================================================
     FALLBACK
     ======================================================= */

  if (!activeMedia) {
    return (
      <div
        className={
          styles.fallback
        }
      >
        <div
          className={
            styles.fallbackGrid
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.fallbackOrbOne
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.fallbackOrbTwo
          }
          aria-hidden="true"
        />

        <div
          className={
            styles.fallbackContent
          }
        >
          <Code2
            size={48}
            strokeWidth={1.3}
          />

          <strong>
            {projectTitle}
          </strong>

          <span>
            {projectSlug ===
            "portfolio-web"
              ? "Living portfolio"
              : "Software project"}
          </span>
        </div>
      </div>
    );
  }


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <>
      <div
        ref={viewerRef}
        className={
          styles.viewer
        }
      >
        <div
          className={[
            styles.previewStack,

            hasMultipleImages
              ? styles.multipleStack
              : "",

            interactionFocused
              ? styles.interactionFocused
              : "",

            outgoingMedia
              ? styles.stackChanging
              : "",
          ].join(" ")}
        >
          <button
            type="button"
            className={[
              styles.preview,

              activeOrientation ===
              "portrait"
                ? styles.portraitPreview
                : "",
            ].join(" ")}
            data-context-cursor={
              hasMultipleImages
                ? "drag"
                : "view"
            }
            onClick={
              handlePreviewClick
            }
            onPointerEnter={
              handlePointerEnter
            }
            onPointerLeave={
              handlePointerLeave
            }
            onPointerDown={
              handlePointerDown
            }
            onPointerUp={
              handlePointerUp
            }
            onPointerCancel={
              handlePointerCancel
            }
            onKeyDown={
              handlePreviewKeyDown
            }
            aria-label={
              hasMultipleImages
                ? `${projectTitle}. Image ${activeIndex + 1} of ${images.length}. Swipe or drag horizontally to explore. Tap or click to expand.`
                : `Expand ${projectTitle} image`
            }
          >
            <Image
              key={`background-${activeMedia.id}`}
              src={
                activeMedia
                  .media_asset
                  .url
              }
              alt=""
              fill
              sizes="(max-width: 899px) 100vw, 60vw"
              className={
                styles.previewBackdrop
              }
              aria-hidden="true"
            />

            <div
              className={
                styles.previewShade
              }
              aria-hidden="true"
            />

            <div
              className={
                styles.previewToolbar
              }
              aria-hidden="true"
            >
              <span
                className={
                  styles.expandIcon
                }
              >
                <Maximize2
                  size={16}
                  strokeWidth={
                    1.7
                  }
                />
              </span>
            </div>

            <div
              className={
                styles.visualTransition
              }
            >
              {outgoingMedia ? (
                <div
                  className={[
                    styles.visualLayer,
                    styles.outgoingVisual,

                    transitionDirection ===
                    "next"
                      ? styles.outgoingNext
                      : styles.outgoingPrevious,
                  ].join(" ")}
                >
                  <MediaPresentation
                    media={
                      outgoingMedia
                    }
                    projectTitle={
                      projectTitle
                    }
                  />
                </div>
              ) : null}

              <div
                key={
                  activeMedia.id
                }
                className={[
                  styles.visualLayer,
                  styles.activeVisual,

                  outgoingMedia
                    ? transitionDirection ===
                      "next"
                      ? styles.incomingNext
                      : styles.incomingPrevious
                    : "",
                ].join(" ")}
              >
                <MediaPresentation
                  media={
                    activeMedia
                  }
                  projectTitle={
                    projectTitle
                  }
                  nextMedia={
                    nextMedia
                  }
                />
              </div>
            </div>
          </button>
        </div>

        {hasMultipleImages ? (
          <div
            className={
              styles.previewControls
            }
          >
            <div
              className={
                styles.previewIndicators
              }
              aria-label={`${projectTitle} image selector`}
            >
              {images.map(
                (
                  item,
                  index,
                ) => (
                  <button
                    key={
                      item.id
                    }
                    type="button"
                    className={[
                      styles.previewIndicator,

                      index ===
                      activeIndex
                        ? styles.activePreviewIndicator
                        : "",
                    ].join(" ")}
                    onClick={() => {
                      if (
                        index ===
                        activeIndex
                      ) {
                        return;
                      }

                      const direction:
                        TransitionDirection =
                        index >
                        activeIndex
                          ? "next"
                          : "previous";

                      changePreviewImage(
                        index,
                        direction,
                      );
                    }}
                    aria-label={`Show ${projectTitle} image ${index + 1}`}
                    aria-current={
                      index ===
                      activeIndex
                        ? "true"
                        : undefined
                    }
                  />
                ),
              )}
            </div>

            <div
              className={
                styles.previewMeta
              }
            >
              <span
                className={[
                  styles.interactionHint,

                  interactionFocused
                    ? styles.interactionHintVisible
                    : "",
                ].join(" ")}
              >
                <span
                  className={
                    styles.desktopHint
                  }
                >
                  Drag to explore
                </span>

                <span
                  className={
                    styles.mobileHint
                  }
                >
                  Swipe to explore
                </span>
              </span>

              <span
                className={
                  styles.previewCounter
                }
              >
                {String(
                  activeIndex + 1,
                ).padStart(
                  2,
                  "0",
                )}

                <span>
                  /
                </span>

                {String(
                  images.length,
                ).padStart(
                  2,
                  "0",
                )}
              </span>
            </div>
          </div>
        ) : null}
      </div>

      {mounted &&
      viewerOpen &&
      activeMedia
        ? createPortal(
            <div
              className={[
                "public-portal-theme",
                styles.portalRoot,
              ].join(" ")}
              data-context-cursor-block="true"
            >
              <button
                type="button"
                className={
                  styles.lightboxBackdrop
                }
                onClick={
                  closeViewer
                }
                aria-label="Close image viewer"
              />

              <section
                className={
                  styles.lightbox
                }
                role="dialog"
                aria-modal="true"
                aria-label={`${projectTitle} media viewer`}
              >
                <header
                  className={
                    styles.lightboxHeader
                  }
                >
                  <div
                    className={
                      styles.lightboxTitle
                    }
                  >
                    <strong>
                      {projectTitle}
                    </strong>

                    <span>
                      {activeIndex +
                        1}{" "}
                      /{" "}
                      {images.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    className={
                      styles.closeButton
                    }
                    onClick={
                      closeViewer
                    }
                    aria-label="Close image viewer"
                  >
                    <X
                      size={22}
                      strokeWidth={
                        1.7
                      }
                    />
                  </button>
                </header>

                <div
                  className={
                    styles.lightboxContent
                  }
                >
                  {hasMultipleImages ? (
                    <button
                      type="button"
                      className={[
                        styles.navigationButton,
                        styles.previousButton,
                      ].join(
                        " ",
                      )}
                      onClick={
                        showPreviousLightbox
                      }
                      aria-label="Previous image"
                    >
                      <ChevronLeft
                        size={26}
                        strokeWidth={
                          1.7
                        }
                      />
                    </button>
                  ) : null}

                  <div
                    className={
                      styles.fullImageStage
                    }
                  >
                    <img
                      key={
                        activeMedia.id
                      }
                      src={
                        activeMedia
                          .media_asset
                          .url
                      }
                      alt={
                        activeMedia.alt_text ??
                        projectTitle
                      }
                      className={
                        styles.fullImage
                      }
                    />
                  </div>

                  {hasMultipleImages ? (
                    <button
                      type="button"
                      className={[
                        styles.navigationButton,
                        styles.nextButton,
                      ].join(
                        " ",
                      )}
                      onClick={
                        showNextLightbox
                      }
                      aria-label="Next image"
                    >
                      <ChevronRight
                        size={26}
                        strokeWidth={
                          1.7
                        }
                      />
                    </button>
                  ) : null}
                </div>

                <footer
                  className={
                    styles.lightboxFooter
                  }
                >
                  <p>
                    {activeMedia.caption ??
                      "Full image preview"}
                  </p>

                  {hasMultipleImages ? (
                    <div
                      className={
                        styles.indicators
                      }
                    >
                      {images.map(
                        (
                          item,
                          index,
                        ) => (
                          <button
                            key={
                              item.id
                            }
                            type="button"
                            className={[
                              styles.indicator,

                              activeIndex ===
                              index
                                ? styles.activeIndicator
                                : "",
                            ].join(
                              " ",
                            )}
                            onClick={() =>
                              setActiveIndex(
                                index,
                              )
                            }
                            aria-label={`View image ${index + 1}`}
                          />
                        ),
                      )}
                    </div>
                  ) : null}
                </footer>
              </section>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}