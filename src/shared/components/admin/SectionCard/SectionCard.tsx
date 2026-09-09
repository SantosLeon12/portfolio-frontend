import type {
  ReactNode,
} from "react";

import styles from "./SectionCard.module.css";


type SectionCardProps = {
  title: string;
  description?: string;

  children: ReactNode;
};


export function SectionCard({
  title,
  description,
  children,
}: SectionCardProps) {
  return (
    <section
      className={styles.card}
    >
      <header
        className={styles.header}
      >
        <h2>{title}</h2>

        {description && (
          <p>{description}</p>
        )}
      </header>

      <div
        className={styles.content}
      >
        {children}
      </div>
    </section>
  );
}