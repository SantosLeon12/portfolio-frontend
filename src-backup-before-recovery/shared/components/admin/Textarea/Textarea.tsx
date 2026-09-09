import {
  forwardRef,
  type TextareaHTMLAttributes,
} from "react";

import clsx from "clsx";

import styles from "./Textarea.module.css";


type TextareaProps =
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    invalid?: boolean;
  };


export const Textarea =
  forwardRef<
    HTMLTextAreaElement,
    TextareaProps
  >(function Textarea(
    {
      invalid = false,
      className,
      ...props
    },
    ref,
  ) {
    return (
      <textarea
        {...props}
        ref={ref}
        className={clsx(
          styles.textarea,
          invalid &&
            styles.invalid,
          className,
        )}
      />
    );
  });