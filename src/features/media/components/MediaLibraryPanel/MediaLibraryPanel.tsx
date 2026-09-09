"use client";

import {
  Images,
  Plus,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import {
  Button,
} from "@/shared/components/admin/Button/Button";

import {
  ConfirmDialog,
} from "@/shared/components/admin/ConfirmDialog/ConfirmDialog";

import {
  EmptyState,
} from "@/shared/components/admin/EmptyState/EmptyState";

import {
  SearchInput,
} from "@/shared/components/admin/SearchInput/SearchInput";

import {
  useToast,
} from "@/shared/providers/toast-provider";

import {
  useMediaMutations,
} from "../../hooks/media.mutations";

import {
  useMediaAssets,
} from "../../hooks/media.queries";

import type {
  MediaAsset,
} from "../../types/media.types";

import {
  MediaAssetCard,
} from "../MediaAssetCard/MediaAssetCard";

import {
  MediaUploadModal,
} from "../MediaUploadModal/MediaUploadModal";

import styles from "../MediaAdmin.module.css";


export function MediaLibraryPanel() {
  const mediaQuery =
    useMediaAssets();

  const {
    deleteMutation,
  } =
    useMediaMutations();

  const {
    showToast,
  } = useToast();


  const [search, setSearch] =
    useState("");

  const [
    uploadOpen,
    setUploadOpen,
  ] = useState(false);

  const [
    deleting,
    setDeleting,
  ] =
    useState<
      MediaAsset | null
    >(null);


  const assets =
    mediaQuery.data ?? [];


  const filtered =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      if (!term) {
        return assets;
      }

      return assets.filter(
        (asset) =>
          asset.storage_key
            .toLowerCase()
            .includes(term) ||
          asset.mime_type
            ?.toLowerCase()
            .includes(term) ||
          asset.storage_provider
            .toLowerCase()
            .includes(term),
      );
    }, [
      assets,
      search,
    ]);


  const remove = async () => {
    if (!deleting) {
      return;
    }

    try {
      await deleteMutation
        .mutateAsync(
          deleting.id,
        );

      showToast({
        title:
          "Media deleted",

        message:
          "The asset was removed from the media library.",
      });

      setDeleting(null);
    } catch (error) {
      showToast({
        title:
          "Unable to delete media",

        message:
          error instanceof Error
            ? error.message
            : undefined,

        variant: "error",
      });
    }
  };


  if (mediaQuery.isLoading) {
    return (
      <div>
        Loading media...
      </div>
    );
  }


  if (
    mediaQuery.isError
  ) {
    return (
      <div>
        {mediaQuery.error
          instanceof Error
          ? mediaQuery.error.message
          : "Unable to load media."}
      </div>
    );
  }


  return (
    <>
      <section
        className={
          styles.panel
        }
      >
        <div
          className={
            styles.toolbar
          }
        >
          <SearchInput
            value={search}
            placeholder="Search media..."
            onChange={setSearch}
          />

          <div
            style={{
              display: "flex",
              alignItems:
                "center",
              gap: "0.75rem",
            }}
          >
            <span
              className={
                styles.count
              }
            >
              {filtered.length}
              {" "}
              {filtered.length === 1
                ? "asset"
                : "assets"}
            </span>

            <Button
              size="sm"
              onClick={() =>
                setUploadOpen(
                  true,
                )
              }
            >
              <Plus
                size={16}
              />

              Upload
            </Button>
          </div>
        </div>


        {filtered.length ===
        0 ? (
          <EmptyState
            icon={
              <Images
                size={34}
              />
            }
            title={
              search
                ? "No matching media"
                : "Your media library is empty"
            }
            description={
              search
                ? "Try another search."
                : "Upload your first image or document."
            }
            action={
              !search ? (
                <Button
                  onClick={() =>
                    setUploadOpen(
                      true,
                    )
                  }
                >
                  <Plus
                    size={16}
                  />

                  Upload media
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div
            className={
              styles.grid
            }
          >
            {filtered.map(
              (asset) => (
                <MediaAssetCard
                  key={
                    asset.id
                  }
                  asset={
                    asset
                  }
                  onDelete={
                    setDeleting
                  }
                />
              ),
            )}
          </div>
        )}
      </section>


      <MediaUploadModal
        open={uploadOpen}
        onClose={() =>
          setUploadOpen(false)
        }
      />


      <ConfirmDialog
        open={!!deleting}
        title="Delete media asset?"
        description={
          deleting
            ? `The asset "${deleting.storage_key}" will be permanently removed. If it is currently referenced by the profile, an organization or a project, the backend may prevent the deletion.`
            : ""
        }
        loading={
          deleteMutation
            .isPending
        }
        onCancel={() =>
          setDeleting(null)
        }
        onConfirm={remove}
      />
    </>
  );
}