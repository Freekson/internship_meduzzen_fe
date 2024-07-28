import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Modal from ".";

describe("Modal Component", () => {
  const onCloseMock = jest.fn();

  const renderModal = (isOpen: boolean) =>
    render(
      <Modal isOpen={isOpen} onClose={onCloseMock}>
        <div>Modal Content</div>
      </Modal>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Renders modal content when isOpen is true", () => {
    renderModal(true);
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  test("Does not render modal content when isOpen is false", () => {
    renderModal(false);
    expect(screen.queryByText("Modal Content")).not.toBeInTheDocument();
  });

  test("Calls onClose when close button is clicked", () => {
    renderModal(true);
    const closeButton = screen.getByRole("button", { name: /close modal/i });
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("Calls onClose when clicking outside the modal", () => {
    renderModal(true);
    fireEvent.mouseDown(document.body);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("Does not call onClose when clicking inside the modal", () => {
    renderModal(true);
    const modalContent = screen.getByText("Modal Content");
    fireEvent.mouseDown(modalContent);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  test("Calls onClose when escape key is pressed", () => {
    renderModal(true);
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("Does not call onClose when other keys are pressed", () => {
    renderModal(true);
    fireEvent.keyDown(document, { key: "Enter", code: "Enter" });
    expect(onCloseMock).not.toHaveBeenCalled();
  });
});
