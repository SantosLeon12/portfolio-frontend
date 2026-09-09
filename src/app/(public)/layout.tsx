import type {
  ReactNode,
} from "react";

import {
  ContextCursor,
} from "@/features/public-home/components/ContextCursor";


type PublicLayoutProps = {
  children: ReactNode;
};


export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <div className="public-theme">
      {children}

      <ContextCursor />
    </div>
  );
}