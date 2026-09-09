"use client";


export type ProjectStackFocus = {
  projectSlug: string;

  projectTitle: string;

  technologyIds: number[];
};


type Listener = () => void;


/* =========================================================
   STORE
   ========================================================= */

/*
 * This tiny store connects Projects and Stack without
 * moving the entire public homepage into a Client Component.
 *
 * It intentionally lives only in memory:
 *
 * - Refreshing the page resets the relationship.
 * - Going directly to Stack shows the normal stack.
 * - Focusing a project establishes the relationship.
 */

let currentFocus:
  ProjectStackFocus | null =
    null;

const listeners =
  new Set<Listener>();


/* =========================================================
   HELPERS
   ========================================================= */

function normalizeTechnologyIds(
  technologyIds: number[],
) {
  return Array.from(
    new Set(
      technologyIds,
    ),
  ).sort(
    (a, b) =>
      a - b,
  );
}


function technologyIdsAreEqual(
  current: number[],
  next: number[],
) {
  if (
    current.length !==
    next.length
  ) {
    return false;
  }

  return current.every(
    (
      id,
      index,
    ) =>
      id ===
      next[index],
  );
}


/* =========================================================
   SET FOCUS
   ========================================================= */

export function setProjectStackFocus(
  focus: ProjectStackFocus,
) {
  const normalizedIds =
    normalizeTechnologyIds(
      focus.technologyIds,
    );

  const normalizedFocus:
    ProjectStackFocus = {
      projectSlug:
        focus.projectSlug,

      projectTitle:
        focus.projectTitle,

      technologyIds:
        normalizedIds,
    };

  if (
    currentFocus &&
    currentFocus.projectSlug ===
      normalizedFocus.projectSlug &&
    currentFocus.projectTitle ===
      normalizedFocus.projectTitle &&
    technologyIdsAreEqual(
      currentFocus.technologyIds,
      normalizedFocus.technologyIds,
    )
  ) {
    return;
  }

  currentFocus =
    normalizedFocus;

  listeners.forEach(
    (listener) => {
      listener();
    },
  );
}


/* =========================================================
   SNAPSHOT
   ========================================================= */

export function getProjectStackFocus() {
  return currentFocus;
}


/*
 * Client Components are still pre-rendered on the server.
 *
 * The server must always render Stack without an arbitrary
 * project selected. Once hydrated, the client can establish
 * the real relationship.
 */

export function getProjectStackFocusServerSnapshot() {
  return null;
}


/* =========================================================
   SUBSCRIBE
   ========================================================= */

export function subscribeProjectStackFocus(
  listener: Listener,
) {
  listeners.add(
    listener,
  );

  return () => {
    listeners.delete(
      listener,
    );
  };
}