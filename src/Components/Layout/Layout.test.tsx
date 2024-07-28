import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Layout from ".";

jest.mock("../Header", () => () => <div>Mocked Header</div>);
jest.mock("../Footer", () => () => <div>Mocked Footer</div>);
jest.mock("react-toastify", () => ({
  ToastContainer: () => <div>Mocked ToastContainer</div>,
}));

describe("Layout Component", () => {
  test("Renders Header, Footer, ToastContainer and children", () => {
    const childText = "Content goes here";
    render(
      <Layout>
        <div>{childText}</div>
      </Layout>
    );

    expect(screen.getByText("Mocked Header")).toBeInTheDocument();
    expect(screen.getByText("Mocked Footer")).toBeInTheDocument();
    expect(screen.getByText("Mocked ToastContainer")).toBeInTheDocument();
    expect(screen.getByText(childText)).toBeInTheDocument();
  });
});
