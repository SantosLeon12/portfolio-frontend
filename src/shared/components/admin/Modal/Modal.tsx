"use client";

import {
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createPortal,
} from "react-dom";

import styles from "./Modal.module.css";


type ModalProps = {
  open: boolean;
  title: string;

  description?: string;

  onClose: () => void;

  children: ReactNode;
};


export function Modal({
  open,
  title,
  description,
  onClose,
  children,
}: ModalProps) {
  const [mounted, setMounted] =
    useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  useEffect(() => {
    if (!open) {
      return;
    }

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [
    open,
    onClose,
  ]);


  if (
    !mounted ||
    !open
  ) {
    return null;
  }


  return createPortal(
    <div
      className={styles.layer}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Close dialog"
      />

      <section
        className={styles.modal}
      >
        <header
          className={styles.header}
        >
          <div>
            <h2>{title}</h2>

            {description && (
              <p>
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            className={
              styles.close
            }
            onClick={onClose}
            aria-label="Close"
          >
            <X size={19} />
          </button>
        </header>

        <div
          className={styles.body}
        >
          {children}
        </div>
      </section>
    </div>,
    document.body,
  );
}