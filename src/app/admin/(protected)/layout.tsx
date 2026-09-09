import {
  redirect,
} from "next/navigation";

import type {
  ReactNode,
} from "react";

import {
  AdminShell,
} from "@/features/admin/components/AdminShell/AdminShell";

import {
  getAdminSession,
} from "@/features/auth/lib/server-session";

import {
  AppProviders,
} from "@/shared/providers/app-providers";


type AdminLayoutProps = {
  children: ReactNode;
};


export default async function AdminLayout({
  children,
}: AdminLayoutProps) {
  const admin =
    await getAdminSession();

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <AppProviders>
      <AdminShell
        admin={admin}
      >
        {children}
      </AdminShell>
    </AppProviders>
  );
}