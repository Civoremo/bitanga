import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServiceCard } from "./ServiceCard";
import type { Service } from "@/lib/services";

const service: Service = {
  slug: "test-service",
  title: "Test Service",
  tagline: "A tagline",
  description: "A description of the service.",
  deliverables: ["First deliverable", "Second deliverable"],
  icon: "cube",
};

describe("ServiceCard", () => {
  it("renders the title, tagline, and description", () => {
    render(<ServiceCard service={service} />);
    expect(
      screen.getByRole("heading", { name: "Test Service" })
    ).toBeInTheDocument();
    expect(screen.getByText("A tagline")).toBeInTheDocument();
    expect(screen.getByText("A description of the service.")).toBeInTheDocument();
  });

  it("renders all deliverables as list items", () => {
    render(<ServiceCard service={service} />);
    for (const item of service.deliverables) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
    expect(screen.getAllByRole("listitem")).toHaveLength(
      service.deliverables.length
    );
  });
});
