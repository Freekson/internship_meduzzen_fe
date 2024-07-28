import { Link } from "react-router-dom";
import styles from "./CustomLink.module.scss";
import { ReactNode } from "react";

type TProps = {
  to: string;
  text: ReactNode;
  variant?: "default" | "primary" | "secondary" | "danger";
};

const CustomLink: React.FC<TProps> = ({ to, text, variant = "default" }) => {
  return (
    <Link to={to} className={`${styles.link} ${styles[variant]}`}>
      {text}
    </Link>
  );
};

export default CustomLink;
