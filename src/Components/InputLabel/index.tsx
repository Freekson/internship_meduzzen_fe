import React from "react";
import styles from "./InputLabel.module.scss";

interface InputLabelProps {
  label: string;
  id: string;
  name: string;
  type: string;
  required?: boolean;
  value: string | number;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
}

const InputLabel: React.FC<InputLabelProps> = React.memo(
  ({
    label,
    id,
    name,
    type,
    required = false,
    value,
    disabled = false,
    onChange,
    min = 0,
    max = 100,
  }) => {
    return (
      <>
        <label htmlFor={id}>{label}</label>
        <input
          type={type}
          id={id}
          name={name}
          required={required}
          value={value}
          onChange={onChange}
          className={styles.input}
          disabled={disabled}
          min={min}
          max={max}
        />
      </>
    );
  }
);

export default InputLabel;
