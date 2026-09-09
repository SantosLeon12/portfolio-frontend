"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  CheckCircle2,
  CircleAlert,
  X,
} from "lucide-react";

import styles from "./toast-provider.module.css";


type ToastVariant =
  | "success"
  | "error";


type ToastInput = {
  title: string;
  message?: string;
  variant?: ToastVariant;
};


type ToastItem =
  ToastInput & {
    id: string;
  };


type ToastContextValue = {
  showToast:
    (toast: ToastInput) => void;
};


const ToastContext =
  createContext<
    ToastContextValue | undefined
  >(undefined);


type ToastProviderProps = {
  children: ReactNode;
};


export function ToastProvider({
  children,
}: ToastProviderProps) {
  const [toasts, setToasts] =
    useState<ToastItem[]>([]);


  const removeToast =
    useCallback(
      (id: string) => {
        setToasts((current) =>
          current.filter(
            (toast) =>
              toast.id !== id,
          ),
        );
      },
      [],
    );


  const showToast =
    useCallback(
      ({
        variant = "success",
        ...toast
      }: ToastInput) => {
        const id =
          `${Date.now()}-${Math.random()}`;

        const item: ToastItem = {
          id,
          variant,
          ...toast,
        };

        setToasts((current) => [
          ...current,
          item,
        ]);

        window.setTimeout(
          () => removeToast(id),
          3500,
        );
      },
      [removeToast],
    );


  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}

      <div
        className={
          styles.viewport
        }
        aria-live="polite"
      >
        {toasts.map(
          (toast) => {
            const error =
              toast.variant ===
              "error";

            return (
              <article
                key={toast.id}
                className={`${styles.toast} ${
                  error
                    ? styles.error
                    : styles.success
                }`}
              >
                <div
                  className={
                    styles.icon
                  }
                >
                  {error ? (
                    <CircleAlert
                      size={20}
                    />
                  ) : (
                    <CheckCircle2
                      size={20}
                    />
                  )}
                </div>

                <div
                  className={
                    styles.content
                  }
                >
                  <strong>
                    {toast.title}
                  </strong>

                  {toast.message && (
                    <p>
                      {
                        toast.message
                      }
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  className={
                    styles.close
                  }
                  onClick={() =>
                    removeToast(
                      toast.id,
                    )
                  }
                  aria-label="Close notification"
                >
                  <X size={17} />
                </button>
              </article>
            );
          },
        )}
      </div>
    </ToastContext.Provider>
  );
}


export function useToast() {
  const context =
    useContext(ToastContext);

  if (!context) {
    throw new Error(
      "useToast must be used inside ToastProvider",
    );
  }

  return context;
}