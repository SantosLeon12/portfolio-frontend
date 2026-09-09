"use client";

import type {
  ReactNode,
} from "react";

import {
  QueryProvider,
} from "./query-provider";
import {
  ToastProvider,
} from "./toast-provider";


type AppProvidersProps = {
  children: ReactNode;
};


export function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <QueryProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </QueryProvider>
  );
}