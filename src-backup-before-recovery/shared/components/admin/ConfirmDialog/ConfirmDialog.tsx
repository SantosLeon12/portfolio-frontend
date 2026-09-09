"use client";

import {
  TriangleAlert,
} from "lucide-react";

import {
  Button,
} from "../Button/Button";
import {
  Modal,
} from "../Modal/Modal";

import styles from "./ConfirmDialog.module.css";


type ConfirmDialogProps = {
  open: boolean;

  title: string;
  description: string;

  loading?: boolean;

  onCancel: () => void;
  onConfirm: () => void;
};


export function ConfirmDialog({
  open,
  title,
  description,
  loading = false,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={
        loading
          ? () => {}
          : onCancel
      }
    >
      <div
        className={styles.content}
      >
        <div
          className={
            styles.warning
          }
        >
          <TriangleAlert
            size={22}
          />
        </div>

        <p>{description}</p>
      </div>

      <footer
        className={styles.actions}
      >
        <Button
          type="button"
          variant="secondary"
          disabled={loading}
          onClick={onCancel}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="danger"
          loading={loading}
          onClick={onConfirm}
        >
          Delete
        </Button>
      </footer>
    </Modal>
  );
}