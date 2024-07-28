import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Footer from ".";
import routes from "../../routes";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Footer Component", () => {
  test("renders footer navigation links", () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText("Home")).toHaveAttribute("href", routes.start);
    expect(screen.getByText("About")).toHaveAttribute("href", routes.about);
    expect(screen.getByText("Company")).toHaveAttribute(
      "href",
      routes.companyProfile
    );
    expect(screen.getByText("Profile")).toHaveAttribute(
      "href",
      routes.userProfile
    );
  });

  test("renders social media links", () => {
    renderWithRouter(<Footer />);

    expect(screen.getByLabelText("Facebook")).toHaveAttribute(
      "href",
      "https://facebook.com"
    );
    expect(screen.getByLabelText("Twitter")).toHaveAttribute(
      "href",
      "https://twitter.com"
    );
    expect(screen.getByLabelText("Instagram")).toHaveAttribute(
      "href",
      "https://instagram.com"
    );
    expect(screen.getByLabelText("LinkedIn")).toHaveAttribute(
      "href",
      "https://linkedin.com"
    );
  });

  test("renders contact information", () => {
    renderWithRouter(<Footer />);

    expect(screen.getByText("Email: freeksons@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("Phone: +123 456 7890")).toBeInTheDocument();
  });

  test("renders copyright information", () => {
    renderWithRouter(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Meduzzen. All rights reserved.`)
    ).toBeInTheDocument();
  });
});
