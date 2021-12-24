import { render, screen } from "@testing-library/react";
import App from "./App";

test("should contain the title Campeonato Brasileiro", () => {
  render(<App />);
  const titleElement = screen.getByText("Campeonato Brasileiro");
  expect(titleElement).toBeInTheDocument();
});
