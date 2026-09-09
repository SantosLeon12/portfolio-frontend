"use client";

import {
  Menu,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  usePathname,
} from "next/navigation";
import {
  useEffect,
  useState,
} from "react";

import {
  adminNavigation,
} from "../../config/admin-navigation";

import styles from "./AdminMobileNav.module.css";


export function AdminMobileNav() {
  const pathname = usePathname();

  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";

      return;
    }

    document.body.style.overflow =
      "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [open]);


  return (
    <>
      <button
        type="button"
        className={
          styles.menuButton
        }
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-expanded={open}
      >
        <Menu size={21} />
      </button>

      {open && (
        <div
          className={styles.layer}
        >
          <button
            type="button"
            className={
              styles.backdrop
            }
            aria-label="Close navigation"
            onClick={() =>
              setOpen(false)
            }
          />

          <aside
            className={styles.drawer}
          >
            <div
              className={
                styles.header
              }
            >
              <div
                className={
                  styles.brand
                }
              >
                <div
                  className={
                    styles.brandMark
                  }
                >
                  JD
                </div>

                <div>
                  <strong>
                    Portfolio
                  </strong>

                  <span>
                    Administration
                  </span>
                </div>
              </div>

              <button
                type="button"
                className={
                  styles.closeButton
                }
                onClick={() =>
                  setOpen(false)
                }
                aria-label="Close navigation"
              >
                <X size={21} />
              </button>
            </div>

            <nav
              className={styles.nav}
            >
              {adminNavigation.map(
                ({
                  label,
                  href,
                  icon: Icon,
                }) => {
                  const active =
                    href === "/admin"
                      ? pathname ===
                        "/admin"
                      : pathname.startsWith(
                          href,
                        );

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() =>
                        setOpen(false)
                      }
                      className={`${styles.link} ${
                        active
                          ? styles.active
                          : ""
                      }`}
                    >
                      <Icon
                        size={19}
                        strokeWidth={
                          1.8
                        }
                      />

                      <span>
                        {label}
                      </span>
                    </Link>
                  );
                },
              )}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}