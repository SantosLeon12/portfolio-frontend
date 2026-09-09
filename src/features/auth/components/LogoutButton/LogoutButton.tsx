"use client";

import {
  LogOut,
} from "lucide-react";
import {
  useRouter,
} from "next/navigation";
import {
  useState,
} from "react";

import {
  logout,
} from "../../api/auth.api";


export function LogoutButton() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await logout();

      router.replace(
        "/admin/login",
      );

      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      title="Sign out"
    >
      <LogOut size={18} />

      <span>
        {loading
          ? "Signing out..."
          : "Sign out"}
      </span>
    </button>
  );
}