"use client";

import Link from "next/link";
import {
  usePathname,
} from "next/navigation";

import {
  adminNavigation,
} from "../../config/admin-navigation";

import styles from "./AdminSidebar.module.css";


export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className={styles.sidebar}
    >
      <div
        className={styles.brand}
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

      <nav
        className={styles.nav}
        aria-label="Admin navigation"
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
                className={`${styles.link} ${
                  active
                    ? styles.active
                    : ""
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={1.8}
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
  );
}