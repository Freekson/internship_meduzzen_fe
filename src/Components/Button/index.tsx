import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  type: "submit" | "button" | "reset";
  text: string;
  onClick?: () => void;
  variant?: "primary" | "danger" | "warning" | "success";
  disabled?: boolean;
  title?: string;
}

const Button: React.FC<ButtonProps> = ({
  type,
  text,
  onClick,
  variant = "primary",
  disabled = false,
  title = "",
}) => {
  const buttonClass = `${styles.button} ${styles[variant]}`;
  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {text}
    </button>
  );
};

export default Button;
