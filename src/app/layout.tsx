import type {
  Metadata,
} from "next";

import {
  Geist,
  Geist_Mono,
} from "next/font/google";

import {
  siteConfig,
} from "@/config/site";

import "./globals.css";


const geistSans = Geist({
  variable:
    "--font-geist-sans",

  subsets: [
    "latin",
  ],
});


const geistMono =
  Geist_Mono({
    variable:
      "--font-geist-mono",

    subsets: [
      "latin",
    ],
  });


export const metadata: Metadata =
  {
    metadataBase:
      new URL(
        siteConfig.url,
      ),

    title: {
      default:
        siteConfig.title,

      template:
        `%s | ${siteConfig.name}`,
    },

    description:
      siteConfig.description,

    applicationName:
      siteConfig.name,

    authors: [
      {
        name:
          siteConfig.name,

        url:
          siteConfig.url,
      },
    ],

    creator:
      siteConfig.name,

    publisher:
      siteConfig.name,

    category:
      "technology",
  };


type RootLayoutProps = {
  children:
    React.ReactNode;
};


export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang={
        siteConfig.language
      }
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