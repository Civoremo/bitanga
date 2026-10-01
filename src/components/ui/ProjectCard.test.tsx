import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "./ProjectCard";
import type { Project } from "@/lib/projects";

const project: Project = {
  slug: "test-project",
  title: "Test Project",
  client: "Test Client",
  year: 2025,
  category: "Web",
  summary: "A short summary of the test project.",
  tags: ["TypeScript", "WebGL"],
  gradient: ["#000000", "#ffffff"],
};

describe("ProjectCard", () => {
  it("renders the core project details", () => {
    render(<ProjectCard project={project} />);
    expect(
      screen.getByRole("heading", { name: "Test Project" })
    ).toBeInTheDocument();
    expect(screen.getByText("Test Client")).toBeInTheDocument();
    expect(screen.getByText("A short summary of the test project.")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("Web")).toBeInTheDocument();
  });

  it("renders every tag", () => {
    render(<ProjectCard project={project} />);
    for (const tag of project.tags) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }
  });
});
