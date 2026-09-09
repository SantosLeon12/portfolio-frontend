"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MoveHorizontal,
  Phone,
  Plus,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import styles from "./ContextCursor.module.css";


type ContextCursorKind =
  | "drag"
  | "view"
  | "open"
  | "email"
  | "call";


type Point = {
  x: number;
  y: number;
};


const DESKTOP_POINTER_QUERY =
  "(min-width: 960px) and (hover: hover) and (pointer: fine)";

const CONTEXT_SELECTOR =
  "[data-context-cursor]";

const BLOCK_SELECTOR =
  '[data-context-cursor-block="true"]';


/* =========================================================
   HELPERS
   ========================================================= */

function isContextCursorKind(
  value: string | undefined,
): value is ContextCursorKind {
  return (
    value === "drag" ||
    value === "view" ||
    value === "open" ||
    value === "email" ||
    value === "call"
  );
}


function resolveContextCursorKind(
  target: EventTarget | null,
): ContextCursorKind | null {
  if (
    !(target instanceof Element)
  ) {
    return null;
  }

  if (
    target.closest(
      BLOCK_SELECTOR,
    )
  ) {
    return null;
  }

  const contextElement =
    target.closest<HTMLElement>(
      CONTEXT_SELECTOR,
    );

  if (!contextElement) {
    return null;
  }

  const value =
    contextElement.dataset
      .contextCursor;

  if (
    !isContextCursorKind(
      value,
    )
  ) {
    return null;
  }

  return value;
}


/* =========================================================
   CURSOR CONTENT
   ========================================================= */

function getCursorContent(
  kind: ContextCursorKind,
  dragging: boolean,
): {
  label: string;
  icon: ReactNode;
} {
  if (
    kind === "drag" &&
    dragging
  ) {
    return {
      label: "Dragging",

      icon: (
        <ArrowRight
          size={13}
          strokeWidth={1.9}
        />
      ),
    };
  }

  switch (kind) {
    case "drag":
      return {
        label: "Drag",

        icon: (
          <MoveHorizontal
            size={14}
            strokeWidth={1.8}
          />
        ),
      };

    case "view":
      return {
        label: "View",

        icon: (
          <Plus
            size={14}
            strokeWidth={1.9}
          />
        ),
      };

    case "open":
      return {
        label: "Open",

        icon: (
          <ArrowUpRight
            size={14}
            strokeWidth={1.9}
          />
        ),
      };

    case "email":
      return {
        label: "Email",

        icon: (
          <Mail
            size={13}
            strokeWidth={1.8}
          />
        ),
      };

    case "call":
      return {
        label: "Call",

        icon: (
          <Phone
            size={13}
            strokeWidth={1.8}
          />
        ),
      };
  }
}


/* =========================================================
   COMPONENT
   ========================================================= */

