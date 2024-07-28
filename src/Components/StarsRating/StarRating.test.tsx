import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StarRating from ".";
import { IconProp, IconLookup } from "@fortawesome/fontawesome-svg-core";

jest.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({
    icon,
    color,
    "data-testid": testId,
  }: {
    icon: IconProp;
    color: string;
    "data-testid"?: string;
  }) => {
    const iconName =
      typeof icon === "string"
        ? icon
        : (icon as IconLookup).iconName || (icon as [string, string])[1];

    return (
      <span data-testid={testId} style={{ color }}>
        {iconName}
      </span>
    );
  },
}));

describe("StarRating Component", () => {
  test("Renders correct number of full stars", () => {
    render(<StarRating rating={100} />);
    expect(screen.getAllByTestId("full-star")).toHaveLength(5);
    expect(screen.queryByTestId("half-star")).not.toBeInTheDocument();
    expect(screen.queryByTestId("empty-star")).not.toBeInTheDocument();
  });

  test("Renders correct number of empty stars", () => {
    render(<StarRating rating={0} />);
    expect(screen.getAllByTestId("empty-star")).toHaveLength(5);
    expect(screen.queryByTestId("full-star")).not.toBeInTheDocument();
    expect(screen.queryByTestId("half-star")).not.toBeInTheDocument();
  });

  test("Renders correct number of half stars", () => {
    render(<StarRating rating={50} />);
    expect(screen.getAllByTestId("full-star")).toHaveLength(2);
    expect(screen.getAllByTestId("half-star")).toHaveLength(1);
    expect(screen.getAllByTestId("empty-star")).toHaveLength(2);
  });

  test("Renders correct stars for different ratings", () => {
    render(<StarRating rating={75} />);
    expect(screen.getAllByTestId("full-star")).toHaveLength(3);
    expect(screen.getAllByTestId("half-star")).toHaveLength(1);
    expect(screen.getAllByTestId("empty-star")).toHaveLength(1);
  });
});
