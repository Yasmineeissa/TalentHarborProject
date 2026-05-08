import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "../Badge";

describe("StatusBadge", () => {
  it("renders the status text", () => {
    render(<StatusBadge status="Shortlisted" />);
    expect(screen.getByText("Shortlisted")).toBeInTheDocument();
  });
});