export function ContextCursor() {
  const cursorRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const targetPositionRef =
    useRef<Point>({
      x: 0,
      y: 0,
    });

  const currentPositionRef =
    useRef<Point>({
      x: 0,
      y: 0,
    });

  const positionInitializedRef =
    useRef(false);

  const [
    enabled,
    setEnabled,
  ] = useState(false);

  const [
    kind,
    setKind,
  ] =
    useState<
      ContextCursorKind | null
    >(null);

  const [
    dragging,
    setDragging,
  ] = useState(false);

  const [
    blocked,
    setBlocked,
  ] = useState(false);


  /* =======================================================
     DESKTOP POINTER DETECTION
     ======================================================= */

  useEffect(() => {
    const query =
      window.matchMedia(
        DESKTOP_POINTER_QUERY,
      );

    const updateEnabled =
      () => {
        setEnabled(
          query.matches,
        );

        if (
          !query.matches
        ) {
          setKind(null);

          setDragging(
            false,
          );

          positionInitializedRef.current =
            false;
        }
      };

    updateEnabled();

    query.addEventListener(
      "change",
      updateEnabled,
    );

    return () => {
      query.removeEventListener(
        "change",
        updateEnabled,
      );
    };
  }, []);


  /* =======================================================
     MODAL / PORTAL BLOCK DETECTION
     ======================================================= */

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const updateBlockedState =
      () => {
        const hasBlock =
          document.querySelector(
            BLOCK_SELECTOR,
          ) !== null;

        setBlocked(
          hasBlock,
        );

        if (hasBlock) {
          setKind(null);

          setDragging(
            false,
          );
        }
      };

    updateBlockedState();

    const observer =
      new MutationObserver(
        updateBlockedState,
      );

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true,
        attributes: true,

        attributeFilter: [
          "data-context-cursor-block",
        ],
      },
    );

    return () => {
      observer.disconnect();
    };
  }, [
    enabled,
  ]);


  /* =======================================================
     POINTER EVENTS
     ======================================================= */

  useEffect(() => {
    if (!enabled) {
      return;
    }


    const updateTargetPosition =
      (
        clientX: number,
        clientY: number,
      ) => {
        const cursor =
          cursorRef.current;

        const cursorWidth =
          cursor?.offsetWidth ??
          92;

        const cursorHeight =
          cursor?.offsetHeight ??
          34;

        const gap = 16;

        let x =
          clientX + gap;

        let y =
          clientY + gap;


        /*
         * Flip horizontally when we are close
         * to the right edge.
         */

        if (
          x +
            cursorWidth +
            10 >
          window.innerWidth
        ) {
          x =
            clientX -
            cursorWidth -
            gap;
        }


        /*
         * Flip vertically when we are close
         * to the bottom edge.
         */

        if (
          y +
            cursorHeight +
            10 >
          window.innerHeight
        ) {
          y =
            clientY -
            cursorHeight -
            gap;
        }


        targetPositionRef.current = {
          x,
          y,
        };


        /*
         * Prevent the cursor from travelling
         * from 0,0 on the first interaction.
         */

        if (
          !positionInitializedRef.current
        ) {
          currentPositionRef.current = {
            x,
            y,
          };

          positionInitializedRef.current =
            true;
        }
      };


    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      if (
        event.pointerType !==
        "mouse"
      ) {
        return;
      }

      updateTargetPosition(
        event.clientX,
        event.clientY,
      );


      if (
        document.querySelector(
          BLOCK_SELECTOR,
        )
      ) {
        setKind(null);

        setDragging(
          false,
        );

        return;
      }


      const nextKind =
        resolveContextCursorKind(
          event.target,
        );

      setKind(
        (current) =>
          current ===
          nextKind
            ? current
            : nextKind,
      );


      if (
        nextKind !== "drag"
      ) {
        setDragging(
          false,
        );
      }
    };


    const handlePointerDown = (
      event: PointerEvent,
    ) => {
      if (
        event.pointerType !==
        "mouse"
      ) {
        return;
      }

      const nextKind =
        resolveContextCursorKind(
          event.target,
        );

      if (
        nextKind === "drag"
      ) {
        setDragging(
          true,
        );
      }
    };


    const handlePointerUp = (
      event: PointerEvent,
    ) => {
      if (
        event.pointerType !==
        "mouse"
      ) {
        return;
      }

      setDragging(
        false,
      );

      const nextKind =
        resolveContextCursorKind(
          event.target,
        );

      setKind(
        nextKind,
      );
    };


    const hideCursor =
      () => {
        setKind(null);

        setDragging(
          false,
        );
      };


    document.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: true,
      },
    );

    document.addEventListener(
      "pointerdown",
      handlePointerDown,
      true,
    );

    document.addEventListener(
      "pointerup",
      handlePointerUp,
      true,
    );

    document.documentElement
      .addEventListener(
        "mouseleave",
        hideCursor,
      );

    window.addEventListener(
      "blur",
      hideCursor,
    );


    return () => {
      document.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
        true,
      );

      document.removeEventListener(
        "pointerup",
        handlePointerUp,
        true,
      );

      document.documentElement
        .removeEventListener(
          "mouseleave",
          hideCursor,
        );

      window.removeEventListener(
        "blur",
        hideCursor,
      );
    };
  }, [
    enabled,
  ]);


  /* =======================================================
     SMOOTH POSITION
     ======================================================= */

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let animationFrame:
      number;

    const animate =
      () => {
        const cursor =
          cursorRef.current;

        const target =
          targetPositionRef.current;

        const current =
          currentPositionRef.current;


        /*
         * Quick interpolation.
         *
         * It gives us enough delay to feel intentional
         * without making the cursor feel disconnected
         * from the real pointer.
         */

        const interpolation =
          0.22;

        current.x +=
          (
            target.x -
            current.x
          ) *
          interpolation;

        current.y +=
          (
            target.y -
            current.y
          ) *
          interpolation;


        if (cursor) {
          cursor.style.transform =
            `translate3d(${current.x}px, ${current.y}px, 0)`;
        }


        animationFrame =
          window.requestAnimationFrame(
            animate,
          );
      };


    animationFrame =
      window.requestAnimationFrame(
        animate,
      );


    return () => {
      window.cancelAnimationFrame(
        animationFrame,
      );
    };
  }, [
    enabled,
  ]);


  /* =======================================================
     DO NOT RENDER FOR TOUCH DEVICES
     ======================================================= */

  if (!enabled) {
    return null;
  }


  const visible =
    Boolean(kind) &&
    !blocked;

  const content =
    kind
      ? getCursorContent(
          kind,
          dragging,
        )
      : null;


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <div
      ref={cursorRef}
      className={[
        styles.cursor,

        visible
          ? styles.visible
          : "",

        dragging
          ? styles.dragging
          : "",
      ].join(" ")}
      aria-hidden="true"
    >
      <div
        className={
          styles.bubble
        }
      >
        {content ? (
          <div
            key={`${kind}-${dragging}`}
            className={
              styles.content
            }
          >
            <span
              className={
                styles.label
              }
            >
              {content.label}
            </span>

            <span
              className={
                styles.icon
              }
            >
              {content.icon}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}