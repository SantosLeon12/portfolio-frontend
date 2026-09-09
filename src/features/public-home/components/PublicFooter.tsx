import {
  ArrowUp,
  Mail,
} from "lucide-react";

import {
  FaLinkedin,
} from "react-icons/fa";

import type {
  PublicProfile,
} from "../types/publicHome.types";

import styles from "./PublicFooter.module.css";

type PublicFooterProps = {
  profile: PublicProfile;
};

export function PublicFooter({
  profile,
}: PublicFooterProps) {
  const email =
    profile.contacts.find(
      (contact) =>
        contact.contact_type ===
          "EMAIL" &&
        contact.is_visible,
    );

  const linkedin =
    profile.social_links.find(
      (link) =>
        link.platform
          .toLowerCase() ===
          "linkedin" &&
        link.is_visible,
    );

  const year =
    new Date().getFullYear();

  return (
    <footer
      className={
        styles.footer
      }
    >
      <div
        className={[
          "public-container",
          styles.inner,
        ].join(" ")}
      >
        <div
          className={
            styles.brand
          }
        >
          <a href="#home">
            Jorge
            <span>.</span>
          </a>

          <p>
            Software Engineer &
            Full Stack Developer
          </p>
        </div>

        <div
          className={
            styles.actions
          }
        >
          {email ? (
            <a
              href={`mailto:${email.value}`}
              aria-label="Email"
            >
              <Mail
                size={18}
              />
            </a>
          ) : null}

          {linkedin ? (
            <a
              href={
                linkedin.url
              }
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin
                size={18}
              />
            </a>
          ) : null}

          <a
            href="#home"
            aria-label="Back to top"
          >
            <ArrowUp
              size={18}
            />
          </a>
        </div>

        <div
          className={
            styles.bottom
          }
        >
          <span>
            © {year}{" "}
            {
              profile.full_name
            }
          </span>

          <span>
            Built with Next.js
            & FastAPI
          </span>
        </div>
      </div>
    </footer>
  );
}