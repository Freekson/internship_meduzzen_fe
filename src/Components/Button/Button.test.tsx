import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Button from ".";

describe("Button Component", () => {
  test("Renders the button with correct text and type", () => {
    render(<Button type="button" text="Click Me" />);
    const buttonElement = screen.getByText("Click Me");
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute("type", "button");
  });

  test("Applies the correct variant class", () => {
    render(<Button type="button" text="Click Me" variant="danger" />);
    const buttonElement = screen.getByText("Click Me");
    expect(buttonElement).toHaveClass("button");
    expect(buttonElement).toHaveClass("danger");
  });

  test("Calls the onClick handler when clicked", () => {
    const onClickMock = jest.fn();
    render(<Button type="button" text="Click Me" onClick={onClickMock} />);
    const buttonElement = screen.getByText("Click Me");
    fireEvent.click(buttonElement);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  test("Renders the button with disabled attribute", () => {
    render(<Button type="button" text="Click Me" disabled />);
    const buttonElement = screen.getByText("Click Me");
    expect(buttonElement).toBeDisabled();
  });

  test("Renders the button with a title", () => {
    render(<Button type="button" text="Click Me" title="Button Title" />);
    const buttonElement = screen.getByText("Click Me");
    expect(buttonElement).toHaveAttribute("title", "Button Title");
  });

  test("Renders the button with default variant class", () => {
    render(<Button type="button" text="Click Me" />);
    const buttonElement = screen.getByText("Click Me");
    expect(buttonElement).toHaveClass("button");
    expect(buttonElement).toHaveClass("primary");
  });
});
