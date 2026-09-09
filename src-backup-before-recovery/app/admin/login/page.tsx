import {
  redirect,
} from "next/navigation";

import {
  LoginForm,
} from "@/features/auth/components/LoginForm/LoginForm";
import {
  getAdminSession,
} from "@/features/auth/lib/server-session";

import styles from "./login.module.css";


export default async function LoginPage() {
  const admin =
    await getAdminSession();

  if (admin) {
    redirect("/admin");
  }

  return (
    <main
      className={styles.page}
    >
      <section
        className={styles.card}
      >
        <div
          className={
            styles.heading
          }
        >
          <span
            className={
              styles.eyebrow
            }
          >
            Portfolio Admin
          </span>

          <h1
            className={styles.title}
          >
            Welcome back
          </h1>

          <p
            className={
              styles.description
            }
          >
            Sign in to manage your
            portfolio content.
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}