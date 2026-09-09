import {
  forwardRef,
  type SelectHTMLAttributes,
} from "react";

import clsx from "clsx";

import styles from "./Select.module.css";


type SelectProps =
  SelectHTMLAttributes<HTMLSelectElement> & {
    invalid?: boolean;
  };


export const Select =
  forwardRef<
    HTMLSelectElement,
    SelectProps
  >(function Select(
    {
      invalid = false,
      className,
      children,
      ...props
    },
    ref,
  ) {
    return (
      <select
        {...props}
        ref={ref}
        className={clsx(
          styles.select,
          invalid && styles.invalid,
          className,
        )}
      >
        {children}
      </select>
    );
  });