import React from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  type: "submit" | "button" | "reset";
  text: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ type, text, onClick }) => {
  return (
    <button type={type} className={styles.button} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
