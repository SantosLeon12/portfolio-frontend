"use client";

import {
  type FormEvent,
  useState,
} from "react";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

import {
  FaLinkedin,
} from "react-icons/fa";

import {
  sendPublicContactMessage,
} from "../services/publicContact.service";

import type {
  PublicProfile,
} from "../types/publicHome.types";

import styles from "./ContactSection.module.css";


type ContactSectionProps = {
  profile: PublicProfile;
};


type FormStatus =
  | "idle"
  | "sending"
  | "success"
  | "error";


type SubmittedMessage = {
  name: string;

  email: string;

  subject: string;
};


/* =========================================================
   COMPONENT
   ========================================================= */

export function ContactSection({
  profile,
}: ContactSectionProps) {
  const [
    status,
    setStatus,
  ] =
    useState<FormStatus>(
      "idle",
    );

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<string | null>(
      null,
    );

  const [
    submittedMessage,
    setSubmittedMessage,
  ] =
    useState<SubmittedMessage | null>(
      null,
    );


  /* =======================================================
     PROFILE CONTACT DATA
     ======================================================= */

  const email =
    profile.contacts.find(
      (contact) =>
        contact.contact_type ===
          "EMAIL" &&
        contact.is_visible,
    );

  const phone =
    profile.contacts.find(
      (contact) =>
        contact.contact_type ===
          "PHONE" &&
        contact.is_visible,
    );

  const linkedin =
    profile.social_links.find(
      (link) =>
        link.platform
          .toLowerCase() ===
          "linkedin" &&
        link.is_visible,
    );


  /* =======================================================
     SUBMIT
     ======================================================= */

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const form =
      event.currentTarget;

    const formData =
      new FormData(
        form,
      );


    const payload = {
      name:
        String(
          formData.get(
            "name",
          ) ?? "",
        ).trim(),

      email:
        String(
          formData.get(
            "email",
          ) ?? "",
        ).trim(),

      subject:
        String(
          formData.get(
            "subject",
          ) ?? "",
        ).trim(),

      message:
        String(
          formData.get(
            "message",
          ) ?? "",
        ).trim(),
    };


    setErrorMessage(
      null,
    );

    setStatus(
      "sending",
    );


    try {
      await sendPublicContactMessage(
        payload,
      );


      /*
       * We only keep non-sensitive summary
       * information for the confirmation state.
       *
       * The complete message is not rendered again.
       */

      setSubmittedMessage({
        name:
          payload.name,

        email:
          payload.email,

        subject:
          payload.subject,
      });


      /*
       * Reset only after a successful request.
       *
       * If the request fails, all typed information
       * remains intact in the form.
       */

      form.reset();


      setStatus(
        "success",
      );
    } catch (
      error
    ) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );

      setStatus(
        "error",
      );
    }
  }


  /* =======================================================
     SEND ANOTHER
     ======================================================= */

  function handleSendAnother() {
    setSubmittedMessage(
      null,
    );

    setErrorMessage(
      null,
    );

    setStatus(
      "idle",
    );
  }


  /* =======================================================
     SUCCESS NAME
     ======================================================= */

  const submittedFirstName =
    submittedMessage
      ?.name
      .trim()
      .split(/\s+/)[0] ??
    "";


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <section
      id="contact"
      className={[
        "public-section",
        styles.section,
      ].join(" ")}
    >
      <div
        className={
          styles.glow
        }
        aria-hidden="true"
      />

      <div
        className={[
          "public-container",
          styles.container,
        ].join(" ")}
      >
        {/* ===================================================
            HEADER
            =================================================== */}

        <header
          className={
            styles.sectionHeader
          }
        >
          <div
            className={
              styles.sectionLabel
            }
          >
            <span
              className={
                styles.sectionNumber
              }
            >
              05
            </span>

            <span
              className={
                styles.sectionLine
              }
            />

            <span>
              Contact
            </span>
          </div>

          <h2
            className={
              styles.sectionTitle
            }
          >
            Have an idea,
            opportunity or
            challenge?{" "}
            <span className="public-gradient-text">
              Let&apos;s talk.
            </span>
          </h2>
        </header>


        {/* ===================================================
            CONTENT
            =================================================== */}

        <div
          className={
            styles.contactGrid
          }
        >
          {/* ===============================================
              CONTACT INFORMATION
              =============================================== */}

          <div
            className={
              styles.contactInfo
            }
          >
            <p
              className={
                styles.intro
              }
            >
              I&apos;m open to
              software development
              opportunities,
              collaborative
              projects and
              conversations about
              building useful
              digital products.
            </p>


            {/* =============================================
                CONTACT LINKS
                ============================================= */}

            <div
              className={
                styles.contactLinks
              }
            >
              {email ? (
                <a
                  href={`mailto:${email.value}`}
                  className={
                    styles.contactLink
                  }
                  data-context-cursor="email"
                >
                  <div>
                    <Mail
                      size={18}
                    />
                  </div>

                  <span>
                    <small>
                      Email
                    </small>

                    <strong>
                      {
                        email.value
                      }
                    </strong>
                  </span>

                  <ArrowUpRight
                    size={17}
                  />
                </a>
              ) : null}


              {phone ? (
                <a
                  href={`tel:${phone.value}`}
                  className={
                    styles.contactLink
                  }
                  data-context-cursor="call"
                >
                  <div>
                    <Phone
                      size={18}
                    />
                  </div>

                  <span>
                    <small>
                      Phone
                    </small>

                    <strong>
                      {
                        phone.value
                      }
                    </strong>
                  </span>

                  <ArrowUpRight
                    size={17}
                  />
                </a>
              ) : null}


              {linkedin ? (
                <a
                  href={
                    linkedin.url
                  }
                  target="_blank"
                  rel="noreferrer"
                  className={
                    styles.contactLink
                  }
                  data-context-cursor="open"
                >
                  <div>
                    <FaLinkedin
                      size={18}
                    />
                  </div>

                  <span>
                    <small>
                      LinkedIn
                    </small>

                    <strong>
                      Connect with me
                    </strong>
                  </span>

                  <ArrowUpRight
                    size={17}
                  />
                </a>
              ) : null}
            </div>


            {/* =============================================
                LOCATION
                ============================================= */}

            {profile.location ? (
              <div
                className={
                  styles.location
                }
              >
                <MapPin
                  size={16}
                />

                <span>
                  {
                    profile.location
                  }
                </span>
              </div>
            ) : null}
          </div>


          {/* =================================================
              SUCCESS STATE
              ================================================= */}

          {status ===
            "success" &&
          submittedMessage ? (
            <section
              className={
                styles.successState
              }
              aria-live="polite"
              aria-label="Message sent successfully"
            >
              {/* =============================================
                  SUCCESS HEADER
                  ============================================= */}

              <div
                className={
                  styles.successHeader
                }
              >
                <div
                  className={
                    styles.successIcon
                  }
                  aria-hidden="true"
                >
                  <Check
                    size={22}
                    strokeWidth={
                      2
                    }
                  />
                </div>

                <div>
                  <span
                    className={
                      styles.successEyebrow
                    }
                  >
                    Message received
                  </span>

                  <h3>
                    Thanks
                    {submittedFirstName
                      ? `, ${submittedFirstName}`
                      : ""}
                    .
                  </h3>
                </div>
              </div>


              {/* =============================================
                  SUCCESS MESSAGE
                  ============================================= */}

              <p
                className={
                  styles.successText
                }
              >
                Your message was
                submitted successfully.
                I&apos;ll review it and
                get back to you as soon
                as possible.
              </p>


              {/* =============================================
                  RECEIPT
                  ============================================= */}

              <div
                className={
                  styles.receipt
                }
              >
                <div
                  className={
                    styles.receiptHeader
                  }
                >
                  <span>
                    Submission details
                  </span>

                  <div
                    className={
                      styles.receiptStatus
                    }
                  >
                    <span
                      className={
                        styles.receiptDot
                      }
                      aria-hidden="true"
                    />

                    Received
                  </div>
                </div>


                <dl
                  className={
                    styles.receiptList
                  }
                >
                  <div>
                    <dt>
                      From
                    </dt>

                    <dd>
                      {
                        submittedMessage.email
                      }
                    </dd>
                  </div>

                  <div>
                    <dt>
                      Subject
                    </dt>

                    <dd>
                      {
                        submittedMessage.subject
                      }
                    </dd>
                  </div>
                </dl>
              </div>


              {/* =============================================
                  SEND ANOTHER
                  ============================================= */}

              <button
                type="button"
                className={
                  styles.sendAnotherButton
                }
                onClick={
                  handleSendAnother
                }
              >
                <span>
                  Send another message
                </span>

                <ArrowRight
                  size={17}
                  strokeWidth={
                    1.8
                  }
                />
              </button>
            </section>
          ) : (
            /* ===============================================
               FORM
               =============================================== */

            <form
              className={[
                styles.form,

                status ===
                "sending"
                  ? styles.formSending
                  : "",
              ].join(" ")}
              onSubmit={
                handleSubmit
              }
            >
              {/* =============================================
                  NAME + EMAIL
                  ============================================= */}

              <div
                className={
                  styles.formRow
                }
              >
                <label
                  className={
                    styles.field
                  }
                >
                  <span>
                    Name
                  </span>

                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    required
                    maxLength={
                      160
                    }
                    disabled={
                      status ===
                      "sending"
                    }
                  />
                </label>

                <label
                  className={
                    styles.field
                  }
                >
                  <span>
                    Email
                  </span>

                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    disabled={
                      status ===
                      "sending"
                    }
                  />
                </label>
              </div>


              {/* =============================================
                  SUBJECT
                  ============================================= */}

              <label
                className={
                  styles.field
                }
              >
                <span>
                  Subject
                </span>

                <input
                  name="subject"
                  type="text"
                  placeholder="What would you like to discuss?"
                  required
                  maxLength={
                    200
                  }
                  disabled={
                    status ===
                    "sending"
                  }
                />
              </label>


              {/* =============================================
                  MESSAGE
                  ============================================= */}

              <label
                className={
                  styles.field
                }
              >
                <span>
                  Message
                </span>

                <textarea
                  name="message"
                  placeholder="Tell me a little about your idea, project or opportunity..."
                  required
                  maxLength={
                    5000
                  }
                  rows={6}
                  disabled={
                    status ===
                    "sending"
                  }
                />
              </label>


              {/* =============================================
                  FOOTER
                  ============================================= */}

              <div
                className={
                  styles.formFooter
                }
              >
                <div
                  className={[
                    styles.formMessage,

                    status ===
                    "error"
                      ? styles.formMessageError
                      : "",

                    status ===
                    "sending"
                      ? styles.formMessageSending
                      : "",
                  ].join(" ")}
                  aria-live="polite"
                  role="status"
                >
                  {status ===
                  "sending"
                    ? "Sending your message..."
                    : null}

                  {status ===
                  "error"
                    ? errorMessage ??
                      "Something went wrong. Please try again."
                    : null}
                </div>


                <button
                  type="submit"
                  disabled={
                    status ===
                    "sending"
                  }
                  className={
                    styles.submitButton
                  }
                >
                  <span>
                    {status ===
                    "sending"
                      ? "Sending..."
                      : "Send message"}
                  </span>

                  <Send
                    size={17}
                  />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}