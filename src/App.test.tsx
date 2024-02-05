import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("renders new project button", () => {
  render(<App />);
  const buttonElement = screen.getByText(/NEW PROJECT/i);
  expect(buttonElement).toBeInTheDocument();
});
