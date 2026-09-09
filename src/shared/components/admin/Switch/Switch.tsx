import styles from "./Switch.module.css";


type SwitchProps = {
  checked: boolean;
  onCheckedChange:
    (checked: boolean) => void;

  disabled?: boolean;
  label?: string;
};


export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  label,
}: SwitchProps) {
  return (
    <label
      className={styles.wrapper}
    >
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        className={`${styles.switch} ${
          checked
            ? styles.checked
            : ""
        }`}
        onClick={() =>
          onCheckedChange(
            !checked,
          )
        }
      >
        <span
          className={styles.thumb}
        />
      </button>

      {label && (
        <span
          className={styles.label}
        >
          {label}
        </span>
      )}
    </label>
  );
}