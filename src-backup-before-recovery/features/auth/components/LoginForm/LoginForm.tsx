"use client";

import {
  zodResolver,
} from "@hookform/resolvers/zod";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
} from "lucide-react";
import {
  useRouter,
} from "next/navigation";
import {
  useState,
} from "react";
import {
  useForm,
} from "react-hook-form";

import {
  login,
} from "../../api/auth.api";
import {
  loginSchema,
  type LoginFormValues,
} from "../../schemas/login.schema";

import styles from "./LoginForm.module.css";


export function LoginForm() {
  const router = useRouter();

  const [serverError, setServerError] =
    useState<string | null>(null);

  const {
    register,
    handleSubmit,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver:
      zodResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });


  const onSubmit = async (
    values: LoginFormValues,
  ) => {
    setServerError(null);

    try {
      await login(values);

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Unable to sign in",
      );
    }
  };


  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit(
        onSubmit,
      )}
      noValidate
    >
      <div
        className={
          styles.fieldGroup
        }
      >
        <label
          className={styles.label}
          htmlFor="email"
        >
          Email
        </label>

        <div
          className={
            styles.inputWrapper
          }
        >
          <Mail
            size={18}
            aria-hidden="true"
          />

          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="admin@example.com"
            className={styles.input}
            {...register("email")}
          />
        </div>

        {errors.email && (
          <p
            className={
              styles.error
            }
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <div
        className={
          styles.fieldGroup
        }
      >
        <label
          className={styles.label}
          htmlFor="password"
        >
          Password
        </label>

        <div
          className={
            styles.inputWrapper
          }
        >
          <LockKeyhole
            size={18}
            aria-hidden="true"
          />

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className={styles.input}
            {...register(
              "password",
            )}
          />
        </div>

        {errors.password && (
          <p
            className={
              styles.error
            }
          >
            {
              errors.password
                .message
            }
          </p>
        )}
      </div>

      {serverError && (
        <div
          className={
            styles.serverError
          }
          role="alert"
        >
          {serverError}
        </div>
      )}

      <button
        type="submit"
        className={styles.submit}
        disabled={isSubmitting}
      >
        <span>
          {isSubmitting
            ? "Signing in..."
            : "Sign in"}
        </span>

        {!isSubmitting && (
          <ArrowRight
            size={18}
          />
        )}
      </button>
    </form>
  );
}