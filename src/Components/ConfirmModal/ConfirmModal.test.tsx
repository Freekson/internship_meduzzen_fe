import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ConfirmModal from ".";

jest.mock(
  "../Modal",
  () =>
    ({ children, isOpen, onClose }: any) =>
      isOpen ? <div data-testid="modal">{children}</div> : null
);

jest.mock("../Button", () => ({ onClick, text }: any) => (
  <button onClick={onClick}>{text}</button>
));

describe("ConfirmModal Component", () => {
  const onCloseMock = jest.fn();
  const onConfirmMock = jest.fn();
  const modalText = "Are you sure?";
  const confirmText = "Yes";
  const cancelText = "Cancel";

  beforeEach(() => {
    onCloseMock.mockClear();
    onConfirmMock.mockClear();
  });

  test("Renders the modal with the correct text and buttons", () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        text={modalText}
        btnText={confirmText}
      />
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText(modalText)).toBeInTheDocument();
    expect(screen.getByText(confirmText)).toBeInTheDocument();
    expect(screen.getByText(cancelText)).toBeInTheDocument();
  });

  test("Calls onConfirm when the confirm button is clicked", () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        text={modalText}
        btnText={confirmText}
      />
    );

    fireEvent.click(screen.getByText(confirmText));
    expect(onConfirmMock).toHaveBeenCalledTimes(1);
  });

  test("Calls onClose when the cancel button is clicked", () => {
    render(
      <ConfirmModal
        isOpen={true}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        text={modalText}
        btnText={confirmText}
      />
    );

    fireEvent.click(screen.getByText(cancelText));
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  test("Does not render the modal when isOpen is false", () => {
    render(
      <ConfirmModal
        isOpen={false}
        onClose={onCloseMock}
        onConfirm={onConfirmMock}
        text={modalText}
        btnText={confirmText}
      />
    );

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });
});
