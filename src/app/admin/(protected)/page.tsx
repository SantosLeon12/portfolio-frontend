import styles from "./dashboard.module.css";


export default function AdminDashboardPage() {
  return (
    <div
      className={styles.page}
    >
      <header
        className={styles.heading}
      >
        <div>
          <span
            className={
              styles.eyebrow
            }
          >
            Administration
          </span>

          <h1>
            Dashboard
          </h1>

          <p>
            Manage the information
            displayed throughout your
            portfolio.
          </p>
        </div>
      </header>

      <section
        className={styles.grid}
      >
        <article
          className={styles.card}
        >
          <span>Profile</span>
          <strong>Personal info</strong>

          <p>
            Manage your profile,
            contacts and social links.
          </p>
        </article>

        <article
          className={styles.card}
        >
          <span>Projects</span>
          <strong>
            Portfolio work
          </strong>

          <p>
            Manage projects, media,
            technologies and case
            studies.
          </p>
        </article>

        <article
          className={styles.card}
        >
          <span>Professional</span>
          <strong>
            Career information
          </strong>

          <p>
            Manage experience,
            education and skills.
          </p>
        </article>
      </section>
    </div>
  );
}