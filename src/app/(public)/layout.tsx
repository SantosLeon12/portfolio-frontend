import type {
  Metadata,
} from "next";

import type {
  ReactNode,
} from "react";

import Script from "next/script";

import {
  serverEnv,
} from "@/config/server-env";

import {
  siteConfig,
} from "@/config/site";

import {
  ContextCursor,
} from "@/features/public-home/components/ContextCursor";


/*
 * We only need the backend origin:
 *
 * Production:
 * https://portfolio-api-vynf.onrender.com
 *
 * Development:
 * http://127.0.0.1:8000
 */
const BACKEND_WAKE_URL =
  new URL(
    serverEnv.apiUrl,
  ).origin;


export const metadata: Metadata =
  {
    alternates: {
      canonical: "/",
    },

    robots: {
      index: true,
      follow: true,
      nocache: false,

      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,

        "max-video-preview":
          -1,

        "max-image-preview":
          "large",

        "max-snippet":
          -1,
      },
    },

    openGraph: {
      type: "website",

      locale:
        siteConfig.locale,

      url: "/",

      siteName:
        siteConfig.name,

      title:
        siteConfig.title,

      description:
        siteConfig.description,
    },

    twitter: {
      card:
        "summary_large_image",

      title:
        siteConfig.title,

      description:
        siteConfig.description,

      images: [
        "/opengraph-image",
      ],
    },
  };


const personJsonLd = {
  "@context":
    "https://schema.org",

  "@type":
    "Person",

  name:
    siteConfig.name,

  url:
    siteConfig.url,

  jobTitle:
    "Full Stack Software Engineer",

  address: {
    "@type":
      "PostalAddress",

    addressLocality:
      "Cancún",

    addressRegion:
      "Quintana Roo",

    addressCountry:
      "MX",
  },

  sameAs: [
    siteConfig.linkedin,
  ],

  knowsAbout: [
    "Software Engineering",
    "Full Stack Development",
    "Python",
    "FastAPI",
    "SQLAlchemy",
    "PostgreSQL",
    "MySQL",
    "TypeScript",
    "React",
    "Next.js",
    "REST APIs",
    "ERP Systems",
    "Web Applications",
    "Mobile Applications",
    "Business Automation",
  ],
};


const websiteJsonLd = {
  "@context":
    "https://schema.org",

  "@type":
    "WebSite",

  name:
    siteConfig.name,

  url:
    siteConfig.url,

  description:
    siteConfig.description,

  inLanguage:
    siteConfig.language,

  author: {
    "@type":
      "Person",

    name:
      siteConfig.name,

    url:
      siteConfig.url,
  },
};


type PublicLayoutProps = {
  children:
    ReactNode;
};


function serializeJsonLd(
  value: object,
) {
  return JSON.stringify(
    value,
  ).replace(
    /</g,
    "\\u003c",
  );
}


export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <div className="public-theme">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              personJsonLd,
            ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html:
            serializeJsonLd(
              websiteJsonLd,
            ),
        }}
      />

      {children}

      <ContextCursor />


      {/*
       * Production-only backend wake-up.
       *
       * The portfolio is already visible when
       * this executes. The browser starts a
       * lightweight GET against Render without
       * waiting for its response.
       *
       * mode: "no-cors" means we do not need
       * to inspect the response; simply reaching
       * Render is enough to wake the service.
       */}
      {process.env.NODE_ENV ===
      "production" ? (
        <Script
          id="wake-portfolio-backend"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  fetch(
                    ${JSON.stringify(
                      BACKEND_WAKE_URL,
                    )},
                    {
                      method: "GET",
                      mode: "no-cors",
                      cache: "no-store",
                      keepalive: true
                    }
                  ).catch(() => {});
                } catch (_) {}
              })();
            `,
          }}
        />
      ) : null}
    </div>
  );
}