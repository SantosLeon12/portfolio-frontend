import type {
  ReactNode,
} from "react";

import styles from "./FormField.module.css";


type FormFieldProps = {
  label: string;
  htmlFor: string;

  error?: string;
  hint?: string;

  required?: boolean;

  children: ReactNode;
};


export function FormField({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div
      className={styles.field}
    >
      <label
        htmlFor={htmlFor}
        className={styles.label}
      >
        {label}

        {required && (
          <span
            className={
              styles.required
            }
          >
            *
          </span>
        )}
      </label>

      {children}

      {error ? (
        <p
          className={styles.error}
        >
          {error}
        </p>
      ) : hint ? (
        <p
          className={styles.hint}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}