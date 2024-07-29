import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import CustomLink from ".";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("CustomLink Component", () => {
  test("Renders the link with the correct text and default variant", () => {
    const to = "/test";
    const text = "Test Link";

    renderWithRouter(<CustomLink to={to} text={text} />);

    const linkElement = screen.getByText(text);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", to);
    expect(linkElement).toHaveClass("link default");
  });

  test("Renders the link with the primary variant", () => {
    const to = "/test";
    const text = "Primary Link";
    const variant = "primary";

    renderWithRouter(<CustomLink to={to} text={text} variant={variant} />);

    const linkElement = screen.getByText(text);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", to);
    expect(linkElement).toHaveClass("link primary");
  });

  test("Renders the link with the secondary variant", () => {
    const to = "/test";
    const text = "Secondary Link";
    const variant = "secondary";

    renderWithRouter(<CustomLink to={to} text={text} variant={variant} />);

    const linkElement = screen.getByText(text);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", to);
    expect(linkElement).toHaveClass("link secondary");
  });

  test("Renders the link with the danger variant", () => {
    const to = "/test";
    const text = "Danger Link";
    const variant = "danger";

    renderWithRouter(<CustomLink to={to} text={text} variant={variant} />);

    const linkElement = screen.getByText(text);
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute("href", to);
    expect(linkElement).toHaveClass("link danger");
  });
});
