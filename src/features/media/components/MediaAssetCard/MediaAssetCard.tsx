"use client";

import {
  ExternalLink,
  FileText,
  ImageIcon,
  Trash2,
} from "lucide-react";

import {
  Button,
} from "@/shared/components/admin/Button/Button";

import type {
  MediaAsset,
} from "../../types/media.types";

import styles from "./MediaAssetCard.module.css";


type Props = {
  asset: MediaAsset;

  onDelete:
    (asset: MediaAsset) => void;
};


function formatBytes(
  bytes:
    | number
    | null,
) {
  if (
    bytes === null ||
    bytes === undefined
  ) {
    return "Unknown";
  }

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
    Math.min(
      Math.floor(
        Math.log(bytes) /
          Math.log(1024),
      ),
      units.length - 1,
    );

  const value =
    bytes /
    1024 ** index;

  return `${value.toFixed(
    index === 0 ? 0 : 1,
  )} ${units[index]}`;
}


function getFilename(
  storageKey: string,
) {
  const parts =
    storageKey.split("/");

  return (
    parts[
      parts.length - 1
    ] || storageKey
  );
}


export function MediaAssetCard({
  asset,
  onDelete,
}: Props) {
  const isImage =
    asset.mime_type?.startsWith(
      "image/",
    ) ?? false;


  return (
    <article
      className={styles.card}
    >
      <div
        className={
          styles.preview
        }
      >
        {isImage ? (
          // We intentionally use a
          // normal img because Cloudinary
          // domains can vary by account.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={asset.url}
            alt=""
          />
        ) : (
          <div
            className={
              styles.filePreview
            }
          >
            <FileText
              size={38}
            />

            <span>
              {asset.mime_type ??
                "Document"}
            </span>
          </div>
        )}

        <span
          className={
            styles.provider
          }
        >
          {
            asset.storage_provider
          }
        </span>
      </div>


      <div
        className={
          styles.content
        }
      >
        <div
          className={
            styles.heading
          }
        >
          {isImage ? (
            <ImageIcon
              size={16}
            />
          ) : (
            <FileText
              size={16}
            />
          )}

          <strong
            title={
              asset.storage_key
            }
          >
            {getFilename(
              asset.storage_key,
            )}
          </strong>
        </div>


        <dl
          className={
            styles.details
          }
        >
          <div>
            <dt>
              Type
            </dt>

            <dd>
              {asset.mime_type ??
                "Unknown"}
            </dd>
          </div>

          <div>
            <dt>
              Size
            </dt>

            <dd>
              {formatBytes(
                asset.file_size,
              )}
            </dd>
          </div>

          {asset.width &&
            asset.height && (
              <div>
                <dt>
                  Dimensions
                </dt>

                <dd>
                  {asset.width}
                  {" × "}
                  {asset.height}
                </dd>
              </div>
            )}

          <div>
            <dt>
              Asset ID
            </dt>

            <dd>
              #{asset.id}
            </dd>
          </div>
        </dl>


        <div
          className={
            styles.actions
          }
        >
          <a
            href={asset.url}
            target="_blank"
            rel="noreferrer"
            className={
              styles.open
            }
          >
            <ExternalLink
              size={15}
            />

            Open
          </a>

          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() =>
              onDelete(asset)
            }
          >
            <Trash2
              size={15}
            />

            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}