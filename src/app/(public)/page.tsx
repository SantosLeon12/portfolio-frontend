import {
  AboutSection,
} from "@/features/public-home/components/AboutSection";

import {
  ContactSection,
} from "@/features/public-home/components/ContactSection";

import {
  HeroSection,
} from "@/features/public-home/components/HeroSection";

import {
  ProfessionalSection,
} from "@/features/public-home/components/ProfessionalSection";

import {
  ProjectsSection,
} from "@/features/public-home/components/ProjectsSection";

import {
  PublicFooter,
} from "@/features/public-home/components/PublicFooter";

import {
  PublicHeader,
} from "@/features/public-home/components/PublicHeader";

import {
  StackSection,
} from "@/features/public-home/components/StackSection";

import {
  getPublicHomeData,
} from "@/features/public-home/services/publicHome.service";


export default async function HomePage() {
  const {
    profile,
    profileMedia,
    documents,
    technologies,
    projects,
    experiences,
    educations,
    languages,
  } = await getPublicHomeData();


  /* =======================================================
     RESUME
     ======================================================= */

  const resume =
    documents.find(
      (document) =>
        document.document_type ===
        "CV",
    ) ??
    documents.find(
      (document) =>
        document.document_type ===
        "RESUME",
    ) ??
    null;


  /* =======================================================
     PROFILE IMAGE

     Same selection strategy used by the Hero:
     HERO -> AVATAR -> first available image.
     ======================================================= */

  const profileImage =
    profileMedia.find(
      (item) =>
        item.media_role ===
        "HERO",
    ) ??
    profileMedia.find(
      (item) =>
        item.media_role ===
        "AVATAR",
    ) ??
    profileMedia[0] ??
    null;


  return (
    <>
      <PublicHeader
        resumeUrl={
          resume?.media_asset.url ??
          null
        }
        profileImageUrl={
          profileImage
            ?.media_asset
            .url ??
          null
        }
        profileImageAlt={
          profileImage
            ?.alt_text ??
          profile.full_name
        }
      />

      <main>
        <HeroSection
          profile={
            profile
          }
          profileMedia={
            profileMedia
          }
          documents={
            documents
          }
        />

        <AboutSection
          profile={
            profile
          }
        />

        <ProjectsSection
          projects={
            projects
          }
        />

        <StackSection
          technologies={
            technologies
          }
        />

        <ProfessionalSection
          experiences={
            experiences
          }
          educations={
            educations
          }
          languages={
            languages
          }
        />

        <ContactSection
          profile={
            profile
          }
        />
      </main>

      <PublicFooter
        profile={
          profile
        }
      />
    </>
  );
}