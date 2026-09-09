import type {
  ReactNode,
} from "react";

import type {
  AdminUser,
} from "@/features/auth/types/auth.types";

import {
  AdminHeader,
} from "../AdminHeader/AdminHeader";
import {
  AdminSidebar,
} from "../AdminSidebar/AdminSidebar";

import styles from "./AdminShell.module.css";


type AdminShellProps = {
  admin: AdminUser;
  children: ReactNode;
};


export function AdminShell({
  admin,
  children,
}: AdminShellProps) {
  return (
    <div
      className={styles.shell}
    >
      <AdminSidebar />

      <div
        className={styles.main}
      >
        <AdminHeader
          admin={admin}
        />

        <main
          className={
            styles.content
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
}