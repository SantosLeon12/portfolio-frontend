import {
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Button,
} from "@/shared/components/admin/Button/Button";

import styles from "./ProfileCollectionCard.module.css";


type Props = {
  title: string;

  subtitle?: string | null;

  visible?: boolean;

  badges?: string[];

  onEdit: () => void;
  onDelete: () => void;
};


export function ProfileCollectionCard({
  title,
  subtitle,
  visible,
  badges = [],
  onEdit,
  onDelete,
}: Props) {
  return (
    <article
      className={styles.card}
    >
      <div
        className={styles.main}
      >
        <div>
          <strong>
            {title}
          </strong>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>

        <div
          className={styles.badges}
        >
          {badges.map(
            (badge) => (
              <span key={badge}>
                {badge}
              </span>
            ),
          )}

          {visible !== undefined && (
            <span
              className={
                visible
                  ? styles.visible
                  : styles.hidden
              }
            >
              {visible ? (
                <Eye size={13} />
              ) : (
                <EyeOff size={13} />
              )}

              {visible
                ? "Visible"
                : "Hidden"}
            </span>
          )}
        </div>
      </div>

      <div
        className={styles.actions}
      >
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onEdit}
        >
          <Pencil size={15} />
          Edit
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 size={15} />
          Delete
        </Button>
      </div>
    </article>
  );
}