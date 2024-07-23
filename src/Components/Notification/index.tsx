import React from "react";
import styles from "./Notification.module.scss";

interface NotificationProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ type, message }) => {
  const getClassName = (): string => {
    switch (type) {
      case "success":
        return styles.success;
      case "error":
        return styles.error;
      case "warning":
        return styles.warning;
      case "info":
        return styles.info;
      default:
        return styles.info;
    }
  };

  return (
    <div className={`${styles.notification} ${getClassName()}`}>{message}</div>
  );
};

export default Notification;
