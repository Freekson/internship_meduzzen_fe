import React from "react";
import styles from "./InputLabel.module.scss";

interface InputLabelProps {
  label: string;
  id: string;
  name: string;
  type: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputLabel: React.FC<InputLabelProps> = React.memo(
  ({ label, id, name, type, required = false, value, onChange }) => {
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
        />
      </>
    );
  }
);

export default InputLabel;
