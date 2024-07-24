import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  type: "submit" | "button" | "reset";
  text: string;
  onClick?: () => void;
  variant?: "primary" | "danger" | "warning";
}

const Button: React.FC<ButtonProps> = ({
  type,
  text,
  onClick,
  variant = "primary",
}) => {
  const buttonClass = `${styles.button} ${styles[variant]}`;
  return (
    <button type={type} className={buttonClass} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
