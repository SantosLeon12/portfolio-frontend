import type {
  Metadata,
} from "next";

import type {
  ReactNode,
} from "react";


export const metadata: Metadata =
  {
    title:
      "Admin",

    robots: {
      index: false,
      follow: false,

      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    },
  };


type AdminRootLayoutProps = {
  children:
    ReactNode;
};


export default function AdminRootLayout({
  children,
}: AdminRootLayoutProps) {
  return (
    <>
      {children}
    </>
  );
}