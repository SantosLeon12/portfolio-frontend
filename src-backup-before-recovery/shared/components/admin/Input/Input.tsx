import {
  forwardRef,
  type InputHTMLAttributes,
} from "react";

import clsx from "clsx";

import styles from "./Input.module.css";


type InputProps =
  InputHTMLAttributes<HTMLInputElement> & {
    invalid?: boolean;
  };


export const Input =
  forwardRef<
    HTMLInputElement,
    InputProps
  >(function Input(
    {
      invalid = false,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <input
        {...props}
        ref={ref}
        className={clsx(
          styles.input,
          invalid &&
            styles.invalid,
          className,
        )}
      />
    );
  });