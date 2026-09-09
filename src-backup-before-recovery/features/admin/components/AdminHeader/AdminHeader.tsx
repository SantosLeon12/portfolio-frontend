import type {
  AdminUser,
} from "@/features/auth/types/auth.types";
import {
  LogoutButton,
} from "@/features/auth/components/LogoutButton/LogoutButton";

import {
  AdminMobileNav,
} from "../AdminMobileNav/AdminMobileNav";

import styles from "./AdminHeader.module.css";


type AdminHeaderProps = {
  admin: AdminUser;
};


export function AdminHeader({
  admin,
}: AdminHeaderProps) {
  return (
    <header
      className={styles.header}
    >
      <div
        className={
          styles.mobileArea
        }
      >
        <AdminMobileNav />

        <span
          className={
            styles.mobileBrand
          }
        >
          Portfolio Admin
        </span>
      </div>

      <div
        className={styles.user}
      >
        <div
          className={
            styles.userInfo
          }
        >
          <strong>
            Administrator
          </strong>

          <span>
            {admin.email}
          </span>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}