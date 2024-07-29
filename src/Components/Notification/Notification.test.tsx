import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Notification from ".";
import styles from "./Notification.module.scss";

describe("Notification Component", () => {
  test("Renders the correct message", () => {
    render(<Notification type="success" message="Success message" />);
    expect(screen.getByText("Success message")).toBeInTheDocument();
  });

  test("Applies the correct class for success type", () => {
    render(<Notification type="success" message="Success message" />);
    const notificationElement = screen.getByText("Success message");
    expect(notificationElement).toHaveClass(styles.notification);
    expect(notificationElement).toHaveClass(styles.success);
  });

  test("Applies the correct class for error type", () => {
    render(<Notification type="error" message="Error message" />);
    const notificationElement = screen.getByText("Error message");
    expect(notificationElement).toHaveClass(styles.notification);
    expect(notificationElement).toHaveClass(styles.error);
  });

  test("Applies the correct class for warning type", () => {
    render(<Notification type="warning" message="Warning message" />);
    const notificationElement = screen.getByText("Warning message");
    expect(notificationElement).toHaveClass(styles.notification);
    expect(notificationElement).toHaveClass(styles.warning);
  });

  test("Applies the correct class for info type", () => {
    render(<Notification type="info" message="Info message" />);
    const notificationElement = screen.getByText("Info message");
    expect(notificationElement).toHaveClass(styles.notification);
    expect(notificationElement).toHaveClass(styles.info);
  });
});
