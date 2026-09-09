import type {
  ButtonHTMLAttributes,
} from "react";

import clsx from "clsx";

import styles from "./Button.module.css";


type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "ghost";

type ButtonSize =
  | "sm"
  | "md";


type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
  };


export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={
        disabled || loading
      }
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        className,
      )}
    >
      {loading && (
        <span
          className={styles.spinner}
          aria-hidden="true"
        />
      )}

      {children}
    </button>
  );
}