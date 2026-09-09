import type {
  Metadata,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:
      "Jorge Luis De los Santos León | Software Engineer",
    template:
      "%s | Jorge Luis De los Santos León",
  },

  description:
    "Software Engineer and Full Stack Developer focused on ERP systems, web and mobile applications, integrations, and practical business solutions.",
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={[
        geistSans.variable,
        geistMono.variable,
      ].join(" ")}
    >
      <body>
        {children}
      </body>
    </html>
  );
}