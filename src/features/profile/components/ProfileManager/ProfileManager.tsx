"use client";

import {
  Save,
} from "lucide-react";

import {
  Button,
} from "@/shared/components/admin/Button/Button";

import {
  PageHeader,
} from "@/shared/components/admin/PageHeader/PageHeader";

import {
  useAdminProfile,
} from "../../hooks/useAdminProfile";

import {
  ContactsSection,
} from "../ContactsSection/ContactsSection";

import {
  InterestsSection,
} from "../InterestsSection/InterestsSection";

import {
  ProfileForm,
} from "../ProfileForm/ProfileForm";

import {
  SocialLinksSection,
} from "../SocialLinksSection/SocialLinksSection";

import {
  StrengthsSection,
} from "../StrengthsSection/StrengthsSection";

import styles from "./ProfileManager.module.css";


export function ProfileManager() {
  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = useAdminProfile();


  if (isLoading) {
    return (
      <div
        className={styles.state}
      >
        <div
          className={styles.spinner}
        />

        <p>Loading profile...</p>
      </div>
    );
  }


  if (
    isError ||
    !profile
  ) {
    return (
      <div
        className={
          styles.errorState
        }
      >
        <strong>
          Unable to load profile
        </strong>

        <p>
          {error instanceof Error
            ? error.message
            : "Profile could not be loaded."}
        </p>
      </div>
    );
  }


  return (
    <div
      className={styles.page}
    >
      <PageHeader
        eyebrow="Profile"
        title="Personal information"
        description="
          Manage the information
          displayed throughout your
          public portfolio.
        "
        actions={
          <Button
            type="submit"
            form="profile-form"
          >
            <Save size={17} />
            Save profile
          </Button>
        }
      />

      <ProfileForm
        profile={profile}
      />

      <ContactsSection
        contacts={profile.contacts}
      />

      <SocialLinksSection
        socialLinks={
          profile.social_links
        }
      />

      <StrengthsSection
        strengths={
          profile.strengths
        }
      />

      <InterestsSection
        interests={
          profile.interests
        }
      />
    </div>
  );
}