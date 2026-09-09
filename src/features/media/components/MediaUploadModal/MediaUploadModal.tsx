"use client";

import {
  FileUp,
  ImageIcon,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Button,
} from "@/shared/components/admin/Button/Button";

import {
  Modal,
} from "@/shared/components/admin/Modal/Modal";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useMediaMutations,
} from "../../hooks/media.mutations";

import styles from "./MediaUploadModal.module.css";


type Props = {
  open: boolean;

  onClose: () => void;
};


const MAX_FILE_SIZE =
  10 * 1024 * 1024;


function formatBytes(
  bytes: number,
) {
  if (bytes === 0) {
    return "0 B";
  }

  const units = [
    "B",
    "KB",
    "MB",
    "GB",
  ];

  const index =
    Math.floor(
      Math.log(bytes) /
        Math.log(1024),
    );

  const value =
    bytes /
    1024 ** index;

  return `${value.toFixed(
    index === 0 ? 0 : 1,
  )} ${units[index]}`;
}


export function MediaUploadModal({
  open,
  onClose,
}: Props) {
  const [file, setFile] =
    useState<File | null>(
      null,
    );

  const [error, setError] =
    useState<
      string | null
    >(null);

  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );


  const {
    uploadMutation,
  } = useMediaMutations();

  const {
    showToast,
  } = useToast();


  useEffect(() => {
    if (!open) {
      return;
    }

    setFile(null);
    setError(null);

    if (inputRef.current) {
      inputRef.current.value =
        "";
    }
  }, [open]);


  const selectFile = (
    selectedFile:
      File | undefined,
  ) => {
    setError(null);

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (
      selectedFile.size >
      MAX_FILE_SIZE
    ) {
      setFile(null);

      setError(
        "The file cannot exceed 10 MB.",
      );

      return;
    }

    setFile(selectedFile);
  };


  const upload = async () => {
    if (!file) {
      setError(
        "Select a file first.",
      );

      return;
    }

    try {
      await uploadMutation
        .mutateAsync(file);

      showToast({
        title:
          "Media uploaded",

        message:
          `${file.name} was uploaded successfully.`,
      });

      onClose();
    } catch (error) {
      showToast({
        title:
          "Unable to upload media",

        message:
          error instanceof Error
            ? error.message
            : undefined,

        variant: "error",
      });
    }
  };


  const isImage =
    file?.type.startsWith(
      "image/",
    );


  return (
    <Modal
      open={open}
      title="Upload media"
      description="
        Upload an image or document
        to your media library.
      "
      onClose={onClose}
    >
      <div
        className={
          styles.content
        }
      >
        <button
          type="button"
          className={
            styles.dropArea
          }
          onClick={() =>
            inputRef
              .current
              ?.click()
          }
        >
          <input
            ref={inputRef}
            type="file"
            className={
              styles.hiddenInput
            }
            onChange={(
              event,
            ) =>
              selectFile(
                event.target
                  .files?.[0],
              )
            }
          />

          {isImage ? (
            <ImageIcon
              size={34}
            />
          ) : (
            <FileUp
              size={34}
            />
          )}

          <strong>
            {file
              ? file.name
              : "Choose a file"}
          </strong>

          <span>
            {file
              ? formatBytes(
                  file.size,
                )
              : "Images and documents up to 10 MB"}
          </span>
        </button>


        {file && (
          <div
            className={
              styles.fileInfo
            }
          >
            <div>
              <span>
                Type
              </span>

              <strong>
                {file.type ||
                  "Unknown"}
              </strong>
            </div>

            <div>
              <span>
                Size
              </span>

              <strong>
                {formatBytes(
                  file.size,
                )}
              </strong>
            </div>
          </div>
        )}


        {error && (
          <p
            className={
              styles.error
            }
          >
            {error}
          </p>
        )}


        <footer
          className={
            styles.actions
          }
        >
          <Button
            type="button"
            variant="secondary"
            disabled={
              uploadMutation
                .isPending
            }
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            loading={
              uploadMutation
                .isPending
            }
            disabled={!file}
            onClick={upload}
          >
            <FileUp
              size={16}
            />

            Upload
          </Button>
        </footer>
      </div>
    </Modal>
  );
}