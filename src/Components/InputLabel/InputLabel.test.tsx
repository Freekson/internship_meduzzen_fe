import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputLabel from ".";

describe("InputLabel Component", () => {
  const onChangeMock = jest.fn();

  test("Renders the label and input correctly", () => {
    render(
      <InputLabel
        label="Test Label"
        id="test-id"
        name="test-name"
        type="text"
        value="Test Value"
        onChange={onChangeMock}
      />
    );

    const labelElement = screen.getByLabelText("Test Label");
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveAttribute("id", "test-id");
    expect(labelElement).toHaveAttribute("name", "test-name");
    expect(labelElement).toHaveAttribute("type", "text");
    expect(labelElement).toHaveValue("Test Value");
  });

  test("Calls onChange function when input value changes", () => {
    render(
      <InputLabel
        label="Test Label"
        id="test-id"
        name="test-name"
        type="text"
        value=""
        onChange={onChangeMock}
      />
    );

    const inputElement = screen.getByLabelText("Test Label");
    fireEvent.change(inputElement, { target: { value: "New Value" } });
    expect(onChangeMock).toHaveBeenCalled();
  });

  test("Renders required attribute correctly", () => {
    render(
      <InputLabel
        label="Test Label"
        id="test-id"
        name="test-name"
        type="text"
        value=""
        required
        onChange={onChangeMock}
      />
    );

    const inputElement = screen.getByLabelText("Test Label");
    expect(inputElement).toBeRequired();
  });

  test("Renders disabled attribute correctly", () => {
    render(
      <InputLabel
        label="Test Label"
        id="test-id"
        name="test-name"
        type="text"
        value=""
        disabled
        onChange={onChangeMock}
      />
    );

    const inputElement = screen.getByLabelText("Test Label");
    expect(inputElement).toBeDisabled();
  });

  test("Renders min and max attributes correctly", () => {
    render(
      <InputLabel
        label="Test Label"
        id="test-id"
        name="test-name"
        type="number"
        value={50}
        onChange={onChangeMock}
        min={10}
        max={90}
      />
    );

    const inputElement = screen.getByLabelText("Test Label");
    expect(inputElement).toHaveAttribute("min", "10");
    expect(inputElement).toHaveAttribute("max", "90");
  });
});
