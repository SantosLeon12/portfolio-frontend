import {
  Search,
  X,
} from "lucide-react";

import styles from "./SearchInput.module.css";


type SearchInputProps = {
  value: string;

  placeholder?: string;

  onChange:
    (value: string) => void;
};


export function SearchInput({
  value,
  placeholder = "Search...",
  onChange,
}: SearchInputProps) {
  return (
    <div className={styles.wrapper}>
      <Search
        size={18}
        aria-hidden="true"
      />

      <input
        value={value}
        type="search"
        placeholder={placeholder}
        className={styles.input}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />

      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() =>
            onChange("")
          }
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}